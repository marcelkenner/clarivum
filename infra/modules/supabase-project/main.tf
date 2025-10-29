terraform {
  required_providers {
    supabase = {
      source  = "supabase/supabase"
      version = ">= 0.11.0"
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

locals {
  db_password = var.database_password != null ? var.database_password : random_password.generated.result
}

resource "random_password" "generated" {
  length           = 32
  special          = true
  override_special = "!#$%&()*+-_=."

  keepers = {
    project_name = var.name
  }
}

resource "supabase_project" "this" {
  organization_id = var.organization_id
  name            = var.name
  region          = var.region
  plan            = var.plan
  db_password     = local.db_password
  db_version      = var.db_version

  enable_pitr = var.enable_point_in_time_recovery

  tags = var.project_tags
}

resource "time_sleep" "await_api" {
  create_duration = "30s"

  depends_on = [supabase_project.this]
}

locals {
  project_ref  = supabase_project.this.project_ref
  api_base     = "https://api.supabase.com/v1/projects/${local.project_ref}"
  supabase_url = "https://${local.project_ref}.supabase.co"
  database_url = "postgresql://postgres:${urlencode(local.db_password)}@db.${local.project_ref}.supabase.co:6543/postgres"
}

data "http" "api_keys" {
  url = "${local.api_base}/api-keys"

  request_headers = {
    Authorization = "Bearer ${var.management_access_token}"
    Accept        = "application/json"
    Content-Type  = "application/json"
  }

  # Supabase may take a short amount of time to generate API keys after project creation.
  depends_on = [time_sleep.await_api]
}

locals {
  decoded_api_keys = try(jsondecode(data.http.api_keys.response_body), [])

  anon_key = one([
    for key in local.decoded_api_keys : key.api_key
    if contains(compact([try(key.name, ""), try(key.role, "")]), "anon")
  ])

  service_role_key = one([
    for key in local.decoded_api_keys : key.api_key
    if contains(compact([try(key.name, ""), try(key.role, "")]), "service_role")
  ])
}
