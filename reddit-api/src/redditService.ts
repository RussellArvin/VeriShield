import axios from "axios";
import { config } from "./config";

// Function to fetch new posts from a subreddit
export const fetchRedditPosts = async (subreddit: string) => {
  const REDDIT_API_URL = `https://oauth.reddit.com/r/${subreddit}/new`;

  try {
    const response = await axios.get(REDDIT_API_URL, {
      headers: {
        Authorization: `Bearer ${config.redditAccessToken}`, 
        "User-Agent": "scraper/1.0 by Cultural-Will3920", 
        'Accept': 'application/json'
      },
      timeout: 5000, 
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
      console.log('Access token might be expired. Refresh required.');
    }

    return {
      subreddit: subreddit,
      posts: []
    };
  }
};