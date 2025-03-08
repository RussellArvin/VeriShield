import { SNSEvent, Context } from 'aws-lambda';
import axios from 'axios';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';

// Initialize constants
const API_URL = 'https://factchecktools.googleapis.com/v1alpha1/claims:search';
const GOOGLE_FACT_CHECK_API_KEY = process.env.GOOGLE_FACT_CHECK_API_KEY as string;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

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
  textualRating: z.string(),
  title: z.string().optional(),
  reviewDate: z.string().optional(),
  languageCode: z.string().optional(),
  textualExplanation: z.string().optional()
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

// Threat entry interface
interface ThreatEntry {
  description: string;
  source_url: string;
  source: string;
  status: 'CRITICAL' | 'MEDIUM' | 'LOW';
  factCheckerUrl: string;
  factCheckerExplanation: string;
}

// Function response interface
interface FunctionResponse {
  userId: string | number;
  persona: string;
  falseClaims: Array<{
    sourceUrl: string;
    originalClaim: string;
    sourceType: string;
    explanations: Array<{
      factCheckerName: string;
      factCheckerUrl: string;
      rating: string;
      explanation: string;
    }>;
    threatEntry?: ThreatEntry;
  }>;
}

export const handler = async (event: SNSEvent, context: Context) => {
  try {
    // Process each message from SNS and collect results
    const allResponses = await Promise.all(event.Records.map(async (record) => {
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
        
        // Filter for false claims only
        const falseClaims = results
          .filter(result => 
            result.factCheckResults && 
            result.factCheckResults.some(fcr => 
              fcr.claimReview.some(review => 
                review.textualRating.toLowerCase().includes('false')
              )
            )
          )
          .map(result => {
            // Extract explanations from all fact checkers that rated this claim as false
            const explanations = result.factCheckResults
              .flatMap(fcr => 
                fcr.claimReview
                  .filter(review => review.textualRating.toLowerCase().includes('false'))
                  .map(review => ({
                    factCheckerName: review.publisher.name,
                    factCheckerUrl: review.url,
                    rating: review.textualRating,
                    explanation: review.textualExplanation || "No explanation provided"
                  }))
              );
            
            return {
              sourceUrl: result.claim.sourceUrl,
              originalClaim: result.claim.text,
              sourceType: result.claim.sourceType,
              explanations: explanations
            };
          });
        
        // Process each false claim with OpenAI to generate threat entries
        const processedClaimsPromises = falseClaims.map(async (falseClaim) => {
          try {
            const threatEntry = await generateThreatEntry(
              falseClaim.originalClaim, 
              falseClaim.sourceUrl, 
              falseClaim.sourceType,
              falseClaim.explanations[0]?.factCheckerUrl || "",
              falseClaim.explanations[0]?.explanation || ""
            );
            
            // Store the threat in Supabase using the userId from the input data
            await storeThreatInSupabase({
              id: uuidv4(),
              userId: String(claimsData.userId), // Use the userId from the SNS message
              description: threatEntry.description,
              sourceUrl: threatEntry.source_url,
              source: threatEntry.source,
              status: threatEntry.status,
              factCheckerUrl: threatEntry.factCheckerUrl,
              factCheckerDescription: threatEntry.factCheckerExplanation
            });
            
            return {
              ...falseClaim,
              threatEntry
            };
          } catch (error) {
            console.error(`Error generating threat entry: ${error}`);
            return falseClaim; // Return original without threat entry if there's an error
          }
        });
        
        const processedClaims = await Promise.all(processedClaimsPromises);
        
        // Create response object
        const response: FunctionResponse = {
          userId: claimsData.userId,
          persona: claimsData.persona,
          falseClaims: processedClaims
        };
        
        // Log summary for CloudWatch
        console.log(`[${correlationId}] Found ${falseClaims.length} false claims out of ${results.length} total claims`);
        console.log(`[${correlationId}] Generated ${processedClaims.filter(c => c.threatEntry).length} threat entries`);
        
        return response;
      } catch (validationError) {
        console.error('Validation error:', validationError);
        throw new Error(`Invalid data structure: ${JSON.stringify(validationError)}`);
      }
    }));
    
    // Extract all threat entries
    const allThreatEntries = allResponses
      .flatMap(response => response.falseClaims)
      .filter(claim => claim.threatEntry)
      .map(claim => claim.threatEntry);
    
    // Merge all responses if there are multiple SNS records
    const mergedResponse = {
      statusCode: 200,
      body: JSON.stringify({
        userId: allResponses[0]?.userId || "unknown",
        persona: allResponses[0]?.persona || "unknown",
        threatEntries: allThreatEntries
      })
    };
    
    return mergedResponse;
  } catch (error) {
    console.error('Error in Lambda execution:', error instanceof Error ? error.message : String(error));
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process fact checking',
        message: error instanceof Error ? error.message : String(error)
      })
    };
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
        textualRating: review.textualRating,
        textualExplanation: review.textualExplanation || "No explanation provided"
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
    
    console.log('Validated Results:', JSON.stringify(validatedResults, null, 2));
    return validatedResults;
  } catch (error) {
    console.error('Error verifying claim:', error);
    throw new Error('Failed to verify claim');
  }
}

async function generateThreatEntry(
  claim: string, 
  sourceUrl: string, 
  sourceType: string,
  factCheckerUrl: string,
  factCheckerExplanation: string
): Promise<ThreatEntry> {
  try {
    const prompt = `You are a threat detection system that analyzes misinformation claims and formats them into standardized JSON threat entries for a database. Given an input claim with its associated information, transform it into a structured threat entry following this exact format: { "description": "[brief description of the misinformation]", "source_url": "[URL from the original claim]", "source": "[source platform/medium]", "status": "[CRITICAL/MEDIUM/LOW based on potential harm]", "factCheckerUrl": "[URL of the fact-checker from the claim]", "factCheckerExplanation": "[explanation from the fact-checker]" } Your task is to: 1. Extract relevant information from the input claim 2. Create a concise description focused on the misinformation 3. Determine an appropriate status level (CRITICAL, MEDIUM, or LOW) based on the potential harm 4. Include the fact-checker information 5. Return only the formatted JSON threat entry without additional commentary

Claim: ${claim}
Source URL: ${sourceUrl}
Source Type: ${sourceType}
Fact Checker URL: ${factCheckerUrl}
Fact Checker Explanation: ${factCheckerExplanation}`;

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: "You are a misinformation analysis system. You only respond with properly formatted JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    const openAiResponse = response.data.choices[0].message.content;
    console.log('OpenAI response:', openAiResponse);
    
    try {
      // Try to parse the response as JSON
      return JSON.parse(openAiResponse);
    } catch (parseError) {
      console.error('Error parsing OpenAI response as JSON:', parseError);
      
      // Fallback: If OpenAI doesn't return valid JSON, create our own
      return {
        description: `Misinformation: ${claim.substring(0, 100)}...`,
        source_url: sourceUrl,
        source: sourceType,
        status: 'MEDIUM', // Default status
        factCheckerUrl: factCheckerUrl,
        factCheckerExplanation: factCheckerExplanation
      };
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    
    // Fallback if OpenAI call fails
    return {
      description: `Misinformation: ${claim.substring(0, 100)}...`,
      source_url: sourceUrl,
      source: sourceType,
      status: 'MEDIUM', // Default status
      factCheckerUrl: factCheckerUrl,
      factCheckerExplanation: factCheckerExplanation
    };
  }
}

// Function to store threat in Supabase
async function storeThreatInSupabase(threatData: {
  id: string
  userId: string;
  description: string;
  sourceUrl: string;
  source: string;
  status: string;
  factCheckerUrl: string;
  factCheckerDescription: string;
}) {
  try {
    console.log('Storing threat in Supabase:', threatData);
    
    const { data, error } = await supabase
      .from('threats')
      .insert([
        {
          id: threatData.id,
          user_id: threatData.userId,
          description: threatData.description,
          source_url: threatData.sourceUrl,
          source: threatData.source,
          status: threatData.status,
          fact_checker_url: threatData.factCheckerUrl,
          fact_checker_description: threatData.factCheckerDescription
        }
      ]);
    
    if (error) {
      console.error('Error storing threat in Supabase:', error);
      throw new Error(`Failed to store threat: ${error.message}`);
    }
    
    console.log('Successfully stored threat in Supabase:', data);
    return data;
  } catch (error) {
    console.error('Exception storing threat in Supabase:', error);
    throw error;
  }
}