# Infra AWS

Infraestrutura Terraform para publicar a aplicacao na AWS com foco em custo baixo para treinamento.

## Arquitetura

```text
Usuario
  |
  v
CloudFront
  |-- /        -> S3 privado com frontend estatico
  |-- /api/*   -> ALB publico
                   |
                   v
                 ECS Fargate backend Node.js
                   |
                   v
                 RDS MySQL privado
```

## Decisoes de custo

- Sem NAT Gateway. O ECS roda em subnets publicas com IP publico, mas aceita trafego somente do ALB.
- RDS pequeno: `db.t4g.micro`, 20 GiB, single-AZ.
- ECS Fargate minimo: `256` CPU e `512` MiB, `desired_count = 1`.
- Subnets privadas com route table privada explicita, sem rota para internet.
- CloudWatch logs com retencao de 7 dias.
- CloudFront `PriceClass_100`.
- RDS com `skip_final_snapshot = true` e `deletion_protection = false` para facilitar destruir o ambiente de treinamento.

## Pre-requisitos

- AWS CLI autenticado.
- Terraform >= 1.6.
- Docker rodando.
- Permissoes AWS para VPC, ECS, ECR, RDS, IAM, ALB, S3, CloudFront, CloudWatch e Secrets Manager.

## Deploy

Entre na pasta Terraform:

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
terraform init
```

Crie primeiro o ECR, porque o ECS precisa da imagem existente:

```bash
terraform apply -target=aws_ecr_repository.backend
```

Suba a imagem do backend:

```bash
cd ../..
./infra/scripts/push-backend-image.sh
```

Crie o restante da infraestrutura:

```bash
cd infra/terraform
terraform apply
```

Publique o frontend no S3 e invalide o CloudFront:

```bash
cd ../..
./infra/scripts/deploy-frontend.sh
```

## Validacao

Veja as URLs:

```bash
cd infra/terraform
terraform output frontend_url
terraform output api_health_url
```

Teste a API:

```bash
curl "$(terraform output -raw api_health_url)"
curl "$(terraform output -raw api_url)/records"
```

Abra a URL do frontend e teste criar, editar e deletar registros.

## Dominio

O dominio customizado padrao e:

```text
https://app-treinamento-mateus.ezopscloud.co
```

O Terraform cria:

- certificado ACM em `us-east-1`;
- registros DNS de validacao do certificado;
- alias `A` e `AAAA` no Route53 apontando para o CloudFront.

## Pipelines

As pipelines ficam em `.github/workflows`:

- `backend-ci.yml`: instala dependencias do backend e faz build da imagem Docker.
- `backend-ci.yml`: em push na `main`, publica imagem no ECR e força novo deploy no ECS.
- `frontend-ci.yml`: faz checks estaticos, build da imagem Docker e, em push na `main`, sincroniza frontend no S3, invalida CloudFront e testa `/api/health`.
- `infra-ci.yml`: valida `terraform fmt`, `terraform init`, `terraform validate` e `terraform plan`.

O deploy usa GitHub Actions OIDC com a role criada pelo Terraform:

```text
app-treinamento-dev-github-actions
```

O Terraform state remoto usa:

- bucket S3: `app-treinamento-tfstate-618889059366-us-east-1`
- tabela DynamoDB: `app-treinamento-tfstate-locks`

## Destruir ambiente

Para evitar custo parado:

```bash
cd infra/terraform
terraform destroy
```
