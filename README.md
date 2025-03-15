# VERISHIELD 🛡️

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-13-black?logo=next.js" alt="Next.js"></a>
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18-blue?logo=react" alt="React"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-4.9-blue?logo=typescript" alt="TypeScript"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind-3.3-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
  <a href="https://ui.shadcn.com"><img src="https://img.shields.io/badge/UI-shadcn%2Fui-000000?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaXJjbGUiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIi8+PC9zdmc+" alt="shadcn/ui"></a>
  <a href="https://trpc.io"><img src="https://img.shields.io/badge/tRPC-10-2596BE?logo=trpc" alt="tRPC"></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase" alt="Supabase"></a>
  <a href="https://clerk.com"><img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk" alt="Clerk"></a>
  <a href="https://openai.com"><img src="https://img.shields.io/badge/OpenAI-API-412991?logo=openai" alt="OpenAI"></a>
  <a href="https://aws.amazon.com/sagemaker/"><img src="https://img.shields.io/badge/AWS%20SageMaker-ML-FF9900?logo=amazon-aws" alt="AWS SageMaker"></a>
  <a href="https://aws.amazon.com/lambda/"><img src="https://img.shields.io/badge/AWS%20Lambda-Serverless-FF9900?logo=amazon-aws" alt="AWS Lambda"></a>
  <a href="https://aws.amazon.com/sns/"><img src="https://img.shields.io/badge/AWS%20SNS-Messaging-FF9900?logo=amazon-aws" alt="AWS SNS"></a>
  <a href="https://www.terraform.io"><img src="https://img.shields.io/badge/Terraform-1.x-7B42BC?logo=terraform" alt="Terraform"></a>
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/Vercel-Deployment-000000?logo=vercel" alt="Vercel"></a>
</p>

VERISHIELD is an advanced AI-powered platform for detecting, analyzing, and responding to misinformation. VeriShield goes beyond just detecting misinformation — it predicts emerging threats before they escalate into critical issues. By proactively identifying false narratives across digital channels, VeriShield empowers organizations to safeguard their brand reputation and stakeholders. Its advanced predictive analysis enables early intervention, ensuring potential risks are addressed swiftly and effectively.

<p align="center">
  <img src="logo.jpg" alt="VeriShield Logo">
</p>

## Watch the Demo

See VeriShield in action! Click below to watch a demonstration of our platform's capabilities:

<p align="center">
  <a href="https://youtu.be/wfSEPD1uwUk?si=i5-C_owfAJZ2zROd" title="Verishield Demo">
    <img src="https://img.shields.io/badge/YouTube-Watch%20Demo-red?style=for-the-badge&logo=youtube&logoColor=white" alt="Watch Demo on YouTube">
  </a>
</p>

## Table of Contents
1. [Watch the Demo](#watch-the-demo)
2. [Collaborators](#collaborators)
3. [Overview](#overview)
4. [Key Features](#key-features)
5. [System Architecture](#system-architecture)
6. [Technology Stack](#technology-stack)
7. [Getting Started](#getting-started)
8. [Use Cases](#use-cases)
9. [Project Structure](#project-structure)
10. [Development](#development)
11. [Deployment](#deployment)
12. [Future Developments](#future-developments)

## Collaborators

The VERISHIELD project is made possible by the contributions of the following individuals:

| Name | GitHub | LinkedIn |
|------|--------|----------|
| Russell Arvin | [![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/russellarvin) | [![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/russellarvin/) |
| Teow Choon Ray | [![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/TeowChoonRay) | [![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/choonray/) |
| Leanne Yeong | [![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/leanneyeong) | [![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/leanne-yeong-24957a261/) |
| Celeste Ho | [![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/celestehosq) | [![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/celeste-ho-b44678287/) |


## Overview

VERISHIELD monitors content across multiple digital sources, identifies potential misinformation using AI-powered fact-checking, analyzes threats, and generates effective responses. The platform provides a comprehensive dashboard for tracking and managing misinformation threats in real-time.

## Key Features

- **Comprehensive Content Monitoring** - Scans Reddit, news sites, and other digital channels
- **AI-Powered Fact Verification** - Cross-references claims with verified sources
- **Threat Detection & Classification** - Evaluates potential damage and categorizes threats from 'No Threat' to 'Critical'
- **Deepfake Detection** - Identifies manipulated media with precise accuracy scores
- **Response Generation** - Creates customisable tailored responses following ethical influence principles
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
   - Assigns threat levels from 'No Threat' to 'Low' to 'Critical'
   - Examines images for manipulation using deepfake detection

5. **Response Generation** - AI creates appropriate responses
   - Tailors responses based on threat level and content
   - Provides quick-response templates and detailed response options, which can be edited

All data is stored in Supabase and displayed in the Next.js web application.

### Deepfake Detection

VERISHIELD integrates advanced deep learning for detecting manipulated media content. Our system:

1. **Automatically extracts images** from source URLs of verified misinformation
2. **Analyzes each image** for potential manipulation using a state-of-the-art deepfake detection model
3. **Stores detection results** alongside the threat data for a comprehensive analysis

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
│   ┌─────────────────┐        ┌─────────────────┐       ┌─────────────────┐           │ │
│   │                 │        │                 │       │                 │           │ │
│   │  Hugging Face   │        │   SageMaker     │       │   API Gateway   │◀─────────-┘ |
│   │  Deepfake Model │◀───────▶   Endpoint      │◀──────▶   & Lambda      │           |
│   │                 │        │                 │       │   Proxy         │           |
│   └─────────────────┘        └─────────────────┘       └─────────────────┘           │
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
   git clone https://github.com/russellarvin/verishield.git
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

2. **Build Lambda functions**
   ```bash
   cd aws-serverless
   ./scripts/build.sh
   ```

3. **Set up Terraform variables**
   Create a `terraform.tfvars` file in the `aws-serverless/terraform` directory:
   ```
   # AWS Configuration
   region            = "ap-southeast-1"  # Your preferred AWS region
   environment       = "dev"             # dev, staging, or prod
   
   # Database
   supabase_url      = "your_supabase_url"
   supabase_key      = "your_supabase_service_role_key"
   
   # AI/ML
   openai_api_key    = "your_openai_api_key"
   
   # External APIs
   reddit_client_id     = "your_reddit_client_id"
   reddit_client_secret = "your_reddit_client_secret"
   google_news_api_key  = "your_google_news_api_key"
   google_fact_check_api_key = "your_google_fact_check_api_key"
   
   # SageMaker Configuration (optional - defaults provided)
   # model_name      = "prithivMLmods/Deep-Fake-Detector-Model"
   # instance_type   = "ml.t2.medium"
   # instance_count  = 1
   ```

4. **Deploy serverless infrastructure**
   ```bash
   cd terraform
   terraform init
   terraform apply
   ```

## Use Cases

### Corporate Communications
- Monitor brand mentions across platforms
- Identify and address false narratives or rumours
- Craft effective, fact-based responses

### Financial Institutions
- Detect scams and frauds surrounding financial products
- Protect customers from financial misinformation (i.e. Pump and Dump Schemes)
- Maintain market confidence during volatility

### Healthcare Organizations
- Combat medical misinformation (i.e. Vaccines Hoax)
- Protect public health messaging
- Support evidence-based communication

### Government Agencies
- Track public service misinformation (i.e. Elections, Government Policies)
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

### ML Model Deployment on AWS

For our AI capabilities including deepfake detection, we use AWS SageMaker with the [prithivMLmods/Deep-Fake-Detector-Model](https://huggingface.co/prithivMLmods/Deep-Fake-Detector-Model) from Hugging Face. This setup:

- **Scales automatically** with varying loads
- **Optimizes costs** through serverless inference (pay-per-use)
- **Ensures low latency** for real-time threat assessment
- **Maintains high availability** across multiple availability zones

Our Terraform pipeline configures the SageMaker endpoints, IAM roles, and API Gateway integration, providing a secure API for Lambda functions.

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

