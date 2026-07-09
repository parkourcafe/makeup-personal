from fastapi import FastAPI

from app.routers import health, looks, matching, user_products


app = FastAPI(
    title="Makeup AI Personal Coach API",
    version="0.1.0",
    description="Deterministic backend MVP for curated makeup look coaching.",
)

app.include_router(health.router)
app.include_router(looks.router)
app.include_router(user_products.router)
app.include_router(matching.router)
