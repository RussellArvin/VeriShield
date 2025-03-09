import { OpenAI } from "openai";

// Define threat level enum type
export type ThreatLevel = "CRITICAL" | "MED" | "LOW";

// Define response format enum type
export const RESPONSE_FORMATS = [
  "disclaimer",
  "email",
  "press-statement",
  "social-media"
] as const;

export type ResponseFormat = typeof RESPONSE_FORMATS[number];

// Define response style enum type
export const RESPONSE_STYLES = [
  "concise",
  "detailed",
  "collaborative"
] as const;

export type ResponseStyle = typeof RESPONSE_STYLES[number];

// Define request interface
export interface MisinformationRequest {
  content: string;
  threatLevel: ThreatLevel;
  source: string;
  format: ResponseFormat;
}

// Define response interface
export interface MisinformationResponse {
  format: ResponseFormat;
  responses: {
    concise: string;
    detailed: string;
    collaborative: string;
  };
  error?: string;
}

export class ResponseGenerator {
  private openai: OpenAI;

  constructor(apiKey?: string) {
    this.openai = new OpenAI({
      apiKey: apiKey ?? process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Generates three different types of responses to misinformation
   * @param params MisinformationRequest object containing the misinformation details
   * @returns Promise resolving to a MisinformationResponse object
   */
  public async generateResponses(
    params: MisinformationRequest
  ): Promise<MisinformationResponse> {
    const { content, threatLevel, source, format } = params;


    // Validate format
    if (!RESPONSE_FORMATS.includes(format)) {
      return {
        format,
        responses: { concise: "", detailed: "", collaborative: "" },
        error: "Invalid format"
      };
    }

    try {
      // Generate all three response types in parallel
      const responsePromises = [
        this.generateSingleResponse(content, threatLevel, source, format, "concise"),
        this.generateSingleResponse(content, threatLevel, source, format, "detailed"),
        this.generateSingleResponse(content, threatLevel, source, format, "collaborative")
      ];

      const [conciseResponse, detailedResponse, collaborativeResponse] = await Promise.all(responsePromises);

      return {
        format,
        responses: {
          concise: conciseResponse ?? "",
          detailed: detailedResponse ?? "",
          collaborative: collaborativeResponse ?? ""
        }
      };
    } catch (error) {
      console.error("Error generating AI responses:", error);
      return {
        format,
        responses: { concise: "", detailed: "", collaborative: "" },
        error: "Failed to generate AI responses. Please try again later."
      };
    }
  }

  /**
   * Generates a single response to misinformation
   * @private
   */
  private async generateSingleResponse(
    content: string,
    threatLevel: ThreatLevel,
    source: string,
    format: ResponseFormat,
    responseStyle: ResponseStyle
  ): Promise<string> {
    // Base format prompts
    const formatPrompts: Record<ResponseFormat, string> = {
      "disclaimer": "Craft a clear and professional disclaimer",
      "email": "Craft a polite and professional email response with appropriate greeting and closing",
      "press-statement": "Craft a formal press statement with headline, body, and closing statement",
      "social-media": "Craft a concise and engaging social media post (ideally under 280 characters when possible)"
    };

    // Response style prompts
    const stylePrompts: Record<ResponseStyle, string> = {
      "concise": `that:
- Is brief and direct
- States the facts clearly without ambiguity
- Uses a confident, authoritative tone
- Avoids unnecessary details while being accurate`,

      "detailed": `that:
- Provides comprehensive context and background
- Directly addresses and debunks each false claim with evidence
- Cites reliable sources where appropriate
- Maintains a professional, educational tone`,

      "collaborative": `that:
- Acknowledges concerns without being dismissive
- Uses inclusive language (we, us, together)
- Invites dialogue and further engagement
- Provides resources for additional information
- Balances correction with relationship-building`
    };

    // Format-specific additional instructions
    const formatSpecificInstructions: Record<ResponseFormat, string> = {
      "disclaimer": "Use appropriate legal-sounding language while remaining clear.",
      "email": "Include appropriate email structure with greeting and signature.",
      "press-statement": "Structure this as a formal press statement with a headline, date, and paragraphs.",
      "social-media": "Keep it concise and engaging, using appropriate hashtags if relevant."
    };

    // Translate threat level to descriptive term
    let threatSeverity: string;
    switch (threatLevel) {
      case "CRITICAL":
        threatSeverity = "critical (high urgency)";
        break;
      case "MED":
        threatSeverity = "medium (moderate urgency)";
        break;
      case "LOW":
        threatSeverity = "low (minimal urgency)";
        break;
      default:
        threatSeverity = "unknown";
        break;
    }

    // Build the system prompt
    const systemPrompt = `You are an expert PR and communications professional. ${formatPrompts[format]} ${stylePrompts[responseStyle]} 

${formatSpecificInstructions[format]}

Consider that this misinformation has a ${threatSeverity} threat level, so adjust your tone and urgency accordingly.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Generate a ${format} to address this misinformation: "${content}".`
          }
        ]
      });

      // Explicitly cast to string to handle any potential undefined values
      return (completion.choices[0]?.message?.content ?? "");
    } catch (error) {
      console.error(`Error generating ${responseStyle} response:`, error);
      return `Error generating ${responseStyle} response. Please try again later.`;
    }
  }
}