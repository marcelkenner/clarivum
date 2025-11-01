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

variable "existing_monitor_arn" {
  description = "Optional existing anomaly monitor ARN to reuse instead of creating a new one."
  type        = string
  default     = null
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

variable "anomaly_subscription_frequency" {
  description = "Delivery frequency for anomaly notifications (SNS requires IMMEDIATE)."
  type        = string
  default     = "IMMEDIATE"

  validation {
    condition     = contains(["DAILY", "WEEKLY", "MONTHLY", "IMMEDIATE"], upper(var.anomaly_subscription_frequency))
    error_message = "Frequency must be one of DAILY, WEEKLY, MONTHLY, or IMMEDIATE."
  }
}
