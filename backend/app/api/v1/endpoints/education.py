from fastapi import APIRouter

from app.core.dependencies import CurrentAdmin, DbSession
from app.core.exceptions import NotFoundError
from app.models.education import Education
from app.repositories.generic_repository import OrderedRepository
from app.schemas.content import EducationCreate, EducationPublic
from app.schemas.common import MessageResponse

public_router = APIRouter(prefix="/education", tags=["education"])
admin_router = APIRouter(prefix="/admin/education", tags=["admin-education"])


@public_router.get("", response_model=list[EducationPublic])
def list_education(db: DbSession) -> list[EducationPublic]:
    return [
        EducationPublic.model_validate(e) for e in OrderedRepository(db, Education).list_all()
    ]


@admin_router.post("", response_model=EducationPublic, status_code=201)
def create_education(
    payload: EducationCreate, db: DbSession, _admin: CurrentAdmin
) -> EducationPublic:
    return EducationPublic.model_validate(
        OrderedRepository(db, Education).create(**payload.model_dump())
    )


@admin_router.put("/{item_id}", response_model=EducationPublic)
def update_education(
    item_id: int, payload: EducationCreate, db: DbSession, _admin: CurrentAdmin
) -> EducationPublic:
    repo = OrderedRepository(db, Education)
    item = repo.get(item_id)
    if not item:
        raise NotFoundError()
    for k, v in payload.model_dump().items():
        setattr(item, k, v)
    return EducationPublic.model_validate(item)


@admin_router.delete("/{item_id}", response_model=MessageResponse)
def delete_education(item_id: int, db: DbSession, _admin: CurrentAdmin) -> MessageResponse:
    repo = OrderedRepository(db, Education)
    item = repo.get(item_id)
    if not item:
        raise NotFoundError()
    repo.delete(item)
    return MessageResponse(message="Deleted")