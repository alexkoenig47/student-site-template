.PHONY: help install dev frontend backend lint format setup

help:
	@echo "Available commands:"
	@echo "  make install    - Install all dependencies"
	@echo "  make dev        - Start both frontend and backend"
	@echo "  make frontend   - Start only frontend"
	@echo "  make backend    - Start only backend"
	@echo "  make lint       - Run linters on all code"
	@echo "  make format     - Format all code"
	@echo "  make setup      - Initial project setup"

install:
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "Installing development dependencies..."
	pip install -r requirements-dev.txt
	@echo "Setting up pre-commit hooks..."
	pre-commit install

dev:
	@echo "Starting full stack application..."
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8000"
	@echo "Press Ctrl+C to stop"
	@trap 'kill 0' EXIT; \
	cd frontend && npm run dev & \
	cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000 & \
	wait

frontend:
	cd frontend && npm run dev

backend:
	cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000

lint:
	@echo "Linting frontend..."
	cd frontend && npm run lint
	@echo "Linting backend..."
	cd backend && ruff check .
	@echo "Linting infrastructure..."
	cfn-lint infrastructure/cloudformation/*.yml

format:
	@echo "Formatting backend..."
	cd backend && ruff format .

setup:
	@echo "Setting up project..."
	@if [ ! -f .env.local ]; then \
		cp env.local.example .env.local; \
		echo "Created .env.local from template"; \
	else \
		echo ".env.local already exists"; \
	fi
	@echo "Running install..."
	@$(MAKE) install
	@echo "Setup complete! Edit .env.local with your settings."

