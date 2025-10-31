locals {
  domain_aliases = concat([var.domain_name], var.alternate_domain_names)
}

resource "aws_cloudfront_distribution" "primary" {
  enabled             = true
  comment             = var.name
  price_class         = var.price_class
  default_root_object = "index.html"
  web_acl_id          = aws_wafv2_web_acl.this.arn

  aliases = local.domain_aliases

  origin {
    domain_name = var.static_bucket_domain_name
    origin_id   = "s3-static"

    origin_access_control_id = aws_cloudfront_origin_access_control.static.id
  }

  origin {
    domain_name = var.api_domain_name
    origin_id   = "http-api"
    origin_path = var.api_origin_path

    custom_origin_config {
      origin_protocol_policy = var.api_origin_protocol_policy
      http_port              = 80
      https_port             = 443
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    target_origin_id       = "s3-static"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    cache_policy_id        = var.static_cache_policy_id
    response_headers_policy_id = var.response_headers_policy_id
  }

  ordered_cache_behavior {
    path_pattern           = "api/*"
    target_origin_id       = "http-api"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    cache_policy_id        = var.api_cache_policy_id
    origin_request_policy_id = var.api_origin_request_policy_id
    response_headers_policy_id = var.response_headers_policy_id
  }

  custom_error_response {
    error_code            = 403
    response_page_path    = "/403.html"
    response_code         = 403
    error_caching_min_ttl = 60
  }

  logging_config {
    bucket          = "${var.logs_bucket_name}.s3.amazonaws.com"
    include_cookies = false
    prefix          = "cloudfront/"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn            = aws_acm_certificate_validation.this.certificate_arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2021"
    cloudfront_default_certificate = false
  }

  tags = var.tags
}
