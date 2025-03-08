# Provider configuration
provider "aws" {
  region = "us-east-1"  # Or your preferred region
}

# First SNS Topic - For communication between scheduler and subredditRetrieval
resource "aws_sns_topic" "user_data_topic" {
  name = "user-data-topic"
}

# Second SNS Topic - For communication between subredditRetrieval and redditScraper
resource "aws_sns_topic" "subreddit_data_topic" {
  name = "subreddit-data-topic"
}

# IAM role for the scheduler Lambda
resource "aws_iam_role" "scheduler_lambda_role" {
  name = "scheduler-lambda-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# Basic policies for logging and SNS publish for scheduler
resource "aws_iam_role_policy" "scheduler_policy" {
  name = "scheduler-policy"
  role = aws_iam_role.scheduler_lambda_role.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Action   = "sns:Publish"
        Effect   = "Allow"
        Resource = aws_sns_topic.user_data_topic.arn
      }
    ]
  })
}

# Scheduler Lambda - Gets users from Supabase
resource "aws_lambda_function" "scheduler" {
  function_name    = "data-scheduler"
  filename         = "${path.module}/../lambdas/scheduler.zip"
  source_code_hash = filebase64sha256("${path.module}/../lambdas/scheduler.zip")
  handler          = "dist/index.handler"  # Changed to support TypeScript
  runtime          = "nodejs18.x"
  timeout          = 10
  memory_size      = 128
  role             = aws_iam_role.scheduler_lambda_role.arn
  
  environment {
    variables = {
      SUPABASE_URL = var.supabase_url
      SUPABASE_SERVICE_ROLE_KEY = var.supabase_key
      SNS_TOPIC_ARN = aws_sns_topic.user_data_topic.arn
    }
  }
}

# CloudWatch Event Rule (cron)
resource "aws_cloudwatch_event_rule" "hourly_trigger" {
  name                = "hourly-scheduler-trigger"
  description         = "Trigger the scheduler Lambda every hour"
  schedule_expression = "rate(1 hour)"
}

resource "aws_cloudwatch_event_target" "trigger_scheduler" {
  rule      = aws_cloudwatch_event_rule.hourly_trigger.name
  target_id = "TriggerSchedulerLambda"
  arn       = aws_lambda_function.scheduler.arn
}

resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.scheduler.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.hourly_trigger.arn
}

# subredditRetrieval Lambda role
resource "aws_iam_role" "subreddit_retrieval_role" {
  name = "subreddit-retrieval-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# Policy for subredditRetrieval Lambda
resource "aws_iam_role_policy" "subreddit_retrieval_policy" {
  name = "subreddit-retrieval-policy"
  role = aws_iam_role.subreddit_retrieval_role.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Action   = "sns:Publish"
        Effect   = "Allow"
        Resource = aws_sns_topic.subreddit_data_topic.arn
      }
    ]
  })
}

# subredditRetrieval Lambda function
resource "aws_lambda_function" "subreddit_retrieval" {
  function_name    = "subreddit-retrieval"
  filename         = "${path.module}/../lambdas/subreddit-retrieval.zip"
  source_code_hash = filebase64sha256("${path.module}/../lambdas/subreddit-retrieval.zip")
  handler          = "dist/index.handler"  # For TypeScript
  runtime          = "nodejs18.x"
  timeout          = 30                    # Increased timeout for OpenAI API
  memory_size      = 256                   # More memory for OpenAI processing
  role             = aws_iam_role.subreddit_retrieval_role.arn
  
  environment {
    variables = {
      OPENAI_API_KEY = var.openai_api_key
      SNS_TOPIC_ARN = aws_sns_topic.subreddit_data_topic.arn
    }
  }
}

# SNS subscription for the subredditRetrieval Lambda
resource "aws_sns_topic_subscription" "subreddit_retrieval_subscription" {
  topic_arn = aws_sns_topic.user_data_topic.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.subreddit_retrieval.arn
}

resource "aws_lambda_permission" "allow_sns_to_subreddit_retrieval" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.subreddit_retrieval.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.user_data_topic.arn
}

# redditScraper Lambda role
resource "aws_iam_role" "reddit_scraper_role" {
  name = "reddit-scraper-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# Policy for redditScraper Lambda
resource "aws_iam_role_policy" "reddit_scraper_policy" {
  name = "reddit-scraper-policy"
  role = aws_iam_role.reddit_scraper_role.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ]
      Effect   = "Allow"
      Resource = "arn:aws:logs:*:*:*"
    }]
  })
}

# redditScraper Lambda function
resource "aws_lambda_function" "reddit_scraper" {
  function_name    = "reddit-scraper"
  filename         = "${path.module}/../lambdas/reddit-scraper.zip"
  source_code_hash = filebase64sha256("${path.module}/../lambdas/reddit-scraper.zip")
  handler          = "dist/index.handler"  # For TypeScript
  runtime          = "nodejs18.x"
  timeout          = 30                    # Increased for API calls
  memory_size      = 256                   # More memory for processing
  role             = aws_iam_role.reddit_scraper_role.arn
  
  environment {
    variables = {
      REDDIT_CLIENT_ID = var.reddit_client_id
      REDDIT_CLIENT_SECRET = var.reddit_client_secret
      SUPABASE_URL = var.supabase_url
      SUPABASE_SERVICE_ROLE_KEY = var.supabase_key
    }
  }
}

# SNS subscription for the redditScraper Lambda
resource "aws_sns_topic_subscription" "reddit_scraper_subscription" {
  topic_arn = aws_sns_topic.subreddit_data_topic.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.reddit_scraper.arn
}

resource "aws_lambda_permission" "allow_sns_to_reddit_scraper" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.reddit_scraper.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.subreddit_data_topic.arn
}

# Google News Lambda role
resource "aws_iam_role" "google_news_role" {
  name = "google-news-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# Policy for Google News Lambda
resource "aws_iam_role_policy" "google_news_policy" {
  name = "google-news-policy"
  role = aws_iam_role.google_news_role.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ]
      Effect   = "Allow"
      Resource = "arn:aws:logs:*:*:*"
    }]
  })
}

# Google News Lambda function
resource "aws_lambda_function" "google_news" {
  function_name    = "google-news"
  filename         = "${path.module}/../lambdas/google-news.zip"
  source_code_hash = filebase64sha256("${path.module}/../lambdas/google-news.zip")
  handler          = "dist/index.handler"
  runtime          = "nodejs18.x"
  timeout          = 30
  memory_size      = 256
  role             = aws_iam_role.google_news_role.arn
  
  environment {
    variables = {
      GOOGLE_NEWS_API_KEY = var.google_news_api_key
      SUPABASE_URL = var.supabase_url
      SUPABASE_SERVICE_ROLE_KEY = var.supabase_key
    }
  }
}

# SNS subscription for the Google News Lambda
resource "aws_sns_topic_subscription" "google_news_subscription" {
  topic_arn = aws_sns_topic.user_data_topic.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.google_news.arn
}

resource "aws_lambda_permission" "allow_sns_to_google_news" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.google_news.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.user_data_topic.arn
}