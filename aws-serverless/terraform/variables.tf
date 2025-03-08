# Variables
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