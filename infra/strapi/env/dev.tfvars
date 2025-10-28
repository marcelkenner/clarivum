region                    = "eu-central-1"
environment               = "dev"
vpc_id                    = "vpc-xxxxxxxx"
public_subnet_ids         = ["subnet-public-a", "subnet-public-b", "subnet-public-c"]
private_subnet_ids        = ["subnet-private-a", "subnet-private-b", "subnet-private-c"]
route53_zone_id           = "ZXXXXXXXXXXXXX"
domain_name               = "cms-dev"
acm_certificate_arn       = "arn:aws:acm:eu-central-1:123456789012:certificate/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
container_image           = "123456789012.dkr.ecr.eu-central-1.amazonaws.com/clarivum/strapi:dev"
environment_variables     = {
  NODE_ENV = "production"
}
secret_environment_variables = {
  APP_KEYS              = "arn:aws:secretsmanager:eu-central-1:123456789012:secret:clarivum/strapi/dev/app-keys-xxxx"
  ADMIN_JWT_SECRET      = "arn:aws:secretsmanager:eu-central-1:123456789012:secret:clarivum/strapi/dev/admin-jwt-xxxx"
  API_TOKEN_SALT        = "arn:aws:secretsmanager:eu-central-1:123456789012:secret:clarivum/strapi/dev/api-token-xxxx"
  TRANSFER_TOKEN_SALT   = "arn:aws:secretsmanager:eu-central-1:123456789012:secret:clarivum/strapi/dev/transfer-token-xxxx"
  JWT_SECRET            = "arn:aws:secretsmanager:eu-central-1:123456789012:secret:clarivum/strapi/dev/jwt-xxxx"
  GRAFANA_OTLP_PASSWORD = "arn:aws:secretsmanager:eu-central-1:123456789012:secret:clarivum/observability/grafana/basic-auth-xxxx"
}
alarm_action_arns = [
  "arn:aws:sns:eu-central-1:123456789012:clarivum-oncall"
]
tags = {
  Owner      = "platform"
  CostCenter = "clarivum-platform"
}
