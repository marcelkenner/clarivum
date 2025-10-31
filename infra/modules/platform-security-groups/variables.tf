variable "name" {
  description = "Prefix applied to all security groups."
  type        = string
}

variable "vpc_id" {
  description = "VPC where security groups will be created."
  type        = string
}

variable "tags" {
  description = "Common tags."
  type        = map(string)
  default     = {}
}

variable "alb_ingress_cidrs" {
  description = "CIDR blocks allowed to reach the load balancer."
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "app_port" {
  description = "Port used by the internal application service (for ALB to app)."
  type        = number
  default     = 3000
}

variable "database_port" {
  description = "Aurora/PostgreSQL port exposed to runtime security groups."
  type        = number
  default     = 5432
}

variable "lambda_egress_cidrs" {
  description = "CIDR ranges the Lambda security group may access."
  type        = list(string)
  default     = ["0.0.0.0/0"]
}
