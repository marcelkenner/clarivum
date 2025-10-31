output "zone_id" {
  description = "Hosted zone ID."
  value       = local.hosted_zone_id
}

output "name_servers" {
  description = "Name servers for the hosted zone (if managed here)."
  value       = var.create_zone ? aws_route53_zone.this[0].name_servers : []
}
