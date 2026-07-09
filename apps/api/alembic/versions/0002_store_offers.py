"""store offers

Revision ID: 0002_store_offers
Revises: 0001_initial_schema
Create Date: 2026-07-10 00:00:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0002_store_offers"
down_revision: Union[str, None] = "0001_initial_schema"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _timestamps() -> list[sa.Column]:
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    ]


def upgrade() -> None:
    op.create_table(
        "stores",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=160), nullable=False),
        sa.Column("city", sa.String(length=120), nullable=False),
        sa.Column("country", sa.String(length=120), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=False),
        sa.Column("longitude", sa.Float(), nullable=False),
        *_timestamps(),
    )
    op.create_table(
        "store_offers",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("store_id", sa.Integer(), sa.ForeignKey("stores.id", ondelete="CASCADE"), nullable=False),
        sa.Column("product_name", sa.String(length=200), nullable=False),
        sa.Column("brand", sa.String(length=160), nullable=False),
        sa.Column("category", sa.String(length=80), nullable=False),
        sa.Column("color_family", sa.String(length=80), nullable=True),
        sa.Column("price", sa.Float(), nullable=False),
        sa.Column("currency", sa.String(length=12), nullable=False),
        sa.Column("availability_status", sa.String(length=80), nullable=False),
        sa.Column("source_label", sa.String(length=160), nullable=False),
        *_timestamps(),
    )


def downgrade() -> None:
    op.drop_table("store_offers")
    op.drop_table("stores")
