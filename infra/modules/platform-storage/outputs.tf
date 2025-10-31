output "static_bucket_id" {
  description = "ID of the static content bucket."
  value       = aws_s3_bucket.static.id
}

output "static_bucket_domain_name" {
  description = "Regional domain name for the static bucket."
  value       = aws_s3_bucket.static.bucket_regional_domain_name
}

output "media_bucket_id" {
  description = "ID of the media bucket."
  value       = aws_s3_bucket.media.id
}

output "logs_bucket_id" {
  description = "ID of the logs bucket."
  value       = aws_s3_bucket.logs.id
}

output "logs_bucket_domain_name" {
  description = "Regional domain name for the logs bucket."
  value       = aws_s3_bucket.logs.bucket_regional_domain_name
}

output "cache_bucket_id" {
  description = "ID of the cache bucket."
  value       = aws_s3_bucket.cache.id
}

output "cache_bucket_domain_name" {
  description = "Regional domain name for the cache bucket."
  value       = aws_s3_bucket.cache.bucket_regional_domain_name
}
