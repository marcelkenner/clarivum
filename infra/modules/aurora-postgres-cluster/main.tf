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
  tags = merge(var.tags, { Name = var.name })
}

locals {
  managed_cluster_parameter_group = var.cluster_parameter_group_name == null && length(var.cluster_parameters) > 0
  instance_identifier_list        = length(var.instance_identifiers) > 0 ? var.instance_identifiers : []
}

resource "random_password" "master" {
  count            = var.generate_random_master_password && var.database_password == null ? 1 : 0
  length           = 32
  special          = true
  override_special = "!#$%&()*+-_="
}

locals {
  generated_master_password = length(random_password.master) > 0 ? random_password.master[0].result : null
  master_password           = var.database_password != null ? var.database_password : local.generated_master_password
}

resource "aws_db_subnet_group" "this" {
  name        = coalesce(var.subnet_group_name, "${var.name}-subnet-group")
  description = coalesce(var.subnet_group_description, "Aurora subnet group for ${var.name}")
  subnet_ids  = var.subnet_ids

  tags = local.tags
}

resource "aws_rds_cluster_parameter_group" "this" {
  count  = local.managed_cluster_parameter_group ? 1 : 0
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

  db_subnet_group_name                = aws_db_subnet_group.this.name
  vpc_security_group_ids              = var.vpc_security_group_ids
  backup_retention_period             = var.backup_retention_days
  preferred_backup_window             = var.preferred_backup_window
  preferred_maintenance_window        = var.preferred_maintenance_window
  apply_immediately                   = var.apply_immediately
  deletion_protection                 = var.deletion_protection
  storage_encrypted                   = true
  kms_key_id                          = var.kms_key_id
  copy_tags_to_snapshot               = var.copy_tags_to_snapshot
  iam_database_authentication_enabled = var.enable_iam_auth
  enable_global_write_forwarding      = var.enable_global_write_forwarding
  enabled_cloudwatch_logs_exports     = var.cloudwatch_logs_exports
  availability_zones                  = var.availability_zones
  db_cluster_parameter_group_name     = coalesce(
    var.cluster_parameter_group_name,
    length(aws_rds_cluster_parameter_group.this) > 0 ? aws_rds_cluster_parameter_group.this[0].name : null
  )

  serverlessv2_scaling_configuration {
    min_capacity = var.serverlessv2_min_capacity
    max_capacity = var.serverlessv2_max_capacity
  }

  lifecycle {
    ignore_changes = [
      master_password,
      availability_zones,
    ]
  }

  tags = local.tags
}

resource "aws_rds_cluster_instance" "this" {
  count               = var.instance_count
  identifier          = length(local.instance_identifier_list) > count.index ? local.instance_identifier_list[count.index] : format("%s-%02d", var.name, count.index + 1)
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
  db_parameter_group_name         = var.instance_parameter_group_name

  tags = local.tags
}
