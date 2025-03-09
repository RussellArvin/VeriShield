import * as dotenv from 'dotenv';
dotenv.config();

import * as express from 'express';
import { OpenAI } from 'openai';

const app = express.default();
const PORT = 3000;

// Check if API key exists
if (!process.env.OPENAI_API_KEY) {
  console.error("ERROR: OpenAI API key is missing. Please check your .env file.");
  process.exit(1);
}

// Middleware to parse JSON
app.use(express.default.json());

// OpenAI API Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to generate infographic using DALL-E
async function generateInfographic(data: {
  description: string;
  source: string;
  status: string;
  source_url: string;
  fact_checked_url: string;
}): Promise<string> {
  const prompt = `Create a visually appealing infographic that contrasts misinformation with verified facts.

Details:
- Description: ${data.description}
- Source: ${data.source}
- Status: ${data.status}
- Source URL: ${data.source_url}
- Fact Checked URL: ${data.fact_checked_url}

Use clear icons, color coding, and structured layouts to emphasize differences.`;

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1024x1024",
  });

  // Check if image URL exists
  const imageUrl = response.data[0]?.url;
  if (!imageUrl) {
    throw new Error('Failed to generate image');
  }
  
  return imageUrl;
}

// Route to handle infographic creation
app.post('/generate-infographic', async (req: any, res: any) => {
  const { description, source_url, source, status, fact_checked_url } = req.body;
  
  if (!description || !source_url || !source || !status || !fact_checked_url) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const imageUrl = await generateInfographic({
      description,
      source_url,
      source,
      status,
      fact_checked_url,
    });
    
    res.json({ imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate infographic' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});