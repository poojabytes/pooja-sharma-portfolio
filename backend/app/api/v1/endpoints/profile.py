from fastapi import APIRouter, UploadFile

from app.core.dependencies import CurrentAdmin, DbSession
from app.core.exceptions import NotFoundError
from app.repositories.profile_repository import ProfileRepository
from app.schemas.profile import ProfilePublic, ProfileUpdate
from app.services.upload_service import upload_profile_image

public_router = APIRouter(prefix="/profile", tags=["profile"])
admin_router = APIRouter(prefix="/admin/profile", tags=["admin-profile"])


@public_router.get("", response_model=ProfilePublic)
def get_profile(db: DbSession) -> ProfilePublic:
    profile = ProfileRepository(db).get_singleton()
    if not profile:
        raise NotFoundError("Profile not configured yet")
    return ProfilePublic.model_validate(profile)


@admin_router.get("", response_model=ProfilePublic)
def admin_get_profile(db: DbSession, _admin: CurrentAdmin) -> ProfilePublic:
    return get_profile(db)


@admin_router.put("", response_model=ProfilePublic)
def update_profile(payload: ProfileUpdate, db: DbSession, _admin: CurrentAdmin) -> ProfilePublic:
    data = payload.model_dump(exclude_unset=True)
    profile = ProfileRepository(db).upsert_singleton(**data)
    return ProfilePublic.model_validate(profile)


@admin_router.post("/photo", response_model=ProfilePublic)
async def upload_photo(
    db: DbSession, _admin: CurrentAdmin, file: UploadFile
) -> ProfilePublic:
    url, public_id = await upload_profile_image(file)
    profile = ProfileRepository(db).upsert_singleton(
        profile_image_url=url, profile_image_public_id=public_id
    )
    return ProfilePublic.model_validate(profile)