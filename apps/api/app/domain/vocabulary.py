from typing import Iterable


PRODUCT_CATEGORIES = {
    "primer",
    "foundation",
    "skin_tint",
    "concealer",
    "powder",
    "blush",
    "bronzer",
    "highlighter",
    "eyeshadow",
    "eyeliner",
    "mascara",
    "eyebrow_pencil",
    "brow_gel",
    "lipstick",
    "lip_tint",
    "lip_balm",
    "lip_gloss",
}

COLOR_FAMILIES = {
    "beige",
    "berry",
    "black",
    "blue",
    "bronze",
    "brown",
    "champagne",
    "clear",
    "coral",
    "gold",
    "lavender",
    "mauve",
    "nude",
    "orange",
    "peach",
    "pink",
    "plum",
    "red",
    "rose",
    "taupe",
    "terracotta",
    "translucent",
}

UNDERTONES = {"cool", "neutral", "olive", "warm"}
FINISHES = {"dewy", "gloss", "matte", "natural", "satin", "shimmer"}
TEXTURES = {"balm", "cream", "gel", "liquid", "pencil", "powder", "stick"}
COVERAGE_LEVELS = {"sheer", "light", "medium", "full"}
PRODUCT_SOURCES = {"manual", "import", "scan", "admin", "recommendation"}
OFFER_STATUSES = {
    "mock_in_stock",
    "mock_limited",
    "live_in_stock",
    "live_limited",
    "out_of_stock",
    "unknown",
}

VOCABULARY = {
    "categories": sorted(PRODUCT_CATEGORIES),
    "color_families": sorted(COLOR_FAMILIES),
    "undertones": sorted(UNDERTONES),
    "finishes": sorted(FINISHES),
    "textures": sorted(TEXTURES),
    "coverage": sorted(COVERAGE_LEVELS),
    "sources": sorted(PRODUCT_SOURCES),
    "offer_statuses": sorted(OFFER_STATUSES),
}


def normalize_token(value: str) -> str:
    return value.strip().lower().replace(" ", "_").replace("-", "_")


def validate_token(field_name: str, value: str | None, allowed: set[str]) -> str | None:
    if value is None:
        return None
    normalized = normalize_token(value)
    if normalized not in allowed:
        raise ValueError(f"{field_name} must be one of: {', '.join(sorted(allowed))}")
    return normalized


def validate_tokens(field_name: str, values: Iterable[str] | None, allowed: set[str]) -> list[str] | None:
    if values is None:
        return None
    return [token for value in values if (token := validate_token(field_name, value, allowed))]
