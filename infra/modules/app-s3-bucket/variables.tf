variable "bucket_prefix" {
  description = "Base bucket name (environment prefix recommended, e.g., clarivum-app-dev-assets)"
  type        = string
}

variable "force_random_suffix" {
  description = "Append a random suffix to guarantee global uniqueness"
  type        = bool
  default     = true
}

variable "public_read" {
  description = "Relax public access blocks (additional policies/CloudFront still required)"
  type        = bool
  default     = false
}

variable "versioning_enabled" {
  description = "Enable object versioning"
  type        = bool
  default     = true
}

variable "force_destroy" {
  description = "Allow Terraform to delete buckets containing objects"
  type        = bool
  default     = false
}

variable "kms_master_key_id" {
  description = "Optional KMS key ARN for bucket encryption (defaults to SSE-S3)"
  type        = string
  default     = null
}

variable "object_ownership" {
  description = "Object ownership rule (BucketOwnerEnforced, BucketOwnerPreferred, ObjectWriter)"
  type        = string
  default     = "BucketOwnerEnforced"
}

variable "lifecycle_rules" {
  description = "Lifecycle rules applied to the bucket"
  type = list(object({
    id                                     = string
    enabled                                = optional(bool, true)
    transition_intelligent_tiering_days    = optional(number)
    expiration_days                        = optional(number)
    noncurrent_version_expiration_days     = optional(number)
    abort_incomplete_multipart_upload_days = optional(number)
  }))
  default = [
    {
      id                                  = "intelligent-tiering"
      transition_intelligent_tiering_days = 180
      noncurrent_version_expiration_days  = 365
    }
  ]
}

variable "tags" {
  description = "Tags to apply to all created resources"
  type        = map(string)
  default     = {}
}
