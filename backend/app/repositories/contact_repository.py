from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.contact_message import ContactMessage


class ContactRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, **kwargs) -> ContactMessage:
        message = ContactMessage(**kwargs)
        self.db.add(message)
        self.db.flush()
        return message

    def list_admin(self, include_deleted: bool = False) -> list[ContactMessage]:
        stmt = select(ContactMessage).order_by(ContactMessage.created_at.desc())
        if not include_deleted:
            stmt = stmt.where(ContactMessage.is_deleted.is_(False))
        return list(self.db.scalars(stmt).all())

    def get(self, message_id: int) -> ContactMessage | None:
        return self.db.get(ContactMessage, message_id)