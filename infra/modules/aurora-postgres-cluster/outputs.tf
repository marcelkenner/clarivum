locals {
  connection_uri = format(
    "postgresql://%s:%s@%s:%d/%s",
    var.master_username,
    urlencode(local.master_password),
    aws_rds_cluster.this.endpoint,
    aws_rds_cluster.this.port,
    var.database_name,
  )
}

output "cluster_arn" {
  description = "ARN of the Aurora cluster"
  value       = aws_rds_cluster.this.arn
}

output "cluster_id" {
  description = "Identifier of the Aurora cluster"
  value       = aws_rds_cluster.this.id
}

output "writer_endpoint" {
  description = "Writer endpoint for read/write connections"
  value       = aws_rds_cluster.this.endpoint
}

output "reader_endpoint" {
  description = "Reader endpoint for load-balanced read replicas"
  value       = aws_rds_cluster.this.reader_endpoint
}

output "port" {
  description = "Database port"
  value       = aws_rds_cluster.this.port
}

output "database_name" {
  description = "Primary database name"
  value       = var.database_name
}

output "master_username" {
  description = "Master database username"
  value       = var.master_username
}

output "master_password" {
  description = "Master database password"
  value       = local.master_password
  sensitive   = true
}

output "connection_uri" {
  description = "Connection string (postgresql URI) for the writer endpoint"
  value       = local.connection_uri
  sensitive   = true
}

output "db_subnet_group_name" {
  description = "Name of the DB subnet group"
  value       = aws_db_subnet_group.this.name
}
