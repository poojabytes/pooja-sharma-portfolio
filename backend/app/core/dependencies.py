from typing import Annotated

from fastapi import Cookie, Depends
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.exceptions import UnauthorizedError
from app.core.security import decode_access_token
from app.db.database import get_db
from app.models.admin import Admin
from app.repositories.admin_repository import AdminRepository

settings = get_settings()
DbSession = Annotated[Session, Depends(get_db)]


def get_admin_repository(db: DbSession) -> AdminRepository:
    return AdminRepository(db)


def get_current_admin(
    db: DbSession,
    access_token: Annotated[str | None, Cookie(alias=settings.access_token_cookie_name)] = None,
) -> Admin:
    if not access_token:
        raise UnauthorizedError()
    try:
        payload = decode_access_token(access_token)
        admin_id = payload.get("sub")
        if not admin_id:
            raise UnauthorizedError()
    except Exception as exc:
        raise UnauthorizedError("Invalid or expired session") from exc

    admin = AdminRepository(db).get_by_id(int(admin_id))
    if not admin or not admin.is_active:
        raise UnauthorizedError()
    return admin


CurrentAdmin = Annotated[Admin, Depends(get_current_admin)]