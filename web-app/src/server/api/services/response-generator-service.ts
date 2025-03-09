import { OpenAI } from "openai";
import { ThreatRepository } from "../repositories/threat-repository";

export type  ThreatLevel  ="CRITCAL" | "MED" | "LOW";
export const RESPONSE_TYPES = [
    "social-media",
    "press-statement", 
    "disclaimer", 
    "email"
  ] as const; 
  
  export type ResponseType = typeof RESPONSE_TYPES[number];
  

// Define interface for the function parameters
export interface ThreatRequest {
  content: string;
  threatLevel: ThreatLevel
  truth: string;
  source: string;
  responseType: ResponseType
}

export class ResponseGeneratorService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey:process.env.OPENAI_API_KEY,
    });


  }


  /**
   * Generates an AI response to misinformation based on the provided parameters
   * @param content The misinformation content to address
   * @param threatLevel The severity level of the threat (percentage)
   * @param source The platform or source where the misinformation was spread
   * @param responseType The type of response to generate
   * @returns The generated response content
   * @throws Error if parameters are missing or if the OpenAI API call fails
   */
  public async generateResponse({
    content,
    threatLevel,
    truth,
    source,
    responseType,
  }: ThreatRequest): Promise<string | null> {

    // Define different system prompts for each response type
    let systemPrompt = "You are an expert PR and communications professional.";
    
    switch (responseType) {
      case "social-media":
        systemPrompt = `You are an expert PR specialist. Craft a **concise and engaging social media response** to misinformation.
        - Keep it within 280 characters (if possible).
        - Use a professional but engaging tone.
        - If necessary, reference verified facts, case studies, or figures.`;
        break;
    
      case "press-statement":
        systemPrompt = `You are an expert corporate communications professional. Craft a **formal press statement** addressing misinformation.
        - Structure it with a **headline, body, and closing statement**.
        - Ensure a neutral, professional tone.
        - Reference **verified facts, case studies, or relevant figures** if applicable.`;
        break;
    
      case "disclaimer":
        systemPrompt = `You are a corporate PR expert. Craft a **clear and professional disclaimer** to address misinformation.
        - Keep it concise but factual.
        - Use a neutral, professional tone.
        - Reference **relevant facts or industry standards**.`;
        break;
    
      case "email":
        systemPrompt = `You are a PR and corporate communications professional. Craft a **polite and professional email** responding to misinformation.
        - Start with a **greeting**.
        - Clearly **address the issue** and provide **clarifications**.
        - Reference **facts or case studies** if necessary.
        - End with a **polite closing statement**.`;
        break;
    
      default:
        throw new Error("Invalid response type. Choose 'social-media', 'press-statement', 'disclaimer', or 'email'.");
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user",
            content: `Generate a response to address this misinformation: "${content}". 
            The truth for this source is as follows: ${truth}
            I have 3 threat levels: CRITCAL, MED, LOW
            Consider that this has a threat level of ${threatLevel} on ${source}.`
          }
        ]
      });

      return completion.choices?.[0]?.message?.content ?? null;
    } catch (error) {
      console.error("Error generating AI response:", error);
      throw new Error("Failed to generate AI response. Please try again later.");
    }
  }
}