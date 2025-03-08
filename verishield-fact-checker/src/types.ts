export interface FactCheckResult {
    claim: string;
    claimReview: {
      publisher: {
        name: string;
      };
      url: string;
      textualRating: string;
    }[];
    rating: string;
  }
  
  export interface ApiResponse {
    status: 'success' | 'error';
    results: FactCheckResult[];
    error?: string;
  }