#!/bin/bash
cd "$(dirname "$0")"
git add -A
git commit -m "fix: TypeScript error in dashboard" || echo "No changes to commit"
git push origin main
echo ""
echo "✅ DONE! Check Vercel - it will auto-deploy in 2-3 minutes."
echo ""
read -p "Press Enter to close..."

