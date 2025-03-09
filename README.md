# VERISHIELD 🛡️

VERISHIELD is an advanced AI-powered platform for detecting, analyzing, and responding to misinformation. It helps organizations protect their brand reputation and stakeholders by proactively identifying false narratives across digital channels.

## Table of Contents
1. [Overview](#overview)
2. [Key Features](#key-features)
3. [System Architecture](#system-architecture)
4. [Technology Stack](#technology-stack)
5. [Getting Started](#getting-started)
6. [Use Cases](#use-cases)
7. [Project Structure](#project-structure)
8. [Development](#development)
9. [Deployment](#deployment)
10. [Future Developments](#future-developments)

## Overview

VERISHIELD monitors content across multiple digital sources, identifies potential misinformation using AI-powered fact-checking, analyzes threats, and generates effective responses. The platform provides a comprehensive dashboard for tracking and managing misinformation threats in real-time.

## Key Features

- **Comprehensive Content Monitoring** - Scans Reddit, news sites, and other digital channels
- **AI-Powered Fact Verification** - Cross-references claims with verified sources
- **Threat Detection & Classification** - Evaluates potential damage and categorizes threats from 'Low' to 'Critical'
- **Deepfake Detection** - Identifies manipulated media with precise accuracy scores
- **Response Generation** - Creates tailored responses following ethical influence principles
- **Centralized Dashboard** - Provides threat visualization, analytics, and response management

## System Architecture

VERISHIELD uses a serverless architecture with AWS Lambda functions to process data through a pipeline:

1. **Content Discovery** - Scheduled processes find relevant content across platforms
   - Identifies relevant subreddits and news sources based on user keywords
   - Retrieves posts and articles from identified sources

2. **Claim Extraction** - AI extracts factual claims from gathered content
   - Processes Reddit posts and news articles
   - Identifies verifiable statements for fact-checking

3. **Verification** - Claims are checked for accuracy
   - Compares claims against Google Fact Check API
   - Uses AI to analyze claims without existing fact checks

4. **Threat Analysis** - Verified misinformation is assessed for risk
   - Evaluates potential reach and impact
   - Assigns threat levels from 'Low' to 'Critical'
   - Examines images for manipulation using deepfake detection

5. **Response Generation** - AI creates appropriate responses
   - Tailors responses based on threat level and content
   - Provides quick-response templates and detailed response options

All data is stored in Supabase and displayed in the Next.js web application.

### Deepfake Detection

VERISHIELD integrates advanced deep learning for detecting manipulated media content. Our system:

1. **Automatically extracts images** from source URLs of verified misinformation
2. **Analyzes each image** for potential manipulation using a state-of-the-art deepfake detection model
3. **Stores detection results** alongside the threat data for a comprehensive analysis

For our deepfake detection capabilities, we leverage [prithivMLmods/Deep-Fake-Detector-Model](https://huggingface.co/prithivMLmods/Deep-Fake-Detector-Model) from Hugging Face. This model:

- Is trained on diverse datasets of real and manipulated images
- Provides confidence scores for classification decisions
- Has been optimized for both accuracy and performance in a serverless environment
- Is deployed as a SageMaker endpoint through AWS infrastructure

The model is integrated into our serverless architecture using AWS SageMaker, with an API Gateway and Lambda proxy to ensure secure, scalable access from our processing pipeline.

### Lambda Function Pipeline

The following diagram illustrates the data flow through our serverless architecture:

```
┌─────────────┐                 ┌─────────────────┐                 ┌────────────────┐
│             │                 │                 │                 │                │
│  Scheduler  │────SNS Topic────▶ Subreddit       │────SNS Topic────▶ Reddit         │
│  Lambda     │ (user-data)     │ Retrieval       │ (subreddit)     │ Scraper        │
│             │                 │ Lambda          │                 │ Lambda         │
└─────────────┘                 └─────────────────┘                 └────────────────┘
       │                                                                    │
       │                                                                    │
       │                                                                    ▼
       │                                                            ┌────────────────┐
       │                                                            │                │
       │                                                            │ Reddit-to-     │
       │                                                            │ Claims Lambda  │
       │                                                            │                │
       │                                                            └────────────────┘
       │                                                                    │
       │                                                                    │
       │                                                                    ▼
       ▼                         ┌─────────────────┐                ┌────────────────┐
┌─────────────┐                  │                 │                │                │
│             │                  │ News-to-        │                │ Fact Checker   │───┐
│ Google News │────SNS Topic─────▶ Claims Lambda   │────SNS Topic───▶ Lambda         │   │
│ Lambda      │  (news-data)     │                 │  (claims)      │                │   │
│             │                  │                 │                │                │   │
└─────────────┘                  └─────────────────┘                └────────────────┘   │
                                                                            │            │
                                                                            │            │
                                                                            ▼            │
                                                                    ┌────────────────┐   │
                                                                    │                │   │
                                                                    │   Supabase     │◀──┘
                                                                    │   Database     │   │
                                                                    │                │   │
                                                                    └────────────────┘   │
                                                                            │            │
                                                                            │            │
                                                                            ▼            │
                                                                    ┌────────────────┐   │
                                                                    │                │   │
                                                                    │   Web App      │   │
                                                                    │   (Next.js)    │   │
                                                                    │                │   │
                                                                    └────────────────┘   │
                                                                                         │
                                                                                         │
┌──────────────────────────────────────────────────────────────────────────────────────┐ │
│                                                                                      │ │
│                                 AWS SageMaker                                        │ │
│                                                                                      │ │
│   ┌─────────────────┐        ┌─────────────────┐       ┌─────────────────┐          │ │
│   │                 │        │                 │       │                 │          │ │
│   │  Hugging Face   │        │   SageMaker     │       │   API Gateway   │◀─────────┘
│   │  Deepfake Model │◀───────▶   Endpoint      │◀──────▶   & Lambda      │
│   │                 │        │                 │       │   Proxy         │
│   └─────────────────┘        └─────────────────┘       └─────────────────┘          │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

Each Lambda function is triggered by events from SNS topics, creating a loosely coupled, event-driven architecture that scales automatically based on workload.

## Technology Stack

### Frontend
- [Next.js](https://nextjs.org) - React framework with SSR capabilities
- [React](https://reactjs.org) - UI library
- [TypeScript](https://www.typescriptlang.org) - Typed JavaScript
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [ShadCN UI](https://ui.shadcn.com) - Component library
- [tRPC](https://trpc.io) - End-to-end typesafe API

### Backend
- [T3 Stack](https://create.t3.gg) - Full-stack, typesafe framework
- [Clerk](https://clerk.com) - Authentication and user management
- [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM with migrations
- [Supabase](https://supabase.com) - PostgreSQL database backend

### AI & Serverless
- [OpenAI API](https://openai.com) - GPT models for text processing
- [AWS Lambda](https://aws.amazon.com/lambda) - Serverless compute
- [AWS SNS](https://aws.amazon.com/sns) - Pub/sub messaging
- [AWS SageMaker](https://aws.amazon.com/sagemaker) - ML model deployment
- [Google Fact Check API](https://developers.google.com/fact-check/tools/api) - Claim verification

### Infrastructure
- [Terraform](https://www.terraform.io) - Infrastructure as code
- [AWS CloudWatch](https://aws.amazon.com/cloudwatch) - Monitoring and scheduling
- [Vercel](https://vercel.com) - Frontend deployment

## Getting Started

### Prerequisites
- Node.js 18.x or later
- pnpm package manager
- PostgreSQL database
- AWS account (for serverless components)
- Clerk account
- OpenAI API key

### Web Application Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/verishield.git
   cd verishield/web-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the `web-app` directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/verishield"

   # Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run database migrations**
   ```bash
   pnpm run db:push
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

### Serverless Setup

1. **Set up AWS credentials**
   Configure your AWS CLI with appropriate credentials.

2. **Deploy serverless infrastructure**
   ```bash
   cd aws-serverless
   terraform init
   terraform apply
   ```

## Use Cases

### Corporate Communications
- Monitor brand mentions across platforms
- Identify and address false narratives
- Craft effective, fact-based responses

### Financial Institutions
- Detect scams and frauds surrounding financial products
- Protect customers from financial misinformation
- Maintain market confidence during volatility

### Healthcare Organizations
- Combat medical misinformation
- Protect public health messaging
- Support evidence-based communication

### Government Agencies
- Track public service misinformation
- Ensure accurate policy understanding
- Support clear public communications

## Project Structure

```
/verishield
├── aws-serverless/             # Serverless components
│   ├── lambdas/                # Lambda functions
│   │   ├── fact-checker/       # Verifies claims
│   │   ├── google-news/        # Retrieves news
│   │   ├── news-to-claims/     # Extracts claims from news
│   │   ├── reddit-scraper/     # Scrapes Reddit posts
│   │   ├── reddit-to-claims/   # Extracts claims from Reddit
│   │   ├── sagemaker-proxy/    # Interfaces with ML models
│   │   ├── scheduler/          # Triggers processing
│   │   └── subreddit-retrieval/# Finds relevant subreddits
│   ├── model/                  # ML model code
│   ├── scripts/                # Deployment scripts
│   └── terraform/              # Infrastructure as code
└── web-app/                    # Next.js web application
    ├── src/
    │   ├── components/         # UI components
    │   ├── pages/              # Application pages
    │   ├── server/             # Backend API
    │   │   ├── api/            # tRPC API definitions
    │   │   ├── db/             # Database schema
    │   │   └── services/       # Business logic
    │   └── styles/             # CSS styles
    └── public/                 # Static assets
```

## Development

To contribute to the codebase:

1. **Web application changes**
   - All frontend code is in the `web-app` directory
   - Use `pnpm dev` to run the development server
   - Follow the existing patterns for components and API calls

2. **Serverless function changes**
   - Lambda functions are in `aws-serverless/lambdas`
   - Each Lambda has its own package.json and dependencies
   - Test changes locally before deploying

3. **Database changes**
   - Use Drizzle migrations for schema changes
   - Create migrations with `pnpm drizzle-kit generate`
   - Apply migrations with `pnpm db:push`

## Deployment

### Web Application
The web app is deployed on Vercel's serverless platform, providing:
- Automatic scaling based on traffic
- Zero-downtime deployments
- Edge network distribution

### SageMaker ML Model Deployment

Our deepfake detection model is deployed using AWS SageMaker, allowing us to:

- **Leverage Hugging Face's Deep-Fake-Detector-Model** - We use the [prithivMLmods/Deep-Fake-Detector-Model](https://huggingface.co/prithivMLmods/Deep-Fake-Detector-Model) from Hugging Face
- **Scale automatically** - Handle varying loads without manual intervention
- **Optimize costs** - Pay only for what we use with serverless inference
- **Ensure low latency** - Process images quickly for real-time threat assessment
- **Maintain high availability** - Multiple availability zones ensure reliable operation

The model is deployed through our Terraform pipeline, which configures the SageMaker endpoint, necessary IAM roles, and API Gateway integration. This provides a secure, RESTful API that our Lambda functions can call to detect deepfakes in images.

### Infrastructure as Code with Terraform

VERISHIELD leverages Terraform for infrastructure automation, providing several key benefits:

- **Consistent Infrastructure** - All AWS resources are defined as code, ensuring consistent deployments
- **Versioned Infrastructure** - Infrastructure changes are tracked alongside application code
- **Environment Parity** - Development, staging, and production environments are identical
- **Simplified Operations** - Complex AWS setup is reduced to a few commands

#### Terraform Pipeline

The Terraform configuration is organized as follows:

```
terraform/
├── main.tf         # Main configuration and provider setup
├── variables.tf    # Input variable definitions
├── outputs.tf      # Output values
└── sagemaker.tf    # SageMaker-specific resources
```

Our Terraform workflow defines and provisions:

1. **Lambda Functions** - All Lambda function resources with appropriate IAM roles
2. **SNS Topics** - Message buses for inter-service communication
3. **Topic Subscriptions** - Connecting Lambdas to their trigger topics
4. **CloudWatch Rules** - Scheduled events that trigger the pipeline
5. **IAM Policies** - Fine-grained access control for all services
6. **SageMaker Endpoints** - ML model deployment for deepfake detection using Hugging Face models
7. **Environment Variables** - Configuration for all Lambda functions

To deploy the infrastructure:

```bash
cd aws-serverless/terraform
terraform init      # Initialize Terraform and download providers
terraform plan      # Preview changes
terraform apply     # Apply changes to AWS infrastructure
```

### Serverless Components
AWS Lambdas are automatically deployed when the Terraform pipeline runs:
- Each Lambda function is packaged as a ZIP file
- Environment variables are injected from Terraform variables
- CloudWatch logs are configured for monitoring
- Function concurrency and memory are optimized for cost and performance

## Future Developments

VERISHIELD is continuously evolving:

- **Enhanced Social Media Integration** - Direct connections to more platforms
- **Advanced Deepfake Detection** - Improved models for video and audio analysis
- **Expanded API Ecosystem** - Integration with more third-party tools
- **Industry-Specific Modules** - Specialized solutions for different sectors
- **Real-time Alert System** - Immediate notifications for critical threats