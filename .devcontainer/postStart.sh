#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_DIR="$ROOT_DIR/app"
READY_MARKER="$ROOT_DIR/.mona-codespace-ready"

rm -f "$READY_MARKER"
cd "$APP_DIR"

if [ ! -d node_modules ]; then
  echo "[postStart] node_modules missing, running npm ci..."
  npm ci
fi

echo "[postStart] Workspace ready."
echo "[postStart] CLI tools available: gh and copilot."
echo "[postStart] Start the API with the VS Code launch config 'Mona Issue API: Dev Server' or the task 'app: dev'."
echo "[postStart] When running, the API will be available on port 3000."
touch "$READY_MARKER"
