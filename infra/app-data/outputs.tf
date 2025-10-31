output "aurora_cluster_arn" {
  description = "ARN of the Aurora PostgreSQL cluster"
  value       = module.aurora.cluster_arn
}

output "aurora_writer_endpoint" {
  description = "Writer endpoint for Aurora"
  value       = module.aurora.writer_endpoint
}

output "aurora_reader_endpoint" {
  description = "Reader endpoint for Aurora"
  value       = module.aurora.reader_endpoint
}

output "aurora_connection_uri" {
  description = "PostgreSQL connection URI for the writer endpoint"
  value       = module.aurora.connection_uri
  sensitive   = true
}

output "aurora_master_username" {
  description = "Master username for Aurora"
  value       = module.aurora.master_username
}

output "aurora_master_password" {
  description = "Master password for Aurora"
  value       = module.aurora.master_password
  sensitive   = true
}

output "aurora_db_subnet_group" {
  description = "DB subnet group used by the Aurora cluster"
  value       = module.aurora.db_subnet_group_name
}

output "asset_buckets" {
  description = "Map of asset bucket outputs keyed by logical bucket name"
  value = {
    for name, mod in module.asset_buckets :
    name => {
      bucket_name        = mod.bucket_name
      bucket_arn         = mod.bucket_arn
      bucket_domain_name = mod.bucket_domain_name
    }
  }
}

output "secrets" {
  description = "Map of Secrets Manager ARNs keyed by secret path"
  value       = { for name, secret in aws_secretsmanager_secret.app_data : name => secret.arn }
  sensitive   = true
}
