@echo off
cd /d "C:\Users\Jacob\Desktop\webGame Project"
git fetch origin main
git checkout origin/main -- .github/workflows/deploy.yml
git rm -rf --cached .
git add -A
git commit --allow-empty -m "Force update all files"
git push origin main --force
pause