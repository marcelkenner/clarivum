environment            = "dev"
network_cidr_block     = "10.20.0.0/16"
nat_gateway_az         = "eu-central-1a"
service_name           = "platform"
aws_region             = "eu-central-1"

public_subnets = {
  "eu-central-1a" = {
    cidr_block = "10.20.1.0/24"
    az         = "eu-central-1a"
  }
  "eu-central-1b" = {
    cidr_block = "10.20.2.0/24"
    az         = "eu-central-1b"
  }
}

private_subnets = {
  "eu-central-1a" = {
    cidr_block = "10.20.11.0/24"
    az         = "eu-central-1a"
  }
  "eu-central-1b" = {
    cidr_block = "10.20.12.0/24"
    az         = "eu-central-1b"
  }
}

dynamodb_table_name   = "platform-dev-kv"
dynamodb_kms_key_arn  = "arn:aws:kms:eu-central-1:869603330574:key/f0172bb9-9e32-467d-a992-07aff4366b85"

aurora_cluster_identifier = "platform-dev-aurora"
aurora_cluster_arn        = "arn:aws:rds:eu-central-1:869603330574:cluster:platform-dev-aurora"
aurora_writer_endpoint    = "platform-dev-aurora.cluster-c3ss2q66m8yw.eu-central-1.rds.amazonaws.com"
aurora_database_name      = "clarivum"
aurora_master_username    = "platformadmin"

master_secret_name = "clarivum/platform/dev/database/master"
url_secret_name    = "clarivum/platform/dev/database/url"

ci_secret_reader_principals = []

static_bucket_name = "clarivum-dev-static-869603330574"
media_bucket_name  = "clarivum-dev-media-869603330574"
logs_bucket_name   = "clarivum-dev-cdn-logs-869603330574"

cloudfront_domain_name    = "dev.clarivum.com"
cloudfront_alternate_names = []

route53_zone_name       = "clarivum.com"
route53_create_zone     = true
route53_existing_zone_id = null

budget_amount_usd = 400

tags = {
  Owner      = "platform-team"
  CostCenter = "dev-platform"
}
