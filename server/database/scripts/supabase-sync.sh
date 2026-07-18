#!/bin/bash
# Supabase Production Sync & Deployment Script
# Targets: Live Production Instance

set -e

echo "🚀 Initializing Supabase Production Sync..."

# 1. Ensure supabase directory exists
mkdir -p supabase/migrations

# 2. Sync migrations from server/database/migrations to supabase/migrations
echo "📦 Syncing migrations..."
cp -rv server/database/migrations/* supabase/migrations/

# 3. Validation Step
echo "🔍 Validating migration sequence..."
ls -1 supabase/migrations/

# 4. Deployment Instructions
echo ""
echo "✅ Preparation Complete."
echo "--------------------------------------------------"
echo "NEXT STEPS FOR MANUAL DEPLOYMENT:"
echo "1. npx supabase login"
echo "2. npx supabase link --project-ref <YOUR_PROJECT_ID>"
echo "3. npx supabase db push"
echo "--------------------------------------------------"
