environment        = "dev"
network_cidr_block = "10.20.0.0/16"
nat_gateway_az     = "eu-central-1a"
service_name       = "platform"
aws_region         = "eu-central-1"

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

dynamodb_table_name                    = "platform-dev-kv"
dynamodb_kms_key_arn                   = "arn:aws:kms:eu-central-1:869603330574:key/f0172bb9-9e32-467d-a992-07aff4366b85"
dynamodb_manage_server_side_encryption = false

aurora_cluster_identifier = "platform-dev-aurora"
aurora_cluster_arn        = "arn:aws:rds:eu-central-1:869603330574:cluster:platform-dev-aurora"
aurora_writer_endpoint    = "platform-dev-aurora.cluster-c3ss2q66m8yw.eu-central-1.rds.amazonaws.com"
aurora_database_name      = "clarivum"
aurora_master_username    = "platformadmin"

master_secret_name           = "clarivum/platform/dev/database/master"
url_secret_name              = "clarivum/platform/dev/database/url"
secrets_rotation_app_version = "1.1.622"

ci_secret_reader_principals = []

lambda_architectures = ["x86_64"]

static_bucket_name                   = "clarivum-dev-static-869603330574"
media_bucket_name                    = "clarivum-dev-media-869603330574"
cache_bucket_name                    = "clarivum-dev-cache-869603330574"
logs_bucket_name                     = "clarivum-dev-cdn-logs-869603330574"
storage_enable_bucket_owner_enforced = false

cloudfront_domain_name            = "dev.clarivum.com"
cloudfront_alternate_names        = []
cloudfront_static_cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"

route53_zone_name        = "clarivum.com"
route53_create_zone      = true
route53_existing_zone_id = null

cache_data_storage_max_gb      = 4
cache_ecpu_per_second_maximum  = 1000
cache_snapshot_retention_limit = 0

route53_additional_records = [
  {
    name    = "_domainconnect"
    type    = "CNAME"
    ttl     = 14400
    records = ["_domainconnect.domains.squarespace.com"]
  },
  {
    name    = "_domainkey"
    type    = "TXT"
    ttl     = 14400
    records = ["v=DKIM1; p="]
  },
  {
    name    = "_dmarc"
    type    = "TXT"
    ttl     = 14400
    records = ["v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s"]
  },
  {
    name    = "@"
    type    = "TXT"
    ttl     = 14400
    records = ["v=spf1 -all"]
  }
]

cost_controls_existing_monitor_arn = "arn:aws:ce::869603330574:anomalymonitor/f4348828-e0fa-4275-bcbe-cf36fe436047"
anomaly_subscription_frequency     = "IMMEDIATE"
secrets_manager_endpoint           = "https://secretsmanager.eu-central-1.amazonaws.com"

budget_amount_usd = 400

tags = {
  Owner      = "platform-team"
  CostCenter = "dev-platform"
}
