output "scheduler_lambda_arn" {
  value = aws_lambda_function.scheduler.arn
}

output "subreddit_retrieval_lambda_arn" {
  value = aws_lambda_function.subreddit_retrieval.arn
}

output "reddit_scraper_lambda_arn" {
  value = aws_lambda_function.reddit_scraper.arn
}

output "user_data_topic_arn" {
  value = aws_sns_topic.user_data_topic.arn
}

output "subreddit_data_topic_arn" {
  value = aws_sns_topic.subreddit_data_topic.arn
}