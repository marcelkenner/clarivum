variable "function_name" {
  description = "Name of the Lambda function."
  type        = string
}

variable "description" {
  description = "Function description."
  type        = string
  default     = "Clarivum Next.js runtime"
}

variable "runtime" {
  description = "Lambda runtime."
  type        = string
  default     = "nodejs20.x"
}

variable "architectures" {
  description = "Instruction set architecture for the function."
  type        = list(string)
  default     = ["arm64"]
}

variable "memory_size" {
  description = "Memory size in MB."
  type        = number
  default     = 2048
}

variable "timeout" {
  description = "Timeout in seconds."
  type        = number
  default     = 30
}

variable "reserved_concurrency" {
  description = "Reserved concurrency limit."
  type        = number
  default     = null
}

variable "subnet_ids" {
  description = "Private subnet IDs for the function."
  type        = list(string)
}

variable "security_group_ids" {
  description = "Security group IDs assigned to the function."
  type        = list(string)
}

variable "dynamodb_table_arn" {
  description = "DynamoDB table ARN the function may access."
  type        = string
}

variable "secrets_allowed_arns" {
  description = "Secret ARNs the function can read."
  type        = list(string)
}

variable "environment_variables" {
  description = "Environment variables injected into the function."
  type        = map(string)
  default     = {}
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days."
  type        = number
  default     = 14
}

variable "layers" {
  description = "Additional Lambda layers."
  type        = list(string)
  default     = []
}

variable "ephemeral_storage_size" {
  description = "Ephemeral storage in MB."
  type        = number
  default     = 512
}

variable "tags" {
  description = "Tags applied to Lambda resources."
  type        = map(string)
  default     = {}
}
