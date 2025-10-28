output "service_name" {
  description = "ECS service name"
  value       = aws_ecs_service.this.name
}

output "service_security_group_id" {
  description = "Security group ID for ECS tasks"
  value       = aws_security_group.service.id
}

output "log_group_name" {
  description = "CloudWatch log group name"
  value       = aws_cloudwatch_log_group.this.name
}

output "task_definition_arn" {
  description = "ECS task definition ARN"
  value       = aws_ecs_task_definition.this.arn
}

output "autoscaling_target_id" {
  description = "App autoscaling resource ID"
  value       = aws_appautoscaling_target.this.resource_id
}
