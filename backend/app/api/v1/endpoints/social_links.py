from fastapi import APIRouter

from app.core.dependencies import CurrentAdmin, DbSession
from app.core.exceptions import NotFoundError
from app.models.social_link import SocialLink
from app.repositories.generic_repository import OrderedRepository
from app.schemas.content import SocialLinkCreate, SocialLinkPublic
from app.schemas.common import MessageResponse

public_router = APIRouter(prefix="/social-links", tags=["social-links"])
admin_router = APIRouter(prefix="/admin/social-links", tags=["admin-social-links"])


@public_router.get("", response_model=list[SocialLinkPublic])
def list_social_links(db: DbSession) -> list[SocialLinkPublic]:
    items = OrderedRepository(db, SocialLink).list_all()
    return [SocialLinkPublic.model_validate(i) for i in items]


@admin_router.post("", response_model=SocialLinkPublic, status_code=201)
def create_link(payload: SocialLinkCreate, db: DbSession, _admin: CurrentAdmin) -> SocialLinkPublic:
    item = OrderedRepository(db, SocialLink).create(**payload.model_dump())
    return SocialLinkPublic.model_validate(item)


@admin_router.put("/{item_id}", response_model=SocialLinkPublic)
def update_link(
    item_id: int, payload: SocialLinkCreate, db: DbSession, _admin: CurrentAdmin
) -> SocialLinkPublic:
    repo = OrderedRepository(db, SocialLink)
    item = repo.get(item_id)
    if not item:
        raise NotFoundError()
    for k, v in payload.model_dump().items():
        setattr(item, k, v)
    return SocialLinkPublic.model_validate(item)


@admin_router.delete("/{item_id}", response_model=MessageResponse)
def delete_link(item_id: int, db: DbSession, _admin: CurrentAdmin) -> MessageResponse:
    repo = OrderedRepository(db, SocialLink)
    item = repo.get(item_id)
    if not item:
        raise NotFoundError()
    repo.delete(item)
    return MessageResponse(message="Deleted")