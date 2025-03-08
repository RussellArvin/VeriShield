import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import OpenAI from "openai";
import { SNSEvent, Context } from 'aws-lambda';

// Types for our data
interface UserData {
  userId: string | number;
  keywords: string[] | string;
  persona: string;
}

interface SubredditResult {
  userId: string | number;
  keywords: string[] | string;
  persona: string;
  subreddits: string[];
  correlationId?: string; // Optional for backward compatibility
}

// Initialize clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

const snsClient = new SNSClient({});
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN as string;z

export const handler = async (event: SNSEvent, context: Context) => {
  try {
    // Process each message from SNS
    const processPromises = event.Records.map(async (record) => {
      // Get message ID from SNS
      const messageId = record.Sns.MessageId;
      console.log(`Received SNS message ${messageId} with attributes:`, JSON.stringify(record.Sns.MessageAttributes));
      
      // Parse the user data from the SNS message
      const parsedMessage = JSON.parse(record.Sns.Message);
      console.log(`Received SNS message content:`, JSON.stringify(parsedMessage));
      
      // Extract user data and the correlation ID if it exists
      const userData: UserData = parsedMessage;
      const correlationId = parsedMessage.correlationId || `corr-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      
      console.log(`[${correlationId}] Processing user data for user ${userData.userId}`);
      
      // Format keywords for the OpenAI prompt, including persona as a keyword
      let allKeywords: string[] = [];
      
      // Handle keywords array or string
      if (Array.isArray(userData.keywords)) {
        allKeywords = [...userData.keywords];
      } else if (typeof userData.keywords === 'string') {
        allKeywords = userData.keywords.split(',').map(k => k.trim());
      }
      
      // Add persona as a keyword
      if (userData.persona) {
        allKeywords.push(userData.persona);
      }
      
      const keywordText = allKeywords.join(', ');
      console.log(`[${correlationId}] Using keywords: ${keywordText}`);

      // Get subreddit suggestions based on combined keywords
      const subreddits = await suggestSubreddits(keywordText);
      console.log(`[${correlationId}] Found ${subreddits.length} subreddits for user ${userData.userId}: ${subreddits.join(', ')}`);

      // Prepare data for the next Lambda
      const resultData: SubredditResult = {
        userId: userData.userId,
        keywords: userData.keywords,
        persona: userData.persona,
        subreddits: subreddits,
        correlationId: correlationId  // Include correlation ID in the data
      };
      
      // Publish to the next SNS topic
      await publishToSNS(resultData);
    });
    
    await Promise.all(processPromises);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully processed subreddit suggestions' })
    };
  } catch (error) {
    console.error('Error in Lambda execution:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

const suggestSubreddits = async (keywords: string): Promise<string[]> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI that suggests relevant subreddit names based on given topics. List each subreddit as 'r/Name' on a new line."
        },
        {
          role: "user",
          content: `Given the keywords: "${keywords}", suggest relevant subreddit names. List each one starting with "r/" and separate them by new lines.`
        }
      ],
      max_tokens: 150, // Increased to allow more suggestions
      temperature: 0.7 // Adds some variability to recommendations
    });

    const suggestedText = response.choices[0].message.content?.trim() || "";
    
    // Extract all subreddit patterns (r/...) and remove 'r/' prefix
    const subredditMatches = suggestedText.match(/r\/[\w]+/g) || [];
    return subredditMatches.map(sub => sub.replace('r/', '').toLowerCase());
    
  } catch (error) {
    console.error("Error generating subreddit recommendations:", error);
    return [];
  }
};

const publishToSNS = async (data: SubredditResult): Promise<void> => {
  const correlationId = data.correlationId || `corr-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  
  console.log(`[${correlationId}] Publishing to SNS topic ${SNS_TOPIC_ARN}:`, JSON.stringify(data));
  
  const command = new PublishCommand({
    TopicArn: SNS_TOPIC_ARN,
    Message: JSON.stringify(data),
    MessageAttributes: {
      'userId': {
        DataType: 'String',
        StringValue: String(data.userId)
      },
      'correlationId': {
        DataType: 'String',
        StringValue: correlationId
      }
    }
  });
  
  const result = await snsClient.send(command);
  console.log(`[${correlationId}] Published subreddit data for user ${data.userId} to SNS, MessageId: ${result.MessageId}`);
};