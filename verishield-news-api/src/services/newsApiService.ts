import axios from 'axios';
import config from '../config/config';
import { NewsApiResponse, NewsArticle } from '../types';
import { AppError } from '../utils/errorHandler';

class NewsApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = config.newsApiBaseUrl;
    this.apiKey = config.newsApiKey as string;
  }

  /**
   * Fetch news articles based on provided parameters
   * @param keywords - Array of keywords to search for
   * @param language - Language code (e.g., 'en', 'es')
   * @param sources - News sources to filter by
   * @param from - Start date for articles
   * @param to - End date for articles
   * @returns Array of news articles
   */
  async fetchNews(
    keywords: string[],
    language?: string,
    sources?: string,
    from?: string,
    to?: string
  ): Promise<NewsArticle[]> {
    try {
      // Join keywords with OR operator for broader results
      const query = keywords.join(' OR ');
      
      // Build query parameters
      const params: Record<string, string> = {
        apiKey: this.apiKey,
        q: query,
      };

      // Add optional parameters if provided
      if (language) params.language = language;
      if (sources) params.sources = sources;
      if (from) params.from = from;
      if (to) params.to = to;

      // Make API request
      const response = await axios.get<NewsApiResponse>(`${this.baseUrl}/everything`, {
        params,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if response is successful
      if (response.data.status !== 'ok') {
        throw new AppError(`NewsAPI error: ${response.data.status}`, 500);
      }

      return response.data.articles;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status || 500;
        const message = error.response?.data?.message || error.message;
        throw new AppError(`NewsAPI request failed: ${message}`, statusCode);
      }
      throw new AppError('Failed to fetch news articles', 500);
    }
  }
}

export default new NewsApiService();