from fastapi import APIRouter, Query, UploadFile

from app.core.dependencies import CurrentAdmin, DbSession
from app.core.exceptions import NotFoundError
from app.repositories.project_repository import ProjectRepository
from app.schemas.content import ProjectCreate, ProjectPublic
from app.schemas.common import MessageResponse
from app.services.cloudinary_service import delete_asset
from app.services.upload_service import upload_project_thumbnail

public_router = APIRouter(prefix="/projects", tags=["projects"])
admin_router = APIRouter(prefix="/admin/projects", tags=["admin-projects"])


@public_router.get("", response_model=list[ProjectPublic])
def list_projects(
    db: DbSession, featured: bool | None = Query(default=None)
) -> list[ProjectPublic]:
    items = ProjectRepository(db).list_public(featured_only=bool(featured))
    return [ProjectPublic.model_validate(p) for p in items]


@public_router.get("/{project_id}", response_model=ProjectPublic)
def get_project(project_id: int, db: DbSession) -> ProjectPublic:
    project = ProjectRepository(db).get_public(project_id)
    if not project:
        raise NotFoundError()
    return ProjectPublic.model_validate(project)


@admin_router.post("", response_model=ProjectPublic, status_code=201)
def create_project(
    payload: ProjectCreate, db: DbSession, _admin: CurrentAdmin
) -> ProjectPublic:
    return ProjectPublic.model_validate(
        ProjectRepository(db).create(**payload.model_dump())
    )


@admin_router.put("/{project_id}", response_model=ProjectPublic)
def update_project(
    project_id: int, payload: ProjectCreate, db: DbSession, _admin: CurrentAdmin
) -> ProjectPublic:
    repo = ProjectRepository(db)
    project = repo.get_public(project_id)
    if not project:
        raise NotFoundError()
    for k, v in payload.model_dump().items():
        setattr(project, k, v)
    return ProjectPublic.model_validate(project)


@admin_router.delete("/{project_id}", response_model=MessageResponse)
def delete_project(
    project_id: int, db: DbSession, _admin: CurrentAdmin
) -> MessageResponse:
    repo = ProjectRepository(db)
    project = repo.get_public(project_id)
    if not project:
        raise NotFoundError()
    repo.soft_delete(project)
    return MessageResponse(message="Project deleted")


@admin_router.post("/{project_id}/thumbnail", response_model=ProjectPublic)
async def upload_thumbnail(
    project_id: int,
    db: DbSession,
    _admin: CurrentAdmin,
    file: UploadFile,
) -> ProjectPublic:
    repo = ProjectRepository(db)
    project = repo.get_public(project_id)
    if not project:
        raise NotFoundError()
    if project.thumbnail_public_id:
        delete_asset(project.thumbnail_public_id)
    url, public_id = await upload_project_thumbnail(file)
    project.thumbnail_url = url
    project.thumbnail_public_id = public_id
    return ProjectPublic.model_validate(project)