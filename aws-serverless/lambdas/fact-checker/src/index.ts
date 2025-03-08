import { SNSEvent, Context } from 'aws-lambda';
import axios from 'axios';
import { z } from 'zod';

// Initialize constants
const API_URL = 'https://factchecktools.googleapis.com/v1alpha1/claims:search';
const GOOGLE_FACT_CHECK_API_KEY = process.env.GOOGLE_FACT_CHECK_API_KEY as string;

// Zod schemas for validation
const ClaimSchema = z.object({
  text: z.string(),
  sourceUrl: z.string().url(),
  sourceTitle: z.string(),
  sourceType: z.string(),
  source: z.string().optional()
});

const FactCheckReviewSchema = z.object({
  publisher: z.object({
    name: z.string()
  }),
  url: z.string().url(),
  textualRating: z.string()
});

const FactCheckResultSchema = z.object({
  claim: z.string(),
  claimReview: z.array(FactCheckReviewSchema),
  rating: z.string()
});

const ClaimsResultSchema = z.object({
  userId: z.union([z.string(), z.number()]),
  keywords: z.union([z.array(z.string()), z.string()]),
  persona: z.string(),
  claims: z.array(ClaimSchema),
  correlationId: z.string().optional()
});

// Type definitions
type Claim = z.infer<typeof ClaimSchema>;
type FactCheckResult = z.infer<typeof FactCheckResultSchema>;
type ClaimsResult = z.infer<typeof ClaimsResultSchema>;

export const handler = async (event: SNSEvent, context: Context) => {
  try {
    // Process each message from SNS
    const processPromises = event.Records.map(async (record) => {
      // Get message ID from SNS
      const messageId = record.Sns.MessageId;
      console.log(`Received SNS message ${messageId} with attributes:`, JSON.stringify(record.Sns.MessageAttributes));
      
      // Parse the claims data from the SNS message
      const parsedMessage = JSON.parse(record.Sns.Message);
      
      // Validate the incoming data
      try {
        const validatedData = ClaimsResultSchema.parse(parsedMessage);
        const claimsData: ClaimsResult = validatedData;
        const correlationId = claimsData.correlationId || `corr-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
        
        console.log(`[${correlationId}] Processing ${claimsData.claims.length} claims for user ${claimsData.userId}`);
        
        // Check each claim
        const factCheckPromises = claimsData.claims.map(async (claim) => {
          try {
            console.log(`[${correlationId}] Checking claim: ${claim.text.substring(0, 100)}...`);
            const factCheckResults = await checkClaim(claim.text);
            
            console.log(`[${correlationId}] Fact check results for claim "${claim.text.substring(0, 50)}...":`, 
              JSON.stringify(factCheckResults));
            
            return {
              claim,
              factCheckResults
            };
          } catch (error) {
            console.error(`[${correlationId}] Error checking claim "${claim.text.substring(0, 50)}...":`, error);
            return {
              claim,
              factCheckResults: [],
              error: error instanceof Error ? error.message : String(error)
            };
          }
        });
        
        const results = await Promise.all(factCheckPromises);
        
        // Log results summary
        console.log(`[${correlationId}] Fact checking completed for user ${claimsData.userId}`);
        console.log(`[${correlationId}] Claims checked: ${results.length}`);
        console.log(`[${correlationId}] Claims with fact checks found: ${results.filter(r => r.factCheckResults && r.factCheckResults.length > 0).length}`);
        
        // Log detailed results
        results.forEach((result, index) => {
          console.log(`[${correlationId}] Claim ${index + 1}: "${result.claim.text.substring(0, 100)}..."`);
          console.log(`[${correlationId}] Source: ${result.claim.sourceUrl} (${result.claim.sourceType})`);
          console.log(`[${correlationId}] Title: ${result.claim.sourceTitle}`);
          
          if (result.factCheckResults && result.factCheckResults.length > 0) {
            console.log(`[${correlationId}] Found ${result.factCheckResults.length} fact check(s):`);
            result.factCheckResults.forEach((check, checkIndex) => {
              console.log(`[${correlationId}]   Check ${checkIndex + 1}: Rating: ${check.rating}`);
              check.claimReview.forEach(review => {
                console.log(`[${correlationId}]     - ${review.publisher.name}: ${review.textualRating}`);
                console.log(`[${correlationId}]       URL: ${review.url}`);
              });
            });
          } else {
            console.log(`[${correlationId}]   No fact checks found for this claim`);
          }
          
          if (result.error) {
            console.log(`[${correlationId}]   Error: ${result.error}`);
          }
          
          console.log(`[${correlationId}] --------`);
        });
        
      } catch (validationError) {
        console.error('Validation error:', validationError);
        throw new Error(`Invalid data structure: ${JSON.stringify(validationError)}`);
      }
    });
    
    await Promise.all(processPromises);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully processed fact checking' })
    };
  } catch (error) {
    console.error('Error in Lambda execution:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

async function checkClaim(claim: string): Promise<FactCheckResult[]> {
  try {
    const response = await axios.get(API_URL, {
      params: {
        key: GOOGLE_FACT_CHECK_API_KEY,
        query: claim,
        languageCode: 'en'
      }
    });

    // If no claims found, return empty array
    if (!response.data.claims) {
      return [];
    }

    // Format and validate response
    const formattedResults = response.data.claims.map((claim: any) => ({
      claim: claim.text,
      claimReview: claim.claimReview.map((review: any) => ({
        publisher: {
          name: review.publisher.name
        },
        url: review.url,
        textualRating: review.textualRating
      })),
      rating: claim.claimReview[0]?.textualRating || 'Unknown'
    }));

    // Validate each result
    const validatedResults = formattedResults.map((result: any) => {
      try {
        return FactCheckResultSchema.parse(result);
      } catch (error) {
        console.error('Validation error for fact check result:', error);
        throw new Error(`Invalid fact check result structure: ${JSON.stringify(error)}`);
      }
    });

    return validatedResults;
  } catch (error) {
    console.error('Error verifying claim:', error);
    throw new Error('Failed to verify claim');
  }
}