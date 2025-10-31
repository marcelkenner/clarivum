variable "master_secret_name" {
  description = "Fully qualified Secrets Manager name for the primary database credentials."
  type        = string
}

variable "url_secret_name" {
  description = "Secrets Manager name for the database connection string."
  type        = string
}

variable "kms_key_id" {
  description = "Optional customer managed KMS key for secrets."
  type        = string
  default     = null
}

variable "rotation_subnet_ids" {
  description = "Private subnets used by the rotation function."
  type        = list(string)
}

variable "rotation_security_group_ids" {
  description = "Security groups attached to the rotation function."
  type        = list(string)
}

variable "aurora_cluster_arn" {
  description = "Aurora cluster ARN targeted by rotation."
  type        = string
}

variable "aurora_secret_username" {
  description = "Database master username used during rotation."
  type        = string
}

variable "aurora_database_name" {
  description = "Database name for rotation connectivity."
  type        = string
}

variable "aurora_port" {
  description = "Database port."
  type        = number
  default     = 5432
}

variable "aurora_host" {
  description = "Writer endpoint hostname."
  type        = string
}

variable "rotation_schedule_expression" {
  description = "cron or rate expression for password rotation."
  type        = string
  default     = "rate(30 days)"
}

variable "ci_secret_reader_principals" {
  description = "List of IAM role ARNs granted read access for deployments."
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Base tags."
  type        = map(string)
  default     = {}
}
