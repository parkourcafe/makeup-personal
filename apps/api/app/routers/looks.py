from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models import Look, Tutorial
from app.schemas import LookRead, TutorialRead


router = APIRouter(tags=["looks"])


@router.get("/looks", response_model=list[LookRead])
def list_looks(db: Session = Depends(get_db)) -> list[Look]:
    statement = (
        select(Look)
        .where(Look.is_active.is_(True))
        .options(selectinload(Look.roles))
        .order_by(Look.id)
    )
    return list(db.scalars(statement).all())


@router.get("/looks/{look_id}", response_model=LookRead)
def get_look(look_id: int, db: Session = Depends(get_db)) -> Look:
    look = db.scalar(
        select(Look)
        .where(Look.id == look_id)
        .options(selectinload(Look.roles))
    )
    if look is None:
        raise HTTPException(status_code=404, detail="look not found")
    return look


@router.get("/looks/{look_id}/tutorial", response_model=TutorialRead)
def get_tutorial(look_id: int, db: Session = Depends(get_db)) -> Tutorial:
    tutorial = db.scalar(
        select(Tutorial)
        .where(Tutorial.look_id == look_id)
        .options(selectinload(Tutorial.steps))
    )
    if tutorial is None:
        raise HTTPException(status_code=404, detail="tutorial not found")
    return tutorial
