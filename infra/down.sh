#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yml"

echo "[down.sh] docker compose down --volumes --remove-orphans"
docker compose -f "$COMPOSE_FILE" down --volumes --remove-orphans

