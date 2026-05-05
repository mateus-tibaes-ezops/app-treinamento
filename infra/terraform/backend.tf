terraform {
  backend "s3" {
    bucket         = "app-treinamento-tfstate-618889059366-us-east-1"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "app-treinamento-tfstate-locks"
    encrypt        = true
  }
}
