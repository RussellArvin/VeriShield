import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import OpenAI from "openai";
import { SNSEvent, Context } from 'aws-lambda';

// Types for our data
interface ScrapedResult {
  userId: string | number;
  keywords: string[] | string;
  persona: string;
  results: SubredditResult[];
  correlationId?: string;
}

interface SubredditResult {
  subreddit: string;
  posts: RedditPost[];
}

interface RedditPost {
  title: string;
  url: string;
  content: string;
  metadata: {
    created_at: number;
    score: number;
  };
}

interface Claim {
  text: string;
  sourceUrl: string;
  sourceTitle: string;
  subreddit: string;
}

interface ClaimsResult {
  userId: string | number;
  keywords: string[] | string;
  persona: string;
  claims: Claim[];
  correlationId?: string;
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
      // Get message ID from SNS
      const messageId = record.Sns.MessageId;
      console.log(`Received SNS message ${messageId} with attributes:`, JSON.stringify(record.Sns.MessageAttributes));
      
      // Parse the reddit data from the SNS message
      const parsedMessage = JSON.parse(record.Sns.Message);
      console.log(`Received SNS message content summary:`, JSON.stringify({
        userId: parsedMessage.userId,
        results: `${parsedMessage.results?.length || 0} subreddits`
      }));
      
      // Extract reddit data and the correlation ID if it exists
      const redditData: ScrapedResult = parsedMessage;
      const correlationId = parsedMessage.correlationId || `corr-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      
      console.log(`[${correlationId}] Processing Reddit data for user ${redditData.userId}`);
      
      // Extract claims from each Reddit post
      const allClaims: Claim[] = [];
      
      for (const subredditResult of redditData.results) {
        const subredditName = subredditResult.subreddit;
        console.log(`[${correlationId}] Processing ${subredditResult.posts.length} posts from r/${subredditName}`);
        
        for (const post of subredditResult.posts) {
          if (!post.content || post.content.trim() === '') {
            console.log(`[${correlationId}] Skipping post with empty content: ${post.title}`);
            continue;
          }
          
          // Use OpenAI to extract claims from the Reddit post
          const claims = await extractClaimsFromPost(post, subredditName);
          console.log(`[${correlationId}] Extracted ${claims.length} claims from post: ${post.title}`);
          
          allClaims.push(...claims);
        }
      }
      
      console.log(`[${correlationId}] Extracted total of ${allClaims.length} claims for user ${redditData.userId}`);

      // Prepare data for the next Lambda
      const resultData: ClaimsResult = {
        userId: redditData.userId,
        keywords: redditData.keywords,
        persona: redditData.persona,
        claims: allClaims,
        correlationId: correlationId
      };
      
      // Publish to the next SNS topic
      await publishToSNS(resultData);
    });
    
    await Promise.all(processPromises);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully extracted claims from Reddit posts' })
    };
  } catch (error) {
    console.error('Error in Lambda execution:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

const extractClaimsFromPost = async (post: RedditPost, subreddit: string): Promise<Claim[]> => {
  try {
    // Combine title and content for context
    const content = `${post.title}\n\n${post.content}`;
    
    // Truncate content if too long for the OpenAI API
    const truncatedContent = content.substring(0, 4000);
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert at extracting claims from social media posts. Extract all types of claims including facts, opinions, speculations, and predictions. Each claim should be a single assertion that can be evaluated."
        },
        {
          role: "user",
          content: `Extract all claims from this Reddit post. Format your response as a numbered list with each claim on a new line.
            
Subreddit: r/${subreddit}
Post Title: ${post.title}
Post Content: ${truncatedContent}

Extract all relevant claims - factual statements, opinions, predictions, and assertions. Return ONLY the numbered list of claims, nothing else.`
        }
      ],
      max_tokens: 500,
      temperature: 0.3 // Lower temperature for more deterministic results
    });

    const claimsText = response.choices[0].message.content?.trim() || "";
    
    // Parse the claims from the numbered list
    const claimLines = claimsText.split('\n')
      .map(line => line.trim())
      .filter(line => line.match(/^\d+\.\s+/) || line.length > 0);
    
    // Process each claim line, removing the number prefix
    const claims = claimLines.map(line => {
      const cleanedLine = line.replace(/^\d+\.\s+/, '').trim();
      return {
        text: cleanedLine,
        sourceUrl: post.url,
        sourceTitle: post.title,
        subreddit: subreddit
      };
    });
    
    return claims.filter(claim => claim.text.length > 0);
    
  } catch (error) {
    console.error("Error extracting claims from Reddit post:", error);
    return [];
  }
};

const publishToSNS = async (data: ClaimsResult): Promise<void> => {
  const correlationId = data.correlationId || `corr-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  
  console.log(`[${correlationId}] Publishing to SNS topic ${SNS_TOPIC_ARN}:`, JSON.stringify({
    userId: data.userId,
    claimCount: data.claims.length
  }));
  
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
  console.log(`[${correlationId}] Published claims data for user ${data.userId} to SNS, MessageId: ${result.MessageId}`);
};