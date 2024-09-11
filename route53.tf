# resource "aws_route53_zone" "main" {
#   name = "example.com" # Replace with your domain
# }

# resource "aws_acm_certificate" "cert" {
#   domain_name       = "example.com" # Replace with your domain
#   validation_method = "DNS"

#   tags = {
#     Name = "example-cert"
#   }
# }

# resource "aws_route53_record" "cert_validation" {
#   name    = aws_acm_certificate.cert.domain_validation_options[0].resource_record_name
#   type    = aws_acm_certificate.cert.domain_validation_options[0].resource_record_type
#   zone_id = aws_route53_zone.main.zone_id
#   records = [aws_acm_certificate.cert.domain_validation_options[0].resource_record_value]
#   ttl     = 60
# }

# resource "aws_acm_certificate_validation" "cert_validation" {
#   certificate_arn         = aws_acm_certificate.cert.arn
#   validation_record_fqdns = [aws_route53_record.cert_validation.fqdn]
# }

# resource "aws_route53_record" "app" {
#   zone_id = aws_route53_zone.main.zone_id
#   name    = "app.example.com" # Replace with your subdomain
#   type    = "A"
#   alias {
#     name                   = aws_cloudfront_distribution.s3_distribution.domain_name
#     zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
#     evaluate_target_health = false
#   }
# }
