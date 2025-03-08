import { Request, Response, NextFunction } from 'express';
import openaiService from '../services/openaiService';
import newsApiService from '../services/newsApiService';
import { NewsRequest, NewsResponse } from '../types';
import { AppError } from '../utils/errorHandler';

export const getNewsArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { 
      keywords, 
      organization, 
      language, 
      sources, 
      from, 
      to 
    } = req.body as NewsRequest;

    // Validate required fields
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      throw new AppError('At least one keyword is required', 400);
    }

    if (!organization || organization.trim() === '') {
      throw new AppError('Organization name is required', 400);
    }

    // Step 1: Generate additional keywords using OpenAI
    const generatedKeywords = await openaiService.generateRelatedKeywords(
      organization,
      keywords
    );

    // Step 2: Combine original keywords with generated ones
    const allKeywords = [...new Set([...keywords, ...generatedKeywords])];

    // Step 3: Fetch news articles using the combined keywords
    const articles = await newsApiService.fetchNews(
      allKeywords,
      language,
      sources,
      from,
      to
    );

    // Step 4: Prepare and send response
    const response: NewsResponse = {
      originalKeywords: keywords,
      generatedKeywords,
      totalResults: articles.length,
      articles,
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};