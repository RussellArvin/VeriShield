import OpenAI from 'openai';
import config from '../config/config';
import { AppError } from '../utils/errorHandler';

class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
    });
  }

  /**
   * Generate related keywords based on organization and initial keywords
   * @param organization - Organization name
   * @param initialKeywords - Initial keywords provided by the user
   * @returns Array of generated keywords
   */
  async generateRelatedKeywords(
    organization: string,
    initialKeywords: string[]
  ): Promise<string[]> {
    try {
      const prompt = `
        Organization: ${organization}
        Initial Keywords: ${initialKeywords.join(', ')}
        
        Please generate a list of 10 additional relevant keywords or phrases related to the organization and initial keywords above.
        These keywords will be used to search for news articles that are relevant to the organization.
        Return only the keywords as a comma-separated list without numbering or explanations.
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: "You are a helpful assistant that generates relevant keywords for news searches. Provide only the requested keywords without any additional text."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 200,
      });

      // Extract and process the response
      const content = response.choices[0]?.message?.content?.trim() || '';
      
      // Split by commas and clean up each keyword
      const generatedKeywords = content
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);
      
      return generatedKeywords;
    } catch (error) {
      console.error('Error generating keywords with OpenAI:', error);
      throw new AppError('Failed to generate keywords', 500);
    }
  }
}

export default new OpenAIService();