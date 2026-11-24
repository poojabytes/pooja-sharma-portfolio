from typing import Generic, TypeVar

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.base import Base

ModelT = TypeVar("ModelT", bound=Base)


class OrderedRepository(Generic[ModelT]):
    def __init__(self, db: Session, model: type[ModelT], order_field: str = "display_order") -> None:
        self.db = db
        self.model = model
        self.order_field = order_field

    def list_all(self) -> list[ModelT]:
        order_col = getattr(self.model, self.order_field)
        stmt = select(self.model).order_by(order_col, self.model.id)  # type: ignore[attr-defined]
        return list(self.db.scalars(stmt).all())

    def get(self, item_id: int) -> ModelT | None:
        return self.db.get(self.model, item_id)

    def create(self, **kwargs) -> ModelT:
        item = self.model(**kwargs)
        self.db.add(item)
        self.db.flush()
        return item

    def delete(self, item: ModelT) -> None:
        self.db.delete(item)