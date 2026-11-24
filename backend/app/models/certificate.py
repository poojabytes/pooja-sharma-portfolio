from datetime import date

from sqlalchemy import Date, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin


class Certificate(Base, TimestampMixin):
    __tablename__ = "certificates"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    issuer: Mapped[str | None] = mapped_column(String(255))
    issue_date: Mapped[date | None] = mapped_column(Date)
    image_url: Mapped[str | None] = mapped_column(String(1024))
    image_public_id: Mapped[str | None] = mapped_column(String(512))
    pdf_url: Mapped[str | None] = mapped_column(String(1024))
    pdf_public_id: Mapped[str | None] = mapped_column(String(512))
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)