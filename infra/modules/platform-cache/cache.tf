locals {
  cache_name = substr(
    replace(lower("${var.name_prefix}-cache"), "/[^a-z0-9-]/", "-"),
    0,
    40,
  )
}

resource "aws_security_group" "cache" {
  name        = "${local.cache_name}-sg"
  description = "Access control for ${local.cache_name}"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Allow Lambda access to Redis TLS port"
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [var.lambda_security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    ipv6_cidr_blocks = [
      "::/0"
    ]
  }

  tags = merge(var.tags, {
    Name = "${local.cache_name}-sg"
  })
}

resource "aws_elasticache_serverless_cache" "this" {
  name                     = local.cache_name
  description              = var.description
  engine                   = var.engine
  major_engine_version     = var.major_engine_version
  subnet_ids               = var.subnet_ids
  security_group_ids       = [aws_security_group.cache.id]
  daily_snapshot_time      = var.daily_snapshot_time
  snapshot_retention_limit = var.snapshot_retention_limit
  kms_key_id               = var.kms_key_id

  dynamic "cache_usage_limits" {
    for_each = var.data_storage_maximum_gb != null || var.ecpu_per_second_maximum != null ? [1] : []
    content {
      dynamic "data_storage" {
        for_each = var.data_storage_maximum_gb != null ? [1] : []
        content {
          maximum = var.data_storage_maximum_gb
          unit    = "GB"
        }
      }

      dynamic "ecpu_per_second" {
        for_each = var.ecpu_per_second_maximum != null ? [1] : []
        content {
          maximum = var.ecpu_per_second_maximum
        }
      }
    }
  }

  tags = merge(var.tags, {
    Name = local.cache_name
  })
}
