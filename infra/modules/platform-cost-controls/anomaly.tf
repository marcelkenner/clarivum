locals {
  create_monitor = var.existing_monitor_arn == null
}

resource "aws_ce_anomaly_monitor" "service" {
  count    = local.create_monitor ? 1 : 0
  provider = aws.ce

  name              = "${var.name_prefix}-service-monitor"
  monitor_type      = "DIMENSIONAL"
  monitor_dimension = "SERVICE"
}

locals {
  monitor_arn = local.create_monitor ? aws_ce_anomaly_monitor.service[0].arn : var.existing_monitor_arn
}

resource "aws_ce_anomaly_subscription" "service" {
  provider = aws.ce

  name      = "${var.name_prefix}-service-subscription"
  frequency = upper(var.anomaly_subscription_frequency)

  monitor_arn_list = [local.monitor_arn]

  subscriber {
    type    = "SNS"
    address = var.notification_topic_arn
  }

  threshold_expression {
    dimension {
      key           = "ANOMALY_TOTAL_IMPACT_ABSOLUTE"
      match_options = ["GREATER_THAN_OR_EQUAL"]
      values        = [format("%.2f", var.anomaly_absolute_threshold)]
    }
  }
}
