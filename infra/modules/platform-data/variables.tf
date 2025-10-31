variable "table_name" {
  description = "DynamoDB table name."
  type        = string
}

variable "kms_master_key_arn" {
  description = "KMS key ARN used for DynamoDB table encryption."
  type        = string
}

variable "ttl_attribute" {
  description = "TTL attribute name."
  type        = string
  default     = "ttl"
}

variable "tags" {
  description = "Base tags applied to resources."
  type        = map(string)
  default     = {}
}
