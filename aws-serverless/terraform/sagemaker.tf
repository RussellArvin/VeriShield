# SageMaker execution role with inline policy
resource "aws_iam_role" "sagemaker_role" {
  name = "sagemaker-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "sagemaker.amazonaws.com"
      }
    }]
  })

  # Attach managed AmazonSageMakerFullAccess policy
  managed_policy_arns = ["arn:aws:iam::aws:policy/AmazonSageMakerFullAccess"]

  # Inline policy for additional ECR, and S3 permissions
  inline_policy {
    name = "sagemaker-permissions"
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Action = [
            "ecr:GetDownloadUrlForLayer",
            "ecr:BatchGetImage",
            "ecr:BatchCheckLayerAvailability",
            "ecr:GetAuthorizationToken",
            "ecr:DescribeRepositories",
            "ecr:ListImages",
            "ecr:DescribeImages"
          ]
          Effect   = "Allow"
          Resource = "*"
        },
        {
          Action = [
            "ecr-public:GetAuthorizationToken",
            "ecr-public:BatchCheckLayerAvailability",
            "ecr-public:GetRepositoryCatalogData",
            "ecr-public:DescribeImages"
          ]
          Effect   = "Allow"
          Resource = "*"
        },
        {
          Action = [
            "sts:GetServiceBearerToken"
          ]
          Effect   = "Allow"
          Resource = "*"
        },
        {
          Action = [
            "s3:*"
          ]
          Effect   = "Allow"
          Resource = "*"
        },
        {
          Action = [
            "logs:CreateLogGroup",
            "logs:CreateLogStream", 
            "logs:PutLogEvents"
          ]
          Effect   = "Allow"
          Resource = "*"
        }
      ]
    })
  }
}

# SageMaker Model
resource "aws_sagemaker_model" "deepfake_model" {
  name               = "deepfake-model"
  execution_role_arn = aws_iam_role.sagemaker_role.arn

  primary_container {
    # Fixed image URI with the exact SHA256 that matches what's being used
    image = "763104351884.dkr.ecr.${var.region}.amazonaws.com/huggingface-pytorch-inference:1.13.1-transformers4.26.0-gpu-py39-cu117-ubuntu20.04"
    
    environment = {
      "HF_MODEL_ID"                  = var.model_name
      "HF_TASK"                      = "image-classification"
      "SAGEMAKER_CONTAINER_LOG_LEVEL" = "20"
      "SAGEMAKER_REGION"             = var.region
    }
  }

  depends_on = [aws_iam_role.sagemaker_role]
}

# SageMaker Endpoint Configuration
resource "aws_sagemaker_endpoint_configuration" "deepfake_config" {
  name = "deepfake-config"

  production_variants {
    variant_name           = "default"
    model_name             = aws_sagemaker_model.deepfake_model.name
    initial_instance_count = var.instance_count
    instance_type          = var.instance_type
  }
}

# SageMaker Endpoint
resource "aws_sagemaker_endpoint" "deepfake_endpoint" {
  name                 = "deepfake-endpoint"
  endpoint_config_name = aws_sagemaker_endpoint_configuration.deepfake_config.name
}

# Lambda role
resource "aws_iam_role" "lambda_role" {
  name = "lambda-sagemaker-role"

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

  # Inline policy for Lambda to invoke SageMaker
  inline_policy {
    name = "lambda-sagemaker-policy"
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
          Resource = "*"
        },
        {
          Action = [
            "sagemaker:InvokeEndpoint"
          ]
          Effect   = "Allow"
          Resource = aws_sagemaker_endpoint.deepfake_endpoint.arn
        }
      ]
    })
  }
}

# Lambda function
resource "aws_lambda_function" "sagemaker_proxy" {
  function_name    = "sagemaker-proxy"
  filename         = "${path.module}/../lambdas/sagemaker-proxy.zip"
  source_code_hash = filebase64sha256("${path.module}/../lambdas/sagemaker-proxy.zip")
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  timeout          = 30
  memory_size      = 256
  role             = aws_iam_role.lambda_role.arn
  
  environment {
    variables = {
      SAGEMAKER_ENDPOINT_NAME = aws_sagemaker_endpoint.deepfake_endpoint.name
    }
  }
}

# API Gateway
resource "aws_api_gateway_rest_api" "api" {
  name        = "deepfake-api"
  description = "API for Deepfake Detection"
}

resource "aws_api_gateway_resource" "predict" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "predict"
}

resource "aws_api_gateway_method" "post" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.predict.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.predict.id
  http_method = aws_api_gateway_method.post.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.sagemaker_proxy.invoke_arn
}

# CORS Support
resource "aws_api_gateway_method" "options" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.predict.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.predict.id
  http_method = aws_api_gateway_method.options.http_method
  type        = "MOCK"
  
  request_templates = {
    "application/json" = jsonencode({ statusCode = 200 })
  }
}

resource "aws_api_gateway_method_response" "options_200" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.predict.id
  http_method = aws_api_gateway_method.options.http_method
  status_code = "200"
  
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration_response" "options_response" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.predict.id
  http_method = aws_api_gateway_method.options.http_method
  status_code = aws_api_gateway_method_response.options_200.status_code
  
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'",
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'",
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.sagemaker_proxy.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}

# Deployment and Stage
resource "aws_api_gateway_deployment" "deployment" {
  depends_on = [
    aws_api_gateway_integration.lambda,
    aws_api_gateway_integration.options
  ]

  rest_api_id = aws_api_gateway_rest_api.api.id
  
  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.predict.id,
      aws_api_gateway_method.post.id,
      aws_api_gateway_method.options.id,
      aws_api_gateway_integration.lambda.id,
      aws_api_gateway_integration.options.id
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "stage" {
  deployment_id = aws_api_gateway_deployment.deployment.id
  rest_api_id   = aws_api_gateway_rest_api.api.id
  stage_name    = var.environment
}

# Output the API URL
output "api_url" {
  value = "${aws_api_gateway_stage.stage.invoke_url}/predict"
  description = "URL for the deepfake detection API"
}