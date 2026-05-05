# Plano de infra AWS

## Divisao em 3 partes

### Parte 1 - Base do projeto

Status: concluida neste workspace.

- Clonar o repositorio.
- Identificar a stack: frontend estatico, backend Node.js/Express e MySQL.
- Criar empacotamento Docker para frontend e backend.
- Criar `docker-compose.yml` para validar a aplicacao localmente com MySQL.
- Preparar o desenho da infraestrutura AWS.

### Parte 2 - Infraestrutura AWS com IaC

Escopo sugerido para a proxima etapa:

- Criar Terraform em `infra/terraform`.
- Criar VPC com subnets publicas e privadas.
- Criar Security Groups.
- Criar RDS MySQL em subnets privadas.
- Criar ECR para a imagem do backend.
- Criar ECS Fargate para o backend.
- Criar ALB publico para expor a API.
- Criar S3 para hospedar o frontend.
- Criar CloudFront para entregar o frontend.
- Configurar variaveis e outputs.

### Parte 3 - Deploy e validacao

Escopo sugerido para a ultima etapa:

- Build e push da imagem do backend para o ECR.
- Aplicar Terraform no ambiente AWS.
- Publicar arquivos do frontend no S3.
- Ajustar `frontend/config.js` ou substituicao equivalente com a URL final da API.
- Testar `/api/health` no ALB.
- Testar CRUD pelo CloudFront.
- Documentar comandos finais e evidencias.

## Arquitetura alvo

```text
Usuario
  |
  v
CloudFront
  |
  v
S3 static website: frontend

Usuario/frontend
  |
  v
ALB publico
  |
  v
ECS Fargate: backend Node.js
  |
  v
RDS MySQL privado
```

## Variaveis que serao necessarias

- `aws_region`
- `project_name`
- `environment`
- `db_name`
- `db_username`
- `db_password`
- `backend_image_tag`

## Observacoes tecnicas

- O backend ja possui `/api/health`, util para health check no ALB/ECS.
- O frontend foi ajustado para aceitar `window.API_BASE_URL` via `frontend/config.js`.
- Em AWS, o RDS deve ficar privado. Somente o ECS acessa o banco.
- O backend pode ficar em subnets privadas com saida via NAT, ou em subnets publicas sem IP publico se o pull da imagem e logs forem atendidos por endpoints/NAT. Para treinamento, a opcao mais simples costuma ser ECS privado com NAT.
