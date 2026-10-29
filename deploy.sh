#!/bin/sh
# Rebuild the page, commit anything changed, push to GitHub, and deploy to Railway.
set -e
cd "$(dirname "$0")"
node src/build.mjs
git add -A
git diff --cached --quiet || git commit -qm "${1:-Update hit list}

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
git push -q origin main
railway up --service web --detach
