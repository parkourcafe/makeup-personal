from typing import TypeVar

from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models import Look, LookRole, Store, StoreOffer, Tutorial, TutorialStep
from app.schemas import (
    LookCreate,
    LookRead,
    LookRoleCreate,
    LookRoleRead,
    LookRoleUpdate,
    LookUpdate,
    StoreCreate,
    StoreOfferCreate,
    StoreOfferRead,
    StoreOfferUpdate,
    StoreRead,
    StoreUpdate,
    TutorialCreate,
    TutorialRead,
    TutorialStepCreate,
    TutorialStepRead,
    TutorialStepUpdate,
    TutorialUpdate,
)


router = APIRouter(prefix="/admin", tags=["admin"])
ModelT = TypeVar("ModelT")


@router.post("/looks", response_model=LookRead, status_code=status.HTTP_201_CREATED)
def create_look(payload: LookCreate, db: Session = Depends(get_db)) -> Look:
    look = Look(**payload.model_dump())
    db.add(look)
    db.commit()
    return _load_look(db, look.id)


@router.put("/looks/{look_id}", response_model=LookRead)
def update_look(look_id: int, payload: LookUpdate, db: Session = Depends(get_db)) -> Look:
    look = _get_or_404(db, Look, look_id, "look not found")
    _apply_update(look, payload)
    db.commit()
    return _load_look(db, look.id)


@router.delete("/looks/{look_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_look(look_id: int, db: Session = Depends(get_db)) -> Response:
    look = _get_or_404(db, Look, look_id, "look not found")
    db.delete(look)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/look-roles", response_model=LookRoleRead, status_code=status.HTTP_201_CREATED)
def create_look_role(payload: LookRoleCreate, db: Session = Depends(get_db)) -> LookRole:
    _get_or_404(db, Look, payload.look_id, "look not found")
    role = LookRole(**payload.model_dump())
    db.add(role)
    db.commit()
    db.refresh(role)
    return role


@router.put("/look-roles/{role_id}", response_model=LookRoleRead)
def update_look_role(role_id: int, payload: LookRoleUpdate, db: Session = Depends(get_db)) -> LookRole:
    role = _get_or_404(db, LookRole, role_id, "look role not found")
    _apply_update(role, payload)
    db.commit()
    db.refresh(role)
    return role


@router.delete("/look-roles/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_look_role(role_id: int, db: Session = Depends(get_db)) -> Response:
    role = _get_or_404(db, LookRole, role_id, "look role not found")
    db.delete(role)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/tutorials", response_model=TutorialRead, status_code=status.HTTP_201_CREATED)
def create_tutorial(payload: TutorialCreate, db: Session = Depends(get_db)) -> Tutorial:
    _get_or_404(db, Look, payload.look_id, "look not found")
    tutorial = Tutorial(**payload.model_dump())
    db.add(tutorial)
    db.commit()
    return _load_tutorial(db, tutorial.id)


@router.put("/tutorials/{tutorial_id}", response_model=TutorialRead)
def update_tutorial(tutorial_id: int, payload: TutorialUpdate, db: Session = Depends(get_db)) -> Tutorial:
    tutorial = _get_or_404(db, Tutorial, tutorial_id, "tutorial not found")
    _apply_update(tutorial, payload)
    db.commit()
    return _load_tutorial(db, tutorial.id)


@router.delete("/tutorials/{tutorial_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tutorial(tutorial_id: int, db: Session = Depends(get_db)) -> Response:
    tutorial = _get_or_404(db, Tutorial, tutorial_id, "tutorial not found")
    db.delete(tutorial)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/tutorial-steps", response_model=TutorialStepRead, status_code=status.HTTP_201_CREATED)
def create_tutorial_step(payload: TutorialStepCreate, db: Session = Depends(get_db)) -> TutorialStep:
    _get_or_404(db, Tutorial, payload.tutorial_id, "tutorial not found")
    if payload.look_role_id is not None:
        _get_or_404(db, LookRole, payload.look_role_id, "look role not found")
    step = TutorialStep(**payload.model_dump())
    db.add(step)
    db.commit()
    db.refresh(step)
    return step


@router.put("/tutorial-steps/{step_id}", response_model=TutorialStepRead)
def update_tutorial_step(step_id: int, payload: TutorialStepUpdate, db: Session = Depends(get_db)) -> TutorialStep:
    step = _get_or_404(db, TutorialStep, step_id, "tutorial step not found")
    if payload.look_role_id is not None:
        _get_or_404(db, LookRole, payload.look_role_id, "look role not found")
    _apply_update(step, payload)
    db.commit()
    db.refresh(step)
    return step


@router.delete("/tutorial-steps/{step_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tutorial_step(step_id: int, db: Session = Depends(get_db)) -> Response:
    step = _get_or_404(db, TutorialStep, step_id, "tutorial step not found")
    db.delete(step)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/stores", response_model=StoreRead, status_code=status.HTTP_201_CREATED)
def create_store(payload: StoreCreate, db: Session = Depends(get_db)) -> Store:
    store = Store(**payload.model_dump())
    db.add(store)
    db.commit()
    db.refresh(store)
    return store


@router.put("/stores/{store_id}", response_model=StoreRead)
def update_store(store_id: int, payload: StoreUpdate, db: Session = Depends(get_db)) -> Store:
    store = _get_or_404(db, Store, store_id, "store not found")
    _apply_update(store, payload)
    db.commit()
    db.refresh(store)
    return store


@router.delete("/stores/{store_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_store(store_id: int, db: Session = Depends(get_db)) -> Response:
    store = _get_or_404(db, Store, store_id, "store not found")
    db.delete(store)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/store-offers", response_model=StoreOfferRead, status_code=status.HTTP_201_CREATED)
def create_store_offer(payload: StoreOfferCreate, db: Session = Depends(get_db)) -> StoreOffer:
    _get_or_404(db, Store, payload.store_id, "store not found")
    offer = StoreOffer(**payload.model_dump())
    db.add(offer)
    db.commit()
    return _load_store_offer(db, offer.id)


@router.put("/store-offers/{offer_id}", response_model=StoreOfferRead)
def update_store_offer(offer_id: int, payload: StoreOfferUpdate, db: Session = Depends(get_db)) -> StoreOffer:
    offer = _get_or_404(db, StoreOffer, offer_id, "store offer not found")
    if payload.store_id is not None:
        _get_or_404(db, Store, payload.store_id, "store not found")
    _apply_update(offer, payload)
    db.commit()
    return _load_store_offer(db, offer.id)


@router.delete("/store-offers/{offer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_store_offer(offer_id: int, db: Session = Depends(get_db)) -> Response:
    offer = _get_or_404(db, StoreOffer, offer_id, "store offer not found")
    db.delete(offer)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


def _get_or_404(db: Session, model: type[ModelT], item_id: int, detail: str) -> ModelT:
    item = db.get(model, item_id)
    if item is None:
        raise HTTPException(status_code=404, detail=detail)
    return item


def _apply_update(model: object, payload: BaseModel) -> None:
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(model, key, value)


def _load_look(db: Session, look_id: int) -> Look:
    look = db.scalar(select(Look).where(Look.id == look_id).options(selectinload(Look.roles)))
    if look is None:
        raise HTTPException(status_code=404, detail="look not found")
    return look


def _load_tutorial(db: Session, tutorial_id: int) -> Tutorial:
    tutorial = db.scalar(select(Tutorial).where(Tutorial.id == tutorial_id).options(selectinload(Tutorial.steps)))
    if tutorial is None:
        raise HTTPException(status_code=404, detail="tutorial not found")
    return tutorial


def _load_store_offer(db: Session, offer_id: int) -> StoreOffer:
    offer = db.scalar(select(StoreOffer).where(StoreOffer.id == offer_id).options(selectinload(StoreOffer.store)))
    if offer is None:
        raise HTTPException(status_code=404, detail="store offer not found")
    return offer
