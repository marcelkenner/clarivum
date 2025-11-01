resource "aws_cloudfront_cache_policy" "static" {
  count = var.static_cache_policy_id == null ? 1 : 0

  name        = "${var.name}-static-cache"
  comment     = "Static asset cache policy managed by Terraform for ${var.name}"
  default_ttl = var.static_cache_policy_default_ttl
  max_ttl     = var.static_cache_policy_max_ttl
  min_ttl     = var.static_cache_policy_min_ttl

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true

    cookies_config {
      cookie_behavior = "none"
    }

    headers_config {
      header_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "none"
    }
  }
}
