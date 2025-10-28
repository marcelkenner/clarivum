output "alb_arn" {
  description = "ARN of the created Application Load Balancer"
  value       = aws_lb.this.arn
}

output "alb_arn_suffix" {
  description = "ARN suffix of the ALB (for CloudWatch metrics)"
  value       = aws_lb.this.arn_suffix
}

output "alb_dns_name" {
  description = "DNS name of the ALB"
  value       = aws_lb.this.dns_name
}

output "alb_zone_id" {
  description = "Hosted zone ID of the ALB"
  value       = aws_lb.this.zone_id
}

output "alb_security_group_id" {
  description = "Security group ID attached to the ALB"
  value       = aws_security_group.alb.id
}

output "target_group_arn" {
  description = "Target group ARN for Strapi service registration"
  value       = aws_lb_target_group.this.arn
}

output "target_group_arn_suffix" {
  description = "ARN suffix of the target group (for CloudWatch metrics)"
  value       = aws_lb_target_group.this.arn_suffix
}

output "target_group_name" {
  description = "Target group name"
  value       = aws_lb_target_group.this.name
}
