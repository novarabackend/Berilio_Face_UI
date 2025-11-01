#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

APP_DIR="$ROOT_DIR/apps/admin-dashboard"

PORT="${DASHBOARD_PORT:-4300}"
HOST="${DASHBOARD_HOST:-0.0.0.0}"

cd "$APP_DIR"

npm install

if lsof -i :"$PORT" > /dev/null 2>&1; then
    echo "Port $PORT already in use. Terminating existing process(es)..."
    PIDS=$(lsof -ti :"$PORT")
    if [ -n "$PIDS" ]; then
        echo "$PIDS" | xargs kill
        sleep 1
    fi
fi

npm run start -- --host "$HOST" --port "$PORT"
