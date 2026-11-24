from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.admin import Admin


class AdminRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_id(self, admin_id: int) -> Admin | None:
        return self.db.get(Admin, admin_id)

    def get_by_email(self, email: str) -> Admin | None:
        stmt = select(Admin).where(Admin.email == email)
        return self.db.scalars(stmt).first()

    def count(self) -> int:
        return len(self.db.scalars(select(Admin)).all())

    def create(self, email: str, password_hash: str) -> Admin:
        admin = Admin(email=email, password_hash=password_hash)
        self.db.add(admin)
        self.db.flush()
        return admin