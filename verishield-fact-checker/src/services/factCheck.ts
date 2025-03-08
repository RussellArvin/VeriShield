import axios from 'axios';
import { FactCheckResult } from '../types';

const API_URL = 'https://factchecktools.googleapis.com/v1alpha1/claims:search';

export class FactCheckService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async checkClaim(claim: string): Promise<FactCheckResult[]> {
    try {
      const response = await axios.get(API_URL, {
        params: {
          key: this.apiKey,
          query: claim,
          languageCode: 'en'
        }
      });

      return response.data.claims?.map((claim: any) => ({
        claim: claim.text,
        claimReview: claim.claimReview.map((review: any) => ({
          publisher: {
            name: review.publisher.name
          },
          url: review.url,
          textualRating: review.textualRating
        })),
        rating: claim.claimReview[0]?.textualRating || 'Unknown'
      })) || [];
    } catch (error) {
      throw new Error('Failed to verify claim');
    }
  }
}