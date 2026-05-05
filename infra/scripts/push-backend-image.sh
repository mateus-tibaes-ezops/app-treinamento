#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TF_DIR="$ROOT_DIR/infra/terraform"
REGION="${AWS_REGION:-$(terraform -chdir="$TF_DIR" output -raw aws_region 2>/dev/null || true)}"
REGION="${REGION:-us-east-1}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

REPOSITORY_URL="$(terraform -chdir="$TF_DIR" output -raw ecr_repository_url)"
REGISTRY="${REPOSITORY_URL%%/*}"

aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$REGISTRY"
docker build --platform linux/amd64 -t "$REPOSITORY_URL:$IMAGE_TAG" "$ROOT_DIR/backend"
docker push "$REPOSITORY_URL:$IMAGE_TAG"

if CLUSTER="$(terraform -chdir="$TF_DIR" output -raw ecs_cluster_name 2>/dev/null)" &&
  SERVICE="$(terraform -chdir="$TF_DIR" output -raw ecs_service_name 2>/dev/null)"; then
  aws ecs update-service \
    --region "$REGION" \
    --cluster "$CLUSTER" \
    --service "$SERVICE" \
    --force-new-deployment >/dev/null
fi

echo "Pushed $REPOSITORY_URL:$IMAGE_TAG"
