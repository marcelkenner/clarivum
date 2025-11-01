locals {
  hosted_zone_id = var.create_zone ? aws_route53_zone.this[0].zone_id : var.existing_zone_id
}

resource "aws_route53_zone" "this" {
  count = var.create_zone ? 1 : 0

  name = var.zone_name
  tags = var.tags
}

resource "aws_route53_record" "aliases" {
  for_each = { for alias in var.aliases : alias.name => alias }

  zone_id         = local.hosted_zone_id
  name            = each.value.name
  type            = "A"
  allow_overwrite = true

  alias {
    name                   = var.cloudfront_domain_name
    zone_id                = var.cloudfront_hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "additional" {
  for_each = { for record in var.additional_records : "${record.name}_${record.type}" => record }

  zone_id         = local.hosted_zone_id
  name            = each.value.name == "@" ? var.zone_name : each.value.name
  type            = each.value.type
  ttl             = each.value.ttl
  records         = each.value.records
  allow_overwrite = true
}
