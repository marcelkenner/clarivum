environment = "prod"
aws_region  = "eu-central-1"

# Replace with production private subnet IDs
db_subnet_ids = [
  "subnet-PRODPRIVATEA",
  "subnet-PRODPRIVATEB",
  "subnet-PRODPRIVATEC",
]

# Security group granting PostgreSQL access from production services
db_security_group_ids = [
  "sg-PRODAPPACCESS",
]

backup_retention_days        = 14
preferred_backup_window      = "01:30-02:30"
preferred_maintenance_window = "sun:02:30-sun:04:30"

resource_tags = {
  Owner        = "platform-team"
  Criticality  = "tier-1"
  ServiceLine  = "platform"
  Environment  = "prod"
}

asset_buckets = {
  "ebooks-public" = {
    bucket_prefix = "clarivum-app-prod-ebooks-public"
  }
  "ebooks-private" = {
    bucket_prefix = "clarivum-app-prod-ebooks-private"
  }
}
