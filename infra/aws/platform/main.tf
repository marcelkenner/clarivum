data "aws_route53_zone" "existing" {
  count = var.route53_create_zone || var.route53_existing_zone_id != null ? 0 : 1

  name         = var.route53_zone_name
  private_zone = false
}

locals {
  existing_route53_zone_id = var.route53_create_zone ? null : (
    var.route53_existing_zone_id != null ? var.route53_existing_zone_id : data.aws_route53_zone.existing[0].zone_id
  )
}

module "platform_dns" {
  source = "../../modules/platform-dns"

  zone_name                 = var.route53_zone_name
  create_zone               = var.route53_create_zone
  existing_zone_id          = local.existing_route53_zone_id
  cloudfront_domain_name    = ""
  cloudfront_hosted_zone_id = ""
  aliases                   = []
  additional_records        = var.route53_additional_records
  tags                      = merge(local.base_tags, { Component = "dns" })
}

module "platform_network" {
  source = "../../modules/platform-network"

  name            = "${local.name_prefix}-vpc"
  cidr_block      = var.network_cidr_block
  nat_gateway_az  = var.nat_gateway_az
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets
  tags            = merge(local.base_tags, { Component = "network" })
}

module "platform_security_groups" {
  source = "../../modules/platform-security-groups"

  name          = local.name_prefix
  vpc_id        = module.platform_network.vpc_id
  app_port      = 3000
  database_port = var.aurora_port
  tags          = merge(local.base_tags, { Component = "security" })
}

module "platform_storage" {
  source = "../../modules/platform-storage"

  static_bucket_name           = var.static_bucket_name
  media_bucket_name            = var.media_bucket_name
  cache_bucket_name            = var.cache_bucket_name
  logs_bucket_name             = var.logs_bucket_name
  enable_bucket_owner_enforced = var.storage_enable_bucket_owner_enforced
  logs_bucket_object_ownership = var.logs_bucket_object_ownership
  tags                         = merge(local.base_tags, { Component = "storage" })
}

module "platform_data" {
  source = "../../modules/platform-data"

  table_name                    = var.dynamodb_table_name
  kms_master_key_arn            = var.dynamodb_kms_key_arn
  manage_server_side_encryption = var.dynamodb_manage_server_side_encryption
  tags                          = merge(local.base_tags, { Component = "data" })
}

module "platform_cache" {
  source = "../../modules/platform-cache"

  name_prefix             = local.name_prefix
  vpc_id                  = module.platform_network.vpc_id
  subnet_ids              = values(module.platform_network.private_subnet_ids)
  lambda_security_group_id = module.platform_security_groups.lambda_security_group_id
  engine                  = var.cache_engine
  major_engine_version    = var.cache_major_engine_version
  description             = var.cache_description
  daily_snapshot_time     = var.cache_daily_snapshot_time
  snapshot_retention_limit = var.cache_snapshot_retention_limit
  kms_key_id              = var.cache_kms_key_id
  data_storage_maximum_gb = var.cache_data_storage_max_gb
  ecpu_per_second_maximum = var.cache_ecpu_per_second_maximum
  tags                    = merge(local.base_tags, { Component = "cache" })
}

module "platform_secrets" {
  source = "../../modules/platform-secrets"

  master_secret_name           = var.master_secret_name
  url_secret_name              = var.url_secret_name
  rotation_subnet_ids          = values(module.platform_network.private_subnet_ids)
  rotation_security_group_ids  = [module.platform_security_groups.lambda_security_group_id]
  aurora_cluster_arn           = var.aurora_cluster_arn
  aurora_secret_username       = var.aurora_master_username
  aurora_database_name         = var.aurora_database_name
  aurora_port                  = var.aurora_port
  aurora_host                  = var.aurora_writer_endpoint
  ci_secret_reader_principals  = var.ci_secret_reader_principals
  rotation_schedule_expression = "rate(30 days)"
  rotation_app_version         = var.secrets_rotation_app_version
  secrets_manager_endpoint     = var.secrets_manager_endpoint
  tags                         = merge(local.base_tags, { Component = "secrets" })
}

locals {
  lambda_env = merge(
    {
      DATABASE_SECRET_ARN     = module.platform_secrets.master_secret_arn
      DATABASE_URL_SECRET_ARN = module.platform_secrets.url_secret_arn
      DATABASE_NAME           = var.aurora_database_name
      DYNAMODB_TABLE_NAME     = module.platform_data.table_name
      CLARIVUM_ENVIRONMENT    = var.environment
      UV_WIDGET_CACHE_ENDPOINT = module.platform_cache.cache_endpoint
      UV_WIDGET_CACHE_PORT     = "6379"
      UV_WIDGET_CACHE_USE_TLS  = "true"
      UV_WIDGET_CACHE_MODE     = "redis"
      UV_WIDGET_RATE_LIMIT_MODE = "redis"
    },
    var.lambda_environment_variables
  )
}

module "platform_lambda" {
  source = "../../modules/platform-lambda"

  function_name        = "${local.name_prefix}-core"
  description          = "Clarivum Next.js runtime for ${var.environment}"
  runtime              = var.lambda_runtime
  architectures        = var.lambda_architectures
  handler              = var.lambda_handler
  memory_size          = var.lambda_memory_size
  timeout              = var.lambda_timeout
  reserved_concurrency = var.lambda_reserved_concurrency
  layers               = var.lambda_layers
  subnet_ids           = values(module.platform_network.private_subnet_ids)
  security_group_ids   = [module.platform_security_groups.lambda_security_group_id]
  dynamodb_table_arn   = module.platform_data.table_arn
  secrets_allowed_arns = [
    module.platform_secrets.master_secret_arn,
    module.platform_secrets.url_secret_arn
  ]
  environment_variables = local.lambda_env
  tags                  = merge(local.base_tags, { Component = "lambda" })
}

module "platform_api" {
  source = "../../modules/platform-api"

  name                = "${local.name_prefix}-http"
  lambda_function_arn = module.platform_lambda.function_arn
  lambda_invoke_arn   = module.platform_lambda.invoke_arn
  tags                = merge(local.base_tags, { Component = "api" })
}

module "platform_cloudfront" {
  source = "../../modules/platform-cloudfront"

  providers = {
    aws           = aws
    aws.us_east_1 = aws.us_east_1
  }

  name                      = "${local.name_prefix}-cdn"
  domain_name               = var.cloudfront_domain_name
  alternate_domain_names    = var.cloudfront_alternate_names
  static_bucket_domain_name = module.platform_storage.static_bucket_domain_name
  api_domain_name           = format("%s.execute-api.%s.amazonaws.com", module.platform_api.api_id, var.aws_region)
  logs_bucket_name          = module.platform_storage.logs_bucket_id
  route53_zone_id           = module.platform_dns.zone_id
  blocked_countries         = var.blocked_countries
  waf_rate_limit            = var.waf_rate_limit
  static_cache_policy_id    = var.cloudfront_static_cache_policy_id
  tags                      = merge(local.base_tags, { Component = "edge" })
}

resource "aws_route53_record" "cloudfront_aliases" {
  for_each = toset(concat([var.cloudfront_domain_name], var.cloudfront_alternate_names))

  zone_id = module.platform_dns.zone_id
  name    = each.value
  type    = "A"

  alias {
    name                   = module.platform_cloudfront.distribution_domain_name
    zone_id                = module.platform_cloudfront.hosted_zone_id
    evaluate_target_health = false
  }
}

module "platform_observability" {
  source = "../../modules/platform-observability"

  providers = {
    aws           = aws
    aws.us_east_1 = aws.us_east_1
  }

  name_prefix                = local.name_prefix
  lambda_function_name       = module.platform_lambda.function_name
  lambda_function_arn        = module.platform_lambda.function_arn
  api_id                     = module.platform_api.api_id
  aurora_cluster_identifier  = var.aurora_cluster_identifier
  dynamodb_table_name        = module.platform_data.table_name
  cloudfront_distribution_id = module.platform_cloudfront.distribution_id
  sns_incident_subscriptions = var.sns_incident_subscriptions
  sns_finops_subscriptions   = var.sns_finops_subscriptions
  tags                       = merge(local.base_tags, { Component = "observability" })
}

module "platform_cost_controls" {
  source = "../../modules/platform-cost-controls"

  providers = {
    aws    = aws
    aws.ce = aws.ce
  }

  name_prefix                    = local.name_prefix
  budget_amount                  = var.budget_amount_usd
  budget_thresholds              = var.budget_thresholds
  notification_topic_arn         = module.platform_observability.finops_topic_arn
  existing_monitor_arn           = var.cost_controls_existing_monitor_arn
  anomaly_absolute_threshold     = var.anomaly_absolute_threshold_usd
  anomaly_subscription_frequency = var.anomaly_subscription_frequency
  tags                           = merge(local.base_tags, { Component = "finops" })
}
