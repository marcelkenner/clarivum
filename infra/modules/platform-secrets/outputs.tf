output "master_secret_arn" {
  description = "ARN of the master secret."
  value       = aws_secretsmanager_secret.master.arn
}

output "url_secret_arn" {
  description = "ARN of the connection URL secret."
  value       = aws_secretsmanager_secret.url.arn
}

output "rotation_lambda_arn" {
  description = "ARN of the rotation Lambda function."
  value       = local.rotation_lambda_arn
}
