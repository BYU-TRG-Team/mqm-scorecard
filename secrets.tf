data "aws_secretsmanager_secret_version" "db_password_version" {
  secret_id = "prod-database"
}
