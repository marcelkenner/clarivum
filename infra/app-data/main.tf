terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  cluster_name = var.aurora_cluster_identifier != "" ? var.aurora_cluster_identifier : "clarivum-app-${var.environment}"

  base_tags = merge(
    {
      Environment = var.environment
      Service     = "app-data"
      ManagedBy   = "terraform"
      Repository  = "clarivum"
    },
    var.resource_tags,
  )

}

module "aurora" {
  source = "../modules/aurora-postgres-cluster"

  name                   = local.cluster_name
  database_name          = var.database_name
  master_username        = var.master_username
  database_password      = var.database_password
  engine_version         = var.engine_version
  availability_zones     = var.availability_zones
  subnet_ids             = var.db_subnet_ids
  vpc_security_group_ids = var.db_security_group_ids

  backup_retention_days           = var.backup_retention_days
  preferred_backup_window         = var.preferred_backup_window
  preferred_maintenance_window    = var.preferred_maintenance_window
  apply_immediately               = var.apply_immediately
  deletion_protection             = var.deletion_protection
  kms_key_id                      = var.kms_key_id
  enable_iam_auth                 = var.enable_iam_auth
  enable_global_write_forwarding  = var.enable_global_write_forwarding
  cloudwatch_logs_exports         = var.cloudwatch_logs_exports
  serverlessv2_min_capacity       = var.serverlessv2_min_capacity
  serverlessv2_max_capacity       = var.serverlessv2_max_capacity
  instance_count                  = var.instance_count
  instance_class                  = var.instance_class
  auto_minor_version_upgrade      = var.auto_minor_version_upgrade
  monitoring_interval             = var.monitoring_interval
  performance_insights_enabled    = var.performance_insights_enabled
  performance_insights_kms_key_id = var.performance_insights_kms_key_id
  parameter_group_family          = var.parameter_group_family
  cluster_parameters              = var.cluster_parameters

  tags = local.base_tags
}

locals {
  asset_buckets = {
    for key, value in var.asset_buckets : key => {
      bucket_prefix       = coalesce(try(value.bucket_prefix, null), format("clarivum-app-%s-%s", var.environment, key))
      public_read         = try(value.public_read, false)
      versioning_enabled  = try(value.versioning_enabled, true)
      force_random_suffix = try(value.force_random_suffix, true)
      force_destroy       = try(value.force_destroy, false)
      lifecycle_rules     = coalesce(try(value.lifecycle_rules, null), var.asset_bucket_default_lifecycle_rules)
      kms_master_key_id   = coalesce(try(value.kms_master_key_id, null), var.asset_bucket_kms_key_id)
      object_ownership    = try(value.object_ownership, "BucketOwnerEnforced")
      tags                = merge(local.base_tags, { Bucket = key }, try(value.tags, {}))
    }
  }
}

module "asset_buckets" {
  for_each = local.asset_buckets
  source   = "../modules/app-s3-bucket"

  bucket_prefix       = each.value.bucket_prefix
  force_random_suffix = each.value.force_random_suffix
  public_read         = each.value.public_read
  versioning_enabled  = each.value.versioning_enabled
  force_destroy       = each.value.force_destroy
  lifecycle_rules     = each.value.lifecycle_rules
  kms_master_key_id   = each.value.kms_master_key_id
  object_ownership    = each.value.object_ownership
  tags                = each.value.tags
