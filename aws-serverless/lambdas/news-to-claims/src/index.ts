import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import OpenAI from "openai";
import { SNSEvent, Context } from 'aws-lambda';

// Types for our data
interface NewsData {
  userId: string | number;
  keywords: string[] | string;
  persona: string;
  articles: Article[];
  correlationId?: string;
}

interface Article {
  title: string;
  url: string;
  content: string;
  source?: string;
  publishedAt?: string;
}

interface Claim {
  text: string;
  articleUrl: string;
  articleTitle: string;
  source?: string;
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
      
      // Parse the news data from the SNS message
      const parsedMessage = JSON.parse(record.Sns.Message);
      console.log(`Received SNS message content:`, JSON.stringify(parsedMessage));
      
      // Extract news data and the correlation ID if it exists
      const newsData: NewsData = parsedMessage;
      const correlationId = parsedMessage.correlationId || `corr-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      
      console.log(`[${correlationId}] Processing news data for user ${newsData.userId}`);
      
      // Extract claims from each article
      const allClaims: Claim[] = [];
      
      // Check if articles exist and is an array before iterating
      if (!newsData.articles || !Array.isArray(newsData.articles)) {
        console.log(`[${correlationId}] Error: newsData.articles is not iterable`, typeof newsData.articles);
        console.log(`[${correlationId}] Message content:`, JSON.stringify(parsedMessage));
        // Create an empty array if not present or not an array
        newsData.articles = [];
      }
      
      for (const article of newsData.articles) {
        // Skip if article is null or undefined
        if (!article) {
          console.log(`[${correlationId}] Skipping null or undefined article`);
          continue;
        }
        
        // Ensure article has required properties
        if (!article.title) article.title = "Untitled Article";
        if (!article.url) article.url = "https://unknown-source.com";
        
        console.log(`[${correlationId}] Processing article: ${article.title}`);
        
        if (!article.content || article.content.trim() === '') {
          console.log(`[${correlationId}] Skipping article with empty content: ${article.title}`);
          continue;
        }
        
        // Use OpenAI to extract claims from the article
        const claims = await extractClaimsFromArticle(article);
        console.log(`[${correlationId}] Extracted ${claims.length} claims from article: ${article.title}`);
        
        allClaims.push(...claims);
      }
      
      console.log(`[${correlationId}] Extracted total of ${allClaims.length} claims for user ${newsData.userId}`);

      // Prepare data for the next Lambda
      const resultData: ClaimsResult = {
        userId: newsData.userId,
        keywords: newsData.keywords,
        persona: newsData.persona,
        claims: allClaims,
        correlationId: correlationId
      };
      
      // Publish to the next SNS topic
      await publishToSNS(resultData);
    });
    
    await Promise.all(processPromises);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully extracted claims from news articles' })
    };
  } catch (error) {
    console.error('Error in Lambda execution:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

const extractClaimsFromArticle = async (article: Article): Promise<Claim[]> => {
  try {
    // Truncate content if too long for the OpenAI API
    const truncatedContent = article.content.substring(0, 4000);
    
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert at extracting claims from news articles. Extract all types of claims including facts, opinions, speculations, and predictions. Each claim should be a single assertion that can be evaluated."
          },
          {
            role: "user",
            content: `Extract all claims from this news article. Format your response as a numbered list with each claim on a new line.
              
  Article Title: ${article.title}
  Article Content: ${truncatedContent}
  
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
        articleUrl: article.url,
        articleTitle: article.title,
        source: article.source
      };
    });
    
    return claims.filter(claim => claim.text.length > 0);
    
  } catch (error) {
    console.error("Error extracting claims from article:", error);
    return [];
  }
};

const publishToSNS = async (data: ClaimsResult): Promise<void> => {
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
  console.log(`[${correlationId}] Published claims data for user ${data.userId} to SNS, MessageId: ${result.MessageId}`);
};