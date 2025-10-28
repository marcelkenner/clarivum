variable "name" {
  description = "Base name for ECS resources (e.g., strapi-dev)"
  type        = string
}

variable "region" {
  description = "AWS region (used for logging configuration)"
  type        = string
}

variable "cluster_arn" {
  description = "ECS cluster ARN"
  type        = string
}

variable "cluster_name" {
  description = "ECS cluster name (for autoscaling resource ID)"
  type        = string
}

variable "execution_role_arn" {
  description = "IAM execution role ARN"
  type        = string
}

variable "task_role_arn" {
  description = "IAM task role ARN"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for ECS tasks"
  type        = list(string)
}

variable "vpc_id" {
  description = "VPC ID where ECS tasks run"
  type        = string
}

variable "alb_security_group_id" {
  description = "Security group ID attached to the ALB"
  type        = string
}

variable "target_group_arn" {
  description = "Target group ARN for service registration"
  type        = string
}

variable "load_balancer_arn_suffix" {
  description = "ALB ARN suffix (for CloudWatch metrics)"
  type        = string
}

variable "target_group_arn_suffix" {
  description = "Target group ARN suffix (for CloudWatch metrics)"
  type        = string
}

variable "container_image" {
  description = "Container image for Strapi service"
  type        = string
}

variable "container_port" {
  description = "Container port exposed by Strapi"
  type        = number
  default     = 1337
}

variable "container_health_check_path" {
  description = "Container health check path"
  type        = string
  default     = "/api/healthz"
}

variable "task_cpu" {
  description = "CPU units for task definition"
  type        = number
  default     = 1024
}

variable "task_memory" {
  description = "Memory (MiB) for task definition"
  type        = number
  default     = 2048
}

variable "desired_count" {
  description = "Desired task count"
  type        = number
  default     = 2
}

variable "environment_variables" {
  description = "List of plain environment variables"
  type = list(object({
    name  = string
    value = string
  }))
  default = []
}

variable "secret_environment_variables" {
  description = "List of secret environment variables referencing Secrets Manager ARNs"
  type = list(object({
    name       = string
    value_from = string
  }))
  default = []
}

variable "enable_firelens" {
  description = "Whether to run FireLens sidecar for log forwarding"
  type        = bool
  default     = false
}

variable "firelens_image" {
  description = "FireLens image to use when enable_firelens = true"
  type        = string
  default     = "public.ecr.aws/aws-observability/aws-for-fluent-bit:stable"
}

variable "autoscaling_min_capacity" {
  description = "Minimum number of tasks in autoscaling target"
  type        = number
  default     = 2
}

variable "autoscaling_max_capacity" {
  description = "Maximum number of tasks in autoscaling target"
  type        = number
  default     = 6
}

variable "autoscaling_cpu_target" {
  description = "Target CPU utilization percentage"
  type        = number
  default     = 50
}

variable "latency_threshold_ms" {
  description = "Latency threshold (milliseconds) for scale-out alarm"
  type        = number
  default     = 1000
}

variable "target_5xx_threshold" {
  description = "Threshold for target 5xx errors in the alarm period"
  type        = number
  default     = 5
}

variable "alarm_action_arns" {
  description = "List of SNS topic ARNs (or other actions) to notify on alarms"
  type        = list(string)
  default     = []
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

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}
