#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════════
# 🚀 HANDYUNDPCSERVICE - AUTOMATED SETUP SCRIPT
# ═══════════════════════════════════════════════════════════════════════════════

set -e  # Exit on error

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🚀 HANDYUNDPCSERVICE - Automated Setup${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════════════${NC}\n"

# ─────────────────────────────────────────────────────────────────────────────────
# Step 1: Check Node.js
# ─────────────────────────────────────────────────────────────────────────────────
echo -e "${YELLOW}Step 1: Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found!${NC}"
    echo "Install from: https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js ${NODE_VERSION}${NC}\n"

# ─────────────────────────────────────────────────────────────────────────────────
# Step 2: Check PostgreSQL
# ─────────────────────────────────────────────────────────────────────────────────
echo -e "${YELLOW}Step 2: Checking PostgreSQL connection...${NC}"

if [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}⚠️  DATABASE_URL not set in .env${NC}"
    echo "Using default: postgresql://postgres:postgres@localhost:5432/handyundpcservice"
    echo ""
    read -p "Is PostgreSQL running? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Please start PostgreSQL first!${NC}"
        echo "Windows: net start PostgreSQL14 (or version)"
        echo "Docker: docker start hps-postgres"
        exit 1
    fi
fi

echo -e "${GREEN}✅ PostgreSQL check passed${NC}\n"

# ─────────────────────────────────────────────────────────────────────────────────
# Step 3: Install Dependencies
# ─────────────────────────────────────────────────────────────────────────────────
echo -e "${YELLOW}Step 3: Installing dependencies...${NC}"

if [ ! -d "node_modules" ]; then
    npm install
else
    echo -e "${GREEN}✅ node_modules exists, skipping npm install${NC}"
fi
echo ""

# ─────────────────────────────────────────────────────────────────────────────────
# Step 4: Run Prisma Migrations
# ─────────────────────────────────────────────────────────────────────────────────
echo -e "${YELLOW}Step 4: Running Prisma migrations...${NC}"
npx prisma migrate dev --name init 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Migration failed. Trying to generate Prisma Client...${NC}"
    npx prisma generate
    npx prisma migrate deploy
}
echo -e "${GREEN}✅ Database initialized${NC}\n"

# ─────────────────────────────────────────────────────────────────────────────────
# Step 5: Create Admin Account
# ─────────────────────────────────────────────────────────────────────────────────
echo -e "${YELLOW}Step 5: Creating admin account...${NC}"
npx tsx scripts/create-admin.ts
echo ""

# ─────────────────────────────────────────────────────────────────────────────────
# Step 6: Success Message
# ─────────────────────────────────────────────────────────────────────────────────
echo -e "${GREEN}═══════════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${BLUE}🚀 Next steps:${NC}"
echo "1. Start dev server: npm run dev"
echo "2. Open browser: http://localhost:3000"
echo "3. Login with admin account created above"
echo "4. Admin panel: http://localhost:3000/admin"
echo ""

echo -e "${YELLOW}📋 Database Info:${NC}"
echo "View data: npx prisma studio"
echo "Reset DB: npx prisma migrate reset"
echo ""

echo -e "${BLUE}📚 Dokumentation:${NC}"
echo "- AUTHENTICATION_SYSTEM.md - Vollständige Auth Dokumentation"
echo "- SETUP_ANLEITUNG.md - Deutsche Schritt-für-Schritt Anleitung"
echo "- CLOUDFLARE_SETUP.md - Production Deployment"
