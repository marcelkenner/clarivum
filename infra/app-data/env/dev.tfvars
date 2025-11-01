environment = "dev"
aws_region  = "eu-central-1"

aurora_cluster_identifier = "platform-dev-aurora"
database_name             = "clarivum"
master_username           = "platformadmin"
kms_key_id                = "arn:aws:kms:eu-central-1:869603330574:key/f0f8eae9-5742-480a-9160-185d7df17bf0"
engine_version            = "15.13"
generate_random_master_password = false
preferred_backup_window   = "00:05-00:35"
preferred_maintenance_window = "sun:02:43-sun:03:13"
serverlessv2_min_capacity = 2.0
serverlessv2_max_capacity = 8.0
instance_count            = 1
monitoring_interval       = 0
performance_insights_enabled = false
deletion_protection          = false
copy_tags_to_snapshot        = false

aurora_subnet_group_name = "platform-dev-db-subnets"
cluster_parameter_group_name = "platform-dev-apg"
instance_parameter_group_name = "platform-dev-instance-pg"
instance_identifiers = [
  "platform-dev-aurora-instance-1"
]

db_subnet_ids = [
  "subnet-07958bfe0e465d42e",
  "subnet-0b4a2e4455725e8ed",
]

db_security_group_ids = [
  "sg-0c15ce9c398884071",
]

resource_tags = {
  Owner       = "platform-team"
  ServiceLine = "platform"
  Environment = "dev"
  CostCenter  = "dev-platform"
}

asset_buckets = {
  # Dev asset buckets managed outside Terraform at the moment.
}
