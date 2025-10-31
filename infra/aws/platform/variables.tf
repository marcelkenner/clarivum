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

variable "logs_bucket_name" {
  description = "S3 bucket for access logs."
  type        = string
}

variable "lambda_memory_size" {
  description = "Lambda memory in MB."
  type        = number
  default     = 2048
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

variable "lambda_environment_variables" {
  description = "Additional environment variables for Lambda."
  type        = map(string)
  default     = {}
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

variable "budget_thresholds" {
  description = "Budget alert thresholds."
  type        = list(number)
  default     = [60, 90, 110]
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
