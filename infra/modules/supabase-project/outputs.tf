output "project_id" {
  description = "Supabase project identifier"
  value       = supabase_project.this.id
}

output "project_ref" {
  description = "Supabase project reference slug (used in URLs)"
  value       = local.project_ref
}

output "supabase_url" {
  description = "Supabase REST API base URL"
  value       = local.supabase_url
}

output "database_password" {
  description = "Managed Postgres password generated for the project"
  value       = local.db_password
  sensitive   = true
}

output "database_url" {
  description = "Connection string for Supabase Postgres"
  value       = local.database_url
  sensitive   = true
}

output "anon_key" {
  description = "Public anon key for the Supabase project"
  value       = local.anon_key
  sensitive   = true
}

output "service_role_key" {
  description = "Service role key for the Supabase project"
  value       = local.service_role_key
  sensitive   = true
}
