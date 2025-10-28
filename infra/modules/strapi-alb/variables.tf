variable "name" {
  description = "Base name for ALB resources (e.g., strapi-dev)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where the ALB will reside"
  type        = string
}

variable "public_subnet_ids" {
  description = "Public subnet IDs for the ALB"
  type        = list(string)
}

variable "allowed_ingress_cidrs" {
  description = "List of CIDR blocks allowed to reach the ALB"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "certificate_arn" {
  description = "ACM certificate ARN for HTTPS listener"
  type        = string
}

variable "target_port" {
  description = "Target group port (Strapi service port)"
  type        = number
  default     = 1337
}

variable "health_check_path" {
  description = "Path for ALB health checks"
  type        = string
  default     = "/api/healthz"
}

variable "health_check_matcher" {
  description = "Expected status code(s) for ALB health check"
  type        = string
  default     = "200-399"
}

variable "ssl_policy" {
  description = "SSL policy for HTTPS listener"
  type        = string
  default     = "ELBSecurityPolicy-TLS13-1-2-2021-06"
}

variable "enable_http_redirect" {
  description = "Create HTTP listener to redirect to HTTPS"
  type        = bool
  default     = true
}

variable "enable_deletion_protection" {
  description = "Enable ALB deletion protection"
  type        = bool
  default     = true
}

variable "access_logs_bucket" {
  description = "S3 bucket for ALB access logs (optional)"
  type        = string
  default     = null
}

variable "access_logs_prefix" {
  description = "Prefix within S3 bucket for ALB access logs"
  type        = string
  default     = "alb/strapi"
}

variable "create_dns_record" {
  description = "Whether to create Route53 alias record for the ALB"
  type        = bool
  default     = true
}

variable "domain_name" {
  description = "DNS name for Route53 record (without zone suffix)"
  type        = string
}

variable "route53_zone_id" {
  description = "Hosted zone ID for DNS record"
  type        = string
}

variable "tags" {
  description = "Common tags to apply to ALB resources"
  type        = map(string)
  default     = {}
}
