from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


MatchStatus = Literal["enough", "use_differently", "not_suitable", "missing", "needs_confirmation"]
OverallStatus = Literal["ready_now", "needs_confirmation", "shopping_gaps"]


class LookRoleRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    look_id: int
    role_key: str
    title: str
    description: str
    required: bool
    native_category: str
    accepted_categories: list[str]
    accepted_color_families: list[str]
    accepted_undertones: list[str]
    accepted_finishes: list[str]
    accepted_textures: list[str]
    accepted_coverage: list[str]
    intensity_min: int | None
    intensity_max: int | None
    sort_order: int


class LookRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    title: str
    description: str
    difficulty: str
    occasion: str
    reference_image_url: str | None
    is_active: bool
    roles: list[LookRoleRead] = []


class LookCreate(BaseModel):
    slug: str = Field(min_length=1, max_length=120)
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1)
    difficulty: str = Field(min_length=1, max_length=40)
    occasion: str = Field(min_length=1, max_length=80)
    reference_image_url: str | None = Field(default=None, max_length=500)
    is_active: bool = True


class LookUpdate(BaseModel):
    slug: str | None = Field(default=None, min_length=1, max_length=120)
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, min_length=1)
    difficulty: str | None = Field(default=None, min_length=1, max_length=40)
    occasion: str | None = Field(default=None, min_length=1, max_length=80)
    reference_image_url: str | None = Field(default=None, max_length=500)
    is_active: bool | None = None


class LookRoleCreate(BaseModel):
    look_id: int
    role_key: str = Field(min_length=1, max_length=120)
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1)
    required: bool = True
    native_category: str = Field(min_length=1, max_length=80)
    accepted_categories: list[str] = []
    accepted_color_families: list[str] = []
    accepted_undertones: list[str] = []
    accepted_finishes: list[str] = []
    accepted_textures: list[str] = []
    accepted_coverage: list[str] = []
    intensity_min: int | None = Field(default=None, ge=0, le=10)
    intensity_max: int | None = Field(default=None, ge=0, le=10)
    sort_order: int = 0


class LookRoleUpdate(BaseModel):
    role_key: str | None = Field(default=None, min_length=1, max_length=120)
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, min_length=1)
    required: bool | None = None
    native_category: str | None = Field(default=None, min_length=1, max_length=80)
    accepted_categories: list[str] | None = None
    accepted_color_families: list[str] | None = None
    accepted_undertones: list[str] | None = None
    accepted_finishes: list[str] | None = None
    accepted_textures: list[str] | None = None
    accepted_coverage: list[str] | None = None
    intensity_min: int | None = Field(default=None, ge=0, le=10)
    intensity_max: int | None = Field(default=None, ge=0, le=10)
    sort_order: int | None = None


class TutorialStepRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    tutorial_id: int
    look_role_id: int | None
    step_number: int
    title: str
    instruction: str
    technique_tip: str | None
    common_mistake: str | None


class TutorialRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    look_id: int
    title: str
    summary: str
    steps: list[TutorialStepRead] = []


class TutorialCreate(BaseModel):
    look_id: int
    title: str = Field(min_length=1, max_length=200)
    summary: str = Field(min_length=1)


class TutorialUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    summary: str | None = Field(default=None, min_length=1)


class TutorialStepCreate(BaseModel):
    tutorial_id: int
    look_role_id: int | None = None
    step_number: int = Field(ge=1)
    title: str = Field(min_length=1, max_length=200)
    instruction: str = Field(min_length=1)
    technique_tip: str | None = None
    common_mistake: str | None = None


class TutorialStepUpdate(BaseModel):
    look_role_id: int | None = None
    step_number: int | None = Field(default=None, ge=1)
    title: str | None = Field(default=None, min_length=1, max_length=200)
    instruction: str | None = Field(default=None, min_length=1)
    technique_tip: str | None = None
    common_mistake: str | None = None


class ProductBase(BaseModel):
    brand: str = Field(min_length=1, max_length=160)
    name: str = Field(min_length=1, max_length=200)
    category: str = Field(min_length=1, max_length=80)
    color_family: str | None = Field(default=None, max_length=80)
    undertone: str | None = Field(default=None, max_length=80)
    finish: str | None = Field(default=None, max_length=80)
    texture: str | None = Field(default=None, max_length=80)
    coverage: str | None = Field(default=None, max_length=80)
    intensity: int | None = Field(default=None, ge=0, le=10)
    is_multi_use_safe: bool = False
    source: str = Field(default="manual", max_length=80)
    confidence: float | None = Field(default=1.0, ge=0, le=1)
    expires_at: datetime | None = None


class ProductCreate(ProductBase):
    pass


class UserProductRead(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int


class ShoppingGap(BaseModel):
    gap_id: str
    needed_category: str
    needed_description: str


class RoleMatch(BaseModel):
    look_role_id: int
    role_key: str
    required: bool
    status: MatchStatus
    score: int
    matched_product_id: int | None
    reason: str
    how_to_use: str | None
    shopping_gap: ShoppingGap | None = None


class ReadinessReport(BaseModel):
    user_id: int
    look_id: int
    overall_status: OverallStatus
    readiness_score: int
    role_matches: list[RoleMatch]


class StoreRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    city: str
    country: str
    latitude: float
    longitude: float


class StoreCreate(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    city: str = Field(min_length=1, max_length=120)
    country: str = Field(min_length=1, max_length=120)
    latitude: float
    longitude: float


class StoreUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=160)
    city: str | None = Field(default=None, min_length=1, max_length=120)
    country: str | None = Field(default=None, min_length=1, max_length=120)
    latitude: float | None = None
    longitude: float | None = None


class StoreOfferRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    store_id: int
    product_name: str
    brand: str
    category: str
    color_family: str | None
    price: float
    currency: str
    availability_status: str
    source_label: str
    store: StoreRead | None = None


class StoreOfferCreate(BaseModel):
    store_id: int
    product_name: str = Field(min_length=1, max_length=200)
    brand: str = Field(min_length=1, max_length=160)
    category: str = Field(min_length=1, max_length=80)
    color_family: str | None = Field(default=None, max_length=80)
    price: float = Field(ge=0)
    currency: str = Field(min_length=1, max_length=12)
    availability_status: str = Field(min_length=1, max_length=80)
    source_label: str = Field(min_length=1, max_length=160)


class StoreOfferUpdate(BaseModel):
    store_id: int | None = None
    product_name: str | None = Field(default=None, min_length=1, max_length=200)
    brand: str | None = Field(default=None, min_length=1, max_length=160)
    category: str | None = Field(default=None, min_length=1, max_length=80)
    color_family: str | None = Field(default=None, max_length=80)
    price: float | None = Field(default=None, ge=0)
    currency: str | None = Field(default=None, min_length=1, max_length=12)
    availability_status: str | None = Field(default=None, min_length=1, max_length=80)
    source_label: str | None = Field(default=None, min_length=1, max_length=160)
