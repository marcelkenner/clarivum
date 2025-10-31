output "alb_security_group_id" {
  description = "Security group ID for the public ALB."
  value       = aws_security_group.alb.id
}

output "app_security_group_id" {
  description = "Security group ID for the internal application runtime."
  value       = aws_security_group.app.id
}

output "lambda_security_group_id" {
  description = "Security group ID assigned to Lambda functions."
  value       = aws_security_group.lambda.id
}

output "database_security_group_id" {
  description = "Security group ID controlling access to Aurora."
  value       = aws_security_group.database.id
}
