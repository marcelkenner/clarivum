locals {
  base_tags = merge(var.tags, {
    Name = var.name
  })
}

resource "aws_security_group" "alb" {
  name        = "${var.name}-alb-sg"
  description = "Public ALB ingress"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = var.alb_ingress_cidrs
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = var.alb_ingress_cidrs
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.base_tags, {
    Name       = "${var.name}-alb-sg"
    Component  = "edge"
    Layer      = "public"
  })
}

resource "aws_security_group" "app" {
  name        = "${var.name}-app-sg"
  description = "Internal application runtime"
  vpc_id      = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.base_tags, {
    Name      = "${var.name}-app-sg"
    Component = "app"
    Layer     = "internal"
  })
}

resource "aws_security_group_rule" "alb_to_app" {
  type                     = "ingress"
  description              = "Allow ALB to application service"
  from_port                = var.app_port
  to_port                  = var.app_port
  protocol                 = "tcp"
  security_group_id        = aws_security_group.app.id
  source_security_group_id = aws_security_group.alb.id
}

resource "aws_security_group" "lambda" {
  name        = "${var.name}-lambda-sg"
  description = "Lambda runtime outbound access"
  vpc_id      = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = var.lambda_egress_cidrs
  }

  tags = merge(local.base_tags, {
    Name      = "${var.name}-lambda-sg"
    Component = "lambda"
    Layer     = "runtime"
  })
}

resource "aws_security_group" "database" {
  name        = "${var.name}-db-sg"
  description = "Aurora access controls"
  vpc_id      = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.base_tags, {
    Name      = "${var.name}-db-sg"
    Component = "data"
    Layer     = "storage"
  })
}

resource "aws_security_group_rule" "lambda_to_db" {
  type                     = "ingress"
  description              = "Lambda to Aurora"
  from_port                = var.database_port
  to_port                  = var.database_port
  protocol                 = "tcp"
  security_group_id        = aws_security_group.database.id
  source_security_group_id = aws_security_group.lambda.id
}

resource "aws_security_group_rule" "app_to_db" {
  type                     = "ingress"
  description              = "Application service to Aurora"
  from_port                = var.database_port
  to_port                  = var.database_port
  protocol                 = "tcp"
  security_group_id        = aws_security_group.database.id
  source_security_group_id = aws_security_group.app.id
}
