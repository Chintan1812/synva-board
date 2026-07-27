#!/usr/bin/env bash
# Supabase MCP server launcher (agent tooling).
#
# Reads SUPABASE_ACCESS_TOKEN + SUPABASE_PROJECT_REF from .env.local at runtime
# so no secret is committed — mirrors scripts/razorpay-mcp-auth.sh. Starts the
# official @supabase/mcp-server-supabase over stdio, scoped to one project.
#
# Starts in --read-only so the agent can inspect schema/data safely. Drop that
# flag (here) when we're ready to APPLY migrations from the agent.
set -euo pipefail
cd "$(dirname "$0")/.."

set -a
[ -f .env.local ] && source .env.local
set +a

if [ -z "${SUPABASE_ACCESS_TOKEN:-}" ]; then
  echo "supabase-mcp: SUPABASE_ACCESS_TOKEN is not set in .env.local" >&2
  exit 1
fi

exec npx -y @supabase/mcp-server-supabase@latest \
  --read-only \
  --project-ref="${SUPABASE_PROJECT_REF:-}"
