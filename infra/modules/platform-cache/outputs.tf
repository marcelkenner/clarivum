output "cache_id" {
  description = "Identifier of the serverless cache."
  value       = aws_elasticache_serverless_cache.this.id
}

output "cache_arn" {
  description = "ARN of the serverless cache."
  value       = aws_elasticache_serverless_cache.this.arn
}

locals {
  writer_endpoint = one(aws_elasticache_serverless_cache.this.endpoint).address
  writer_port     = one(aws_elasticache_serverless_cache.this.endpoint).port
  reader_endpoint = try(one(aws_elasticache_serverless_cache.this.reader_endpoint).address, null)
  reader_port     = try(one(aws_elasticache_serverless_cache.this.reader_endpoint).port, null)
}

output "cache_endpoint" {
  description = "Writer endpoint hostname."
  value       = local.writer_endpoint
}

output "cache_endpoint_port" {
  description = "Writer endpoint port."
  value       = local.writer_port
}

output "cache_reader_endpoint" {
  description = "Reader endpoint hostname."
  value       = local.reader_endpoint
}

output "cache_reader_endpoint_port" {
  description = "Reader endpoint port."
  value       = local.reader_port
}

output "security_group_id" {
  description = "Security group protecting the cache."
  value       = aws_security_group.cache.id
}
