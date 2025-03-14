import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { SNSEvent, Context } from 'aws-lambda';
import axios from "axios";

// Types for our data
interface SubredditData {
  userId: string | number;
  keywords: string[] | string;
  persona: string;
  subreddits: string[];
  correlationId?: string;
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

interface SubredditResult {
  subreddit: string;
  posts: RedditPost[];
}

interface ScrapedResult {
  userId: string | number;
  keywords: string[] | string;
  persona: string;
  results: SubredditResult[];
  correlationId?: string;
}

// Initialize SNS client
const snsClient = new SNSClient({});
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;

// Reddit API credentials
const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID as string;
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET as string;

// Access token cache
let redditAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

export const handler = async (event: SNSEvent, context: Context) => {
  try {
    // Process each message from SNS
    for (const record of event.Records) {
      // Get the message ID and attributes from SNS
      const messageId = record.Sns.MessageId;
      console.log(`Received SNS message ${messageId} with attributes:`, JSON.stringify(record.Sns.MessageAttributes));
      
      // Parse the data from the SNS message
      const parsedMessage = JSON.parse(record.Sns.Message);
      console.log(`Received SNS message content:`, JSON.stringify(parsedMessage));
      
      // Extract data and correlation ID
      const data: SubredditData = parsedMessage;
      const correlationId = parsedMessage.correlationId || `corr-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      
      console.log(`[${correlationId}] Processing data for user ${data.userId} with ${data.subreddits.length} subreddits`);
      
      // Ensure we have a valid access token
      await ensureAccessToken();
      
      // Fetch posts from each subreddit
      const results: SubredditResult[] = [];
      
      for (const subreddit of data.subreddits) {
        // Add delay between requests to avoid rate limiting
        if (results.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log(`[${correlationId}] Fetching posts from r/${subreddit}`);
        const result = await fetchRedditPosts(subreddit);
        console.log(`[${correlationId}] Found ${result.posts.length} posts in r/${subreddit}`);
        
        // Log a sample of post titles (just the first 3)
        if (result.posts.length > 0) {
          const sampleTitles = result.posts.slice(0, 3).map(p => p.title);
          console.log(`[${correlationId}] Sample posts from r/${subreddit}:`, JSON.stringify(sampleTitles));
        }
        
        results.push(result);
      }
      
      // Prepare result for passing to next step in pipeline (if needed)
      const scrapedResult: ScrapedResult = {
        userId: data.userId,
        keywords: data.keywords,
        persona: data.persona,
        results: results,
        correlationId: correlationId
      };
      
      console.log(`[${correlationId}] Scraped ${results.reduce((sum, r) => sum + r.posts.length, 0)} total posts across ${results.length} subreddits`);
      
      // You could publish this to another SNS topic if needed
      if (SNS_TOPIC_ARN) {
        await publishToSNS(scrapedResult);
      }
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully scraped Reddit posts' })
    };
  } catch (error) {
    console.error('Error in Lambda execution:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

const ensureAccessToken = async (): Promise<void> => {
  const now = Date.now();
  
  // If token is still valid, reuse it
  if (redditAccessToken && now < tokenExpiresAt - 60000) {
    return;
  }
  
  try {
    console.log('Getting new Reddit access token');
    const response = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      'grant_type=client_credentials',
      {
        auth: {
          username: REDDIT_CLIENT_ID,
          password: REDDIT_CLIENT_SECRET
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'scraper/1.0 by Cultural-Will3920'
        }
      }
    );
    
    redditAccessToken = response.data.access_token;
    // Set expiry time (convert expires_in seconds to milliseconds)
    tokenExpiresAt = now + (response.data.expires_in * 1000);
    console.log(`Got new access token, expires in ${response.data.expires_in} seconds`);
  } catch (error) {
    console.error('Error getting Reddit access token:', error);
    throw error;
  }
};

const fetchRedditPosts = async (subreddit: string): Promise<SubredditResult> => {
  const REDDIT_API_URL = `https://oauth.reddit.com/r/${subreddit}/new`;

  try {
    const response = await axios.get(REDDIT_API_URL, {
      headers: {
        Authorization: `Bearer ${redditAccessToken}`,
        "User-Agent": "scraper/1.0 by Cultural-Will3920",
        'Accept': 'application/json'
      },
      timeout: 5000,
      params: {
        limit: 10 // Limit to 10 posts per subreddit to avoid hitting rate limits
      }
    });

    // Handle rate limiting - check remaining requests
    const remaining = response.headers['x-ratelimit-remaining'];
    const reset = response.headers['x-ratelimit-reset'];
    
    if (remaining && parseInt(remaining) < 2) {
      console.log(`Approaching rate limit. Resets in ${reset} seconds`);
      await new Promise(resolve => setTimeout(resolve, (parseInt(reset) + 1) * 1000));
    }

    return {
      subreddit: subreddit,
      posts: response.data.data.children.map((post: any) => ({
        title: post.data.title,
        url: post.data.url,
        content: post.data.selftext || "",
        metadata: {
          created_at: post.data.created_utc,
          score: post.data.score
        }
      }))
    };
  } catch (error: any) {
    console.error(`Error fetching posts from r/${subreddit}:`, 
      error.response?.status,
      error.response?.data?.message || error.message
    );

    // Handle token expiration specifically
    if (error.response?.status === 401) {
      console.log('Access token expired. Will refresh on next request.');
      redditAccessToken = null;
    }

    return {
      subreddit: subreddit,
      posts: []
    };
  }
};

const publishToSNS = async (data: ScrapedResult): Promise<void> => {
  const correlationId = data.correlationId || `corr-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  
  console.log(`[${correlationId}] Publishing to SNS topic ${SNS_TOPIC_ARN}:`, JSON.stringify({
    userId: data.userId,
    keywords: data.keywords,
    persona: data.persona,
    resultSummary: `${data.results.length} subreddits, ${data.results.reduce((sum, r) => sum + r.posts.length, 0)} total posts`
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
  console.log(`[${correlationId}] Published scraped data for user ${data.userId} to SNS, MessageId: ${result.MessageId}`);
};