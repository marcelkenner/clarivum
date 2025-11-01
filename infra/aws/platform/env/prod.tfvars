environment        = "prod"
network_cidr_block = "10.30.0.0/16"
nat_gateway_az     = "eu-central-1a"
service_name       = "platform"
aws_region         = "eu-central-1"

public_subnets = {
  "eu-central-1a" = {
    cidr_block = "10.30.1.0/24"
    az         = "eu-central-1a"
  }
  "eu-central-1b" = {
    cidr_block = "10.30.2.0/24"
    az         = "eu-central-1b"
  }
}

private_subnets = {
  "eu-central-1a" = {
    cidr_block = "10.30.11.0/24"
    az         = "eu-central-1a"
  }
  "eu-central-1b" = {
    cidr_block = "10.30.12.0/24"
    az         = "eu-central-1b"
  }
}

dynamodb_table_name          = "platform-prod-kv"
dynamodb_kms_key_arn         = "arn:aws:kms:eu-central-1:869603330574:key/f0f8eae9-5742-480a-9160-185d7df17bf0"
dynamodb_manage_server_side_encryption = false

aurora_cluster_identifier = "platform-prod-aurora"
aurora_cluster_arn        = "arn:aws:rds:eu-central-1:869603330574:cluster:platform-prod-aurora"
aurora_writer_endpoint    = "platform-prod-aurora.cluster-c3ss2q66m8yw.eu-central-1.rds.amazonaws.com"
aurora_database_name      = "clarivum"
aurora_master_username    = "platformadmin"

master_secret_name           = "clarivum/platform/prod/database/master"
url_secret_name              = "clarivum/platform/prod/database/url"
secrets_rotation_app_version = "1.1.622"

ci_secret_reader_principals = []

lambda_architectures = ["x86_64"]

static_bucket_name                   = "clarivum-prod-static-869603330574"
media_bucket_name                    = "clarivum-prod-media-869603330574"
cache_bucket_name                    = "clarivum-prod-cache-869603330574"
logs_bucket_name                     = "clarivum-prod-cdn-logs-869603330574"
storage_enable_bucket_owner_enforced = false
logs_bucket_object_ownership         = "ObjectWriter"

cloudfront_domain_name            = "clarivum.com"
cloudfront_alternate_names        = ["www.clarivum.com"]
cloudfront_static_cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"

route53_zone_name        = "clarivum.com"
route53_create_zone      = false
route53_existing_zone_id = "Z08138481U72OSFRKQ9G7"
route53_additional_records = []

cache_data_storage_max_gb      = 8
cache_ecpu_per_second_maximum  = 2000
cache_snapshot_retention_limit = 0

cost_controls_existing_monitor_arn = "arn:aws:ce::869603330574:anomalymonitor/f4348828-e0fa-4275-bcbe-cf36fe436047"
anomaly_subscription_frequency     = "IMMEDIATE"
secrets_manager_endpoint           = "https://secretsmanager.eu-central-1.amazonaws.com"

budget_amount_usd = 1000
budget_thresholds = [60, 90, 110]

tags = {
  Owner      = "platform-team"
  CostCenter = "prod-platform"
}
