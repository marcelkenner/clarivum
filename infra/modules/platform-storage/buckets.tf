locals {
  base_tags = var.tags
}

resource "aws_s3_bucket" "static" {
  bucket = var.static_bucket_name
  tags   = merge(local.base_tags, { Name = var.static_bucket_name })
}

resource "aws_s3_bucket_versioning" "static" {
  bucket = aws_s3_bucket.static.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "static" {
  bucket = aws_s3_bucket.static.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = var.kms_master_key_id
    }
  }
}

resource "aws_s3_bucket_public_access_block" "static" {
  bucket = aws_s3_bucket.static.id

  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "static" {
  count = var.enable_bucket_owner_enforced ? 1 : 0

  bucket = aws_s3_bucket.static.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_logging" "static" {
  bucket        = aws_s3_bucket.static.id
  target_bucket = aws_s3_bucket.logs.id
  target_prefix = "static/"
}

resource "aws_s3_bucket" "media" {
  bucket = var.media_bucket_name
  tags   = merge(local.base_tags, { Name = var.media_bucket_name })
}

resource "aws_s3_bucket_versioning" "media" {
  bucket = aws_s3_bucket.media.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "media" {
  bucket = aws_s3_bucket.media.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = var.kms_master_key_id
    }
  }
}

resource "aws_s3_bucket_public_access_block" "media" {
  bucket = aws_s3_bucket.media.id

  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "media" {
  count = var.enable_bucket_owner_enforced ? 1 : 0

  bucket = aws_s3_bucket.media.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket" "logs" {
  bucket = var.logs_bucket_name
  tags   = merge(local.base_tags, { Name = var.logs_bucket_name })
}

resource "aws_s3_bucket_versioning" "logs" {
  bucket = aws_s3_bucket.logs.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "logs" {
  bucket = aws_s3_bucket.logs.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = var.kms_master_key_id
    }
  }
}

resource "aws_s3_bucket_public_access_block" "logs" {
  bucket = aws_s3_bucket.logs.id

  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "logs" {
  count = var.enable_bucket_owner_enforced ? 1 : 0

  bucket = aws_s3_bucket.logs.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_ownership_controls" "logs_custom" {
  count = !var.enable_bucket_owner_enforced && var.logs_bucket_object_ownership != null ? 1 : 0

  bucket = aws_s3_bucket.logs.id

  rule {
    object_ownership = var.logs_bucket_object_ownership
  }
}

resource "aws_s3_bucket" "cache" {
  bucket = var.cache_bucket_name
  tags   = merge(local.base_tags, { Name = var.cache_bucket_name })
}

resource "aws_s3_bucket_versioning" "cache" {
  bucket = aws_s3_bucket.cache.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "cache" {
  bucket = aws_s3_bucket.cache.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = var.kms_master_key_id
    }
  }
}

resource "aws_s3_bucket_public_access_block" "cache" {
  bucket = aws_s3_bucket.cache.id

  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "cache" {
  count = var.enable_bucket_owner_enforced ? 1 : 0

  bucket = aws_s3_bucket.cache.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}
