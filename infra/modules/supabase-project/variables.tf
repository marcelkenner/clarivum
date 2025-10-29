variable "name" {
  description = "Human-readable project name (e.g., clarivum-dev)"
  type        = string
}

variable "organization_id" {
  description = "Supabase organization identifier that will own the project"
  type        = string
}

variable "region" {
  description = "Supabase region (see https://supabase.com/docs/guides/platform/regions)"
  type        = string
}

variable "plan" {
  description = "Supabase plan slug (e.g., pro, team, enterprise)"
  type        = string
}

variable "database_password" {
  description = "Optional seed for the Postgres database password; random value generated when null"
  type        = string
  default     = null
}

variable "management_access_token" {
  description = "Personal access token with access to the Supabase Management API"
  type        = string
  sensitive   = true
}

variable "enable_point_in_time_recovery" {
  description = "Enable point-in-time recovery for the managed Postgres database"
  type        = bool
  default     = true
}

variable "db_version" {
  description = "Managed Postgres major version"
  type        = string
  default     = "16"
}

variable "project_tags" {
  description = "Arbitrary key/value tags attached to the Supabase project metadata"
  type        = map(string)
  default     = {}
}
