#!/bin/bash
# scripts/build.sh

echo "Building Lambda functions..."

# Navigate to project root
cd "$(dirname "$0")/.."
ROOT_DIR=$(pwd)

# Create scheduler Lambda zip
echo "Building scheduler Lambda..."
cd $ROOT_DIR/lambdas/scheduler
npm install
npm run build
zip -r $ROOT_DIR/lambdas/scheduler.zip dist node_modules package.json

# Create subreddit-retrieval Lambda zip
echo "Building subreddit-retrieval Lambda..."
cd $ROOT_DIR/lambdas/subreddit-retrieval
npm install
npm run build
zip -r $ROOT_DIR/lambdas/subreddit-retrieval.zip dist node_modules package.json

# Create reddit-scraper Lambda zip
echo "Building reddit-scraper Lambda..."
cd $ROOT_DIR/lambdas/reddit-scraper
npm install
npm run build
zip -r $ROOT_DIR/lambdas/reddit-scraper.zip dist node_modules package.json

# Create google-news Lambda zip
echo "Building google-news Lambda..."
cd $ROOT_DIR/lambdas/google-news
npm install
npm run build
zip -r $ROOT_DIR/lambdas/google-news.zip dist node_modules package.json

echo "All Lambda functions built successfully!"
echo "Zip files created at:"
ls -la $ROOT_DIR/lambdas/*.zip