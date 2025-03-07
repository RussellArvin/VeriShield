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

interface ThreatRequest {
  content: string;
  threatLevel: number;
  reach: number;
  source: string;
  responseType: "social-media" | "press-statement" | "disclaimer" | "email";
}

app.post('/test', async (req: Request, res: Response) => {
  res.json({ message: "Test endpoint working!" });
});

app.post("/generate-response", async (req: Request, res: Response) => {
  const { content, threatLevel, reach, source, responseType }: ThreatRequest = req.body as ThreatRequest;

  if (!content || threatLevel === undefined || reach === undefined || !source || !responseType) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

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
      return res.status(400).json({ error: "Invalid response type. Choose 'social-media', 'press-statement', 'disclaimer', or 'email-response'." });
  }
  

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user",
          content: `Generate a response to address this misinformation: "${content}". 
          Consider that this has a threat level of ${threatLevel}% and has reached ${reach} users on ${source}.`
        }
      ]
    });

    return res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error generating AI response:", error);
    return res.status(500).json({ error: "Failed to generate AI response. Please try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});