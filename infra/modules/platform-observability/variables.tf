variable "name_prefix" {
  description = "Prefix applied to observability resources."
  type        = string
}

variable "lambda_function_name" {
  description = "Lambda function name for alarms."
  type        = string
}

variable "lambda_function_arn" {
  description = "Lambda function ARN."
  type        = string
}

variable "api_id" {
  description = "API Gateway HTTP API ID."
  type        = string
}

variable "aurora_cluster_identifier" {
  description = "Aurora cluster identifier."
  type        = string
}

variable "dynamodb_table_name" {
  description = "DynamoDB table name."
  type        = string
}

variable "cloudfront_distribution_id" {
  description = "CloudFront distribution ID."
  type        = string
}

variable "sns_incident_subscriptions" {
  description = "Subscriptions for incident notifications."
  type = list(object({
    protocol = string
    endpoint = string
  }))
  default = []
}

variable "sns_finops_subscriptions" {
  description = "Subscriptions for cost/finops alerts."
  type = list(object({
    protocol = string
    endpoint = string
  }))
  default = []
}

variable "aurora_capacity_threshold" {
  description = "ACU threshold before alerting."
  type        = number
  default     = 6
}

variable "lambda_duration_threshold_ms" {
  description = "Lambda average duration threshold (ms)."
  type        = number
  default     = 8000
}

variable "tags" {
  description = "Tags for observability resources."
  type        = map(string)
  default     = {}
}
