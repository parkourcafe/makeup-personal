from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models import Look, User, UserProduct
from app.schemas import ReadinessReport
from app.services.matching import build_readiness_report


router = APIRouter(tags=["matching"])


@router.post("/users/{user_id}/looks/{look_id}/readiness", response_model=ReadinessReport)
def get_readiness_report(user_id: int, look_id: int, db: Session = Depends(get_db)) -> ReadinessReport:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="user not found")

    look = db.scalar(
        select(Look)
        .where(Look.id == look_id, Look.is_active.is_(True))
        .options(selectinload(Look.roles))
    )
    if look is None:
        raise HTTPException(status_code=404, detail="look not found")

    products = list(db.scalars(select(UserProduct).where(UserProduct.user_id == user_id).order_by(UserProduct.id)).all())
    return build_readiness_report(look=look, products=products, user_id=user.id)
