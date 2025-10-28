terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

resource "aws_security_group" "alb" {
  name_prefix = "${var.name}-alb-"
  description = "Ingress for ${var.name} ALB"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP redirect to HTTPS"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = var.allowed_ingress_cidrs
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = var.allowed_ingress_cidrs
  }

  egress {
    description = "Allow all egress"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "${var.name}-alb-sg"
  })
}

resource "aws_lb" "this" {
  name                       = "${var.name}-alb"
  internal                   = false
  load_balancer_type         = "application"
  security_groups            = [aws_security_group.alb.id]
  subnets                    = var.public_subnet_ids
  enable_deletion_protection = var.enable_deletion_protection
  idle_timeout               = 60

  access_logs {
    bucket  = var.access_logs_bucket
    enabled = var.access_logs_bucket != null && var.access_logs_bucket != ""
    prefix  = var.access_logs_prefix
  }

  drop_invalid_header_fields = true

  tags = merge(var.tags, {
    Name = "${var.name}-alb"
  })
}

resource "aws_lb_target_group" "this" {
  name                 = "${var.name}-tg"
  port                 = var.target_port
  protocol             = "HTTP"
  protocol_version     = "HTTP1"
  target_type          = "ip"
  vpc_id               = var.vpc_id
  deregistration_delay = 30
  slow_start           = 30

  health_check {
    enabled             = true
    healthy_threshold   = 3
    unhealthy_threshold = 2
    interval            = 30
    timeout             = 5
    matcher             = var.health_check_matcher
    path                = var.health_check_path
    protocol            = "HTTP"
  }

  tags = merge(var.tags, {
    Name = "${var.name}-tg"
  })
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.this.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = var.ssl_policy
  certificate_arn   = var.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.this.arn
  }
}

resource "aws_lb_listener" "http_redirect" {
  count             = var.enable_http_redirect ? 1 : 0
  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      host        = "#{host}"
      path        = "/#{path}"
      port        = "443"
      protocol    = "HTTPS"
      query       = "#{query}"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_route53_record" "this" {
  count   = var.create_dns_record ? 1 : 0
  name    = var.domain_name
  type    = "A"
  zone_id = var.route53_zone_id

  alias {
    evaluate_target_health = true
    name                   = aws_lb.this.dns_name
    zone_id                = aws_lb.this.zone_id
  }
}
