import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';

// Custom API error class
export class AppError extends Error implements ApiError {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly stack!: string;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    stack = ''
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;
  
  if (!(error instanceof AppError)) {
    const statusCode = 'statusCode' in error ? error.statusCode : 500;
    const message = error.message || 'Something went wrong';
    error = new AppError(message, statusCode, true, error.stack);
  }

  const apiError = error as ApiError;
  
  if (process.env.NODE_ENV === 'development') {
    res.status(apiError.statusCode).json({
      success: false,
      error: {
        message: apiError.message,
        stack: apiError.stack,
        statusCode: apiError.statusCode,
      },
    });
  } else {
    // Production error response (no stack trace)
    res.status(apiError.statusCode).json({
      success: false,
      message: apiError.isOperational ? apiError.message : 'Something went wrong',
    });
  }
};

// Handler for unhandled promise rejections
export const unhandledRejectionHandler = (
  error: Error,
  promise: Promise<any>
) => {
  console.error('Unhandled Rejection:', error);
  // Optionally exit process on unhandled rejection
  // process.exit(1);
};