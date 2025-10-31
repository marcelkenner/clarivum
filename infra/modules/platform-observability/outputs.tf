output "incident_topic_arn" {
  description = "SNS topic ARN for incident notifications."
  value       = aws_sns_topic.incident.arn
}

output "finops_topic_arn" {
  description = "SNS topic ARN for FinOps notifications."
  value       = aws_sns_topic.finops.arn
}
