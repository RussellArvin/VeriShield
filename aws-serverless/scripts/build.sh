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

# Create news-to-claims Lambda zip
echo "Building news-to-claims Lambda..."
cd $ROOT_DIR/lambdas/news-to-claims
npm install
# Use esbuild to create a bundled version with all dependencies included
npx esbuild src/index.ts --bundle --platform=node --target=node18 --outfile=dist/index.js --external:aws-sdk
# Create smaller package with just the bundled code
zip -r $ROOT_DIR/lambdas/news-to-claims.zip dist package.json

# Create reddit-to-claims Lambda zip
echo "Building reddit-to-claims Lambda..."
cd $ROOT_DIR/lambdas/reddit-to-claims
npm install
# Use esbuild to create a bundled version with all dependencies included
npx esbuild src/index.ts --bundle --platform=node --target=node18 --outfile=dist/index.js --external:aws-sdk
# Create smaller package with just the bundled code
zip -r $ROOT_DIR/lambdas/reddit-to-claims.zip dist package.json

# Create fact-checker Lambda zip
echo "Building fact-checker Lambda..."
cd $ROOT_DIR/lambdas/fact-checker
npm install
# Use esbuild to create a bundled version with all dependencies included
npm run build
# Create smaller package with just the bundled code - explicitly exclude node_modules
rm -f $ROOT_DIR/lambdas/fact-checker.zip
cd dist
zip -r $ROOT_DIR/lambdas/fact-checker.zip . ../package.json

echo "All Lambda functions built successfully!"
echo "Zip files created at:"
ls -la $ROOT_DIR/lambdas/*.zip