output "function_arn" {
  description = "ARN of the Lambda function."
  value       = aws_lambda_function.core.arn
}

output "function_name" {
  description = "Name of the Lambda function."
  value       = aws_lambda_function.core.function_name
}

output "role_arn" {
  description = "IAM role ARN associated with the Lambda."
  value       = aws_iam_role.core.arn
}

output "log_group_name" {
  description = "CloudWatch log group name for the function."
  value       = aws_cloudwatch_log_group.lambda.name
}

output "invoke_arn" {
  description = "Invoke ARN for the Lambda function."
  value       = aws_lambda_function.core.invoke_arn
}
