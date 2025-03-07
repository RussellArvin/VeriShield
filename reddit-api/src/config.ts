import dotenv from "dotenv";

dotenv.config();

export const config = {
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  redditAccessToken: process.env.REDDIT_ACCESS_TOKEN || "",
  port: process.env.PORT || 4000,
};
