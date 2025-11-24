# Quick Setup Guide

This guide will help you get started quickly. For detailed information, see [README.md](README.md).

## Initial Setup (One Time)

1. **Install prerequisites** (if not already installed):

   - Node.js 18+
   - Python 3.11+
   - Docker Desktop
   - VS Code
   - Git

2. **Clone and navigate to the project**:

   ```bash
   cd student-site-template
   ```

3. **Set up environment file**:

   ```bash
   cp env.local.example .env.local
   # Edit .env.local with your settings (defaults work for local dev)
   ```

4. **Install dependencies**:

   ```bash
   # Frontend
   cd frontend && npm install && cd ..

   # Backend
   cd backend && pip install -r requirements.txt && cd ..

   # Development tools
   pip install -r requirements-dev.txt
   pre-commit install
   ```

5. **Test locally**:
   - Use VS Code: Press `Ctrl+Shift+P` → "Tasks: Run Task" → "Start Full Stack"
   - Or manually: Run `npm run dev` in `frontend/` and `uvicorn main:app --reload` in `backend/`

## AWS Deployment Setup (One Time)

1. **Create GitHub Actions IAM Role**:

   - AWS Console → IAM → Roles → Create Role
   - Name: `github-actions-role`
   - Attach: `AdministratorAccess` policy
   - Copy the Role ARN

2. **Get Route53 Hosted Zone ID**:

   - AWS Console → Route53 → Hosted zones
   - Copy the Hosted Zone ID for your domain

3. **Configure GitHub Secrets**:

   - GitHub repo → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `GITHUB_ACTIONS_ROLE_ARN`: (from step 1)
     - `HOSTED_ZONE_ID`: (from step 2)
     - `BASE_DOMAIN`: Your domain (e.g., `example.com`)
     - `FRONTEND_DOMAIN`: Usually `www` or `@`
     - `BACKEND_DOMAIN`: Usually `api`
     - `PROJECT_NAME`: Your project name

4. **Connect Amplify to GitHub** (after first deployment):
   - AWS Console → Amplify → Your app
   - Connect repository manually (CloudFormation creates the app, but you need to connect the repo)
   - This enables automatic frontend deployments

## Daily Development

1. **Make changes** to your code
2. **Test locally** using VS Code tasks
3. **Commit and push**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
4. **Deployment happens automatically** via GitHub Actions!

## Need Help?

See the full [README.md](README.md) for detailed explanations and troubleshooting.
