variable "environment" {
  description = "Deployment environment (e.g., dev, prod)"
  type        = string
}

variable "aws_region" {
  description = "AWS region for Aurora and S3 resources"
  type        = string
}

variable "aurora_cluster_identifier" {
  description = "Override for the Aurora cluster identifier (defaults to clarivum-app-<env>)"
  type        = string
  default     = ""
}

variable "database_name" {
  description = "Primary database name created in Aurora"
  type        = string
  default     = "clarivum_app"
}

variable "master_username" {
  description = "Master username for Aurora"
  type        = string
  default     = "clarivum_app"
}

variable "database_password" {
  description = "Optional master password seed; random value generated when null"
  type        = string
  default     = null
  sensitive   = true
}

variable "engine_version" {
  description = "Aurora PostgreSQL engine version"
  type        = string
  default     = "16.1"
}

variable "availability_zones" {
  description = "Optional list of AZs for the Aurora cluster"
  type        = list(string)
  default     = []
}

variable "db_subnet_ids" {
  description = "Private subnet IDs for the Aurora DB subnet group"
  type        = list(string)
}

variable "db_security_group_ids" {
  description = "Security groups that can reach the Aurora cluster"
  type        = list(string)
}

variable "backup_retention_days" {
  description = "Aurora backup retention period in days"
  type        = number
  default     = 7
}

variable "preferred_backup_window" {
  description = "Preferred backup window in UTC (hh:mm-hh:mm)"
  type        = string
  default     = "02:00-03:00"
}

variable "preferred_maintenance_window" {
  description = "Preferred maintenance window in UTC"
  type        = string
  default     = "sun:03:00-sun:05:00"
}

variable "apply_immediately" {
  description = "Apply database modifications immediately"
  type        = bool
  default     = false
}

variable "deletion_protection" {
  description = "Protect Aurora cluster from deletion"
  type        = bool
  default     = true
}

variable "kms_key_id" {
  description = "Custom KMS key ARN for Aurora storage encryption"
  type        = string
  default     = null
}

variable "enable_iam_auth" {
  description = "Enable IAM authentication for Aurora"
  type        = bool
  default     = false
}

variable "enable_global_write_forwarding" {
  description = "Enable write forwarding for global database clusters"
  type        = bool
  default     = false
}

variable "cloudwatch_logs_exports" {
  description = "Aurora log exports (e.g., ['postgresql'])"
  type        = list(string)
  default     = ["postgresql"]
}

variable "serverlessv2_min_capacity" {
  description = "Minimum Aurora capacity units (ACUs)"
  type        = number
  default     = 0.5
}

variable "serverlessv2_max_capacity" {
  description = "Maximum Aurora capacity units (ACUs)"
  type        = number
  default     = 4
}

variable "instance_count" {
  description = "Number of Aurora cluster instances"
  type        = number
  default     = 2
}

variable "instance_class" {
  description = "Instance class for Aurora cluster instances"
  type        = string
  default     = "db.serverless"
}

variable "auto_minor_version_upgrade" {
  description = "Enable automatic minor DB upgrades"
  type        = bool
  default     = true
}

variable "monitoring_interval" {
  description = "Enhanced monitoring interval in seconds (0 disables)"
  type        = number
  default     = 60
}

variable "performance_insights_enabled" {
  description = "Enable Performance Insights"
  type        = bool
  default     = true
}

variable "performance_insights_kms_key_id" {
  description = "KMS key for Performance Insights data"
  type        = string
  default     = null
}

variable "parameter_group_family" {
  description = "Aurora parameter group family"
  type        = string
  default     = "aurora-postgresql16"
}

variable "cluster_parameters" {
  description = "Optional Aurora cluster parameter overrides"
  type = list(object({
    name         = string
    value        = string
    apply_method = optional(string)
  }))
  default = []
}

variable "resource_tags" {
  description = "Additional tags applied to Aurora and S3 resources"
  type        = map(string)
  default     = {}
}

variable "secret_tags" {
  description = "Additional tags applied to Secrets Manager secrets"
  type        = map(string)
  default     = {}
}

variable "secret_recovery_window_days" {
  description = "Secrets Manager recovery window in days"
  type        = number
  default     = 7
}

variable "asset_bucket_kms_key_id" {
  description = "Default KMS key for asset buckets (overridden per bucket when provided)"
  type        = string
  default     = null
}

variable "asset_bucket_default_lifecycle_rules" {
  description = "Default lifecycle rules applied to asset buckets when none supplied"
  type = list(object({
    id                                     = string
    enabled                                = optional(bool, true)
    transition_intelligent_tiering_days    = optional(number)
    expiration_days                        = optional(number)
    noncurrent_version_expiration_days     = optional(number)
    abort_incomplete_multipart_upload_days = optional(number)
  }))
  default = [
    {
      id                                     = "intelligent-tiering"
      transition_intelligent_tiering_days    = 180
      noncurrent_version_expiration_days     = 365
      abort_incomplete_multipart_upload_days = 7
    }
  ]
}

variable "asset_buckets" {
  description = "Map of asset bucket definitions keyed by logical name"
  type = map(object({
    bucket_prefix       = optional(string)
    public_read         = optional(bool, false)
    versioning_enabled  = optional(bool, true)
    force_random_suffix = optional(bool, true)
    force_destroy       = optional(bool, false)
    lifecycle_rules = optional(list(object({
      id                                     = string
      enabled                                = optional(bool, true)
      transition_intelligent_tiering_days    = optional(number)
      expiration_days                        = optional(number)
      noncurrent_version_expiration_days     = optional(number)
      abort_incomplete_multipart_upload_days = optional(number)
    })))
    kms_master_key_id = optional(string)
    object_ownership  = optional(string)
    tags              = optional(map(string))
  }))
  default = {
    "ebooks-public"  = {}
    "ebooks-private" = {}
  }
}
