environment = "prod"
aws_region  = "eu-central-1"

aurora_cluster_identifier = "platform-prod-aurora"
database_name             = "clarivum"
master_username           = "platformadmin"
kms_key_id                = "arn:aws:kms:eu-central-1:869603330574:key/f0f8eae9-5742-480a-9160-185d7df17bf0"
engine_version            = "15.13"
generate_random_master_password = false
preferred_maintenance_window = "fri:22:49-fri:23:19"
serverlessv2_min_capacity    = 2.0
serverlessv2_max_capacity    = 8.0
instance_count               = 1
monitoring_interval          = 0
performance_insights_enabled = false
copy_tags_to_snapshot        = true

aurora_subnet_group_name       = "platform-prod-aurora-subnet-group"
cluster_parameter_group_name   = "default.aurora-postgresql15"
instance_parameter_group_name  = "default.aurora-postgresql15"
instance_identifiers = [
  "platform-prod-aurora-01"
]

db_subnet_ids = [
  "subnet-05749cf7d39e9ea78",
  "subnet-0dc83583337c45c03",
]

db_security_group_ids = [
  "sg-0bbef28fe6e7755c4",
]

backup_retention_days   = 14
preferred_backup_window = "01:30-02:30"

resource_tags = {
  Owner       = "platform-team"
  Criticality = "tier-1"
  ServiceLine = "platform"
  Environment = "prod"
}

asset_buckets = {
  "ebooks-public" = {
    bucket_prefix = "clarivum-app-prod-ebooks-public"
    object_ownership = "BucketOwnerEnforced"
  }
  "ebooks-private" = {
    bucket_prefix = "clarivum-app-prod-ebooks-private"
    object_ownership = "BucketOwnerEnforced"
  }
}

asset_bucket_kms_key_id = "alias/aws/s3"
