resource "aws_dynamodb_table" "kv" {
  name         = var.table_name
  billing_mode = "PAY_PER_REQUEST"

  hash_key  = "pk"
  range_key = "sk"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = var.kms_master_key_arn
  }

  time_to_live {
    attribute_name = var.ttl_attribute
    enabled        = true
  }

  tags = merge(var.tags, {
    Name = var.table_name
  })
}
