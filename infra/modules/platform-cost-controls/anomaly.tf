resource "aws_ce_anomaly_monitor" "service" {
  provider = aws.ce

  name              = "${var.name_prefix}-service-monitor"
  monitor_type      = "DIMENSIONAL"
  monitor_dimension = "SERVICE"
}

resource "aws_ce_anomaly_subscription" "service" {
  provider = aws.ce

  name      = "${var.name_prefix}-service-subscription"
  frequency = "DAILY"

  monitor_arn_list = [aws_ce_anomaly_monitor.service.arn]

  subscriber {
    type  = "SNS"
    address = var.notification_topic_arn
  }

  threshold = 50
}
