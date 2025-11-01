variable "name" {
  description = "Display name for the CloudFront distribution."
  type        = string
}

variable "domain_name" {
  description = "Primary domain name served by the distribution."
  type        = string
}

variable "alternate_domain_names" {
  description = "Additional CNAMEs for the distribution."
  type        = list(string)
  default     = []
}

variable "static_bucket_domain_name" {
  description = "Regional domain name of the static S3 origin."
  type        = string
}

variable "api_domain_name" {
  description = "Domain name for the API Gateway origin."
  type        = string
}

variable "api_origin_path" {
  description = "Optional path appended to requests sent to the API origin."
  type        = string
  default     = ""
}

variable "api_origin_protocol_policy" {
  description = "Origin protocol policy for the API origin."
  type        = string
  default     = "https-only"
}

variable "logs_bucket_name" {
  description = "S3 bucket name where CloudFront logs are delivered."
  type        = string
}

variable "route53_zone_id" {
  description = "Hosted zone ID for DNS validation."
  type        = string
}

variable "blocked_countries" {
  description = "List of two-letter country codes to block via WAF."
  type        = list(string)
  default     = ["CN", "RU", "IR", "IQ", "KP", "SY", "AF", "BY"]
}

variable "waf_rate_limit" {
  description = "Requests per 5 minutes threshold for rate limiting."
  type        = number
  default     = 2000
}

variable "response_headers_policy_id" {
  description = "Response headers policy ID applied to behaviors."
  type        = string
  default     = "67f7725c-6f97-4210-82d7-5512b31e9d03" # Managed-SecurityHeadersPolicy
}

variable "static_cache_policy_id" {
  description = "Optional cache policy ID for the static origin. When null, the module creates a policy."
  type        = string
  default     = null
}

variable "static_cache_policy_min_ttl" {
  description = "Minimum TTL applied to the generated static cache policy."
  type        = number
  default     = 0
}

variable "static_cache_policy_default_ttl" {
  description = "Default TTL applied to the generated static cache policy."
  type        = number
  default     = 86400
}

variable "static_cache_policy_max_ttl" {
  description = "Maximum TTL applied to the generated static cache policy."
  type        = number
  default     = 31536000
}

variable "api_cache_policy_id" {
  description = "Cache policy for API origin."
  type        = string
  default     = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" # Managed-CachingDisabled (see AWS docs)
}

variable "api_origin_request_policy_id" {
  description = "Origin request policy for API behavior."
  type        = string
  default     = "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf" # Managed-AllViewerExceptHostHeader
}

variable "price_class" {
  description = "CloudFront price class."
  type        = string
  default     = "PriceClass_100"
}

variable "tags" {
  description = "Tags applied to resources."
  type        = map(string)
  default     = {}
}
