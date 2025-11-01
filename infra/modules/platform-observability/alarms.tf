resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "${var.name_prefix}-lambda-errors"
  alarm_description   = "Lambda reports errors"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 60
  statistic           = "Sum"
  threshold           = 1

  dimensions = {
    FunctionName = var.lambda_function_name
  }

  alarm_actions = [aws_sns_topic.incident.arn]
  ok_actions    = [aws_sns_topic.incident.arn]

  tags = var.tags
}

resource "aws_cloudwatch_metric_alarm" "lambda_duration" {
  alarm_name          = "${var.name_prefix}-lambda-duration"
  alarm_description   = "Lambda duration exceeds threshold"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "Duration"
  namespace           = "AWS/Lambda"
  period              = 60
  statistic           = "Average"
  threshold           = var.lambda_duration_threshold_ms

  dimensions = {
    FunctionName = var.lambda_function_name
  }

  alarm_actions = [aws_sns_topic.incident.arn]
  ok_actions    = [aws_sns_topic.incident.arn]

  tags = var.tags
}

resource "aws_cloudwatch_metric_alarm" "api_gateway_5xx" {
  alarm_name          = "${var.name_prefix}-api-5xx"
  alarm_description   = "API Gateway returning elevated 5xx responses"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "5xx"
  namespace           = "AWS/ApiGateway"
  period              = 60
  statistic           = "Sum"
  threshold           = 5

  dimensions = {
    ApiId = var.api_id
  }

  alarm_actions = [aws_sns_topic.incident.arn]
  ok_actions    = [aws_sns_topic.incident.arn]

  tags = var.tags
}

resource "aws_cloudwatch_metric_alarm" "dynamodb_throttles" {
  alarm_name          = "${var.name_prefix}-dynamodb-throttle"
  alarm_description   = "DynamoDB throttled requests detected"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "ThrottledRequests"
  namespace           = "AWS/DynamoDB"
  period              = 60
  statistic           = "Sum"
  threshold           = 0
  treat_missing_data  = "notBreaching"

  dimensions = {
    TableName = var.dynamodb_table_name
  }

  alarm_actions = [aws_sns_topic.incident.arn]
  ok_actions    = [aws_sns_topic.incident.arn]

  tags = var.tags
}

resource "aws_cloudwatch_metric_alarm" "aurora_capacity" {
  alarm_name          = "${var.name_prefix}-aurora-capacity"
  alarm_description   = "Aurora serverless capacity above threshold"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "ServerlessDatabaseCapacity"
  namespace           = "AWS/RDS"
  period              = 300
  statistic           = "Average"
  threshold           = var.aurora_capacity_threshold

  dimensions = {
    DBClusterIdentifier = var.aurora_cluster_identifier
  }

  alarm_actions = [aws_sns_topic.incident.arn]
  ok_actions    = [aws_sns_topic.incident.arn]

  tags = var.tags
}

resource "aws_cloudwatch_metric_alarm" "cloudfront_5xx" {
  provider            = aws.us_east_1
  alarm_name          = "${var.name_prefix}-cloudfront-5xx"
  alarm_description   = "CloudFront 5xx error rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "5xxErrorRate"
  namespace           = "AWS/CloudFront"
  period              = 60
  statistic           = "Average"
  threshold           = 1

  dimensions = {
    DistributionId = var.cloudfront_distribution_id
    Region         = "Global"
  }

  alarm_actions = [aws_sns_topic.incident_us_east_1.arn]
  ok_actions    = [aws_sns_topic.incident_us_east_1.arn]

  tags = var.tags
}

resource "aws_cloudwatch_metric_alarm" "cloudfront_4xx" {
  provider            = aws.us_east_1
  alarm_name          = "${var.name_prefix}-cloudfront-4xx"
  alarm_description   = "CloudFront 4xx error rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "4xxErrorRate"
  namespace           = "AWS/CloudFront"
  period              = 60
  statistic           = "Average"
  threshold           = 5

  dimensions = {
    DistributionId = var.cloudfront_distribution_id
    Region         = "Global"
  }

  alarm_actions = [aws_sns_topic.incident_us_east_1.arn]
  ok_actions    = [aws_sns_topic.incident_us_east_1.arn]

  tags = var.tags
}
