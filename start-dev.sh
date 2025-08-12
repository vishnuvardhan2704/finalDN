#!/usr/bin/env bash
set -euo pipefail

# Move to the script's directory (project root)
cd "$(dirname "$0")"

echo
echo "=== EcoSwap Dev Runner (bash) ==="
echo "Working directory: $(pwd)"
echo

# Basic checks
if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] Node.js is not installed or not in PATH. Install Node 18+ and retry." >&2
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "[ERROR] npm is not installed or not in PATH. Install Node.js (includes npm) and retry." >&2
  exit 1
fi

# Install dependencies if needed
if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

# Generate env templates if missing
if [ -f setup-env.js ] && [ ! -f .env ]; then
  echo "Creating .env and .env.local from setup-env.js ..."
  node setup-env.js || true
fi

# Start dev server (package.json uses port 9002)
echo
echo "Starting development server on http://localhost:9002 ..."
echo
npm run dev
