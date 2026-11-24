import mimetypes
from pathlib import Path

from fastapi import UploadFile

from app.core.exceptions import AppError
from app.services.cloudinary_service import (
    IMAGE_EXTENSIONS,
    MAX_IMAGE_BYTES,
    MAX_RESUME_BYTES,
    RESUME_EXTENSIONS,
    upload_file,
)

ALLOWED_IMAGE_MIME = {"image/jpeg", "image/png", "image/webp", "image/gif"}
ALLOWED_RESUME_MIME = {"application/pdf"}


async def read_upload_limited(file: UploadFile, max_bytes: int) -> bytes:
    data = await file.read()
    if len(data) > max_bytes:
        raise AppError(f"File exceeds maximum size of {max_bytes // (1024 * 1024)}MB")
    if len(data) == 0:
        raise AppError("Empty file upload")
    return data


def validate_extension(filename: str, allowed: set[str]) -> str:
    ext = Path(filename or "").suffix.lower()
    if ext not in allowed:
        raise AppError(f"Invalid file extension. Allowed: {', '.join(sorted(allowed))}")
    return ext


async def upload_profile_image(file: UploadFile) -> tuple[str, str]:
    validate_extension(file.filename or "", IMAGE_EXTENSIONS)
    content = await read_upload_limited(file, MAX_IMAGE_BYTES)
    mime = file.content_type or mimetypes.guess_type(file.filename or "")[0]
    if mime not in ALLOWED_IMAGE_MIME:
        raise AppError("Invalid image MIME type")
    result = upload_file(content, folder="portfolio/profile", public_id_prefix="profile")
    return result["secure_url"], result["public_id"]


async def upload_resume_pdf(file: UploadFile) -> tuple[str, str, str]:
    validate_extension(file.filename or "", RESUME_EXTENSIONS)
    content = await read_upload_limited(file, MAX_RESUME_BYTES)
    mime = file.content_type or mimetypes.guess_type(file.filename or "")[0]
    if mime not in ALLOWED_RESUME_MIME:
        raise AppError("Resume must be a PDF")
    result = upload_file(
        content,
        folder="portfolio/resume",
        public_id_prefix="resume",
        resource_type="raw",
    )
    return result["secure_url"], result["public_id"], file.filename or "resume.pdf"


async def upload_project_thumbnail(file: UploadFile) -> tuple[str, str]:
    validate_extension(file.filename or "", IMAGE_EXTENSIONS)
    content = await read_upload_limited(file, MAX_IMAGE_BYTES)
    mime = file.content_type or mimetypes.guess_type(file.filename or "")[0]
    if mime not in ALLOWED_IMAGE_MIME:
        raise AppError("Invalid image MIME type")
    result = upload_file(
        content, folder="portfolio/projects", public_id_prefix="project-thumb"
    )
    return result["secure_url"], result["public_id"]


async def upload_certificate_image(file: UploadFile) -> tuple[str, str]:
    validate_extension(file.filename or "", IMAGE_EXTENSIONS)
    content = await read_upload_limited(file, MAX_IMAGE_BYTES)
    mime = file.content_type or mimetypes.guess_type(file.filename or "")[0]
    if mime not in ALLOWED_IMAGE_MIME:
        raise AppError("Invalid image MIME type")
    result = upload_file(
        content, folder="portfolio/certificates", public_id_prefix="cert-image"
    )
    return result["secure_url"], result["public_id"]


async def upload_certificate_pdf(file: UploadFile) -> tuple[str, str]:
    validate_extension(file.filename or "", RESUME_EXTENSIONS)
    content = await read_upload_limited(file, MAX_RESUME_BYTES)
    mime = file.content_type or mimetypes.guess_type(file.filename or "")[0]
    if mime not in ALLOWED_RESUME_MIME:
        raise AppError("Certificate PDF must be a PDF")
    result = upload_file(
        content,
        folder="portfolio/certificates",
        public_id_prefix="certificate",
        resource_type="raw",
    )
    return result["secure_url"], result["public_id"]