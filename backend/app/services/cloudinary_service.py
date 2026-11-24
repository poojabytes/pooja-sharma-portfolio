import logging
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


def configure_cloudinary() -> None:
    if not all(
        [settings.cloudinary_cloud_name, settings.cloudinary_api_key, settings.cloudinary_api_secret]
    ):
        logger.debug("Cloudinary credentials not configured")
        return
    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret,
        secure=True,
    )


def upload_file(
    file_bytes: bytes,
    *,
    folder: str,
    public_id_prefix: str,
    resource_type: str = "image",
) -> dict[str, Any]:
    configure_cloudinary()
    return cloudinary.uploader.upload(
        file_bytes,
        folder=folder,
        public_id=public_id_prefix,
        resource_type=resource_type,
        overwrite=True,
    )


def delete_asset(public_id: str, resource_type: str = "image") -> None:
    configure_cloudinary()
    try:
        cloudinary.uploader.destroy(public_id, resource_type=resource_type)
    except Exception as exc:
        logger.warning("Failed to delete Cloudinary asset %s: %s", public_id, exc)