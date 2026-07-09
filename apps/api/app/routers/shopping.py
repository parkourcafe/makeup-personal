import re

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models import LookRole, StoreOffer
from app.schemas import StoreOfferRead


router = APIRouter(tags=["shopping"])

GAP_ID_PATTERN = re.compile(r"^look-(?P<look_id>\d+)-role-(?P<role_id>\d+)$")


@router.get("/shopping-gaps/{gap_id}/mock-offers", response_model=list[StoreOfferRead])
def get_mock_offers(gap_id: str, db: Session = Depends(get_db)) -> list[StoreOffer]:
    match = GAP_ID_PATTERN.match(gap_id)
    if match is None:
        raise HTTPException(status_code=404, detail="shopping gap not found")

    look_id = int(match.group("look_id"))
    role_id = int(match.group("role_id"))
    role = db.get(LookRole, role_id)
    if role is None or role.look_id != look_id:
        raise HTTPException(status_code=404, detail="shopping gap not found")

    statement = (
        select(StoreOffer)
        .where(StoreOffer.category == role.native_category)
        .options(selectinload(StoreOffer.store))
        .order_by(StoreOffer.price, StoreOffer.id)
    )
    return list(db.scalars(statement).all())
