from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import os

class Settings(BaseModel):
    app_name: str = "orbit-studio"
    environment: str = "development"
    demo_mode: bool = False
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Orbit Studio - AI Engineering Issue Tracker"
)

class HealthResponse(BaseModel):
    status: str
    version: str
    environment: str
    demo_mode: bool

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="ok",
        version="1.0.0",
        environment=settings.environment,
        demo_mode=settings.demo_mode
    )

@app.get("/")
async def root():
    return {"message": "Orbit Studio API", "version": "1.0.0", "docs": "/docs"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)