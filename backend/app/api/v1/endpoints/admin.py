from fastapi import APIRouter

from app.core.dependencies import CurrentAdmin, DbSession
from app.core.exceptions import NotFoundError
from app.models.website_settings import WebsiteSetting
from app.repositories.generic_repository import OrderedRepository
from app.repositories.profile_repository import ProfileRepository
from app.schemas.content import WebsiteSettingPublic
from app.schemas.common import MessageResponse
from pydantic import BaseModel, Field

router = APIRouter(prefix="/admin", tags=["admin"])


class SettingUpsert(BaseModel):
    key: str = Field(max_length=128)
    value: str


@router.get("/settings", response_model=list[WebsiteSettingPublic])
def list_settings(db: DbSession, _admin: CurrentAdmin) -> list[WebsiteSettingPublic]:
    items = OrderedRepository(db, WebsiteSetting, order_field="key").list_all()
    return [WebsiteSettingPublic.model_validate(i) for i in items]


@router.put("/settings", response_model=WebsiteSettingPublic)
def upsert_setting(payload: SettingUpsert, db: DbSession, _admin: CurrentAdmin) -> WebsiteSettingPublic:
    repo = OrderedRepository(db, WebsiteSetting, order_field="key")
    existing = next((s for s in repo.list_all() if s.key == payload.key), None)
    if existing:
        existing.value = payload.value
        return WebsiteSettingPublic.model_validate(existing)
    item = repo.create(key=payload.key, value=payload.value)
    return WebsiteSettingPublic.model_validate(item)


@router.get("/overview")
def overview(db: DbSession, _admin: CurrentAdmin) -> dict:
    profile = ProfileRepository(db).get_singleton()
    if not profile:
        raise NotFoundError("Initialize profile in admin dashboard")
    return {
        "profile_configured": True,
        "name": profile.name,
    }