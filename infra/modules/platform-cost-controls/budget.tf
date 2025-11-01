resource "aws_budgets_budget" "monthly" {
  name         = "${var.name_prefix}-monthly"
  budget_type  = "COST"
  time_unit    = "MONTHLY"
  limit_amount = format("%.2f", var.budget_amount)
  limit_unit   = "USD"

  notification {
    comparison_operator       = "GREATER_THAN"
    notification_type         = "FORECASTED"
    threshold                 = var.budget_thresholds[0]
    threshold_type            = "PERCENTAGE"
    subscriber_sns_topic_arns = [var.notification_topic_arn]
  }

  dynamic "notification" {
    for_each = toset(slice(var.budget_thresholds, 1, length(var.budget_thresholds)))

    content {
      comparison_operator       = "GREATER_THAN"
      notification_type         = "ACTUAL"
      threshold                 = notification.value
      threshold_type            = "PERCENTAGE"
      subscriber_sns_topic_arns = [var.notification_topic_arn]
    }
  }
}
