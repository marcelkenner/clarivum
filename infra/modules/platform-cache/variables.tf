variable "name_prefix" {
  description = "Name prefix applied to cache resources."
  type        = string
}

variable "vpc_id" {
  description = "VPC hosting the serverless cache."
  type        = string
}

variable "subnet_ids" {
  description = "Private subnet IDs for the serverless cache."
  type        = list(string)
}

variable "lambda_security_group_id" {
  description = "Security group ID assigned to the platform Lambda runtime allowed to access the cache."
  type        = string
}

variable "tags" {
  description = "Tags applied to created resources."
  type        = map(string)
}

variable "engine" {
  description = "Cache engine."
  type        = string
  default     = "valkey"
}

variable "major_engine_version" {
  description = "Major engine version."
  type        = string
  default     = "7"
}

variable "description" {
  description = "Cache description."
  type        = string
  default     = "Clarivum shared response cache and guardrail store"
}

variable "daily_snapshot_time" {
  description = "Daily snapshot window in HH:MM format."
  type        = string
  default     = null
}

variable "snapshot_retention_limit" {
  description = "Number of snapshots to retain."
  type        = number
  default     = null
}

variable "kms_key_id" {
  description = "KMS key ARN for data at rest encryption."
  type        = string
  default     = null
}

variable "data_storage_maximum_gb" {
  description = "Optional maximum data storage in GiB."
  type        = number
  default     = null
}

variable "ecpu_per_second_maximum" {
  description = "Optional maximum eCPU per second."
  type        = number
  default     = null
}
