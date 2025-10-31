output "vpc_id" {
  description = "Identifier of the VPC."
  value       = aws_vpc.this.id
}

output "public_subnet_ids" {
  description = "Map of public subnet IDs keyed by availability zone."
  value = {
    for az, subnet in aws_subnet.public : az => subnet.id
  }
}

output "private_subnet_ids" {
  description = "Map of private subnet IDs keyed by availability zone."
  value = {
    for az, subnet in aws_subnet.private : az => subnet.id
  }
}

output "nat_gateway_id" {
  description = "Identifier of the managed NAT gateway."
  value       = aws_nat_gateway.this.id
}

output "route_table_public_id" {
  description = "Identifier of the public route table."
  value       = aws_route_table.public.id
}

output "route_table_private_id" {
  description = "Identifier of the private route table."
  value       = aws_route_table.private.id
}

output "flow_logs_log_group_name" {
  description = "CloudWatch log group name used by VPC flow logs."
  value       = local.flow_logs_enabled ? aws_cloudwatch_log_group.flow_logs[0].name : null
}
