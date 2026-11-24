from fastapi import APIRouter, Response, status

from app.core.config import get_settings
from app.core.dependencies import CurrentAdmin, DbSession
from app.schemas.auth import AdminPublic, LoginRequest
from app.schemas.common import MessageResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/admin", tags=["admin-auth"])
settings = get_settings()


@router.post("/login", response_model=MessageResponse)
def admin_login(payload: LoginRequest, response: Response, db: DbSession) -> MessageResponse:
    token, _admin_id = AuthService(db).login(payload.email, payload.password)
    max_age = settings.jwt_expire_minutes * 60
    response.set_cookie(
        key=settings.access_token_cookie_name,
        value=token,
        httponly=True,
        secure=settings.resolved_cookie_secure,
        samesite=settings.resolved_cookie_samesite,
        max_age=max_age,
        path="/",
    )
    return MessageResponse(message="Login successful")


@router.post("/logout", response_model=MessageResponse)
def admin_logout(response: Response) -> MessageResponse:
    response.delete_cookie(
        key=settings.access_token_cookie_name,
        path="/",
        httponly=True,
        secure=settings.resolved_cookie_secure,
        samesite=settings.resolved_cookie_samesite,
    )
    return MessageResponse(message="Logged out")


@router.get("/me", response_model=AdminPublic)
def admin_me(admin: CurrentAdmin) -> AdminPublic:
    return AdminPublic.model_validate(admin)