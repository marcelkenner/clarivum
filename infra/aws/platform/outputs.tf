output "vpc_id" {
  description = "VPC identifier."
  value       = module.platform_network.vpc_id
}

output "lambda_function_arn" {
  description = "Lambda function ARN."
  value       = module.platform_lambda.function_arn
}

output "api_invoke_url" {
  description = "Invoke URL for the HTTP API."
  value       = module.platform_api.invoke_url
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain."
  value       = module.platform_cloudfront.distribution_domain_name
}

output "hosted_zone_id" {
  description = "Hosted zone ID for clarivum DNS."
  value       = module.platform_dns.zone_id
}

output "cache_endpoint" {
  description = "Writer endpoint for the shared serverless cache."
  value       = module.platform_cache.cache_endpoint
}

output "cache_reader_endpoint" {
  description = "Reader endpoint for the shared serverless cache."
  value       = module.platform_cache.cache_reader_endpoint
}
