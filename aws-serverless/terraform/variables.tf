variable "supabase_url" {
  description = "The URL for your Supabase instance"
  type        = string
}

variable "supabase_key" {
  description = "The service role key for your Supabase instance"
  type        = string
  sensitive   = true
}

variable "openai_api_key" {
  description = "OpenAI API key for subreddit retrieval"
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
  description = "API key for Google News"
  type        = string
  sensitive   = true
}