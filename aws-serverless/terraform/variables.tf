# variables.tf example
variable "supabase_url" {
  description = "The URL for your Supabase instance"
  type        = string
}

variable "supabase_key" {
  description = "The service role key for your Supabase instance"
  type        = string
  sensitive   = true
}