import { SNSEvent, Context } from 'aws-lambda';
import OpenAI from 'openai';
import axios from 'axios';
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// Types for our data
interface UserData {
  userId: string | number;
  keywords: string[] | string;
  persona: string;
  correlationId?: string;
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
  correlationId?: string;
}

// Initialize clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

const snsClient = new SNSClient({});
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;

const GOOGLE_NEWS_API_KEY = process.env.GOOGLE_NEWS_API_KEY as string;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export const handler = async (event: SNSEvent, context: Context) => {
  try {
    // Process each message from SNS
    for (const record of event.Records) {
      // Get message ID and attributes
      const messageId = record.Sns.MessageId;
      console.log(`Received SNS message ${messageId} with attributes:`, JSON.stringify(record.Sns.MessageAttributes));
      
      // Parse the user data from the SNS message
      const parsedMessage = JSON.parse(record.Sns.Message);
      console.log(`Received SNS message content:`, JSON.stringify(parsedMessage));
      
      // Extract user data and correlation ID
      const userData: UserData = parsedMessage;
      const correlationId = parsedMessage.correlationId || `corr-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      
      console.log(`[${correlationId}] Processing user data for user ${userData.userId}`);
      
      // Format keywords for the OpenAI prompt
      const initialKeywords = Array.isArray(userData.keywords) 
        ? userData.keywords 
        : typeof userData.keywords === 'string'
          ? userData.keywords.split(',').map(k => k.trim())
          : [];
      
      console.log(`[${correlationId}] Initial keywords: ${initialKeywords.join(', ')}`);
      
      // Generate additional keywords using OpenAI
      const generatedKeywords = await generateRelatedKeywords(
        userData.persona, 
        initialKeywords
      );
      
      console.log(`[${correlationId}] Generated ${generatedKeywords.length} additional keywords: ${generatedKeywords.join(', ')}`);
      
      // Combine initial and generated keywords
      const allKeywords = [...initialKeywords, ...generatedKeywords];
      
      // Fetch news articles based on keywords
      const newsArticles = await fetchNews(allKeywords);
      console.log(`[${correlationId}] Found ${newsArticles.length} news articles for user ${userData.userId}`);
      
      // Log a sample of article titles (just the first 3)
      if (newsArticles.length > 0) {
        const sampleTitles = newsArticles.slice(0, 3).map(article => article.title);
        console.log(`[${correlationId}] Sample articles:`, JSON.stringify(sampleTitles));
      }
      
      // Create processed result
      const result: ProcessedResult = {
        userId: userData.userId,
        keywords: initialKeywords,
        generatedKeywords: generatedKeywords,
        persona: userData.persona,
        articles: newsArticles,
        correlationId: correlationId
      };
      
      // Log the results with detailed information
      console.log(`[${correlationId}] Completed processing for user ${userData.userId}`);
      console.log(`[${correlationId}] Result summary: ${newsArticles.length} articles found from ${newsArticles.reduce((sources, article) => {
        if (!sources.includes(article.source.name)) {
          sources.push(article.source.name);
        }
        return sources;
      }, [] as string[]).length} different sources`);
      
      // Publish to SNS for next Lambda in pipeline
      if (SNS_TOPIC_ARN) {
        await publishToSNS(result);
      } else {
        console.log(`[${correlationId}] SNS_TOPIC_ARN not configured, skipping publishing`);
      }
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

/**
 * Publish the processed news data to the next SNS topic in the pipeline
 */
const publishToSNS = async (data: ProcessedResult): Promise<void> => {
  const correlationId = data.correlationId || `corr-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  
  console.log(`[${correlationId}] Publishing to SNS topic ${SNS_TOPIC_ARN}:`, JSON.stringify({
    userId: data.userId,
    keywords: data.keywords,
    persona: data.persona,
    articlesSummary: `${data.articles.length} articles found`
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
  console.log(`[${correlationId}] Published news data for user ${data.userId} to SNS, MessageId: ${result.MessageId}`);
};