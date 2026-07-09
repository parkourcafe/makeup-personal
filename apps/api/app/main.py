import os
from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.routers import admin, health, looks, matching, shopping, user_products
from app.seed.data import seed_demo_data


def cors_origins() -> list[str]:
    raw_origins = os.getenv("CORS_ORIGINS", "*")
    if raw_origins.strip() == "*":
        return ["*"]
    return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]


def should_auto_seed_demo() -> bool:
    return os.getenv("AUTO_SEED_DEMO", "false").lower() == "true"


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncGenerator[None, None]:
    if should_auto_seed_demo():
        Base.metadata.create_all(bind=engine)
        with SessionLocal() as db:
            seed_demo_data(db, reset=True)
    yield


app = FastAPI(
    title="Makeup AI Personal Coach API",
    version="0.1.0",
    description="Deterministic backend MVP for curated makeup look coaching.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins(),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(admin.router)
app.include_router(looks.router)
app.include_router(user_products.router)
app.include_router(matching.router)
app.include_router(shopping.router)
