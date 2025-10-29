terraform {
  required_version = ">= 1.6.0"

  required_providers {
    supabase = {
      source  = "supabase/supabase"
      version = ">= 0.11.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = ">= 3.5.1"
    }
    http = {
      source  = "hashicorp/http"
      version = ">= 3.4.1"
    }
    time = {
      source  = "hashicorp/time"
      version = ">= 0.9.1"
    }
  }
}

provider "supabase" {
  access_token = var.supabase_access_token
}

provider "aws" {
  region = var.aws_region
}

data "http" "organizations" {
  count = var.supabase_organization_id_override == "" ? 1 : 0

  url = "https://api.supabase.com/v1/organizations"

  request_headers = {
    Authorization = "Bearer ${var.supabase_access_token}"
    Accept        = "application/json"
  }
}

locals {
  tags = merge(
    {
      Environment = var.environment
      Service     = "supabase"
      ManagedBy   = "terraform"
      Repository  = "clarivum"
    },
    var.project_tags
  )

  secret_tags = merge(
    {
      Environment = var.environment
      Service     = "supabase"
      ManagedBy   = "terraform"
      Repository  = "clarivum"
    },
    var.secret_tags
  )

  organization_lookup_enabled = var.supabase_organization_id_override == ""
  organizations_response_body = local.organization_lookup_enabled ? data.http.organizations[0].response_body : "[]"
  organizations               = local.organization_lookup_enabled ? jsondecode(local.organizations_response_body) : []
  organization_from_slug = local.organization_lookup_enabled ? try(
    one([
      for organization in local.organizations : organization
      if try(organization.slug, "") == var.supabase_organization_slug
    ]),
    null,
  ) : null
  supabase_organization_id = local.organization_lookup_enabled ? (
    local.organization_from_slug != null ? local.organization_from_slug.id : error("Supabase organization slug '${var.supabase_organization_slug}' not found for supplied access token")
  ) : var.supabase_organization_id_override
}

module "project" {
  source = "../modules/supabase-project"

  providers = {
    supabase = supabase
  }

  name                          = "clarivum-${var.environment}"
  organization_id               = local.supabase_organization_id
  region                        = var.supabase_region
  plan                          = var.supabase_plan
  management_access_token       = var.supabase_access_token
  project_tags                  = local.tags
  enable_point_in_time_recovery = true
  db_version                    = "16"
}

module "storage_buckets" {
  for_each = var.storage_buckets

  source = "../modules/supabase-storage-bucket"

  providers = {
    supabase = supabase
  }

  project_ref        = module.project.project_ref
  name               = each.key
  public             = each.value.public
  file_size_limit    = lookup(each.value, "file_size_limit", 0)
  allowed_mime_types = lookup(each.value, "allowed_mime_types", [])
}

locals {
  supabase_url      = module.project.supabase_url
  project_ref       = module.project.project_ref
  database_url      = module.project.database_url
  database_password = module.project.database_password
}

locals {
  secret_values = {
    "clarivum/supabase/${var.environment}/anon_key"             = module.project.anon_key
    "clarivum/supabase/${var.environment}/service_role"         = module.project.service_role_key
    "clarivum/supabase/${var.environment}/db_url"               = local.database_url
    "clarivum/supabase/${var.environment}/db_password"          = local.database_password
    "clarivum/supabase/${var.environment}/url"                  = local.supabase_url
    "clarivum/supabase/${var.environment}/project_ref"          = local.project_ref
    "clarivum/supabase/${var.environment}/next_public_url"      = local.supabase_url
    "clarivum/supabase/${var.environment}/next_public_anon_key" = module.project.anon_key
  }
}

resource "aws_secretsmanager_secret" "supabase" {
  for_each = local.secret_values

  name                    = each.key
  recovery_window_in_days = var.secret_recovery_window_days

  tags = merge(local.secret_tags, {
    Name = replace(each.key, "/", "-")
  })
}

resource "aws_secretsmanager_secret_version" "supabase" {
  for_each = local.secret_values

  secret_id     = aws_secretsmanager_secret.supabase[each.key].id
  secret_string = each.value

  lifecycle {
    ignore_changes = [secret_string]
  }
}
