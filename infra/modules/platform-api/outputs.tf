output "api_id" {
  description = "HTTP API identifier."
  value       = aws_apigatewayv2_api.http.id
}

output "execution_arn" {
  description = "Execution ARN for the API."
  value       = aws_apigatewayv2_api.http.execution_arn
}

output "invoke_url" {
  description = "Public invoke URL for the API."
  value       = aws_apigatewayv2_stage.default.invoke_url
}
