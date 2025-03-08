import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  newsApiKey: process.env.NEWS_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
  newsApiBaseUrl: 'https://newsapi.org/v2',
};

// Validate required environment variables
const requiredEnvVars = ['NEWS_API_KEY', 'OPENAI_API_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: Environment variable ${envVar} is required but not set.`);
    process.exit(1);
  }
}

export default config;