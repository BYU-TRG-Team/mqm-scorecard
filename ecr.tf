resource "aws_ecr_repository" "mqm_scorecard_api" {
  name                 = "mqm-scorecard-api"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}

output "mqm_scorecard_api_repository_url" {
  value = aws_ecr_repository.mqm_scorecard_api.repository_url
}
