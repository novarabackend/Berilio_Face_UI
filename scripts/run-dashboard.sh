#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

APP_DIR="$ROOT_DIR/apps/admin-dashboard"

PORT="${DASHBOARD_PORT:-4300}"
HOST="${DASHBOARD_HOST:-0.0.0.0}"

cd "$APP_DIR"

npm install

npm run start -- --host "$HOST" --port "$PORT"
