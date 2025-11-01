variable "aws_region" {
  description = "AWS region for primary resources."
  type        = string
  default     = "eu-central-1"
}

variable "environment" {
  description = "Deployment environment (e.g., dev, prod)."
  type        = string
}

variable "service_name" {
  description = "Logical service name."
  type        = string
  default     = "platform"
}

variable "tags" {
  description = "Base tags applied to all resources."
  type        = map(string)
  default     = {}
}

variable "network_cidr_block" {
  description = "VPC CIDR block."
  type        = string
}

variable "public_subnets" {
  description = "Map of public subnet configurations keyed by AZ."
  type = map(object({
    cidr_block = string
    az         = string
  }))
}

variable "private_subnets" {
  description = "Map of private subnet configurations keyed by AZ."
  type = map(object({
    cidr_block = string
    az         = string
  }))
}

variable "nat_gateway_az" {
  description = "AZ hosting the NAT gateway."
  type        = string
}

variable "dynamodb_table_name" {
  description = "DynamoDB table name."
  type        = string
}

variable "dynamodb_kms_key_arn" {
  description = "KMS key ARN for DynamoDB."
  type        = string
}

variable "dynamodb_manage_server_side_encryption" {
  description = "Whether Terraform manages DynamoDB server-side encryption (disable for imported tables)."
  type        = bool
  default     = true
}

variable "aurora_cluster_identifier" {
  description = "Aurora cluster identifier."
  type        = string
}

variable "aurora_cluster_arn" {
  description = "Aurora cluster ARN."
  type        = string
}

variable "aurora_writer_endpoint" {
  description = "Aurora writer endpoint hostname."
  type        = string
}

variable "aurora_database_name" {
  description = "Primary database name."
  type        = string
}

variable "aurora_master_username" {
  description = "Aurora master username."
  type        = string
}

variable "aurora_port" {
  description = "Aurora port."
  type        = number
  default     = 5432
}

variable "master_secret_name" {
  description = "Secrets Manager name for the master credentials."
  type        = string
}

variable "url_secret_name" {
  description = "Secrets Manager name for the connection URL."
  type        = string
}

variable "secrets_rotation_app_version" {
  description = "Semantic version for the Secrets Manager rotation application."
  type        = string
  default     = "1.1.622"
}

variable "ci_secret_reader_principals" {
  description = "IAM principals allowed to read deployment secrets."
  type        = list(string)
  default     = []
}

variable "static_bucket_name" {
  description = "S3 bucket for static assets."
  type        = string
}

variable "media_bucket_name" {
  description = "S3 bucket for media assets."
  type        = string
}

variable "cache_bucket_name" {
  description = "S3 bucket for OpenNext incremental cache artifacts."
  type        = string
}

variable "logs_bucket_name" {
  description = "S3 bucket for access logs."
  type        = string
}

variable "logs_bucket_object_ownership" {
  description = "Optional ownership control mode for the logs bucket when BucketOwnerEnforced is disabled."
  type        = string
  default     = null
}

variable "storage_enable_bucket_owner_enforced" {
  description = "Whether to enforce BucketOwnerEnforced ownership controls on S3 buckets."
  type        = bool
  default     = true
}

variable "lambda_memory_size" {
  description = "Lambda memory in MB."
  type        = number
  default     = 2048
}

variable "lambda_runtime" {
  description = "Lambda runtime identifier."
  type        = string
  default     = "nodejs20.x"
}

variable "lambda_architectures" {
  description = "Lambda instruction set architectures."
  type        = list(string)
  default     = ["x86_64"]
}

variable "lambda_handler" {
  description = "Lambda handler entrypoint."
  type        = string
  default     = "index.handler"
}

variable "lambda_timeout" {
  description = "Lambda timeout in seconds."
  type        = number
  default     = 30
}

variable "lambda_reserved_concurrency" {
  description = "Reserved concurrency limit."
  type        = number
  default     = null
}

variable "lambda_layers" {
  description = "Additional Lambda layers to attach."
  type        = list(string)
  default     = []
}

variable "lambda_environment_variables" {
  description = "Additional environment variables for Lambda."
  type        = map(string)
  default     = {}
}

variable "cache_engine" {
  description = "ElastiCache serverless engine."
  type        = string
  default     = "valkey"
}

variable "cache_major_engine_version" {
  description = "Major engine version for the serverless cache."
  type        = string
  default     = "7"
}

variable "cache_description" {
  description = "Description applied to the serverless cache."
  type        = string
  default     = "Clarivum shared cache for response hydration and guardrails."
}

variable "cache_daily_snapshot_time" {
  description = "Optional daily snapshot window (HH:MM, 24h)."
  type        = string
  default     = null
}

variable "cache_snapshot_retention_limit" {
  description = "Number of daily snapshots to retain."
  type        = number
  default     = null
}

variable "cache_kms_key_id" {
  description = "Optional KMS key ARN for cache encryption at rest."
  type        = string
  default     = null
}

variable "cache_data_storage_max_gb" {
  description = "Optional maximum data storage in GiB for the serverless cache."
  type        = number
  default     = null
}

variable "cache_ecpu_per_second_maximum" {
  description = "Optional maximum eCPU per second for the serverless cache."
  type        = number
  default     = null
}

variable "cloudfront_domain_name" {
  description = "Primary domain served by CloudFront."
  type        = string
}

variable "cloudfront_alternate_names" {
  description = "Alternate domain names for CloudFront."
  type        = list(string)
  default     = []
}

variable "cloudfront_static_cache_policy_id" {
  description = "Optional cache policy ID for CloudFront static origin (null creates a managed policy)."
  type        = string
  default     = null
}

variable "route53_zone_name" {
  description = "Hosted zone (apex) domain name."
  type        = string
}

variable "route53_create_zone" {
  description = "Whether to create the hosted zone."
  type        = bool
  default     = true
}

variable "route53_existing_zone_id" {
  description = "Existing hosted zone ID when not creating a new zone."
  type        = string
  default     = null
}

variable "route53_additional_records" {
  description = "Additional DNS records to create in the hosted zone."
  type = list(object({
    name    = string
    type    = string
    ttl     = number
    records = list(string)
  }))
  default = []
}

variable "sns_incident_subscriptions" {
  description = "Incident SNS subscribers."
  type = list(object({
    protocol = string
    endpoint = string
  }))
  default = []
}

variable "sns_finops_subscriptions" {
  description = "FinOps SNS subscribers."
  type = list(object({
    protocol = string
    endpoint = string
  }))
  default = []
}

variable "budget_amount_usd" {
  description = "Monthly budget amount."
  type        = number
  default     = 500
}

variable "cost_controls_existing_monitor_arn" {
  description = "Optional ARN of a pre-existing Cost Explorer anomaly monitor to reuse."
  type        = string
  default     = null
}

variable "anomaly_subscription_frequency" {
  description = "Delivery frequency for cost anomaly notifications."
  type        = string
  default     = "IMMEDIATE"
}

variable "secrets_manager_endpoint" {
  description = "Optional override for the Secrets Manager endpoint used by rotation Lambdas."
  type        = string
  default     = null
}

variable "budget_thresholds" {
  description = "Budget alert thresholds."
  type        = list(number)
  default     = [60, 90, 110]
}

variable "anomaly_absolute_threshold_usd" {
  description = "Absolute anomaly impact amount (USD) before alerts fire."
  type        = number
  default     = 50
}

variable "blocked_countries" {
  description = "Country denylist for WAF."
  type        = list(string)
  default     = ["CN", "RU", "IR", "IQ", "KP", "SY", "AF", "BY"]
}

variable "waf_rate_limit" {
  description = "Rate limit per 5 minutes for WAF."
  type        = number
  default     = 2000
}
