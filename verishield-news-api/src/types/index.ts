// News API interfaces
export interface NewsArticle {
    source: {
      id: string | null;
      name: string;
    };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
  }
  
  export interface NewsApiResponse {
    status: string;
    totalResults: number;
    articles: NewsArticle[];
  }
  
  // Request/Response interfaces
  export interface NewsRequest {
    keywords: string[];
    organization: string;
    language?: string;
    sources?: string;
    from?: string;
    to?: string;
  }
  
  export interface NewsResponse {
    originalKeywords: string[];
    generatedKeywords: string[];
    totalResults: number;
    articles: NewsArticle[];
  }
  
  // Error interfaces
  export interface ApiError extends Error {
    statusCode: number;
    isOperational: boolean;
  }