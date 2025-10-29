terraform {
  required_providers {
    supabase = {
      source  = "supabase/supabase"
      version = ">= 0.11.0"
    }
  }
}

resource "supabase_storage_bucket" "this" {
  project_ref = var.project_ref
  name        = var.name
  public      = var.public

  file_size_limit    = var.file_size_limit
  allowed_mime_types = var.allowed_mime_types
}

output "bucket_id" {
  description = "Identifier of the created storage bucket"
  value       = supabase_storage_bucket.this.id
}
