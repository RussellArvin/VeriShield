import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import OpenAI from "openai";
import { SNSEvent, Context } from 'aws-lambda';
import axios from 'axios';

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
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN as string;

// Reddit API auth variables
const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID as string;
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET as string;
let redditAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

// Function to ensure we have a valid access token
const ensureAccessToken = async (): Promise<void> => {
  const now = Date.now();
  
  // If token is still valid, reuse it
  if (redditAccessToken && now < tokenExpiresAt - 60000) {
    return;
  }
  
  try {
    // Validate credentials exist
    if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET) {
      console.error('Reddit credentials missing: Client ID or Secret not set in environment variables');
      throw new Error('Reddit API credentials not configured. Check environment variables REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET.');
    }
    
    console.log('Getting new Reddit access token');
    
    // Log partial credentials for debugging (safely)
    const clientIdPrefix = REDDIT_CLIENT_ID.substring(0, 4) + '...';
    console.log(`Using Reddit client ID starting with: ${clientIdPrefix}`);
    
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
          'User-Agent': 'VerifAI/1.0 (by u/Cultural-Will3920)'
        }
      }
    );
    
    if (!response.data || !response.data.access_token) {
      console.error('Reddit API response missing access token:', JSON.stringify(response.data));
      throw new Error('Invalid response from Reddit API: No access token provided');
    }
    
    redditAccessToken = response.data.access_token;
    // Set expiry time (convert expires_in seconds to milliseconds)
    tokenExpiresAt = now + (response.data.expires_in * 1000);
    console.log(`Got new access token, expires in ${response.data.expires_in} seconds`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error getting Reddit access token:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.response?.status === 401) {
        throw new Error('Reddit API authentication failed: Invalid credentials');
      } else if (error.response?.status === 403) {
        throw new Error('Reddit API authentication failed: Permission denied');
      }
    } else {
      console.error('Error getting Reddit access token:', error);
    }
    throw error;
  }
};

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
      
      // Format keywords for the OpenAI prompt
      let allKeywords: string[] = [];
      
      // Handle keywords array or string
      if (Array.isArray(userData.keywords)) {
        allKeywords = [...userData.keywords];
      } else if (typeof userData.keywords === 'string') {
        allKeywords = userData.keywords.split(',').map(k => k.trim());
      }
      
      // Add persona to the mix
      if (userData.persona) {
        allKeywords.push(userData.persona);
      }
      
      const keywordText = allKeywords.join(', ');
      console.log(`[${correlationId}] Using keywords: ${keywordText}`);

      // Condense keywords to 3-5 keywords
      const condensedKeywords = await condenseKeywords(keywordText);
      console.log(`[${correlationId}] Condensed keywords: ${condensedKeywords.join(', ')}`);

      // Get subreddit suggestions based on condensed keywords
      let subreddits: string[] = [];
      let redditApiSuccess = false;
      
      try {
        // Validate that OpenAI key exists
        if (!process.env.OPENAI_API_KEY) {
          console.error(`[${correlationId}] OPENAI_API_KEY is not set in environment variables`);
          throw new Error('OpenAI API key not configured. Check environment variable OPENAI_API_KEY.');
        }

        try {
          // Try Reddit API first
          console.log(`[${correlationId}] Attempting to use Reddit API to find subreddits`);
          
          // Ensure we have a valid Reddit access token
          await ensureAccessToken();
          
          // Search for subreddits using Reddit API with our access token
          subreddits = await searchRedditSubreddits(condensedKeywords);
          console.log(`[${correlationId}] Found ${subreddits.length} subreddits using Reddit API`);
          
          // If we got results, mark as successful
          if (subreddits.length > 0) {
            redditApiSuccess = true;
          } else {
            console.log(`[${correlationId}] Reddit API returned no results, will try OpenAI fallback`);
          }
        } catch (redditError) {
          console.error(`[${correlationId}] Error using Reddit API:`, redditError);
          console.log(`[${correlationId}] Falling back to OpenAI for subreddit suggestions`);
        }
        
        // If Reddit API failed or returned no results, use OpenAI
        if (!redditApiSuccess) {
          subreddits = await suggestSubreddits(condensedKeywords.join(', '));
          console.log(`[${correlationId}] Found ${subreddits.length} subreddits using OpenAI fallback`);
        }
      } catch (error) {
        console.error(`[${correlationId}] Critical error in subreddit retrieval:`, error);
        // Still try to proceed with any subreddits we might have found
        if (subreddits.length === 0) {
          // Last resort: provide some generic popular subreddits
          subreddits = ['askreddit', 'news', 'worldnews', 'science', 'technology'];
          console.log(`[${correlationId}] Using generic subreddit list as last resort`);
        }
      }
      
      console.log(`[${correlationId}] Final subreddits for user ${userData.userId}: ${subreddits.join(', ')}`);

      // Prepare data for the next Lambda - KEEPING EXACT SAME RESPONSE SHAPE
      const resultData: SubredditResult = {
        userId: userData.userId,
        keywords: userData.keywords,  // Original keywords
        persona: userData.persona,    // Original persona
        subreddits: subreddits,       // Subreddits from Reddit API or fallback
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

// Function to condense keywords using OpenAI
const condenseKeywords = async (keywords: string): Promise<string[]> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI that condenses a list of keywords into 3-5 most relevant and specific keywords that represent the core interests."
        },
        {
          role: "user",
          content: `Given these keywords and personas: "${keywords}", condense them into 3-5 keywords that best represent the main interests. Return only the keywords separated by commas, without any additional text.`
        }
      ],
      max_tokens: 50,
      temperature: 0.3 // Lower temperature for more focused results
    });

    const condensedText = response.choices[0].message.content?.trim() || "";
    return condensedText.split(',').map(keyword => keyword.trim().toLowerCase());
    
  } catch (error) {
    console.error("Error condensing keywords:", error);
    // Fall back to the first 3 keywords if there's an error
    return keywords.split(',').slice(0, 3).map(k => k.trim().toLowerCase());
  }
};

// Search subreddits using Reddit API with our access token
async function searchRedditSubreddits(keywords: string[]): Promise<string[]> {
  try {
    // Validate token exists
    if (!redditAccessToken) {
      console.error("Reddit access token not available - this should not happen");
      throw new Error("Reddit access token not available");
    }
    
    const allSubreddits: string[] = [];
    const uniqueSubreddits = new Set<string>();
    let searchAttempts = 0;
    let searchSuccesses = 0;
    
    console.log(`Starting subreddit search with ${keywords.length} keywords: ${keywords.join(', ')}`);
    
    // Process each keyword
    for (const keyword of keywords) {
      if (!keyword || keyword.trim().length === 0) continue;
      
      searchAttempts++;
      try {
        console.log(`Searching Reddit for keyword: "${keyword}"`);
        
        // Search for subreddits using Reddit's JSON API
        const response = await axios.get(`https://oauth.reddit.com/subreddits/search`, {
          params: {
            q: keyword,
            limit: 15, // Increased limit for better results
            include_over_18: false
          },
          headers: {
            'Authorization': `Bearer ${redditAccessToken}`,
            'User-Agent': 'VerifAI/1.0 (by u/Cultural-Will3920)'
          },
          timeout: 5000 // 5 second timeout to prevent hanging
        });
        
        // Check if response has the expected structure
        if (response.data && response.data.data && Array.isArray(response.data.data.children)) {
          searchSuccesses++;
          
          // Extract and filter subreddits
          const filteredSubreddits = response.data.data.children
            .map((child: any) => child.data)
            .filter((sub: any) => {
              // Check each property exists before accessing
              return sub && 
                     typeof sub.over18 !== 'undefined' && 
                     typeof sub.subscribers !== 'undefined' && 
                     typeof sub.display_name !== 'undefined' &&
                     !sub.over18 && 
                     sub.subscribers > 1000;
            })
            .map((sub: any) => sub.display_name.toLowerCase());
            
          // Add unique subreddits to our collection
          for (const subreddit of filteredSubreddits) {
            if (!uniqueSubreddits.has(subreddit)) {
              uniqueSubreddits.add(subreddit);
              allSubreddits.push(subreddit);
            }
          }
          
          console.log(`Found ${filteredSubreddits.length} subreddits for keyword "${keyword}"`);
        } else {
          console.warn(`Unexpected response format from Reddit API for keyword "${keyword}"`);
          console.log(`Response structure: ${JSON.stringify(response.data, null, 2).substring(0, 500)}`);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Specific handling for Axios errors
          console.error(`Error searching Reddit for keyword "${keyword}":`, {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data ? JSON.stringify(error.response.data).substring(0, 500) : 'No data'
          });
          
          // If token is expired or invalid, we should stop and reattempt auth
          if (error.response?.status === 401) {
            console.log('Reddit token appears to be expired or invalid, aborting search');
            throw new Error('Reddit authentication token expired or invalid');
          }
        } else {
          console.error(`Error searching Reddit for keyword "${keyword}":`, error);
        }
        // Continue with other keywords if one fails
      }
    }
    
    console.log(`Completed ${searchAttempts} keyword searches with ${searchSuccesses} successful responses`);
    
    // If no subreddits found, try searching for related posts
    if (allSubreddits.length === 0 && searchSuccesses < searchAttempts) {
      console.log('No subreddits found from direct search, trying related posts search');
      return await searchRelatedPosts(keywords.join(' '));
    }
    
    console.log(`Found a total of ${allSubreddits.length} unique subreddits`);
    
    // Return up to 10 subreddits
    return allSubreddits.slice(0, 10);
  } catch (error) {
    console.error("Error in searchRedditSubreddits:", error);
    throw error;
  }
}

// Additional method to search for related posts and extract subreddits
async function searchRelatedPosts(keyword: string): Promise<string[]> {
  try {
    // Validate token exists
    if (!redditAccessToken) {
      console.error("Reddit access token not available in searchRelatedPosts - this should not happen");
      throw new Error("Reddit access token not available");
    }
    
    console.log(`Searching Reddit posts for keyword: "${keyword}"`);
    
    try {
      const response = await axios.get(`https://oauth.reddit.com/search`, {
        params: {
          q: keyword,
          limit: 50, // Increased limit for better results
          t: 'month',
          sort: 'relevance',
          include_over_18: false
        },
        headers: {
          'Authorization': `Bearer ${redditAccessToken}`,
          'User-Agent': 'VerifAI/1.0 (by u/Cultural-Will3920)'
        },
        timeout: 5000 // 5 second timeout to prevent hanging
      });
      
      if (!response.data || !response.data.data || !Array.isArray(response.data.data.children)) {
        console.warn('Unexpected response format from Reddit search API');
        console.log(`Response structure: ${JSON.stringify(response.data, null, 2).substring(0, 500)}`);
        return [];
      }
      
      const subredditCounts: Record<string, number> = {};
      let processedPosts = 0;
      
      // Count occurrences of each subreddit in search results
      for (const child of response.data.data.children) {
        if (!child.data) continue;
        
        const post = child.data;
        processedPosts++;
        
        // Safely check properties and filter out NSFW content
        if (post && typeof post.over_18 !== 'undefined' && !post.over_18 && 
            typeof post.subreddit !== 'undefined' && post.subreddit) {
          const subredditName = post.subreddit.toLowerCase();
          subredditCounts[subredditName] = (subredditCounts[subredditName] || 0) + 1;
        }
      }
      
      // Sort subreddits by frequency
      const sortedSubreddits = Object.entries(subredditCounts)
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);
      
      console.log(`Processed ${processedPosts} posts and found ${sortedSubreddits.length} unique subreddits from related posts for keyword "${keyword}"`);
      
      // Return up to 10 subreddits
      return sortedSubreddits.slice(0, 10);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Specific handling for Axios errors
        console.error(`Error searching Reddit posts for keyword "${keyword}":`, {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data ? JSON.stringify(error.response.data).substring(0, 500) : 'No data'
        });
        
        // If token is expired or invalid, we should report clearly
        if (error.response?.status === 401) {
          throw new Error('Reddit authentication token expired or invalid in post search');
        }
      } else {
        console.error(`Error searching Reddit posts for keyword "${keyword}":`, error);
      }
      return []; // Return empty array on error
    }
  } catch (error) {
    console.error("Error in searchRelatedPosts:", error);
    return []; // Return empty array to allow fallback to OpenAI
  }
}

// Fallback method using OpenAI if Reddit API fails
const suggestSubreddits = async (keywords: string): Promise<string[]> => {
  try {
    console.log(`Using OpenAI fallback for subreddit suggestions with keywords: "${keywords}"`);
    
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
      max_tokens: 150,
      temperature: 0.7
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