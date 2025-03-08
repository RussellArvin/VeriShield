#!/bin/bash

# Build scheduler Lambda
cd lambdas/scheduler
npm install
npm run build
# Create deployment package with compiled code and node_modules
mkdir -p ../../terraform/build
cp -r dist node_modules package.json ../../terraform/build/scheduler
cd ../../terraform/build/scheduler
zip -r ../scheduler.zip .

# Build worker Lambda (similar process)
cd ../../../lambdas/worker
npm install
npm run build
mkdir -p ../../terraform/build/worker
cp -r dist node_modules package.json ../../terraform/build/worker
cd ../../terraform/build/worker
zip -r ../worker.zip .