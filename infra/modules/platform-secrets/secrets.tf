locals {
  base_tags = var.tags
}

resource "aws_secretsmanager_secret" "master" {
  name        = var.master_secret_name
  description = "Aurora master credentials (managed by Terraform with rotation)"

  kms_key_id                     = var.kms_key_id
  recovery_window_in_days        = 7
  force_overwrite_replica_secret = true

  tags = merge(local.base_tags, {
    Name = var.master_secret_name
  })
}

resource "aws_secretsmanager_secret" "url" {
  name        = var.url_secret_name
  description = "Aurora connection URL for application runtimes"

  kms_key_id              = var.kms_key_id
  recovery_window_in_days = 7

  tags = merge(local.base_tags, {
    Name = var.url_secret_name
  })
}

locals {
  rotation_app_id      = "arn:aws:serverlessrepo:us-east-1:297356227824:applications/SecretsManagerRDSPostgreSQLRotationSingleUser"
  rotation_app_version = "2.0.1"
  rotation_name_tokens = regexall("[A-Za-z0-9_-]+", var.master_secret_name)
  rotation_function_name = length(local.rotation_name_tokens) > 0 ? trimsuffix(
    trimprefix(join("-", local.rotation_name_tokens), "-"),
    "-"
  ) : "rotation"
}

resource "aws_serverlessapplicationrepository_cloudformation_stack" "rotation" {
  name             = "${local.rotation_function_name}-rotation"
  application_id   = local.rotation_app_id
  semantic_version = local.rotation_app_version

  parameters = {
    functionName        = "${local.rotation_function_name}-fn"
    vpcSecurityGroupIds = join(",", var.rotation_security_group_ids)
    vpcSubnetIds        = join(",", var.rotation_subnet_ids)
    endpointAddress     = var.aurora_host
    endpointPort        = tostring(var.aurora_port)
    dbName              = var.aurora_database_name
    secretArn           = aws_secretsmanager_secret.master.arn
  }

  capabilities = [
    "CAPABILITY_NAMED_IAM",
    "CAPABILITY_AUTO_EXPAND"
  ]

  tags = local.base_tags
}

locals {
  rotation_lambda_arn = try(
    aws_serverlessapplicationrepository_cloudformation_stack.rotation.outputs["RotationLambdaArn"],
    aws_serverlessapplicationrepository_cloudformation_stack.rotation.outputs["LambdaRotationFunctionArn"],
    aws_serverlessapplicationrepository_cloudformation_stack.rotation.outputs["functionArn"]
  )
}

resource "aws_secretsmanager_secret_rotation" "master" {
  secret_id           = aws_secretsmanager_secret.master.id
  rotation_lambda_arn = local.rotation_lambda_arn

  rotation_rules {
    schedule_expression = var.rotation_schedule_expression
  }
}

resource "aws_secretsmanager_secret_policy" "master" {
  count = length(var.ci_secret_reader_principals) > 0 ? 1 : 0

  secret_arn = aws_secretsmanager_secret.master.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowDeploymentPipelinesRead"
        Effect = "Allow"
        Principal = {
          AWS = var.ci_secret_reader_principals
        }
        Action   = ["secretsmanager:GetSecretValue", "secretsmanager:DescribeSecret"]
        Resource = aws_secretsmanager_secret.master.arn
      }
    ]
  })
}

resource "aws_secretsmanager_secret_policy" "url" {
  count = length(var.ci_secret_reader_principals) > 0 ? 1 : 0

  secret_arn = aws_secretsmanager_secret.url.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowDeploymentPipelinesRead"
        Effect = "Allow"
        Principal = {
          AWS = var.ci_secret_reader_principals
        }
        Action   = ["secretsmanager:GetSecretValue", "secretsmanager:DescribeSecret"]
        Resource = aws_secretsmanager_secret.url.arn
      }
    ]
  })
}
