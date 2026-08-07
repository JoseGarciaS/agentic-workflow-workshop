#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_DIR="$ROOT_DIR/app"

echo "[postCreate] Installing GitHub Copilot CLI..."
npm install -g @github/copilot
copilot --version

echo "[postCreate] Installing Mona Issue Triage API dependencies..."
cd "$APP_DIR"
npm ci

echo "[postCreate] Verifying API test baseline..."
npm test

echo "[postCreate] Done. GitHub CLI and Copilot CLI are installed."
echo "[postCreate] Use the 'Mona Issue API: Dev Server' launch config or the 'app: dev' task to start the API."
