environment = "dev"
aws_region  = "eu-central-1"

aurora_cluster_identifier = "platform-dev-aurora"
database_name             = "clarivum"
master_username           = "platformadmin"
kms_key_id                = "arn:aws:kms:eu-central-1:869603330574:key/f0f8eae9-5742-480a-9160-185d7df17bf0"

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
  "ebooks-public" = {
    bucket_prefix = "clarivum-app-dev-ebooks-public"
  }
  "ebooks-private" = {
    bucket_prefix = "clarivum-app-dev-ebooks-private"
  }
}
