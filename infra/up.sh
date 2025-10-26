#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yml"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Export variables from project .env if present
if [[ -f "$ROOT_DIR/.env" ]]; then
  set -a
  # shellcheck source=/dev/null
  source "$ROOT_DIR/.env"
  set +a
fi

RETRIES="${RETRIES:-40}"
SLEEP_SECS="${SLEEP_SECS:-3}"

echo "[up.sh] docker compose up -d --build"
docker compose -f "$COMPOSE_FILE" up -d --build

is_healthy() {
  local name="$1"
  local status
  status=$(docker inspect --format '{{.State.Health.Status}}' "$name" 2>/dev/null || true)
  if [[ "$status" == "healthy" ]]; then
    return 0
  fi
  return 1
}

wait_for() {
  local name="$1"
  local n=0
  while (( n < RETRIES )); do
    if is_healthy "$name"; then
      echo "[up.sh] $name healthy"
      return 0
    fi
    ((n++)) || true
    sleep "$SLEEP_SECS"
  done
  echo "[up.sh] ERROR: $name not healthy after $RETRIES attempts" >&2
  return 1
}

# Wait for critical services
wait_for cp-db
wait_for cp-api

echo "[up.sh] docker compose ps"
docker compose -f "$COMPOSE_FILE" ps

