variable "static_bucket_name" {
  description = "Name of the S3 bucket serving static site assets."
  type        = string
}

variable "media_bucket_name" {
  description = "Name of the S3 bucket storing user-generated media."
  type        = string
}

variable "logs_bucket_name" {
  description = "Name of the bucket receiving CloudFront and access logs."
  type        = string
}

variable "cache_bucket_name" {
  description = "Name of the bucket storing OpenNext incremental cache artifacts."
  type        = string
}

variable "kms_master_key_id" {
  description = "KMS key ARN or alias used for SSE-KMS encryption."
  type        = string
  default     = "alias/aws/s3"
}

variable "tags" {
  description = "Tags applied to all buckets."
  type        = map(string)
  default     = {}
}
