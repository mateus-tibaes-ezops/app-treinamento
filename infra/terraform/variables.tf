variable "aws_region" {
  description = "AWS region used by the training environment."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name prefix for AWS resources."
  type        = string
  default     = "app-treinamento"
}

variable "environment" {
  description = "Environment name."
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC."
  type        = string
  default     = "10.40.0.0/16"
}

variable "db_name" {
  description = "Application database name."
  type        = string
  default     = "training_app"
}

variable "db_username" {
  description = "RDS master username."
  type        = string
  default     = "appuser"
}

variable "db_instance_class" {
  description = "Small RDS instance for training. db.t4g.micro is cost-conscious in supported regions."
  type        = string
  default     = "db.t4g.micro"
}

variable "db_allocated_storage" {
  description = "RDS allocated storage in GiB."
  type        = number
  default     = 20
}

variable "backend_image_tag" {
  description = "Container tag used by ECS. Push this tag to ECR before updating the service."
  type        = string
  default     = "latest"
}

variable "backend_cpu" {
  description = "Fargate task CPU units."
  type        = number
  default     = 256
}

variable "backend_memory" {
  description = "Fargate task memory in MiB."
  type        = number
  default     = 512
}

variable "backend_desired_count" {
  description = "Number of backend tasks. Keep 1 for low-cost training."
  type        = number
  default     = 1
}
