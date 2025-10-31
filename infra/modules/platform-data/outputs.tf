output "table_name" {
  description = "Managed DynamoDB table name."
  value       = aws_dynamodb_table.kv.id
}

output "table_arn" {
  description = "Managed DynamoDB table ARN."
  value       = aws_dynamodb_table.kv.arn
}
