locals {
  topic_tags = var.tags
}

resource "aws_sns_topic" "incident" {
  name = "${var.name_prefix}-incident"
  tags = merge(local.topic_tags, { Name = "${var.name_prefix}-incident" })
}

resource "aws_sns_topic" "finops" {
  name = "${var.name_prefix}-finops"
  tags = merge(local.topic_tags, { Name = "${var.name_prefix}-finops" })
}

resource "aws_sns_topic_subscription" "incident" {
  for_each = { for sub in var.sns_incident_subscriptions : "${sub.protocol}:${sub.endpoint}" => sub }

  topic_arn = aws_sns_topic.incident.arn
  protocol  = each.value.protocol
  endpoint  = each.value.endpoint
}

resource "aws_sns_topic_subscription" "finops" {
  for_each = { for sub in var.sns_finops_subscriptions : "${sub.protocol}:${sub.endpoint}" => sub }

  topic_arn = aws_sns_topic.finops.arn
  protocol  = each.value.protocol
  endpoint  = each.value.endpoint
}
