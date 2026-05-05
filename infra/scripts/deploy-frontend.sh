#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TF_DIR="$ROOT_DIR/infra/terraform"
API_URL="$(terraform -chdir="$TF_DIR" output -raw api_url)"
BUCKET="$(terraform -chdir="$TF_DIR" output -raw frontend_bucket)"
DISTRIBUTION_ID="$(terraform -chdir="$TF_DIR" output -raw cloudfront_distribution_id)"

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

cp -R "$ROOT_DIR/frontend/." "$TMP_DIR/"
rm -f "$TMP_DIR/Dockerfile" "$TMP_DIR/nginx.conf" "$TMP_DIR/.dockerignore"
cat > "$TMP_DIR/config.js" <<CONFIG
window.API_BASE_URL = "$API_URL";
CONFIG

aws s3 sync "$TMP_DIR/" "s3://$BUCKET" --delete
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*" >/dev/null

echo "Frontend deployed to $(terraform -chdir="$TF_DIR" output -raw frontend_url)"
