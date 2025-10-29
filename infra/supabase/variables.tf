variable "environment" {
  description = "Deployment environment (e.g., dev, prod)"
  type        = string
}

variable "aws_region" {
  description = "AWS region for Secrets Manager integration"
  type        = string
}

variable "supabase_access_token" {
  description = "Supabase personal access token with org + project management scope"
  type        = string
  sensitive   = true
}

variable "supabase_organization_slug" {
  description = "Supabase organization slug (e.g., clarivum) that will own the project"
  type        = string
}

variable "supabase_organization_id_override" {
  description = "Optional explicit Supabase organization identifier; when set, skips slug lookup"
  type        = string
  default     = ""
}

variable "supabase_region" {
  description = "Supabase project region (e.g., eu-central-1)"
  type        = string
}

variable "supabase_plan" {
  description = "Supabase plan slug (pro, team, enterprise)"
  type        = string
  default     = "pro"
}

variable "project_tags" {
  description = "Additional tags applied to Supabase project metadata"
  type        = map(string)
  default     = {}
}

variable "secret_tags" {
  description = "Additional tags applied to AWS Secrets Manager secrets"
  type        = map(string)
  default     = {}
}

variable "secret_recovery_window_days" {
  description = "Recovery window for Supabase-related secrets in AWS Secrets Manager"
  type        = number
  default     = 7
}

variable "storage_buckets" {
  description = "Storage bucket configuration map keyed by bucket name"
  type = map(object({
    public             = bool
    file_size_limit    = optional(number, 0)
    allowed_mime_types = optional(list(string), [])
  }))
  default = {
    "ebooks-public" = {
      public             = false
      file_size_limit    = 104857600 # 100 MiB
      allowed_mime_types = ["application/pdf", "application/epub+zip"]
    }
    "ebooks-private" = {
      public             = false
      file_size_limit    = 524288000 # 500 MiB
      allowed_mime_types = []
    }
  }
}
