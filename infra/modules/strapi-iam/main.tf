terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

data "aws_iam_policy_document" "execution_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "execution" {
  name               = "${var.name}-exec"
  assume_role_policy = data.aws_iam_policy_document.execution_assume_role.json

  tags = merge(var.tags, {
    Name = "${var.name}-exec-role"
  })
}

resource "aws_iam_role_policy_attachment" "execution_task_policy" {
  role       = aws_iam_role.execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "execution_xray_policy" {
  role       = aws_iam_role.execution.name
  policy_arn = "arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess"
}

data "aws_iam_policy_document" "execution_extra" {
  statement {
    sid = "AllowSecretsManager"

    actions = [
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret"
    ]

    resources = var.secret_arns
  }

  dynamic "statement" {
    for_each = var.extra_execution_statements
    content {
      sid       = lookup(statement.value, "sid", null)
      effect    = lookup(statement.value, "effect", "Allow")
      actions   = statement.value.actions
      resources = statement.value.resources
    }
  }
}

resource "aws_iam_policy" "execution_custom" {
  name   = "${var.name}-exec-custom"
  policy = data.aws_iam_policy_document.execution_extra.json
}

resource "aws_iam_role_policy_attachment" "execution_custom_attachment" {
  role       = aws_iam_role.execution.name
  policy_arn = aws_iam_policy.execution_custom.arn
}

data "aws_iam_policy_document" "task_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "task" {
  name               = "${var.name}-task"
  assume_role_policy = data.aws_iam_policy_document.task_assume_role.json

  tags = merge(var.tags, {
    Name = "${var.name}-task-role"
  })
}

data "aws_iam_policy_document" "task_policy" {
  statement {
    sid = "AllowSecretRetrieval"

    actions = [
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret"
    ]

    resources = var.secret_arns
  }

  statement {
    sid = "AllowXRayTracing"

    actions = [
      "xray:PutTraceSegments",
      "xray:PutTelemetryRecords",
      "xray:GetSamplingRules",
      "xray:GetSamplingTargets",
      "xray:GetSamplingStatisticSummaries"
    ]

    resources = ["*"]
  }

  dynamic "statement" {
    for_each = length(var.media_bucket_arns) > 0 ? [1] : []
    content {
      sid = "AllowS3MediaObjects"
      actions = [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject"
      ]
      resources = [for arn in var.media_bucket_arns : "${arn}/*"]
    }
  }

  dynamic "statement" {
    for_each = length(var.media_bucket_arns) > 0 ? [1] : []
    content {
      sid = "AllowS3MediaList"
      actions = [
        "s3:ListBucket"
      ]
      resources = var.media_bucket_arns
    }
  }

  dynamic "statement" {
    for_each = var.extra_task_statements
    content {
      sid       = lookup(statement.value, "sid", null)
      effect    = lookup(statement.value, "effect", "Allow")
      actions   = statement.value.actions
      resources = statement.value.resources
      condition = lookup(statement.value, "condition", null)
    }
  }
}

resource "aws_iam_policy" "task_custom" {
  name   = "${var.name}-task-policy"
  policy = data.aws_iam_policy_document.task_policy.json
}

resource "aws_iam_role_policy_attachment" "task_custom_attachment" {
  role       = aws_iam_role.task.name
  policy_arn = aws_iam_policy.task_custom.arn
}
