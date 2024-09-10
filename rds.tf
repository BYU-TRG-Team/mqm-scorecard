# RDS Instance
resource "aws_db_instance" "default" {
  engine                 = "postgres"
  engine_version         = "15.8"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  storage_type           = "gp2"
  identifier             = "mqm-scorecard-db"
  db_name                = "mqm_scorecard"
  username               = "admin"
  password               = jsondecode(data.aws_secretsmanager_secret_version.db_password_version.secret_string).password
  parameter_group_name   = "default.postgres15"
  skip_final_snapshot    = true
  publicly_accessible    = false
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  storage_encrypted      = true

  tags = {
    Name = "MQM Scorecard Database"
  }
}

output "rds_endpoint" {
  value = aws_db_instance.default.endpoint
}

# Security group for RDS
resource "aws_security_group" "rds_sg" {
  name        = "mqm-scorecard-rds-security-group"
  description = "Allow inbound access to RDS from ECS tasks"
  vpc_id      = aws_vpc.main.id

  ingress {
    protocol        = "tcp"
    from_port       = 5432
    to_port         = 5432
    security_groups = [aws_security_group.ecs_tasks.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_secretsmanager_secret" "db_password" {
  name = "mqm-scorecard-db-password"
}

resource "aws_secretsmanager_secret_version" "db_password_version" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = jsonencode({ password = "changeme" }) # Replace with actual password
}
