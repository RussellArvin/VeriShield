# Variables
variable "region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "ap-southeast-1"  # Match your existing infrastructure region
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "model_name" {
  description = "Name of the Hugging Face model"
  type        = string
  default     = "prithivMLmods/Deep-Fake-Detector-Model"
}

variable "instance_type" {
  description = "SageMaker instance type for inference"
  type        = string
  default     = "ml.t2.medium"  # Free tier eligible instance
}

variable "instance_count" {
  description = "Number of instances for the endpoint"
  type        = number
  default     = 1
}



variable "supabase_url" {
  description = "Supabase URL"
  type        = string
  sensitive   = true
}

variable "supabase_key" {
  description = "Supabase service role key"
  type        = string
  sensitive   = true
}

variable "openai_api_key" {
  description = "OpenAI API key"
  type        = string
  sensitive   = true
}

variable "reddit_client_id" {
  description = "Reddit API client ID"
  type        = string
  sensitive   = true
}

variable "reddit_client_secret" {
  description = "Reddit API client secret"
  type        = string
  sensitive   = true
}

variable "google_news_api_key" {
  description = "Google News API key"
  type        = string
  sensitive   = true
}

variable "google_fact_check_api_key" {
  description = "Google Fact Check Tools API key"
  type        = string
  sensitive   = true
}