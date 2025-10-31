variable "zone_name" {
  description = "Primary hosted zone name (e.g., clarivum.com)."
  type        = string
}

variable "create_zone" {
  description = "Whether to create the hosted zone."
  type        = bool
  default     = true
}

variable "existing_zone_id" {
  description = "Optional existing zone ID when create_zone is false."
  type        = string
  default     = null
}

variable "cloudfront_domain_name" {
  description = "CloudFront distribution domain name for alias targets."
  type        = string
  default     = ""
}

variable "cloudfront_hosted_zone_id" {
  description = "Hosted zone ID provided by CloudFront."
  type        = string
  default     = ""
}

variable "aliases" {
  description = "List of alias records to create for CloudFront."
  type = list(object({
    name = string
  }))
  default = []
}

variable "tags" {
  description = "Tags for the hosted zone."
  type        = map(string)
  default     = {}
}
