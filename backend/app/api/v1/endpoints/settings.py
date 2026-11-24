from fastapi import APIRouter

from app.core.dependencies import DbSession
from app.models.website_settings import WebsiteSetting
from app.repositories.generic_repository import OrderedRepository
from app.schemas.content import WebsiteSettingPublic

PUBLIC_SETTING_KEYS = frozenset({"site_title", "default_theme"})

public_router = APIRouter(prefix="/settings", tags=["settings"])


@public_router.get("/public", response_model=list[WebsiteSettingPublic])
def list_public_settings(db: DbSession) -> list[WebsiteSettingPublic]:
    items = OrderedRepository(db, WebsiteSetting, order_field="key").list_all()
    public = [s for s in items if s.key in PUBLIC_SETTING_KEYS]
    return [WebsiteSettingPublic.model_validate(s) for s in public]