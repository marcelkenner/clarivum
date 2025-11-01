output "incident_topic_arn" {
  description = "SNS topic ARN for incident notifications."
  value       = aws_sns_topic.incident.arn
}

output "incident_topic_arn_us_east_1" {
  description = "SNS topic ARN for incident notifications in us-east-1 (CloudFront alarms)."
  value       = aws_sns_topic.incident_us_east_1.arn
}

output "finops_topic_arn" {
  description = "SNS topic ARN for FinOps notifications."
  value       = aws_sns_topic.finops.arn
}
