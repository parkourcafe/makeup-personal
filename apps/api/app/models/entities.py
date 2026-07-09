from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, JSON, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class Look(TimestampMixin, Base):
    __tablename__ = "looks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    difficulty: Mapped[str] = mapped_column(String(40), nullable=False)
    occasion: Mapped[str] = mapped_column(String(80), nullable=False)
    reference_image_url: Mapped[str | None] = mapped_column(String(500))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    roles: Mapped[list["LookRole"]] = relationship(
        back_populates="look",
        cascade="all, delete-orphan",
        order_by="LookRole.sort_order",
    )
    tutorial: Mapped["Tutorial | None"] = relationship(
        back_populates="look",
        cascade="all, delete-orphan",
        uselist=False,
    )


class LookRole(TimestampMixin, Base):
    __tablename__ = "look_roles"
    __table_args__ = (UniqueConstraint("look_id", "role_key", name="uq_look_role_key"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    look_id: Mapped[int] = mapped_column(ForeignKey("looks.id", ondelete="CASCADE"), nullable=False)
    role_key: Mapped[str] = mapped_column(String(120), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    required: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    native_category: Mapped[str] = mapped_column(String(80), nullable=False)
    accepted_categories: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    accepted_color_families: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    accepted_undertones: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    accepted_finishes: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    accepted_textures: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    accepted_coverage: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    intensity_min: Mapped[int | None] = mapped_column(Integer)
    intensity_max: Mapped[int | None] = mapped_column(Integer)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    look: Mapped[Look] = relationship(back_populates="roles")
    tutorial_steps: Mapped[list["TutorialStep"]] = relationship(back_populates="look_role")


class Tutorial(TimestampMixin, Base):
    __tablename__ = "tutorials"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    look_id: Mapped[int] = mapped_column(ForeignKey("looks.id", ondelete="CASCADE"), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)

    look: Mapped[Look] = relationship(back_populates="tutorial")
    steps: Mapped[list["TutorialStep"]] = relationship(
        back_populates="tutorial",
        cascade="all, delete-orphan",
        order_by="TutorialStep.step_number",
    )


class TutorialStep(TimestampMixin, Base):
    __tablename__ = "tutorial_steps"
    __table_args__ = (UniqueConstraint("tutorial_id", "step_number", name="uq_tutorial_step_number"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    tutorial_id: Mapped[int] = mapped_column(ForeignKey("tutorials.id", ondelete="CASCADE"), nullable=False)
    look_role_id: Mapped[int | None] = mapped_column(ForeignKey("look_roles.id", ondelete="SET NULL"))
    step_number: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    instruction: Mapped[str] = mapped_column(Text, nullable=False)
    technique_tip: Mapped[str | None] = mapped_column(Text)
    common_mistake: Mapped[str | None] = mapped_column(Text)

    tutorial: Mapped[Tutorial] = relationship(back_populates="steps")
    look_role: Mapped[LookRole | None] = relationship(back_populates="tutorial_steps")


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    display_name: Mapped[str] = mapped_column(String(160), nullable=False)
    language: Mapped[str] = mapped_column(String(20), default="en", nullable=False)
    skin_depth: Mapped[str | None] = mapped_column(String(40))
    skin_undertone: Mapped[str | None] = mapped_column(String(40))

    products: Mapped[list["UserProduct"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        order_by="UserProduct.id",
    )


class UserProduct(TimestampMixin, Base):
    __tablename__ = "user_products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    brand: Mapped[str] = mapped_column(String(160), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(80), nullable=False)
    color_family: Mapped[str | None] = mapped_column(String(80))
    undertone: Mapped[str | None] = mapped_column(String(80))
    finish: Mapped[str | None] = mapped_column(String(80))
    texture: Mapped[str | None] = mapped_column(String(80))
    coverage: Mapped[str | None] = mapped_column(String(80))
    intensity: Mapped[int | None] = mapped_column(Integer)
    is_multi_use_safe: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    source: Mapped[str] = mapped_column(String(80), default="manual", nullable=False)
    confidence: Mapped[float | None] = mapped_column(Float, default=1.0)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    user: Mapped[User] = relationship(back_populates="products")


class Store(TimestampMixin, Base):
    __tablename__ = "stores"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    city: Mapped[str] = mapped_column(String(120), nullable=False)
    country: Mapped[str] = mapped_column(String(120), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)

    offers: Mapped[list["StoreOffer"]] = relationship(
        back_populates="store",
        cascade="all, delete-orphan",
        order_by="StoreOffer.id",
    )


class StoreOffer(TimestampMixin, Base):
    __tablename__ = "store_offers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    store_id: Mapped[int] = mapped_column(ForeignKey("stores.id", ondelete="CASCADE"), nullable=False)
    product_name: Mapped[str] = mapped_column(String(200), nullable=False)
    brand: Mapped[str] = mapped_column(String(160), nullable=False)
    category: Mapped[str] = mapped_column(String(80), nullable=False)
    color_family: Mapped[str | None] = mapped_column(String(80))
    price: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(12), nullable=False)
    availability_status: Mapped[str] = mapped_column(String(80), nullable=False)
    source_label: Mapped[str] = mapped_column(String(160), nullable=False)

    store: Mapped[Store] = relationship(back_populates="offers")
