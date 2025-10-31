output "distribution_id" {
  description = "CloudFront distribution ID."
  value       = aws_cloudfront_distribution.primary.id
}

output "distribution_domain_name" {
  description = "Domain name assigned by CloudFront."
  value       = aws_cloudfront_distribution.primary.domain_name
}

output "hosted_zone_id" {
  description = "Hosted zone ID for alias records."
  value       = aws_cloudfront_distribution.primary.hosted_zone_id
}

output "certificate_arn" {
  description = "ARN of the ACM certificate in us-east-1."
  value       = aws_acm_certificate.this.arn
}

output "waf_arn" {
  description = "ARN of the associated WAF web ACL."
  value       = aws_wafv2_web_acl.this.arn
}
