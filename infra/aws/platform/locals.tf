locals {
  base_tags = merge(
    {
      Environment = var.environment
      Service     = var.service_name
      ManagedBy   = "terraform"
      Repository  = "clarivum"
    },
    var.tags,
  )

  name_prefix = "${var.service_name}-${var.environment}"
}
