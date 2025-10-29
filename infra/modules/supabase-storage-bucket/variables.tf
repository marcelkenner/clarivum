variable "project_ref" {
  description = "Supabase project reference the bucket belongs to"
  type        = string
}

variable "name" {
  description = "Storage bucket name"
  type        = string
}

variable "public" {
  description = "Whether the bucket is publicly readable"
  type        = bool
  default     = false
}

variable "file_size_limit" {
  description = "Maximum allowed object size in bytes (0 disables the limit)"
  type        = number
  default     = 0
}

variable "allowed_mime_types" {
  description = "Optional allowlist of MIME types"
  type        = list(string)
  default     = []
}
