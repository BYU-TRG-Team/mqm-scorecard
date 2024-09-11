# RDS Instance
resource "aws_db_instance" "default" {
  engine                 = "postgres"
  engine_version         = "15.8"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  storage_type           = "gp2"
  identifier             = "mqm-scorecard-db"
  db_name                = jsondecode(data.aws_secretsmanager_secret_version.db_password_version.secret_string).database
  username               = jsondecode(data.aws_secretsmanager_secret_version.db_password_version.secret_string).username
  password               = jsondecode(data.aws_secretsmanager_secret_version.secret_string).password
  parameter_group_name   = "default.postgres15"
  skip_final_snapshot    = false
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

resource "aws_secretsmanager_secret" "db_password" {
  name = "mqm-scorecard-db-password"
}

resource "aws_secretsmanager_secret_version" "db_password_version" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = jsonencode({ password = "changeme" }) # Replace with actual password
}
