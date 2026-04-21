#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Load local Cloudflare env file (optional, not committed).
if [ -f "$SCRIPT_DIR/.cf.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$SCRIPT_DIR/.cf.env"
  set +a
fi

# ===== configurable =====
REMOTE_HOST="47.84.192.179"
REMOTE_USER="root"
REMOTE_SSH="${REMOTE_USER}@${REMOTE_HOST}"
SSH_OPTS="-o BatchMode=no -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=15 -o ServerAliveInterval=30 -o ServerAliveCountMax=6"
SCP_OPTS="-o BatchMode=no -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=15 -o ServerAliveInterval=30 -o ServerAliveCountMax=6"
IMAGE_NAME="pakgopaymanagement:latest"
CONTAINER_NAME="pakgopaymanagement"
NGINX_CONTAINER="pakgopay-nginx"
PORT_MAP="127.0.0.1:5173:80"
VITE_MODE="${VITE_MODE:-dev}"
PLATFORM="${PLATFORM:-linux/amd64}"
FRONTEND_DEPLOY_CONTAINER="${FRONTEND_DEPLOY_CONTAINER:-no}"
# Cloudflare Pages auto publish (optional)
CF_UPLOAD="${CF_UPLOAD:-no}"
CF_PAGES_PROJECT="${CF_PAGES_PROJECT:-}"
CF_PAGES_BRANCH="${CF_PAGES_BRANCH:-production}"
CF_API_TOKEN="${CF_API_TOKEN:-${CLOUDFLARE_API_TOKEN:-}}"
CF_ACCOUNT_ID="${CF_ACCOUNT_ID:-${CLOUDFLARE_ACCOUNT_ID:-}}"
CF_WORKER_NAME="${CF_WORKER_NAME:-${CF_PAGES_PROJECT:-}}"
# Optional: purge Cloudflare cache after upload
CF_PURGE_CACHE="${CF_PURGE_CACHE:-no}"
CF_ZONE_ID="${CF_ZONE_ID:-}"
# ========================

mask_value() {
  local value="$1"
  local len="${#value}"
  if [[ "$len" -le 8 ]]; then
    printf '%s' "$value"
    return
  fi
  printf '%s***%s' "${value:0:4}" "${value: -4}"
}

if [ ! -f package.json ]; then
  echo "ERROR: package.json not found in $SCRIPT_DIR" >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: docker not found" >&2
  exit 1
fi

if ! command -v ssh >/dev/null 2>&1 || ! command -v scp >/dev/null 2>&1; then
  echo "ERROR: ssh/scp not found" >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm not found" >&2
  exit 1
fi

if [[ "$CF_UPLOAD" == "yes" ]]; then
  echo "Cloudflare Workers static asset publish config:"
  echo "  SCRIPT_DIR=$SCRIPT_DIR"
  echo "  CF_WORKER_NAME=${CF_WORKER_NAME:-<empty>}"
  echo "  CF_PAGES_PROJECT=${CF_PAGES_PROJECT:-<empty>}"
  echo "  CF_PAGES_BRANCH=${CF_PAGES_BRANCH:-<empty>}"
  echo "  CF_ACCOUNT_ID=$(mask_value "${CF_ACCOUNT_ID:-}")"
  echo "  CF_API_TOKEN_LEN=${#CF_API_TOKEN}"
  echo "  CF_ZONE_ID=$(mask_value "${CF_ZONE_ID:-}")"
  if [[ -z "$CF_WORKER_NAME" ]]; then
    echo "ERROR: CF_WORKER_NAME or CF_PAGES_PROJECT is required when CF_UPLOAD=yes" >&2
    exit 1
  fi
  if [[ -z "$CF_API_TOKEN" ]]; then
    echo "ERROR: CF_API_TOKEN (or CLOUDFLARE_API_TOKEN) is required when CF_UPLOAD=yes" >&2
    exit 1
  fi
  if [[ -z "$CF_ACCOUNT_ID" ]]; then
    echo "ERROR: CF_ACCOUNT_ID (or CLOUDFLARE_ACCOUNT_ID) is required when CF_UPLOAD=yes" >&2
    exit 1
  fi
  if ! command -v curl >/dev/null 2>&1; then
    echo "ERROR: curl not found" >&2
    exit 1
  fi
fi

# Turnstile site key (hard-coded)
VITE_TURNSTILE_SITE_KEY="0x4AAAAAACYPb1386VmIfFUe"

# 1) build dist locally
echo "[frontend] STEP 1/6 build local dist"
if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
  npm install
fi
VITE_TURNSTILE_SITE_KEY="$VITE_TURNSTILE_SITE_KEY" npm run build -- --mode "$VITE_MODE"

if [ ! -d "$SCRIPT_DIR/dist" ]; then
  echo "ERROR: dist not found after build in $SCRIPT_DIR/dist" >&2
  exit 1
fi

# 1.1) optional Cloudflare Pages publish
if [[ "$CF_UPLOAD" == "yes" ]]; then
  echo "[frontend] STEP 2/6 deploy Cloudflare static assets"
  echo "Validating Cloudflare Worker access..."
  CF_VERIFY_TMP="$(mktemp /tmp/pakgopay-cf-verify.XXXXXX)"
  CF_VERIFY_STATUS="$(curl -sS -o "$CF_VERIFY_TMP" -w "%{http_code}" -X GET \
    "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/workers/scripts/${CF_WORKER_NAME}" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json")"
  CF_VERIFY_RESP="$(cat "$CF_VERIFY_TMP")"
  rm -f "$CF_VERIFY_TMP"
  echo "Cloudflare Worker precheck status: $CF_VERIFY_STATUS"
  echo "Cloudflare Worker precheck response: $CF_VERIFY_RESP"
  if [[ "$CF_VERIFY_STATUS" != "200" && "$CF_VERIFY_STATUS" != "204" ]]; then
    echo "ERROR: Cloudflare Worker precheck failed" >&2
    echo "$CF_VERIFY_RESP" >&2
    exit 1
  fi
  echo "Publishing dist to Cloudflare Worker static assets..."
  WRANGLER_TMP_DIR="$(mktemp -d /tmp/pakgopay-wrangler.XXXXXX)"
  trap 'rm -rf "$WRANGLER_TMP_DIR"' EXIT
  cat >"$WRANGLER_TMP_DIR/wrangler.jsonc" <<EOF
{
  "name": "${CF_WORKER_NAME}",
  "compatibility_date": "$(date +%F)",
  "account_id": "${CF_ACCOUNT_ID}",
  "assets": {
    "directory": "${SCRIPT_DIR}/dist",
    "not_found_handling": "single-page-application"
  }
}
EOF
  (
    cd "$WRANGLER_TMP_DIR"
    export CI=1
    export WRANGLER_SEND_METRICS=false
    CLOUDFLARE_API_TOKEN="$CF_API_TOKEN" \
    CLOUDFLARE_ACCOUNT_ID="$CF_ACCOUNT_ID" \
    npx --yes wrangler@4 deploy --config "$WRANGLER_TMP_DIR/wrangler.jsonc"
  )

  if [[ "$CF_PURGE_CACHE" == "yes" ]]; then
    if [[ -z "$CF_ZONE_ID" ]]; then
      echo "ERROR: CF_ZONE_ID is required when CF_PURGE_CACHE=yes" >&2
      exit 1
    fi
    echo "Purging Cloudflare cache..."
    curl -sS -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" \
      -H "Authorization: Bearer ${CF_API_TOKEN}" \
      -H "Content-Type: application/json" \
      --data '{"purge_everything":true}' >/dev/null
  fi
fi

echo "[frontend] STEP 3/4 remote nginx dist sync delegated to nginx-admin backend"
echo "[frontend] STEP 4/4 remote nginx reload delegated to nginx-admin backend"

if [[ "$FRONTEND_DEPLOY_CONTAINER" == "yes" ]]; then
  echo "[frontend] optional: build and replace remote frontend container"
  if ! docker buildx inspect >/dev/null 2>&1; then
    docker buildx create --use >/dev/null
  fi

  docker buildx build --platform "$PLATFORM" -t "$IMAGE_NAME" --load .
  IMAGE_TAR="/tmp/${IMAGE_NAME//[:\/]/_}.tar"
  docker save -o "$IMAGE_TAR" "$IMAGE_NAME"
  IMAGE_TAR_SIZE_BYTES="$(wc -c < "$IMAGE_TAR" | tr -d ' ')"
  REMOTE_TMP_FREE_BYTES="$(ssh $SSH_OPTS "$REMOTE_SSH" "df -PB1 /tmp | awk 'NR==2 {print \$4}'")"
  if [[ -n "$REMOTE_TMP_FREE_BYTES" && "$REMOTE_TMP_FREE_BYTES" =~ ^[0-9]+$ ]]; then
    if (( REMOTE_TMP_FREE_BYTES <= IMAGE_TAR_SIZE_BYTES )); then
      echo "ERROR: remote /tmp free space is insufficient for image tar upload." >&2
      echo "       required=${IMAGE_TAR_SIZE_BYTES}B, available=${REMOTE_TMP_FREE_BYTES}B" >&2
      exit 1
    fi
  fi
  ssh $SSH_OPTS "$REMOTE_SSH" "docker image rm -f $IMAGE_NAME >/dev/null 2>&1 || true"
  scp $SCP_OPTS "$IMAGE_TAR" "$REMOTE_SSH:/tmp/pakgopay_image.tar"
  ssh $SSH_OPTS "$REMOTE_SSH" "docker load -i /tmp/pakgopay_image.tar && rm -f /tmp/pakgopay_image.tar"
  rm -f "$IMAGE_TAR"
  ssh $SSH_OPTS "$REMOTE_SSH" "docker rm -f $CONTAINER_NAME >/dev/null 2>&1 || true"
  ssh $SSH_OPTS "$REMOTE_SSH" "docker run -d --name $CONTAINER_NAME -p $PORT_MAP $IMAGE_NAME"
fi

echo "[frontend] DONE VITE_MODE=$VITE_MODE PLATFORM=$PLATFORM CF_UPLOAD=$CF_UPLOAD FRONTEND_DEPLOY_CONTAINER=$FRONTEND_DEPLOY_CONTAINER"
