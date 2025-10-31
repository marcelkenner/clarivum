environment = "dev"
aws_region  = "eu-central-1"

# Replace with real private subnet IDs in the application VPC
db_subnet_ids = [
  "subnet-DEVPRIVATEA",
  "subnet-DEVPRIVATEB",
  "subnet-DEVPRIVATEC",
]

# Security group that allows PostgreSQL traffic from app services
db_security_group_ids = [
  "sg-DEVAPPACCESS",
]

resource_tags = {
  Owner        = "platform-team"
  ServiceLine  = "platform"
  Environment  = "dev"
}

asset_buckets = {
  "ebooks-public" = {
    bucket_prefix = "clarivum-app-dev-ebooks-public"
  }
  "ebooks-private" = {
    bucket_prefix = "clarivum-app-dev-ebooks-private"
  }
}
