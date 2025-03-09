import { TRPCError } from "@trpc/server";
import OpenAI from "openai";

export class AnalysisService {
    private openai: OpenAI;
    
    constructor(apiKey?: string) {
        this.openai = new OpenAI({
            apiKey: apiKey ?? process.env.OPENAI_API_KEY,
        });
    }

    public async generate(
        claim: string,
        rebuttal: string,
        threatLevel: string
    ): Promise<string> {
        const securityAnalysisPrompt = `
            I need an analysis of the following security claim:

            CLAIM: ${claim}

            REBUTTAL: ${rebuttal}

            THREAT LEVEL: ${threatLevel}

            Please craft a comprehensive analysis of this security situation, explaining why it has been categorized at this threat level. Structure your analysis as a single detailed paragraph that evaluates the claim, considers the rebuttal, and justifies the threat categorization.
            `;
            
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4-turbo",
                messages: [
                    { 
                        role: "user", 
                        content: securityAnalysisPrompt 
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            });
            
            return response.choices[0]?.message?.content ?? "Analysis generation failed";
        } catch (error) {
            throw new TRPCError({code:"INTERNAL_SERVER_ERROR"})
        }
    }
}