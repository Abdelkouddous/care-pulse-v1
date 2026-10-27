#!/usr/bin/env bash

# ==============================================================================
#  WATEEN BOOK LOCAL DEV RUNNER
#  Automates Laravel Backend + Next.js Frontend Dev Environment by WateenSoft
# ==============================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting Wateen Book Full-Stack Development Environment...${NC}\n"

cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down Wateen Book backend and frontend servers...${NC}"
    kill 0
    exit 0
}

trap cleanup INT TERM EXIT

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ─── 1. BACKEND ───────────────────────────────────────────────────────────────
echo -e "${YELLOW}🐘 Setting up Wateen Book Laravel Backend...${NC}"
cd "$ROOT_DIR/apps/api"

if [ ! -f .env ]; then
    echo -e "${YELLOW}  -> Copying .env.example to .env...${NC}"
    cp .env.example .env
    php artisan key:generate
fi

echo -e "${YELLOW}  -> Running Database Migrations & Seeds...${NC}"
php artisan migrate:fresh --seed --quiet

echo -e "${YELLOW}  -> Running Backend Tests...${NC}"
php artisan test --parallel || echo -e "${RED}⚠️ Some backend tests failed, but proceeding...${NC}"

echo -e "${GREEN}  ✓ Backend setup complete! Starting API Server on http://127.0.0.1:8000${NC}"
php artisan serve --host=0.0.0.0 --port=8000 &
echo -e "${GREEN}  ✓ Starting Reverb WebSocket Server on ws://127.0.0.1:8080${NC}"
php artisan reverb:start --host=0.0.0.0 --port=8080 &

# ─── 2. FRONTEND ──────────────────────────────────────────────────────────────
echo -e "\n${YELLOW}⚛️ Setting up Wateen Book Next.js Frontend...${NC}"
cd "$ROOT_DIR/apps/web"

if [ ! -f .env.local ]; then
    if [ -f .env.example ]; then
        cp .env.example .env.local
    else
        echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1" > .env.local
    fi
fi

if [ ! -d node_modules ]; then
    npm install
fi

echo -e "${GREEN}  ✓ Frontend setup complete! Starting Next.js Dev Server on http://localhost:3000${NC}"
npm run dev &
cd "$ROOT_DIR"

# ─── 3. MONITOR ───────────────────────────────────────────────────────────────
echo -e "\n${GREEN}✨ VitalBook Full-Stack App is Live!${NC}"
echo -e "   - 🐘 Backend API:  ${BLUE}http://127.0.0.1:8000${NC}"
echo -e "   - ⚡ Reverb WS:    ${BLUE}ws://127.0.0.1:8080${NC}"
echo -e "   - ⚛️ Frontend UI:   ${BLUE}http://localhost:3000${NC}"
echo -e "   - 🛑 Press ${RED}Ctrl + C${NC} to stop both servers safely.\n"

wait
