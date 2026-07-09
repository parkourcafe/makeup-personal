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
