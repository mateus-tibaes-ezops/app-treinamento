output "ecr_repository_url" {
  description = "Backend ECR repository URL."
  value       = aws_ecr_repository.backend.repository_url
}

output "api_url" {
  description = "HTTPS API base URL through CloudFront."
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}/api"
}

output "api_health_url" {
  description = "HTTPS API health check URL through CloudFront."
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}/api/health"
}

output "alb_api_url" {
  description = "Direct HTTP API base URL on the ALB."
  value       = "http://${aws_lb.api.dns_name}/api"
}

output "frontend_bucket" {
  description = "S3 bucket used for frontend files."
  value       = aws_s3_bucket.frontend.bucket
}

output "frontend_url" {
  description = "CloudFront frontend URL."
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID for cache invalidations."
  value       = aws_cloudfront_distribution.frontend.id
}

output "rds_endpoint" {
  description = "Private RDS endpoint."
  value       = aws_db_instance.mysql.address
}

output "aws_region" {
  description = "AWS region used by this deployment."
  value       = var.aws_region
}

output "ecs_cluster_name" {
  description = "ECS cluster name."
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "ECS backend service name."
  value       = aws_ecs_service.backend.name
}
