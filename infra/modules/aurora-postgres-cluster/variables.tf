variable "name" {
  description = "Cluster identifier (e.g., clarivum-app-prod)"
  type        = string
}

variable "database_name" {
  description = "Default database name to create in the cluster"
  type        = string
}

variable "master_username" {
  description = "Master username for the Aurora cluster"
  type        = string
  default     = "clarivum_admin"
}

variable "database_password" {
  description = "Optional password seed for the master user; random value generated when null"
  type        = string
  default     = null
  sensitive   = true
}

variable "generate_random_master_password" {
  description = "Generate a random master password when database_password is not provided"
  type        = bool
  default     = true
}

variable "engine_version" {
  description = "Aurora PostgreSQL engine version"
  type        = string
  default     = "16.1"
}

variable "availability_zones" {
  description = "Optional list of availability zones for the cluster"
  type        = list(string)
  default     = []
}

variable "cluster_parameter_group_name" {
  description = "Existing DB cluster parameter group to associate; when set, Terraform will not manage a new parameter group"
  type        = string
  default     = null
}

variable "subnet_ids" {
  description = "Private subnet IDs for the DB subnet group"
  type        = list(string)
}

variable "subnet_group_name" {
  description = "Optional override for the DB subnet group name when adopting existing infrastructure"
  type        = string
  default     = null
}

variable "subnet_group_description" {
  description = "Optional override for the DB subnet group description"
  type        = string
  default     = null
}

variable "vpc_security_group_ids" {
  description = "Security groups allowed to connect to the cluster"
  type        = list(string)
}

variable "backup_retention_days" {
  description = "Backup retention period in days"
  type        = number
  default     = 7
}

variable "preferred_backup_window" {
  description = "Preferred backup window in UTC (e.g., 02:00-03:00)"
  type        = string
  default     = "02:00-03:00"
}

variable "preferred_maintenance_window" {
  description = "Preferred maintenance window in UTC (e.g., sun:03:00-sun:05:00)"
  type        = string
  default     = "sun:03:00-sun:05:00"
}

variable "apply_immediately" {
  description = "Whether modifications should be applied immediately"
  type        = bool
  default     = false
}

variable "deletion_protection" {
  description = "Enable deletion protection on the cluster"
  type        = bool
  default     = true
}

variable "kms_key_id" {
  description = "Customer-managed KMS key ARN for encryption; defaults to aws/rds when null"
  type        = string
  default     = null
}

variable "enable_iam_auth" {
  description = "Enable IAM database authentication"
  type        = bool
  default     = false
}

variable "enable_global_write_forwarding" {
  description = "Enable global database write forwarding (when part of a global cluster)"
  type        = bool
  default     = false
}

variable "cloudwatch_logs_exports" {
  description = "CloudWatch log exports (e.g., ['postgresql'])"
  type        = list(string)
  default     = ["postgresql"]
}

variable "serverlessv2_min_capacity" {
  description = "Minimum Aurora capacity units (ACUs) for Serverless v2"
  type        = number
  default     = 0.5
}

variable "serverlessv2_max_capacity" {
  description = "Maximum Aurora capacity units (ACUs) for Serverless v2"
  type        = number
  default     = 4
}

variable "copy_tags_to_snapshot" {
  description = "Whether to copy tags to snapshots"
  type        = bool
  default     = true
}

variable "instance_count" {
  description = "Number of cluster instances to create"
  type        = number
  default     = 2
}

variable "instance_class" {
  description = "Instance class for cluster instances (Serverless v2 requires db.serverless)"
  type        = string
  default     = "db.serverless"
}

variable "auto_minor_version_upgrade" {
  description = "Enable automatic minor version upgrades on instances"
  type        = bool
  default     = true
}

variable "instance_parameter_group_name" {
  description = "Existing DB instance parameter group to associate; when set, Terraform will not manage a new parameter group"
  type        = string
  default     = null
}

variable "instance_identifiers" {
  description = "Optional list of explicit DB instance identifiers to use (one per instance)"
  type        = list(string)
  default     = []
}

variable "monitoring_interval" {
  description = "Enhanced monitoring interval in seconds (set 0 to disable)"
  type        = number
  default     = 60
}

variable "performance_insights_enabled" {
  description = "Enable Performance Insights on cluster instances"
  type        = bool
  default     = true
}

variable "performance_insights_kms_key_id" {
  description = "Optional KMS key for Performance Insights"
  type        = string
  default     = null
}

variable "tags" {
  description = "Tags applied to all resources created by the module"
  type        = map(string)
  default     = {}
}

variable "parameter_group_family" {
  description = "Parameter group family (e.g., aurora-postgresql16)"
  type        = string
  default     = "aurora-postgresql16"
}

variable "cluster_parameters" {
  description = "Optional cluster parameter overrides"
  type = list(object({
    name         = string
    value        = string
    apply_method = optional(string)
  }))
  default = []
}
