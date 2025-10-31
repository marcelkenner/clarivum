variable "name" {
  description = "Base name for the API Gateway HTTP API."
  type        = string
}

variable "lambda_function_arn" {
  description = "Lambda function ARN integrated with the API."
  type        = string
}

variable "lambda_invoke_arn" {
  description = "Lambda invoke ARN for integration."
  type        = string
}

variable "tags" {
  description = "Tags applied to API resources."
  type        = map(string)
  default     = {}
}

variable "access_log_retention_days" {
  description = "Retention days for API Gateway access logs."
  type        = number
  default     = 30
}

variable "throttle_burst_limit" {
  description = "Burst limit for default route throttling."
  type        = number
  default     = 1000
}

variable "throttle_rate_limit" {
  description = "Steady-state requests per second."
  type        = number
  default     = 500
}

variable "metrics_enabled" {
  description = "Whether to enable detailed CloudWatch metrics."
  type        = bool
  default     = true
}
