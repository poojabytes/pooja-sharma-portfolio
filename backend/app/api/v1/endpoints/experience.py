from fastapi import APIRouter

from app.core.dependencies import CurrentAdmin, DbSession
from app.core.exceptions import NotFoundError
from app.models.experience import Experience
from app.repositories.generic_repository import OrderedRepository
from app.schemas.content import ExperienceCreate, ExperiencePublic
from app.schemas.common import MessageResponse

public_router = APIRouter(prefix="/experience", tags=["experience"])
admin_router = APIRouter(prefix="/admin/experience", tags=["admin-experience"])


@public_router.get("", response_model=list[ExperiencePublic])
def list_experience(db: DbSession) -> list[ExperiencePublic]:
    return [
        ExperiencePublic.model_validate(e)
        for e in OrderedRepository(db, Experience).list_all()
    ]


@admin_router.post("", response_model=ExperiencePublic, status_code=201)
def create_experience(
    payload: ExperienceCreate, db: DbSession, _admin: CurrentAdmin
) -> ExperiencePublic:
    return ExperiencePublic.model_validate(
        OrderedRepository(db, Experience).create(**payload.model_dump())
    )


@admin_router.put("/{item_id}", response_model=ExperiencePublic)
def update_experience(
    item_id: int, payload: ExperienceCreate, db: DbSession, _admin: CurrentAdmin
) -> ExperiencePublic:
    repo = OrderedRepository(db, Experience)
    item = repo.get(item_id)
    if not item:
        raise NotFoundError()
    for k, v in payload.model_dump().items():
        setattr(item, k, v)
    return ExperiencePublic.model_validate(item)


@admin_router.delete("/{item_id}", response_model=MessageResponse)
def delete_experience(item_id: int, db: DbSession, _admin: CurrentAdmin) -> MessageResponse:
    repo = OrderedRepository(db, Experience)
    item = repo.get(item_id)
    if not item:
        raise NotFoundError()
    repo.delete(item)
    return MessageResponse(message="Deleted")