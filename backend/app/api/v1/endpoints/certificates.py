from datetime import date

from fastapi import APIRouter, UploadFile
from pydantic import BaseModel, Field

from app.core.dependencies import CurrentAdmin, DbSession
from app.core.exceptions import NotFoundError
from app.models.certificate import Certificate
from app.repositories.generic_repository import OrderedRepository
from app.schemas.content import CertificatePublic
from app.schemas.common import MessageResponse
from app.services.cloudinary_service import delete_asset
from app.services.upload_service import upload_certificate_image, upload_certificate_pdf

public_router = APIRouter(prefix="/certificates", tags=["certificates"])
admin_router = APIRouter(prefix="/admin/certificates", tags=["admin-certificates"])


class CertificateCreate(BaseModel):
    title: str = Field(max_length=255)
    issuer: str | None = None
    issue_date: date | None = None
    image_url: str | None = None
    image_public_id: str | None = None
    pdf_url: str | None = None
    pdf_public_id: str | None = None
    display_order: int = 0


@public_router.get("", response_model=list[CertificatePublic])
def list_certificates(db: DbSession) -> list[CertificatePublic]:
    return [
        CertificatePublic.model_validate(c)
        for c in OrderedRepository(db, Certificate).list_all()
    ]


@admin_router.post("", response_model=CertificatePublic, status_code=201)
def create_certificate(
    payload: CertificateCreate, db: DbSession, _admin: CurrentAdmin
) -> CertificatePublic:
    return CertificatePublic.model_validate(
        OrderedRepository(db, Certificate).create(**payload.model_dump())
    )


@admin_router.put("/{item_id}", response_model=CertificatePublic)
def update_certificate(
    item_id: int, payload: CertificateCreate, db: DbSession, _admin: CurrentAdmin
) -> CertificatePublic:
    repo = OrderedRepository(db, Certificate)
    item = repo.get(item_id)
    if not item:
        raise NotFoundError()
    for k, v in payload.model_dump().items():
        setattr(item, k, v)
    return CertificatePublic.model_validate(item)


@admin_router.delete("/{item_id}", response_model=MessageResponse)
def delete_certificate(item_id: int, db: DbSession, _admin: CurrentAdmin) -> MessageResponse:
    repo = OrderedRepository(db, Certificate)
    item = repo.get(item_id)
    if not item:
        raise NotFoundError()
    repo.delete(item)
    return MessageResponse(message="Deleted")


@admin_router.post("/{item_id}/image", response_model=CertificatePublic)
async def upload_certificate_image_file(
    item_id: int,
    db: DbSession,
    _admin: CurrentAdmin,
    file: UploadFile,
) -> CertificatePublic:
    repo = OrderedRepository(db, Certificate)
    item = repo.get(item_id)
    if not item:
        raise NotFoundError()
    if item.image_public_id:
        delete_asset(item.image_public_id)
    url, public_id = await upload_certificate_image(file)
    item.image_url = url
    item.image_public_id = public_id
    return CertificatePublic.model_validate(item)


@admin_router.post("/{item_id}/pdf", response_model=CertificatePublic)
async def upload_certificate_pdf_file(
    item_id: int,
    db: DbSession,
    _admin: CurrentAdmin,
    file: UploadFile,
) -> CertificatePublic:
    repo = OrderedRepository(db, Certificate)
    item = repo.get(item_id)
    if not item:
        raise NotFoundError()
    if item.pdf_public_id:
        delete_asset(item.pdf_public_id, resource_type="raw")
    url, public_id = await upload_certificate_pdf(file)
    item.pdf_url = url
    item.pdf_public_id = public_id
    return CertificatePublic.model_validate(item)