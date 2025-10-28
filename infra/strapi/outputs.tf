output "cluster_arn" {
  description = "ECS cluster ARN"
  value       = aws_ecs_cluster.this.arn
}

output "service_name" {
  description = "ECS service name"
  value       = module.service.service_name
}

output "alb_dns_name" {
  description = "Public DNS of Strapi ALB"
  value       = module.alb.alb_dns_name
}

output "alb_security_group_id" {
  description = "Security group ID for the ALB"
  value       = module.alb.alb_security_group_id
}

output "service_security_group_id" {
  description = "Security group ID for Strapi tasks"
  value       = module.service.service_security_group_id
}

output "log_group_name" {
  description = "CloudWatch log group for application logs"
  value       = module.service.log_group_name
}

output "media_public_bucket_name" {
  description = "Public media bucket for Strapi uploads (served via CDN)"
  value       = aws_s3_bucket.media_public.bucket
}

output "media_private_bucket_name" {
  description = "Private media bucket for signed access"
  value       = aws_s3_bucket.media_private.bucket
}

output "database_endpoint" {
  description = "RDS endpoint for Strapi database"
  value       = aws_db_instance.strapi.address
}

output "database_secret_arn" {
  description = "Secrets Manager ARN containing the Strapi database URL"
  value       = aws_secretsmanager_secret.database_url.arn
}

output "database_password_secret_arn" {
  description = "Secrets Manager ARN containing the Strapi database password"
  value       = aws_secretsmanager_secret.database_password.arn
}
