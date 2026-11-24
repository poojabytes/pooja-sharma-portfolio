from fastapi import APIRouter, UploadFile

from app.core.dependencies import CurrentAdmin, DbSession
from app.core.exceptions import NotFoundError
from app.models.resume import Resume
from app.repositories.resume_repository import ResumeRepository
from app.schemas.content import ResumePublic
from app.schemas.common import MessageResponse
from app.services.cloudinary_service import delete_asset
from app.services.upload_service import upload_resume_pdf

public_router = APIRouter(prefix="/resume", tags=["resume"])
admin_router = APIRouter(prefix="/admin/resume", tags=["admin-resume"])


@public_router.get("", response_model=ResumePublic)
def get_resume(db: DbSession) -> ResumePublic:
    resume = ResumeRepository(db).get_active()
    if not resume:
        raise NotFoundError("Resume not available")
    return ResumePublic.model_validate(resume)


@admin_router.post("", response_model=ResumePublic, status_code=201)
async def upload_resume(db: DbSession, _admin: CurrentAdmin, file: UploadFile) -> ResumePublic:
    url, public_id, filename = await upload_resume_pdf(file)
    repo = ResumeRepository(db)
    old = repo.get_active()
    if old:
        delete_asset(old.public_id, resource_type="raw")
    resume = Resume(file_url=url, public_id=public_id, file_name=filename, is_active=True)
    resume = repo.set_active(resume)
    return ResumePublic.model_validate(resume)


@admin_router.delete("", response_model=MessageResponse)
def delete_resume(db: DbSession, _admin: CurrentAdmin) -> MessageResponse:
    repo = ResumeRepository(db)
    resume = repo.get_active()
    if not resume:
        raise NotFoundError()
    delete_asset(resume.public_id, resource_type="raw")
    resume.is_active = False
    db.delete(resume)
    return MessageResponse(message="Resume deleted")