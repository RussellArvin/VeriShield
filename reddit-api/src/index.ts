import express, { Request, Response } from "express";
import { fetchRedditPosts } from "./redditService";
import { suggestSubreddits } from "./openaiService";
import { config } from "./config";

const app = express();
app.use(express.json());

// API Endpoint: Retrieve posts from relevant subreddits
app.post("/get-reddit-posts", async (req: Request, res: Response) => {
  const { keywords, subreddits }: { keywords: string; subreddits?: string[] } = req.body;

  let allSubreddits = subreddits || [];

  if (allSubreddits.length === 0) {
    allSubreddits = await suggestSubreddits(keywords);
  }

  console.log("Fetching from subreddits:", allSubreddits);

  // Fetch posts from suggested subreddits
  const results = await Promise.all(allSubreddits.map(fetchRedditPosts));
  const flattenedResults = results.flat();

  res.json(flattenedResults);
});

// Start Express Server
app.listen(config.port, () => console.log(`Server running on port ${config.port}`));
