import logging
import uuid
from pathlib import Path
from typing import Any

import cloudinary
import cloudinary.uploader

from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

MAX_IMAGE_BYTES = 5 * 1024 * 1024
MAX_RESUME_BYTES = 10 * 1024 * 1024

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
RESUME_EXTENSIONS = {".pdf"}

# Local fallback when Cloudinary is not configured (development / missing creds).
UPLOADS_ROOT = Path(__file__).resolve().parents[2] / "uploads"


def cloudinary_configured() -> bool:
    return bool(
        settings.cloudinary_cloud_name
        and settings.cloudinary_api_key
        and settings.cloudinary_api_secret
    )


def configure_cloudinary() -> None:
    if not cloudinary_configured():
        logger.debug("Cloudinary credentials not configured")
        return
    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret,
        secure=True,
    )


def _save_local(
    file_bytes: bytes,
    *,
    folder: str,
    public_id_prefix: str,
    resource_type: str,
) -> dict[str, Any]:
    ext = ".pdf" if resource_type == "raw" else ".webp"
    if public_id_prefix == "resume":
        filename = f"resume-{uuid.uuid4().hex[:8]}.pdf"
    else:
        filename = f"{public_id_prefix}-{uuid.uuid4().hex[:8]}{ext}"

    # folder like "portfolio/resume" -> uploads/resume/...
    dest_dir = UPLOADS_ROOT / folder.split("/")[-1]
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / filename
    dest.write_bytes(file_bytes)

    relative = f"{dest_dir.name}/{filename}"
    public_id = f"local/{relative}"
    # Served by FastAPI StaticFiles at /media
    base = settings.api_public_url.rstrip("/")
    secure_url = f"{base}/media/{relative}"
    logger.info("Stored upload locally at %s", dest)
    return {"secure_url": secure_url, "public_id": public_id}


def upload_file(
    file_bytes: bytes,
    *,
    folder: str,
    public_id_prefix: str,
    resource_type: str = "image",
) -> dict[str, Any]:
    if not cloudinary_configured():
        return _save_local(
            file_bytes,
            folder=folder,
            public_id_prefix=public_id_prefix,
            resource_type=resource_type,
        )
    configure_cloudinary()
    return cloudinary.uploader.upload(
        file_bytes,
        folder=folder,
        public_id=public_id_prefix,
        resource_type=resource_type,
        overwrite=True,
    )


def delete_asset(public_id: str, resource_type: str = "image") -> None:
    if public_id.startswith("local/"):
        relative = public_id.removeprefix("local/")
        path = UPLOADS_ROOT / relative
        try:
            path.unlink(missing_ok=True)
        except Exception as exc:
            logger.warning("Failed to delete local asset %s: %s", public_id, exc)
        return

    if not cloudinary_configured():
        return
    configure_cloudinary()
    try:
        cloudinary.uploader.destroy(public_id, resource_type=resource_type)
    except Exception as exc:
        logger.warning("Failed to delete Cloudinary asset %s: %s", public_id, exc)
