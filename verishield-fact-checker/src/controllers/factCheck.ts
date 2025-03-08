import { Request, Response } from 'express';
import { FactCheckService } from '../services/factCheck';
import { ApiResponse, FactCheckResult } from '../types';

export class FactCheckController {
  private factCheckService: FactCheckService;

  constructor(apiKey: string) {
    this.factCheckService = new FactCheckService(apiKey);
  }

  async verifyInformation(req: Request, res: Response) {
    const response: ApiResponse = { status: 'success', results: [] };
    
    try {
      const { information } = req.body;
      
      if (!information) {
        throw new Error('No information provided');
      }

      // Explicitly type the filter callback parameter
      const claims = information.split(/\. |\n/).filter((c: string) => c.trim());
      
      for (const claim of claims) {
        const results = await this.factCheckService.checkClaim(claim);
        response.results.push(...results);
      }

      res.json(response);
    } catch (error) {
      response.status = 'error';
      response.error = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json(response);
    }
  }
}