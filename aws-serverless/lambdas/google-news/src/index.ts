import { SNSEvent, Context } from 'aws-lambda';
import OpenAI from 'openai';
import axios from 'axios';

// Types for our data
interface UserData {
  userId: string | number;
  keywords: string[] | string;
  persona: string;
}

interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

interface ProcessedResult {
  userId: string | number;
  keywords: string[];
  generatedKeywords: string[];
  persona: string;
  articles: NewsArticle[];
}

// Initialize clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

const GOOGLE_NEWS_API_KEY = process.env.GOOGLE_NEWS_API_KEY as string;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export const handler = async (event: SNSEvent, context: Context) => {
  try {
    // Process each message from SNS
    for (const record of event.Records) {
      // Parse the user data from the SNS message
      const userData: UserData = JSON.parse(record.Sns.Message);
      console.log('Processing user data:', JSON.stringify(userData));
      
      // Format keywords for the OpenAI prompt
      const initialKeywords = Array.isArray(userData.keywords) 
        ? userData.keywords 
        : typeof userData.keywords === 'string'
          ? userData.keywords.split(',').map(k => k.trim())
          : [];
      
      // Generate additional keywords using OpenAI
      const generatedKeywords = await generateRelatedKeywords(
        userData.persona, 
        initialKeywords
      );
      
      console.log(`Generated ${generatedKeywords.length} additional keywords`);
      
      // Combine initial and generated keywords
      const allKeywords = [...initialKeywords, ...generatedKeywords];
      
      // Fetch news articles based on keywords
      const newsArticles = await fetchNews(allKeywords);
      console.log(`Found ${newsArticles.length} news articles for user ${userData.userId}`);
      
      // Create processed result
      const result: ProcessedResult = {
        userId: userData.userId,
        keywords: initialKeywords,
        generatedKeywords: generatedKeywords,
        persona: userData.persona,
        articles: newsArticles
      };
      
      // Log the results (in production you might want to send this somewhere)
      console.log(`Completed processing for user ${userData.userId}`);
      console.log(`Result: ${newsArticles.length} articles found`);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully processed news articles' })
    };
  } catch (error) {
    console.error('Error in Lambda execution:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

/**
 * Generate related keywords based on organization/persona and initial keywords
 */
const generateRelatedKeywords = async (
  organization: string,
  initialKeywords: string[]
): Promise<string[]> => {
  try {
    const prompt = `
      Organization: ${organization}
      Initial Keywords: ${initialKeywords.join(', ')}
      
      Please generate a list of 10 additional relevant keywords or phrases related to the organization and initial keywords above.
      These keywords will be used to search for news articles that are relevant to the organization.
      Return only the keywords as a comma-separated list without numbering or explanations.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful assistant that generates relevant keywords for news searches. Provide only the requested keywords without any additional text."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    // Extract and process the response
    const content = response.choices[0]?.message?.content?.trim() || '';
    
    // Split by commas and clean up each keyword
    const generatedKeywords = content
      .split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);
    
    return generatedKeywords;
  } catch (error) {
    console.error('Error generating keywords with OpenAI:', error);
    throw new Error('Failed to generate keywords');
  }
};

/**
 * Fetch news articles based on provided keywords
 */
const fetchNews = async (
  keywords: string[],
  language: string = 'en'
): Promise<NewsArticle[]> => {
  try {
    // Join keywords with OR operator for broader results
    const query = keywords.join(' OR ');
    
    // Build query parameters
    const params: Record<string, string> = {
      apiKey: GOOGLE_NEWS_API_KEY,
      q: query,
      language,
      pageSize: '10', // Limit to 10 articles to avoid excessive data
    };

    // Add date range (last 7 days)
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);
    
    params.from = fromDate.toISOString().split('T')[0];
    params.to = toDate.toISOString().split('T')[0];

    // Make API request
    const response = await axios.get<NewsApiResponse>(`${NEWS_API_BASE_URL}/everything`, {
      params,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if response is successful
    if (response.data.status !== 'ok') {
      throw new Error(`NewsAPI error: ${response.data.status}`);
    }

    return response.data.articles;
  } catch (error) {
    console.error('Failed to fetch news articles:', error);
    // Return empty array instead of throwing to keep pipeline running
    return [];
  }
};