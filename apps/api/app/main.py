import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import health, looks, matching, user_products


def cors_origins() -> list[str]:
    raw_origins = os.getenv("CORS_ORIGINS", "*")
    if raw_origins.strip() == "*":
        return ["*"]
    return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]


app = FastAPI(
    title="Makeup AI Personal Coach API",
    version="0.1.0",
    description="Deterministic backend MVP for curated makeup look coaching.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins(),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(looks.router)
app.include_router(user_products.router)
app.include_router(matching.router)
