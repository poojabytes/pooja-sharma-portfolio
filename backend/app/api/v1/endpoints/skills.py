from fastapi import APIRouter

from app.core.dependencies import CurrentAdmin, DbSession
from app.core.exceptions import NotFoundError
from app.models.skill import Skill
from app.repositories.generic_repository import OrderedRepository
from app.schemas.content import SkillCreate, SkillPublic
from app.schemas.common import MessageResponse

public_router = APIRouter(prefix="/skills", tags=["skills"])
admin_router = APIRouter(prefix="/admin/skills", tags=["admin-skills"])


@public_router.get("", response_model=list[SkillPublic])
def list_skills(db: DbSession) -> list[SkillPublic]:
    return [SkillPublic.model_validate(s) for s in OrderedRepository(db, Skill).list_all()]


@admin_router.post("", response_model=SkillPublic, status_code=201)
def create_skill(payload: SkillCreate, db: DbSession, _admin: CurrentAdmin) -> SkillPublic:
    return SkillPublic.model_validate(
        OrderedRepository(db, Skill).create(**payload.model_dump())
    )


@admin_router.put("/{skill_id}", response_model=SkillPublic)
def update_skill(
    skill_id: int, payload: SkillCreate, db: DbSession, _admin: CurrentAdmin
) -> SkillPublic:
    repo = OrderedRepository(db, Skill)
    skill = repo.get(skill_id)
    if not skill:
        raise NotFoundError()
    for k, v in payload.model_dump().items():
        setattr(skill, k, v)
    return SkillPublic.model_validate(skill)


@admin_router.delete("/{skill_id}", response_model=MessageResponse)
def delete_skill(skill_id: int, db: DbSession, _admin: CurrentAdmin) -> MessageResponse:
    repo = OrderedRepository(db, Skill)
    skill = repo.get(skill_id)
    if not skill:
        raise NotFoundError()
    repo.delete(skill)
    return MessageResponse(message="Deleted")