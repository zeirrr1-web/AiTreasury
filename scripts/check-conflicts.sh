#!/usr/bin/env bash
set -euo pipefail

if rg -n "^(<<<<<<<|=======|>>>>>>>)" . --glob '!.git/*' --glob '!node_modules/*'; then
  echo "❌ Merge conflict markers detected. Resolve conflicts before deploy."
  exit 1
fi

echo "✅ No merge conflict markers found."
