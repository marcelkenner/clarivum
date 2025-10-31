terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = ">= 3.5.1"
    }
  }
}

locals {
  master_password = var.database_password != null ? var.database_password : random_password.master.result
  tags            = merge(var.tags, { Name = var.name })
}

resource "random_password" "master" {
  length           = 32
  special          = true
  override_special = "!#$%&()*+-_="
}

resource "aws_db_subnet_group" "this" {
  name        = "${var.name}-subnet-group"
  description = "Aurora subnet group for ${var.name}"
  subnet_ids  = var.subnet_ids

  tags = local.tags
}

resource "aws_rds_cluster_parameter_group" "this" {
  count  = length(var.cluster_parameters) > 0 ? 1 : 0
  name   = "${var.name}-cluster-params"
  family = var.parameter_group_family

  dynamic "parameter" {
    for_each = var.cluster_parameters
    content {
      name         = parameter.value.name
      value        = parameter.value.value
      apply_method = coalesce(parameter.value.apply_method, "pending-reboot")
    }
  }

  tags = local.tags
}

resource "aws_rds_cluster" "this" {
  cluster_identifier = var.name
  engine             = "aurora-postgresql"
  engine_version     = var.engine_version
  engine_mode        = "provisioned"

  database_name   = var.database_name
  master_username = var.master_username
  master_password = local.master_password

  availability_zones                  = var.availability_zones
  db_subnet_group_name                = aws_db_subnet_group.this.name
  vpc_security_group_ids              = var.vpc_security_group_ids
  backup_retention_period             = var.backup_retention_days
  preferred_backup_window             = var.preferred_backup_window
  preferred_maintenance_window        = var.preferred_maintenance_window
  apply_immediately                   = var.apply_immediately
  deletion_protection                 = var.deletion_protection
  storage_encrypted                   = true
  kms_key_id                          = var.kms_key_id
  copy_tags_to_snapshot               = true
  iam_database_authentication_enabled = var.enable_iam_auth
  enable_global_write_forwarding      = var.enable_global_write_forwarding
  enabled_cloudwatch_logs_exports     = var.cloudwatch_logs_exports
  db_cluster_parameter_group_name     = length(var.cluster_parameters) > 0 ? aws_rds_cluster_parameter_group.this[0].name : null

  serverlessv2_scaling_configuration {
    min_capacity = var.serverlessv2_min_capacity
    max_capacity = var.serverlessv2_max_capacity
  }

  lifecycle {
    ignore_changes = [
      master_password,
    ]
  }

  tags = local.tags
}

resource "aws_rds_cluster_instance" "this" {
  count               = var.instance_count
  identifier          = format("%s-%02d", var.name, count.index + 1)
  cluster_identifier  = aws_rds_cluster.this.id
  instance_class      = var.instance_class
  engine              = aws_rds_cluster.this.engine
  engine_version      = aws_rds_cluster.this.engine_version
  publicly_accessible = false
  apply_immediately   = var.apply_immediately

  auto_minor_version_upgrade      = var.auto_minor_version_upgrade
  monitoring_interval             = var.monitoring_interval
  performance_insights_enabled    = var.performance_insights_enabled
  performance_insights_kms_key_id = var.performance_insights_kms_key_id

  tags = local.tags
}
