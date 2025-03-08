# Provider configuration
provider "aws" {
  region = "us-east-1"  # Or your preferred region
}

# SNS Topic - Free tier includes 1 million SNS publishes per month
resource "aws_sns_topic" "processor_topic" {
  name = "data-processor-topic"
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

# Basic policies for logging and SNS publish
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
        Resource = aws_sns_topic.processor_topic.arn
      }
    ]
  })
}

# Scheduler Lambda - Free tier includes 1 million invocations per month
resource "aws_lambda_function" "scheduler" {
  function_name    = "data-scheduler"
  filename         = "${path.module}/../lambdas/scheduler.zip"
  source_code_hash = filebase64sha256("${path.module}/../lambdas/scheduler.zip")
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  timeout          = 10                     # Lower timeout to reduce resource usage
  memory_size      = 128                    # Minimum memory for Lambda - free tier eligible
  role             = aws_iam_role.scheduler_lambda_role.arn
  
  environment {
    variables = {
      SUPABASE_URL = var.supabase_url
      SUPABASE_SERVICE_ROLE_KEY = var.supabase_key
      SNS_TOPIC_ARN = aws_sns_topic.processor_topic.arn
    }
  }
}

# CloudWatch Event Rule (cron) - Free tier includes some CloudWatch usage
resource "aws_cloudwatch_event_rule" "hourly_trigger" {
  name                = "hourly-scheduler-trigger"
  description         = "Trigger the scheduler Lambda every hour"
  schedule_expression = "rate(1 hour)"      # Keep hourly to minimize invocations
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

# Worker Lambda role
resource "aws_iam_role" "worker_lambda_role" {
  name = "worker-lambda-role"
  
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

# Basic logging policy for worker
resource "aws_iam_role_policy" "worker_policy" {
  name = "worker-policy"
  role = aws_iam_role.worker_lambda_role.id
  
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

# Worker Lambda function - Also free tier eligible
resource "aws_lambda_function" "worker" {
  function_name    = "data-processor-worker"
  filename         = "${path.module}/../lambdas/worker.zip"
  source_code_hash = filebase64sha256("${path.module}/../lambdas/worker.zip")
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  timeout          = 10                     # Lower timeout to reduce resource usage
  memory_size      = 128                    # Minimum memory for Lambda
  role             = aws_iam_role.worker_lambda_role.arn
}

# SNS subscription for the worker Lambda
resource "aws_sns_topic_subscription" "worker_subscription" {
  topic_arn = aws_sns_topic.processor_topic.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.worker.arn
}

resource "aws_lambda_permission" "allow_sns" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.worker.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.processor_topic.arn
}

# Variables
variable "supabase_url" {
  description = "The URL for your Supabase instance"
  type        = string
}

variable "supabase_key" {
  description = "The service role key for your Supabase instance"
  type        = string
  sensitive   = true
}