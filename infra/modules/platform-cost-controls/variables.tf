variable "name_prefix" {
  description = "Prefix for cost control resources."
  type        = string
}

variable "budget_amount" {
  description = "Monthly budget amount in USD."
  type        = number
  default     = 500
}

variable "budget_thresholds" {
  description = "Alert thresholds (percentages) for the budget."
  type        = list(number)
  default     = [60, 90, 110]
}

variable "notification_topic_arn" {
  description = "SNS topic ARN for cost notifications."
  type        = string
}

variable "tags" {
  description = "Tags applied to resources."
  type        = map(string)
  default     = {}
}

variable "anomaly_absolute_threshold" {
  description = "Absolute USD anomaly impact required before triggering notifications."
  type        = number
  default     = 50
}
