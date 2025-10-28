region                    = "eu-central-1"
environment               = "prod"
vpc_id                    = "vpc-yyyyyyyy"
public_subnet_ids         = ["subnet-public-a", "subnet-public-b", "subnet-public-c"]
private_subnet_ids        = ["subnet-private-a", "subnet-private-b", "subnet-private-c"]
route53_zone_id           = "ZYYYYYYYYYYYY"
domain_name               = "cms"
acm_certificate_arn       = "arn:aws:acm:eu-central-1:123456789012:certificate/yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy"
container_image           = "123456789012.dkr.ecr.eu-central-1.amazonaws.com/clarivum/strapi:prod"
environment_variables     = {
  NODE_ENV = "production"
}
secret_environment_variables = {
  APP_KEYS              = "arn:aws:secretsmanager:eu-central-1:123456789012:secret:clarivum/strapi/prod/app-keys-yyyy"
  ADMIN_JWT_SECRET      = "arn:aws:secretsmanager:eu-central-1:123456789012:secret:clarivum/strapi/prod/admin-jwt-yyyy"
  API_TOKEN_SALT        = "arn:aws:secretsmanager:eu-central-1:123456789012:secret:clarivum/strapi/prod/api-token-yyyy"
  TRANSFER_TOKEN_SALT   = "arn:aws:secretsmanager:eu-central-1:123456789012:secret:clarivum/strapi/prod/transfer-token-yyyy"
  JWT_SECRET            = "arn:aws:secretsmanager:eu-central-1:123456789012:secret:clarivum/strapi/prod/jwt-yyyy"
  GRAFANA_OTLP_PASSWORD = "arn:aws:secretsmanager:eu-central-1:123456789012:secret:clarivum/observability/grafana/basic-auth-yyyy"
}
alarm_action_arns = [
  "arn:aws:sns:eu-central-1:123456789012:clarivum-oncall"
]
autoscaling_min_capacity = 3
autoscaling_max_capacity = 8
latency_threshold_ms     = 800
target_5xx_threshold     = 1
tags = {
  Owner      = "platform"
  CostCenter = "clarivum-platform"
}
