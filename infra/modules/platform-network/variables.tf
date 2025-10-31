variable "name" {
  description = "Base name used for tagging and resource naming."
  type        = string
}

variable "cidr_block" {
  description = "Primary CIDR block for the VPC."
  type        = string
}

variable "public_subnets" {
  description = "Map of public subnet definitions keyed by availability zone."
  type = map(object({
    cidr_block = string
    az         = string
    tags       = optional(map(string), {})
  }))
}

variable "private_subnets" {
  description = "Map of private subnet definitions keyed by availability zone."
  type = map(object({
    cidr_block = string
    az         = string
    tags       = optional(map(string), {})
  }))
}

variable "nat_gateway_az" {
  description = "Availability zone hosting the NAT gateway (must match a public subnet AZ)."
  type        = string
}

variable "enable_flow_logs" {
  description = "Whether to enable VPC flow logs."
  type        = bool
  default     = true
}

variable "flow_logs_retention_days" {
  description = "Retention days for VPC flow logs."
  type        = number
  default     = 90
}

variable "flow_logs_log_group_name" {
  description = "Optional override for the flow logs CloudWatch log group name."
  type        = string
  default     = null
}

variable "tags" {
  description = "Base tags applied to all resources."
  type        = map(string)
  default     = {}
}
