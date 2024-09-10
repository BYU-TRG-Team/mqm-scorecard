# ECS Cluster
resource "aws_ecs_cluster" "mqm_scorecard_cluster" {
  name = "mqm-scorecard-cluster"

  tags = {
    Name = "MQM Scorecard ECS Cluster"
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "mqm_scorecard_task" {
  family                   = "mqm-scorecard-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name  = "mqm-scorecard-container"
      image = "your-docker-image-url:latest"
      portMappings = [
        {
          containerPort = 8081
          hostPort      = 8081
        }
      ]
      environment = [
        {
          name  = "DB_HOST"
          value = aws_db_instance.default.endpoint
        },
        {
          name  = "DB_NAME"
          value = aws_db_instance.default.db_name
        },
        {
          name  = "DB_USER"
          value = aws_db_instance.default.username
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs_log_group.name
          awslogs-region        = "us-west-2"
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])

  execution_role_arn = aws_iam_role.ecs_execution_role.arn
  task_role_arn      = aws_iam_role.ecs_task_role.arn
}

# ECS Service
resource "aws_ecs_service" "mqm_scorecard_service" {
  name            = "mqm-scorecard-service"
  cluster         = aws_ecs_cluster.mqm_scorecard_cluster.id
  task_definition = aws_ecs_task_definition.mqm_scorecard_task.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets          = [aws_subnet.subnet_a.id, aws_subnet.subnet_b.id]
    assign_public_ip = true
    security_groups  = [aws_security_group.ecs_tasks.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app_tg.arn
    container_name   = "mqm-scorecard-container"
    container_port   = 8081
  }
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.mqm_scorecard_cluster.name
}

resource "aws_appautoscaling_target" "ecs_service" {
  max_capacity       = 1
  min_capacity       = 1
  resource_id        = "service/${aws_ecs_cluster.mqm_scorecard_cluster.name}/${aws_ecs_service.mqm_scorecard_service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "scale_up" {
  name               = "scale-up"
  resource_id        = aws_appautoscaling_target.ecs_service.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_service.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_service.service_namespace
  policy_type        = "StepScaling"

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 60
    metric_aggregation_type = "Average"

    step_adjustment {
      scaling_adjustment          = 1
      metric_interval_lower_bound = 0
    }
  }
}

resource "aws_appautoscaling_policy" "scale_down" {
  name               = "scale-down"
  resource_id        = aws_appautoscaling_target.ecs_service.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_service.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_service.service_namespace
  policy_type        = "StepScaling"

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 60
    metric_aggregation_type = "Average"

    step_adjustment {
      scaling_adjustment          = -1
      metric_interval_upper_bound = 0
    }
  }
}

resource "aws_cloudwatch_log_group" "ecs_log_group" {
  name              = "/ecs/mqm-scorecard"
  retention_in_days = 7
}

# Load Balancer
resource "aws_lb" "app_lb" {
  name               = "mqm-scorecard-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.subnet_a.id, aws_subnet.subnet_b.id]

  tags = {
    Name = "mqm-scorecard-alb"
  }
}

resource "aws_lb_target_group" "app_tg" {
  name     = "mqm-scorecard-tg"
  port     = 8081
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200-299"
  }

  tags = {
    Name = "mqm-scorecard-tg"
  }
}

resource "aws_lb_listener" "app_listener" {
  load_balancer_arn = aws_lb.app_lb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_tg.arn
  }
}
