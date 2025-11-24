# Student Site Template - Full Stack Web Application

Welcome! This template provides you with everything you need to build and deploy a professional full-stack web application on AWS. Even if you've never coded before, this guide will walk you through everything step by step.

## 📚 What You Have

This template includes:

- **Frontend**: A modern Next.js application with Tailwind CSS (in the `frontend/` folder)
- **Backend**: A FastAPI Python server (in the `backend/` folder)
- **Infrastructure**: AWS CloudFormation templates that automatically set up your cloud resources
- **Deployment**: GitHub Actions workflow that automatically deploys your app when you push code
- **Development Tools**: VS Code configuration for easy local development

## 🏗️ Architecture Overview

Your application will be deployed on AWS with:

- **Frontend**: Hosted on AWS Amplify (automatically scales and serves your Next.js app)
- **Backend**: Running on AWS ECS Fargate (containerized Python API behind a load balancer)
- **Infrastructure**: Managed by AWS CloudFormation (infrastructure as code)

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have:

1. **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
2. **Python** (version 3.11 or higher) - [Download here](https://www.python.org/downloads/)
3. **Docker** - [Download here](https://www.docker.com/products/docker-desktop/)
4. **VS Code** - [Download here](https://code.visualstudio.com/)
5. **Git** - [Download here](https://git-scm.com/downloads)
6. **An AWS Account** - [Sign up here](https://aws.amazon.com/)

### Step 1: Set Up Your Local Environment

1. **Clone or download this template** to your computer
2. **Open the folder in VS Code**
3. **Copy the environment file**:
   ```bash
   cp env.local.example .env.local
   ```
4. **Edit `.env.local`** with your local development settings (you can leave most defaults for now)

### Step 2: Install Dependencies

Open a terminal in VS Code (Terminal → New Terminal) and run:

```bash
# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..

# Install development tools (for linting)
pip install -r requirements-dev.txt

# Set up pre-commit hooks
pre-commit install
```

### Step 3: Run Your Application Locally

You have two options:

**Option A: Use VS Code Tasks (Recommended)**

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Tasks: Run Task"
3. Select "Start Full Stack"
4. This will start both frontend and backend

**Option B: Manual Start**
Open two terminal windows:

Terminal 1 (Frontend):

```bash
cd frontend
npm run dev
```

Terminal 2 (Backend):

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Your application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

### Step 4: Set Up AWS for Deployment

Before deploying, you need to configure AWS:

1. **Create an IAM Role for GitHub Actions**:

   - Go to AWS Console → IAM → Roles
   - Create a new role named `github-actions-role`
   - Attach policies: `AdministratorAccess` (for students - in production, use least privilege)
   - Note the Role ARN (looks like: `arn:aws:iam::123456789012:role/github-actions-role`)

2. **Get Your Route53 Hosted Zone ID**:

   - Go to AWS Console → Route53 → Hosted zones
   - If you don't have one, create a hosted zone for your domain
   - Copy the Hosted Zone ID (looks like: `Z1234567890ABC`)

3. **Set Up GitHub Secrets**:
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `GITHUB_ACTIONS_ROLE_ARN`: Your IAM role ARN from step 1
     - `HOSTED_ZONE_ID`: Your Route53 Hosted Zone ID
     - `BASE_DOMAIN`: Your domain name (e.g., `example.com`)
     - `FRONTEND_DOMAIN`: Subdomain for frontend (usually `www` or `@`)
     - `BACKEND_DOMAIN`: Subdomain for backend (usually `api`)
     - `PROJECT_NAME`: A name for your project (e.g., `my-student-site`)

### Step 5: Deploy to AWS

Once your GitHub secrets are configured:

1. **Push your code to GitHub**:

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Watch the deployment**:

   - Go to your GitHub repository → Actions tab
   - You'll see the deployment workflow running
   - It will:
     - Create an S3 bucket for artifacts
     - Create an ECR repository for Docker images
     - Build and push your backend Docker image
     - Deploy all CloudFormation stacks
     - Set up your frontend and backend

3. **Wait for completion** (usually 10-15 minutes for first deployment)

4. **Connect Amplify to GitHub** (Required for frontend):

   - Go to AWS Console → Amplify
   - Find your app (named `your-project-name-frontend`)
   - Click "Connect branch" or "Connect repository"
   - Connect your GitHub repository and select the `main` branch
   - This enables automatic frontend deployments on code pushes

5. **Access your deployed application**:
   - Frontend: `https://www.yourdomain.com` (or your configured frontend domain)
   - Backend: `https://api.yourdomain.com` (or your configured backend domain)

## 📁 Project Structure

```
student-site-template/
├── frontend/              # Next.js frontend application
│   ├── app/              # Next.js app router pages
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
│
├── backend/              # FastAPI backend application
│   ├── main.py          # Main API file
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile       # Docker configuration for deployment
│
├── infrastructure/       # AWS infrastructure as code
│   └── cloudformation/  # CloudFormation templates
│       ├── main.yml     # Main stack (orchestrates everything)
│       ├── frontend-stack.yml  # Frontend infrastructure
│       └── backend-stack.yml   # Backend infrastructure
│
├── .github/
│   └── workflows/
│       └── deploy.yml   # Automated deployment workflow
│
├── .vscode/             # VS Code configuration
│   ├── tasks.json       # Development tasks
│   └── launch.json      # Debug configurations
│
├── .pre-commit-config.yaml  # Code quality checks
├── .env.local           # Local environment variables (create from env.local.example)
└── README.md           # This file!
```

## 🛠️ Development Workflow

### Making Changes

1. **Edit your code** in `frontend/` or `backend/`
2. **Test locally** using VS Code tasks or manual commands
3. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```
   (Pre-commit hooks will automatically check your code quality)
4. **Push to GitHub**:
   ```bash
   git push origin main
   ```
5. **Automatic deployment** happens via GitHub Actions!

### Code Quality

This template includes automatic code quality checks:

- **Frontend**: ESLint checks your JavaScript/TypeScript
- **Backend**: Ruff checks your Python code
- **Infrastructure**: cfn-lint checks your CloudFormation templates

These run automatically before each commit. If they find issues, fix them and try again.

## 🔍 Viewing Logs

### Local Development

- **Frontend logs**: Check the terminal where you ran `npm run dev`
- **Backend logs**: Check the terminal where you ran `uvicorn`

### Production (AWS)

- **Frontend logs**: AWS Amplify Console → Your App → Build settings → View logs
- **Backend logs**: AWS CloudWatch → Log groups → `/ecs/your-project-name`

## 🎓 Learning Resources

### Next.js (Frontend)

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### FastAPI (Backend)

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Python Documentation](https://docs.python.org/3/)

### AWS

- [AWS CloudFormation Documentation](https://docs.aws.amazon.com/cloudformation/)
- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)

## 🐛 Troubleshooting

### "Port already in use" error

- Another application is using port 3000 or 8000
- Stop other applications or change ports in your `.env.local`

### "Module not found" error

- Run `npm install` in `frontend/` or `pip install -r requirements.txt` in `backend/`

### Deployment fails

- Check GitHub Actions logs for specific errors
- Verify all GitHub secrets are set correctly
- Ensure your AWS IAM role has necessary permissions

### Can't access deployed site

- Wait 10-15 minutes after deployment (DNS propagation takes time)
- Check Route53 records are created correctly
- Verify SSL certificates are issued (may take a few minutes)

## 📝 Next Steps

Now that you have a working template:

1. **Customize the frontend**: Edit `frontend/app/page.tsx` to change the homepage
2. **Add API endpoints**: Edit `backend/main.py` to add new routes
3. **Connect frontend to backend**: Use the API URL from your environment variables
4. **Add features**: Build your application!

## 🤝 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review AWS CloudWatch logs for backend errors
3. Check GitHub Actions logs for deployment errors
4. Review the AWS Console for resource status

## 📄 License

This template is provided as-is for educational purposes.

---

**Happy Coding! 🚀**
