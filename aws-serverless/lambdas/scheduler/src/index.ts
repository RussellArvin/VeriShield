import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { createClient } from '@supabase/supabase-js';
import { Context, ScheduledEvent } from 'aws-lambda';

// Types for our data
interface User {
  id: string | number;
  keywords: string[] | string;
  persona: string;
}

interface PublishMessage {
  userId: string | number;
  keywords: string[] | string;
  persona: string;
}

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN as string;
const snsClient = new SNSClient({});

export const handler = async (event: ScheduledEvent, context: Context) => {
    try {
        // Query data using Supabase API
        const { data, error } = await supabase
            .from('user')
            .select('id, keywords, persona')
            .limit(100);
        
        if (error) {
            console.error('Error querying Supabase:', error);
            throw error;
        }
        
        // Log the number of items found
        console.log(`Found ${data?.length || 0} items to process`);
        
        if (!data || data.length === 0) {
            return { 
                status: 'success', 
                processedCount: 0
            };
        }
        
        // Publish each item to SNS for processing by other Lambdas
        const publishPromises = data.map(async (item: User) => {
            // Ensure keywords is always in the expected format
            const keywords = Array.isArray(item.keywords) 
                ? item.keywords 
                : typeof item.keywords === 'string' 
                    ? [item.keywords] 
                    : [];
            
            // Restructure the message to have the format we want
            const message: PublishMessage = {
                userId: item.id,
                keywords: keywords,
                persona: item.persona || ''
            };
            
            const command = new PublishCommand({
                TopicArn: SNS_TOPIC_ARN,
                Message: JSON.stringify(message),
                MessageAttributes: {
                    'userId': {
                        DataType: 'String',
                        StringValue: String(item.id)
                    }
                }
            });
            
            await snsClient.send(command);
            console.log(`Published message for user ${item.id}`);
        });
        
        await Promise.all(publishPromises);
        
        return { 
            status: 'success', 
            processedCount: data.length 
        };
    } catch (err) {
        console.error('Error in Lambda execution:', err instanceof Error ? err.message : String(err));
        throw err; // Rethrow to mark Lambda as failed
    }
};