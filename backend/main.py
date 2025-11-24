"""
FastAPI Backend Application
Main entry point for the API server
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import logs
import os

app = FastAPI(
    title="Student Site API",
    description="Backend API for student site template",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(logs.router)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "API is running", "status": "healthy"}


@app.get("/health")
async def health():
    """Health check endpoint for load balancer"""
    return {"status": "healthy"}

