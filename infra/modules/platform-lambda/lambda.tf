data "archive_file" "stub" {
  type        = "zip"
  output_path = "${path.module}/.generated/${var.function_name}-stub.zip"

  source {
    content  = <<-EOF
      "use strict";

      exports.handler = async () => ({
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: "Clarivum runtime placeholder",
          timestamp: new Date().toISOString()
        })
      });
    EOF
    filename = "index.js"
  }
}

resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${var.function_name}"
  retention_in_days = var.log_retention_days

  tags = merge(var.tags, {
    Name = "/aws/lambda/${var.function_name}"
  })
}

resource "aws_lambda_function" "core" {
  function_name = var.function_name
  description   = var.description
  role          = aws_iam_role.core.arn
  runtime       = var.runtime
  handler       = var.handler
  architectures = var.architectures
  memory_size   = var.memory_size
  timeout       = var.timeout
  layers        = var.layers

  filename         = data.archive_file.stub.output_path
  source_code_hash = data.archive_file.stub.output_base64sha256

  ephemeral_storage {
    size = var.ephemeral_storage_size
  }

  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }

  environment {
    variables = var.environment_variables
  }

  dynamic "dead_letter_config" {
    for_each = []
    content {}
  }

  reserved_concurrent_executions = var.reserved_concurrency

  tags = merge(var.tags, {
    Name = var.function_name
  })

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash
    ]
  }
}
