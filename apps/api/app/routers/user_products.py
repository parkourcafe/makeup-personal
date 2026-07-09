from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import User, UserProduct
from app.schemas import ProductCreate, UserProductRead


router = APIRouter(tags=["user_products"])


@router.get("/users/{user_id}/products", response_model=list[UserProductRead])
def list_user_products(user_id: int, db: Session = Depends(get_db)) -> list[UserProduct]:
    _get_user_or_404(user_id, db)
    return list(db.scalars(select(UserProduct).where(UserProduct.user_id == user_id).order_by(UserProduct.id)).all())


@router.post("/users/{user_id}/products", response_model=UserProductRead, status_code=status.HTTP_201_CREATED)
def create_user_product(user_id: int, payload: ProductCreate, db: Session = Depends(get_db)) -> UserProduct:
    _get_user_or_404(user_id, db)
    product = UserProduct(user_id=user_id, **payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/users/{user_id}/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_product(user_id: int, product_id: int, db: Session = Depends(get_db)) -> Response:
    _get_user_or_404(user_id, db)
    product = db.scalar(select(UserProduct).where(UserProduct.id == product_id, UserProduct.user_id == user_id))
    if product is None:
        raise HTTPException(status_code=404, detail="product not found")
    db.delete(product)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


def _get_user_or_404(user_id: int, db: Session) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="user not found")
    return user
