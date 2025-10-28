variable "region" {
  description = "AWS region for Strapi infrastructure"
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g., dev, prod)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID for networking"
  type        = string
}

variable "public_subnet_ids" {
  description = "Public subnet IDs for ALB"
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for ECS tasks"
  type        = list(string)
}

variable "database_subnet_ids" {
  description = "Subnet IDs for database (defaults to private_subnet_ids when unset)"
  type        = list(string)
  default     = []
}

variable "route53_zone_id" {
  description = "Route53 hosted zone ID for ALB record"
  type        = string
}

variable "domain_name" {
  description = "Hostname to assign to Strapi ALB (subdomain without zone suffix)"
  type        = string
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN for HTTPS listener"
  type        = string
}

variable "alb_allowed_cidrs" {
  description = "CIDR blocks allowed to access the ALB"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "alb_access_logs_bucket" {
  description = "S3 bucket for ALB access logs"
  type        = string
  default     = null
}

variable "alb_access_logs_prefix" {
  description = "S3 prefix for ALB access logs"
  type        = string
  default     = "alb/strapi"
}

variable "enable_alb_deletion_protection" {
  description = "Enable deletion protection on the ALB"
  type        = bool
  default     = true
}

variable "container_image" {
  description = "Strapi container image (ECR URI)"
  type        = string
}

variable "container_port" {
  description = "Container port exposed by Strapi"
  type        = number
  default     = 1337
}

variable "health_check_path" {
  description = "Health check path for ALB and container"
  type        = string
  default     = "/api/healthz"
}

variable "task_cpu" {
  description = "CPU units for Strapi task definition"
  type        = number
  default     = 1024
}

variable "task_memory" {
  description = "Memory (MiB) for Strapi task definition"
  type        = number
  default     = 2048
}

variable "desired_count" {
  description = "Desired ECS task count"
  type        = number
  default     = 2
}

variable "environment_variables" {
  description = "Plain environment variables for Strapi container"
  type        = map(string)
  default     = {}
}

variable "secret_environment_variables" {
  description = "Environment variables sourced from Secrets Manager"
  type        = map(string)
  default     = {}
}

variable "media_bucket_arns" {
  description = "S3 bucket ARNs for media access (upload provider)"
  type        = list(string)
  default     = []
}

variable "alarm_action_arns" {
  description = "Alarm action ARNs (SNS topics, etc.)"
  type        = list(string)
  default     = []
}

variable "autoscaling_min_capacity" {
  description = "Minimum ECS task count"
  type        = number
  default     = 2
}

variable "autoscaling_max_capacity" {
  description = "Maximum ECS task count"
  type        = number
  default     = 6
}

variable "autoscaling_cpu_target" {
  description = "CPU utilization target percentage"
  type        = number
  default     = 50
}

variable "latency_threshold_ms" {
  description = "Latency threshold (ms) for scale-out alarm"
  type        = number
  default     = 1000
}

variable "target_5xx_threshold" {
  description = "Target 5xx error threshold per minute"
  type        = number
  default     = 5
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 30
}

variable "log_kms_key_arn" {
  description = "Optional KMS key ARN for log group encryption"
  type        = string
  default     = null
}

variable "enable_firelens" {
  description = "Enable FireLens sidecar for log forwarding"
  type        = bool
  default     = false
}

variable "firelens_image" {
  description = "FireLens image to use when enabled"
  type        = string
  default     = "public.ecr.aws/aws-observability/aws-for-fluent-bit:stable"
}

variable "extra_execution_role_statements" {
  description = "Additional IAM statements for execution role"
  type = list(object({
    sid       = optional(string)
    effect    = optional(string, "Allow")
    actions   = list(string)
    resources = list(string)
  }))
  default = []
}

variable "extra_task_role_statements" {
  description = "Additional IAM statements for task role"
  type = list(object({
    sid       = optional(string)
    effect    = optional(string, "Allow")
    actions   = list(string)
    resources = list(string)
    condition = optional(any)
  }))
  default = []
}

variable "db_engine_version" {
  description = "PostgreSQL engine version for Strapi RDS"
  type        = string
  default     = "15.5"
}

variable "db_instance_class" {
  description = "Instance class for Strapi RDS"
  type        = string
  default     = "db.t4g.medium"
}

variable "db_allocated_storage" {
  description = "Initial storage (GiB) for Strapi RDS"
  type        = number
  default     = 100
}

variable "db_max_allocated_storage" {
  description = "Maximum storage (GiB) for Strapi RDS autoscaling"
  type        = number
  default     = 512
}

variable "db_storage_type" {
  description = "Storage type for Strapi RDS"
  type        = string
  default     = "gp3"
}

variable "db_name" {
  description = "Database name for Strapi"
  type        = string
  default     = "strapi"
}

variable "db_username" {
  description = "Master username for Strapi database"
  type        = string
  default     = "strapi_admin"
}

variable "db_port" {
  description = "Database port for Strapi"
  type        = number
  default     = 5432
}

variable "db_multi_az" {
  description = "Whether to enable Multi-AZ for the database"
  type        = bool
  default     = true
}

variable "db_apply_immediately" {
  description = "Apply database changes immediately (may cause downtime)"
  type        = bool
  default     = false
}

variable "db_auto_minor_version_upgrade" {
  description = "Auto-apply minor version upgrades"
  type        = bool
  default     = true
}

variable "db_backup_retention_days" {
  description = "Automated backup retention in days"
  type        = number
  default     = 35
}

variable "db_deletion_protection" {
  description = "Enable deletion protection on the database"
  type        = bool
  default     = true
}

variable "db_performance_insights_retention_days" {
  description = "Performance Insights retention period in days"
  type        = number
  default     = 7
}

variable "db_skip_final_snapshot" {
  description = "Skip final snapshot on database destroy"
  type        = bool
  default     = false
}

variable "db_kms_key_arn" {
  description = "KMS key ARN for database storage encryption (defaults to AWS managed when null)"
  type        = string
  default     = null
}

variable "tags" {
  description = "Additional tags to merge with defaults"
  type        = map(string)
  default     = {}
}
