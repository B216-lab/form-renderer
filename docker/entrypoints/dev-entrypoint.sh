#!/usr/bin/env bash
set -euo pipefail

cd "${APP_HOME:-/workspace}"

pnpm install --frozen-lockfile

exec "$@"

