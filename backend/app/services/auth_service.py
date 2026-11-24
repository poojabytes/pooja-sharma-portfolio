from sqlalchemy.orm import Session

from app.core.exceptions import AppError, UnauthorizedError
from app.core.security import create_access_token, verify_password
from app.repositories.admin_repository import AdminRepository


class AuthService:
    def __init__(self, db: Session) -> None:
        self.admins = AdminRepository(db)

    def login(self, email: str, password: str) -> tuple[str, int]:
        admin = self.admins.get_by_email(email)
        if not admin or not admin.is_active:
            raise UnauthorizedError("Invalid email or password")
        if not verify_password(password, admin.password_hash):
            raise UnauthorizedError("Invalid email or password")
        token = create_access_token(str(admin.id), {"email": admin.email})
        return token, admin.id

    def ensure_admin_exists_for_init(self, email: str) -> None:
        if self.admins.get_by_email(email):
            raise AppError("Admin account already exists", status_code=409)
        if self.admins.count() > 0:
            raise AppError("Admin initialization is only allowed once", status_code=409)