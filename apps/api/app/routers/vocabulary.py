from fastapi import APIRouter

from app.domain.vocabulary import VOCABULARY


router = APIRouter(tags=["vocabulary"])


@router.get("/vocabulary")
def get_vocabulary() -> dict[str, list[str]]:
    return VOCABULARY
