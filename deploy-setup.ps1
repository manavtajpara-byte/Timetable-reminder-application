# Timetable Master Deployment Setup
# This script helps you push your project to GitHub for easy Vercel deployment.

$repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/repo-name.git)"

if (-not $repoUrl) {
    Write-Host "Error: No URL provided. Exiting." -ForegroundColor Red
    exit
}

Write-Host "`nInitializing remote..." -ForegroundColor Cyan
git remote add origin $repoUrl

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git branch -M main
git push -u origin main

Write-Host "`nSuccess! Your code is now on GitHub." -ForegroundColor Green
Write-Host "To finish deployment:" -ForegroundColor Yellow
Write-Host "1. Go to https://vercel.com/new"
Write-Host "2. Import your repository: $repoUrl"
Write-Host "3. Click 'Deploy'. Vercel will handle the rest!"
