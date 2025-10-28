terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = ">= 3.5"
    }
  }
}

provider "aws" {
  region = var.region
}

data "aws_caller_identity" "current" {}

locals {
  service_name = "strapi"
  name         = "${local.service_name}-${var.environment}"

  default_tags = {
    Environment = var.environment
    Service     = local.service_name
    ManagedBy   = "terraform"
    Repository  = "clarivum"
  }

  tags = merge(local.default_tags, var.tags)

  media_public_bucket_name  = "clarivum-${local.name}-media-public"
  media_private_bucket_name = "clarivum-${local.name}-media-private"

  plain_environment_variables = [
    for name, value in var.environment_variables : {
      name  = name
      value = value
    }
  ]

  secret_environment_map = merge(
    var.secret_environment_variables,
    {
      DATABASE_PASSWORD = aws_secretsmanager_secret.database_password.arn,
      DATABASE_URL      = aws_secretsmanager_secret.database_url.arn
    }
  )

  secret_environment_variables = [
    for name, arn in local.secret_environment_map : {
      name       = name
      value_from = arn
    }
  ]

  secret_arns = distinct([for _, arn in local.secret_environment_map : arn])

  media_bucket_arns = concat(
    [
      aws_s3_bucket.media_public.arn,
      aws_s3_bucket.media_private.arn
    ],
    var.media_bucket_arns
  )

  s3_kms_key_arn = "arn:aws:kms:${var.region}:${data.aws_caller_identity.current.account_id}:alias/aws/s3"

  database_subnet_ids = length(var.database_subnet_ids) > 0 ? var.database_subnet_ids : var.private_subnet_ids
}

resource "random_password" "db_master" {
  length           = 24
  special          = true
  override_special = "!#$%&()*+-_=."
}

resource "aws_cloudwatch_log_group" "exec" {
  name              = "/aws/ecs/${local.name}/exec"
  retention_in_days = var.log_retention_days
  kms_key_id        = var.log_kms_key_arn

  tags = merge(local.tags, {
    Name = "${local.name}-exec-logs"
  })
}

resource "aws_ecs_cluster" "this" {
  name = "${local.name}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  configuration {
    execute_command_configuration {
      logging = "OVERRIDE"
      log_configuration {
        cloud_watch_log_group_name = aws_cloudwatch_log_group.exec.name
      }
    }
  }

  tags = merge(local.tags, {
    Name = "${local.name}-cluster"
  })
}

resource "aws_ecs_cluster_capacity_providers" "this" {
  cluster_name       = aws_ecs_cluster.this.name
  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = 1
    base              = 1
  }
}

resource "aws_s3_bucket" "media_public" {
  bucket = local.media_public_bucket_name

  tags = merge(local.tags, {
    Name = "${local.name}-media-public"
  })
}

resource "aws_s3_bucket" "media_private" {
  bucket = local.media_private_bucket_name

  tags = merge(local.tags, {
    Name = "${local.name}-media-private"
  })
}

resource "aws_s3_bucket_ownership_controls" "media_public" {
  bucket = aws_s3_bucket.media_public.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_ownership_controls" "media_private" {
  bucket = aws_s3_bucket.media_private.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_versioning" "media_public" {
  bucket = aws_s3_bucket.media_public.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_versioning" "media_private" {
  bucket = aws_s3_bucket.media_private.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "media_public" {
  bucket = aws_s3_bucket.media_public.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = local.s3_kms_key_arn
      sse_algorithm     = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "media_private" {
  bucket = aws_s3_bucket.media_private.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = local.s3_kms_key_arn
      sse_algorithm     = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "media_public" {
  bucket                  = aws_s3_bucket.media_public.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_public_access_block" "media_private" {
  bucket                  = aws_s3_bucket.media_private.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "media_public" {
  bucket = aws_s3_bucket.media_public.id

  rule {
    id     = "media-public-transition"
    status = "Enabled"

    transition {
      days          = 180
      storage_class = "INTELLIGENT_TIERING"
    }

    noncurrent_version_transition {
      noncurrent_days = 180
      storage_class   = "INTELLIGENT_TIERING"
    }

    noncurrent_version_expiration {
      noncurrent_days = 365
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "media_private" {
  bucket = aws_s3_bucket.media_private.id

  rule {
    id     = "media-private-transition"
    status = "Enabled"

    transition {
      days          = 180
      storage_class = "INTELLIGENT_TIERING"
    }

    noncurrent_version_transition {
      noncurrent_days = 180
      storage_class   = "INTELLIGENT_TIERING"
    }

    noncurrent_version_expiration {
      noncurrent_days = 365
    }
  }
}

data "aws_iam_policy_document" "media_public_policy" {
  statement {
    sid    = "EnforceTLS"
    effect = "Deny"

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = ["s3:*"]
    resources = [
      aws_s3_bucket.media_public.arn,
      "${aws_s3_bucket.media_public.arn}/*"
    ]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }
}

data "aws_iam_policy_document" "media_private_policy" {
  statement {
    sid    = "EnforceTLS"
    effect = "Deny"

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = ["s3:*"]
    resources = [
      aws_s3_bucket.media_private.arn,
      "${aws_s3_bucket.media_private.arn}/*"
    ]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }
}

resource "aws_s3_bucket_policy" "media_public" {
  bucket = aws_s3_bucket.media_public.id
  policy = data.aws_iam_policy_document.media_public_policy.json
}

resource "aws_s3_bucket_policy" "media_private" {
  bucket = aws_s3_bucket.media_private.id
  policy = data.aws_iam_policy_document.media_private_policy.json
}

resource "aws_secretsmanager_secret" "database_password" {
  name                    = "clarivum/strapi/${var.environment}/database-password"
  recovery_window_in_days = 7

  tags = merge(local.tags, {
    Name = "${local.name}-database-password"
  })
}

resource "aws_secretsmanager_secret" "database_url" {
  name                    = "clarivum/strapi/${var.environment}/database-url"
  recovery_window_in_days = 7

  tags = merge(local.tags, {
    Name = "${local.name}-database-url"
  })
}

module "iam" {
  source = "../modules/strapi-iam"

  name        = local.name
  secret_arns = local.secret_arns

  media_bucket_arns          = local.media_bucket_arns
  extra_execution_statements = var.extra_execution_role_statements
  extra_task_statements      = var.extra_task_role_statements
  tags                       = local.tags
}

module "alb" {
  source = "../modules/strapi-alb"

  name                       = local.name
  vpc_id                     = var.vpc_id
  public_subnet_ids          = var.public_subnet_ids
  allowed_ingress_cidrs      = var.alb_allowed_cidrs
  certificate_arn            = var.acm_certificate_arn
  target_port                = var.container_port
  health_check_path          = var.health_check_path
  domain_name                = var.domain_name
  route53_zone_id            = var.route53_zone_id
  access_logs_bucket         = var.alb_access_logs_bucket
  access_logs_prefix         = var.alb_access_logs_prefix
  enable_deletion_protection = var.enable_alb_deletion_protection
  tags                       = local.tags
}

module "service" {
  source = "../modules/strapi-ecs-service"

  name         = local.name
  region       = var.region
  cluster_arn  = aws_ecs_cluster.this.arn
  cluster_name = aws_ecs_cluster.this.name

  execution_role_arn = module.iam.execution_role_arn
  task_role_arn      = module.iam.task_role_arn

  private_subnet_ids       = var.private_subnet_ids
  vpc_id                   = var.vpc_id
  alb_security_group_id    = module.alb.alb_security_group_id
  target_group_arn         = module.alb.target_group_arn
  load_balancer_arn_suffix = module.alb.alb_arn_suffix
  target_group_arn_suffix  = module.alb.target_group_arn_suffix

  container_image             = var.container_image
  container_port              = var.container_port
  container_health_check_path = var.health_check_path
  task_cpu                    = var.task_cpu
  task_memory                 = var.task_memory
  desired_count               = var.desired_count

  environment_variables        = local.plain_environment_variables
  secret_environment_variables = local.secret_environment_variables

  autoscaling_min_capacity = var.autoscaling_min_capacity
  autoscaling_max_capacity = var.autoscaling_max_capacity
  autoscaling_cpu_target   = var.autoscaling_cpu_target
  latency_threshold_ms     = var.latency_threshold_ms
  target_5xx_threshold     = var.target_5xx_threshold

  alarm_action_arns = var.alarm_action_arns

  log_retention_days = var.log_retention_days
  log_kms_key_arn    = var.log_kms_key_arn

  enable_firelens = var.enable_firelens
  firelens_image  = var.firelens_image

  tags = local.tags
}

resource "aws_db_subnet_group" "strapi" {
  name       = "${local.name}-db-subnets"
  subnet_ids = local.database_subnet_ids

  tags = merge(local.tags, {
    Name = "${local.name}-db-subnets"
  })
}

resource "aws_security_group" "database" {
  name_prefix = "${local.name}-db-"
  description = "Security group for ${local.name} database"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Allow Strapi ECS tasks"
    from_port       = var.db_port
    to_port         = var.db_port
    protocol        = "tcp"
    security_groups = [module.service.service_security_group_id]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.tags, {
    Name = "${local.name}-db-sg"
  })
}

resource "aws_iam_role" "rds_monitoring" {
  name = "${local.name}-rds-monitoring"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = merge(local.tags, {
    Name = "${local.name}-rds-monitoring-role"
  })
}

resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  role       = aws_iam_role.rds_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

resource "aws_db_parameter_group" "strapi" {
  name        = "${local.name}-pg"
  family      = "postgres15"
  description = "Strapi ${var.environment} parameter group"

  parameter {
    name  = "rds.force_ssl"
    value = "1"
  }

  tags = merge(local.tags, {
    Name = "${local.name}-db-parameter-group"
  })
}

locals {
  db_password_encoded = urlencode(random_password.db_master.result)
  db_connection_url   = "postgres://${var.db_username}:${local.db_password_encoded}@${aws_db_instance.strapi.address}:${var.db_port}/${var.db_name}?sslmode=require"
}

resource "aws_db_instance" "strapi" {
  identifier = "${local.name}-db"

  engine         = "postgres"
  engine_version = var.db_engine_version
  instance_class = var.db_instance_class

  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  storage_type          = var.db_storage_type
  storage_encrypted     = true
  kms_key_id            = var.db_kms_key_arn

  db_name  = var.db_name
  username = var.db_username
  password = random_password.db_master.result

  port                = var.db_port
  multi_az            = var.db_multi_az
  publicly_accessible = false

  apply_immediately          = var.db_apply_immediately
  auto_minor_version_upgrade = var.db_auto_minor_version_upgrade
  backup_retention_period    = var.db_backup_retention_days
  deletion_protection        = var.db_deletion_protection
  copy_tags_to_snapshot      = true

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  performance_insights_enabled          = true
  performance_insights_retention_period = var.db_performance_insights_retention_days

  monitoring_interval = 60
  monitoring_role_arn = aws_iam_role.rds_monitoring.arn

  db_subnet_group_name   = aws_db_subnet_group.strapi.name
  vpc_security_group_ids = [aws_security_group.database.id]

  parameter_group_name = aws_db_parameter_group.strapi.name

  skip_final_snapshot       = var.db_skip_final_snapshot
  final_snapshot_identifier = var.db_skip_final_snapshot ? null : "${local.name}-final-snapshot"

  tags = merge(local.tags, {
    Name = "${local.name}-db"
  })
}

resource "aws_secretsmanager_secret_version" "database_password" {
  secret_id     = aws_secretsmanager_secret.database_password.id
  secret_string = random_password.db_master.result

  lifecycle {
    ignore_changes = [secret_string]
  }
}

resource "aws_secretsmanager_secret_version" "database_url" {
  secret_id     = aws_secretsmanager_secret.database_url.id
  secret_string = local.db_connection_url

  lifecycle {
    ignore_changes = [secret_string]
  }
}
