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
    path                = "/health"
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

resource "aws_lb_listener" "app_listener_http" {
  load_balancer_arn = aws_lb.app_lb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "app_listener_https" {
  load_balancer_arn = aws_lb.app_lb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = aws_acm_certificate.cert.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app_tg.arn
  }
}

resource "tls_private_key" "example" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

resource "tls_self_signed_cert" "example" {
  private_key_pem = tls_private_key.example.private_key_pem
  subject {
    common_name  = "example.com" # Replace with your desired common name
    organization = "Example Org"
  }
  validity_period_hours = 8760 # 1 year
  is_ca_certificate     = false
  allowed_uses          = ["digital_signature", "key_encipherment"]
}

resource "aws_acm_certificate" "example" {
  private_key       = tls_private_key.example.private_key_pem
  certificate_body  = tls_self_signed_cert.example.cert_pem
  certificate_chain = tls_self_signed_cert.example.cert_pem
}
