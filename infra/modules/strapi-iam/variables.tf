variable "name" {
  description = "Base name for IAM role resources (e.g., strapi-dev)"
  type        = string
}

variable "secret_arns" {
  description = "List of Secrets Manager ARNs that the task needs to read"
  type        = list(string)
  default     = []
}

variable "media_bucket_arns" {
  description = "List of S3 bucket ARNs for media upload/download permissions"
  type        = list(string)
  default     = []
}

variable "extra_execution_statements" {
  description = "Additional IAM statements for the execution role"
  type = list(object({
    sid       = optional(string)
    effect    = optional(string, "Allow")
    actions   = list(string)
    resources = list(string)
  }))
  default = []
}

variable "extra_task_statements" {
  description = "Additional IAM statements for the task role"
  type = list(object({
    sid       = optional(string)
    effect    = optional(string, "Allow")
    actions   = list(string)
    resources = list(string)
    condition = optional(any)
  }))
  default = []
}

variable "tags" {
  description = "Common tags to apply to IAM resources"
  type        = map(string)
  default     = {}
}
