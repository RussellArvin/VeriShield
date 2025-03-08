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
}

// Initialize clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

const snsClient = new SNSClient({});
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN as string;

export const handler = async (event: SNSEvent, context: Context) => {
  try {
    // Process each message from SNS
    const processPromises = event.Records.map(async (record) => {
      // Parse the user data from the SNS message
      const userData: UserData = JSON.parse(record.Sns.Message);
      console.log('Processing user data:', JSON.stringify(userData));
      
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

      // Get subreddit suggestions based on combined keywords
      const subreddits = await suggestSubreddits(keywordText);
      console.log(`Found ${subreddits.length} subreddits for user ${userData.userId}`);

      // Prepare data for the next Lambda
      const resultData: SubredditResult = {
        userId: userData.userId,
        keywords: userData.keywords,
        persona: userData.persona,
        subreddits: subreddits
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
  const command = new PublishCommand({
    TopicArn: SNS_TOPIC_ARN,
    Message: JSON.stringify(data),
    MessageAttributes: {
      'userId': {
        DataType: 'String',
        StringValue: String(data.userId)
      }
    }
  });
  
  await snsClient.send(command);
  console.log(`Published subreddit data for user ${data.userId} to SNS`);
};