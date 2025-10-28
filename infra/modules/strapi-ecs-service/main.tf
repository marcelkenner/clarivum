terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

resource "aws_cloudwatch_log_group" "this" {
  name              = "/aws/ecs/${var.name}"
  retention_in_days = var.log_retention_days
  kms_key_id        = var.log_kms_key_arn

  tags = merge(var.tags, {
    Name = "${var.name}-logs"
  })
}

resource "aws_security_group" "service" {
  name_prefix = "${var.name}-svc-"
  description = "Security group for ${var.name} ECS tasks"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Allow ALB to reach Strapi"
    from_port       = var.container_port
    to_port         = var.container_port
    protocol        = "tcp"
    security_groups = [var.alb_security_group_id]
  }

  egress {
    description = "Allow outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "${var.name}-svc-sg"
  })
}

locals {
  environment_variables = [
    for pair in var.environment_variables : {
      name  = pair.name
      value = pair.value
    }
  ]

  secret_environment_variables = [
    for pair in var.secret_environment_variables : {
      name      = pair.name
      valueFrom = pair.value_from
    }
  ]

  latency_threshold_seconds = var.latency_threshold_ms / 1000

  container_definitions = concat(
    [
      {
        name      = "strapi"
        image     = var.container_image
        essential = true
        cpu       = var.task_cpu
        memory    = var.task_memory
        portMappings = [
          {
            containerPort = var.container_port
            hostPort      = var.container_port
            protocol      = "tcp"
          }
        ]
        environment = local.environment_variables
        secrets     = local.secret_environment_variables
        logConfiguration = {
          logDriver = "awslogs"
          options = {
            awslogs-group         = aws_cloudwatch_log_group.this.name
            awslogs-region        = var.region
            awslogs-stream-prefix = "strapi"
          }
        }
        healthCheck = {
          command     = ["CMD-SHELL", "curl -fsS http://localhost:${var.container_port}${var.container_health_check_path} || exit 1"]
          retries     = 3
          timeout     = 5
          interval    = 30
          startPeriod = 60
        }
      }
    ],
    var.enable_firelens ? [
      {
        name      = "firelens"
        image     = var.firelens_image
        essential = false
        firelensConfiguration = {
          type = "fluentbit"
        }
        logConfiguration = {
          logDriver = "awslogs"
          options = {
            awslogs-group         = aws_cloudwatch_log_group.this.name
            awslogs-region        = var.region
            awslogs-stream-prefix = "firelens"
          }
        }
      }
    ] : []
  )
}

resource "aws_ecs_task_definition" "this" {
  family                   = "${var.name}-task"
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = var.execution_role_arn
  task_role_arn            = var.task_role_arn
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode(local.container_definitions)

  tags = merge(var.tags, {
    Name = "${var.name}-task"
  })
}

resource "aws_ecs_service" "this" {
  name            = "${var.name}-svc"
  cluster         = var.cluster_arn
  task_definition = aws_ecs_task_definition.this.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 50
  health_check_grace_period_seconds  = 60

  enable_execute_command  = true
  propagate_tags          = "SERVICE"
  enable_ecs_managed_tags = true

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.service.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = "strapi"
    container_port   = var.container_port
  }

  lifecycle {
    ignore_changes = [task_definition]
  }

  tags = merge(var.tags, {
    Name = "${var.name}-service"
  })
}

resource "aws_appautoscaling_target" "this" {
  max_capacity       = var.autoscaling_max_capacity
  min_capacity       = var.autoscaling_min_capacity
  resource_id        = "service/${var.cluster_name}/${aws_ecs_service.this.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "cpu_target" {
  name               = "${var.name}-cpu-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.this.resource_id
  scalable_dimension = aws_appautoscaling_target.this.scalable_dimension
  service_namespace  = aws_appautoscaling_target.this.service_namespace

  target_tracking_scaling_policy_configuration {
    target_value       = var.autoscaling_cpu_target
    scale_in_cooldown  = 120
    scale_out_cooldown = 60

    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
  }
}

resource "aws_appautoscaling_policy" "latency_step" {
  name               = "${var.name}-latency-scaleout"
  policy_type        = "StepScaling"
  resource_id        = aws_appautoscaling_target.this.resource_id
  scalable_dimension = aws_appautoscaling_target.this.scalable_dimension
  service_namespace  = aws_appautoscaling_target.this.service_namespace

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 60
    metric_aggregation_type = "Average"

    step_adjustment {
      metric_interval_lower_bound = 0
      scaling_adjustment          = 1
    }
  }
}

resource "aws_cloudwatch_metric_alarm" "latency_high" {
  alarm_name          = "${var.name}-target-response-latency"
  alarm_description   = "Strapi target response time above ${var.latency_threshold_ms} ms"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  datapoints_to_alarm = 2
  threshold           = local.latency_threshold_seconds
  treat_missing_data  = "breaching"
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  statistic           = "Average"
  period              = 60

  dimensions = {
    TargetGroup  = var.target_group_arn_suffix
    LoadBalancer = var.load_balancer_arn_suffix
  }

  alarm_actions = concat(var.alarm_action_arns, [aws_appautoscaling_policy.latency_step.arn])
  ok_actions    = var.alarm_action_arns
}

resource "aws_cloudwatch_metric_alarm" "target_5xx" {
  alarm_name          = "${var.name}-target-5xx"
  alarm_description   = "HTTP 5xx errors detected behind Strapi ALB"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  datapoints_to_alarm = 1
  threshold           = var.target_5xx_threshold
  treat_missing_data  = "notBreaching"
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  statistic           = "Sum"
  period              = 60

  dimensions = {
    TargetGroup  = var.target_group_arn_suffix
    LoadBalancer = var.load_balancer_arn_suffix
  }

  alarm_actions = var.alarm_action_arns
  ok_actions    = var.alarm_action_arns
}
