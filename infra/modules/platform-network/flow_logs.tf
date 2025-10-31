locals {
  flow_logs_enabled = var.enable_flow_logs
}

resource "aws_cloudwatch_log_group" "flow_logs" {
  count = local.flow_logs_enabled ? 1 : 0

  name              = coalesce(var.flow_logs_log_group_name, "/aws/vpc/${var.name}/flow-logs")
  retention_in_days = var.flow_logs_retention_days

  tags = merge(local.base_tags, {
    Name = "${var.name}-flow-logs"
  })
}

resource "aws_iam_role" "flow_logs" {
  count = local.flow_logs_enabled ? 1 : 0

  name = "${var.name}-flow-logs-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "vpc-flow-logs.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = merge(local.base_tags, {
    Name = "${var.name}-flow-logs-role"
  })
}

resource "aws_iam_role_policy" "flow_logs" {
  count = local.flow_logs_enabled ? 1 : 0

  name = "${var.name}-flow-logs-policy"
  role = aws_iam_role.flow_logs[0].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_vpc_flow_log" "this" {
  count = local.flow_logs_enabled ? 1 : 0

  vpc_id               = aws_vpc.this.id
  iam_role_arn         = aws_iam_role.flow_logs[0].arn
  log_destination      = aws_cloudwatch_log_group.flow_logs[0].arn
  log_destination_type = "cloud-watch-logs"
  traffic_type         = "ALL"
}
