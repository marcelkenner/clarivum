output "project_ref" {
  description = "Supabase project reference slug"
  value       = module.project.project_ref
}

output "supabase_url" {
  description = "Supabase REST API base URL"
  value       = module.project.supabase_url
}

output "storage_bucket_ids" {
  description = "Map of storage bucket module outputs keyed by bucket name"
  value       = { for name, mod in module.storage_buckets : name => mod.bucket_id }
}

output "secrets" {
  description = "Map of AWS Secrets Manager ARNs keyed by secret path"
  value       = { for name, secret in aws_secretsmanager_secret.supabase : name => secret.arn }
  sensitive   = true
}
