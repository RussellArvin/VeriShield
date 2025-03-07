import OpenAI from "openai";
import { config } from "./config";

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

export const suggestSubreddits = async (keywords: string): Promise<string[]> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI that suggests relevant subreddit names based on given topics. List each subreddit as 'r/Name' on a new line.",
        },
        {
          role: "user",
          content: `Given the keywords: "${keywords}", suggest relevant subreddit names. List each one starting with "r/" and separate them by new lines.`,
        },
      ],
      max_tokens: 100, // Increased to allow more suggestions
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