"""
RSA Key Generation System
=========================
FastAPI Backend Application
Course Project: Cryptography and Network Security (CNS)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import init_db
from .routers import rsa

# Initialize SQLite database
init_db()

app = FastAPI(
    title="RSA Key Generation System",
    description="Undergraduate Cryptography and Network Security (CNS) Course Project demonstrating RSA Key Generation.",
    version="1.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include RSA endpoints
app.include_router(rsa.router, prefix="/api")


@app.get("/")
def root():
    return {
        "project": "RSA Key Generation System",
        "course": "Cryptography and Network Security (CNS)",
        "status": "Running",
        "docs_url": "/docs"
    }


@app.get("/api/health")
def health_check():
    return {"status": "HEALTHY", "database": "SQLite Connected"}
