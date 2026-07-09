"""initial schema

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2026-07-09 00:00:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _timestamps() -> list[sa.Column]:
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    ]


def upgrade() -> None:
    op.create_table(
        "looks",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("difficulty", sa.String(length=40), nullable=False),
        sa.Column("occasion", sa.String(length=80), nullable=False),
        sa.Column("reference_image_url", sa.String(length=500), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        *_timestamps(),
    )
    op.create_index(op.f("ix_looks_slug"), "looks", ["slug"], unique=True)

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("display_name", sa.String(length=160), nullable=False),
        sa.Column("language", sa.String(length=20), nullable=False),
        sa.Column("skin_depth", sa.String(length=40), nullable=True),
        sa.Column("skin_undertone", sa.String(length=40), nullable=True),
        *_timestamps(),
    )

    op.create_table(
        "look_roles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("look_id", sa.Integer(), sa.ForeignKey("looks.id", ondelete="CASCADE"), nullable=False),
        sa.Column("role_key", sa.String(length=120), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("required", sa.Boolean(), nullable=False),
        sa.Column("native_category", sa.String(length=80), nullable=False),
        sa.Column("accepted_categories", sa.JSON(), nullable=False),
        sa.Column("accepted_color_families", sa.JSON(), nullable=False),
        sa.Column("accepted_undertones", sa.JSON(), nullable=False),
        sa.Column("accepted_finishes", sa.JSON(), nullable=False),
        sa.Column("accepted_textures", sa.JSON(), nullable=False),
        sa.Column("accepted_coverage", sa.JSON(), nullable=False),
        sa.Column("intensity_min", sa.Integer(), nullable=True),
        sa.Column("intensity_max", sa.Integer(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        *_timestamps(),
        sa.UniqueConstraint("look_id", "role_key", name="uq_look_role_key"),
    )

    op.create_table(
        "tutorials",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("look_id", sa.Integer(), sa.ForeignKey("looks.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False),
        *_timestamps(),
    )

    op.create_table(
        "user_products",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("brand", sa.String(length=160), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("category", sa.String(length=80), nullable=False),
        sa.Column("color_family", sa.String(length=80), nullable=True),
        sa.Column("undertone", sa.String(length=80), nullable=True),
        sa.Column("finish", sa.String(length=80), nullable=True),
        sa.Column("texture", sa.String(length=80), nullable=True),
        sa.Column("coverage", sa.String(length=80), nullable=True),
        sa.Column("intensity", sa.Integer(), nullable=True),
        sa.Column("is_multi_use_safe", sa.Boolean(), nullable=False),
        sa.Column("source", sa.String(length=80), nullable=False),
        sa.Column("confidence", sa.Float(), nullable=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
        *_timestamps(),
    )

    op.create_table(
        "tutorial_steps",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("tutorial_id", sa.Integer(), sa.ForeignKey("tutorials.id", ondelete="CASCADE"), nullable=False),
        sa.Column("look_role_id", sa.Integer(), sa.ForeignKey("look_roles.id", ondelete="SET NULL"), nullable=True),
        sa.Column("step_number", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("instruction", sa.Text(), nullable=False),
        sa.Column("technique_tip", sa.Text(), nullable=True),
        sa.Column("common_mistake", sa.Text(), nullable=True),
        *_timestamps(),
        sa.UniqueConstraint("tutorial_id", "step_number", name="uq_tutorial_step_number"),
    )


def downgrade() -> None:
    op.drop_table("tutorial_steps")
    op.drop_table("user_products")
    op.drop_table("tutorials")
    op.drop_table("look_roles")
    op.drop_table("users")
    op.drop_index(op.f("ix_looks_slug"), table_name="looks")
    op.drop_table("looks")
