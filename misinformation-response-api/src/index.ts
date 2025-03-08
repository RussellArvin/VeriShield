import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface MisinformationRequest {
  content: string;
  threatLevel: number;
  reach: number;
  source: string;
  format: "disclaimer" | "email" | "press-statement" | "social-media";
}

app.post('/test', async (req: Request, res: Response) => {
  res.json({ message: "Test endpoint working!" });
});

app.post("/generate-responses", async (req: Request, res: Response) => {
  const { content, threatLevel, reach, source, format }: MisinformationRequest = req.body as MisinformationRequest;

  if (!content || threatLevel === undefined || reach === undefined || !source || !format) {
    return res.status(400).json({ 
      error: "Missing required parameters", 
      requiredParameters: ["content", "threatLevel", "reach", "source", "format"] 
    });
  }

  // Validate format
  const validFormats = ["disclaimer", "email", "press-statement", "social-media"];
  if (!validFormats.includes(format)) {
    return res.status(400).json({ 
      error: "Invalid format", 
      validFormats: validFormats 
    });
  }

  try {
    // Generate all three response types in parallel
    const responsePromises = [
      generateResponse(content, threatLevel, reach, source, format, "concise"),
      generateResponse(content, threatLevel, reach, source, format, "detailed"),
      generateResponse(content, threatLevel, reach, source, format, "collaborative")
    ];

    const [conciseResponse, detailedResponse, collaborativeResponse] = await Promise.all(responsePromises);

    return res.json({
      format,
      responses: {
        concise: conciseResponse,
        detailed: detailedResponse,
        collaborative: collaborativeResponse
      }
    });
  } catch (error) {
    console.error("Error generating AI responses:", error);
    return res.status(500).json({ error: "Failed to generate AI responses. Please try again later." });
  }
});

async function generateResponse(
  content: string,
  threatLevel: number,
  reach: number,
  source: string,
  format: string,
  responseType: "concise" | "detailed" | "collaborative"
): Promise<string> {
  // Base format prompts
  const formatPrompts = {
    "disclaimer": "Craft a clear and professional disclaimer",
    "email": "Craft a polite and professional email response with appropriate greeting and closing",
    "press-statement": "Craft a formal press statement with headline, body, and closing statement",
    "social-media": "Craft a concise and engaging social media post (ideally under 280 characters when possible)"
  };

  // Response type prompts
  const typePrompts = {
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
  const formatSpecificInstructions = {
    "disclaimer": "Use appropriate legal-sounding language while remaining clear.",
    "email": "Include appropriate email structure with greeting and signature.",
    "press-statement": "Structure this as a formal press statement with a headline, date, and paragraphs.",
    "social-media": "Keep it concise and engaging, using appropriate hashtags if relevant."
  };

  // Build the system prompt
  const systemPrompt = `You are an expert PR and communications professional. ${formatPrompts[format as keyof typeof formatPrompts]} ${typePrompts[responseType]} 

${formatSpecificInstructions[format as keyof typeof formatSpecificInstructions]}

Consider that this misinformation has a threat level of ${threatLevel}% and has reached ${reach} users on ${source}, so adjust your tone and urgency accordingly.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { 
        role: "user", 
        content: `Generate a ${format} to address this misinformation: "${content}".`
      }
    ]
  });

  return completion.choices[0].message.content || "";
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export { app }; // Export for testing