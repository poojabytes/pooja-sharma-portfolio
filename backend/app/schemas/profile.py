from pydantic import BaseModel, EmailStr, Field


class ProfilePublic(BaseModel):
    id: int
    name: str
    designation: str | None = None
    biography: str | None = None
    email: EmailStr | str | None = None
    location: str | None = None
    profile_image_url: str | None = None

    model_config = {"from_attributes": True}


class ProfileUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=255)
    designation: str | None = Field(default=None, max_length=512)
    biography: str | None = None
    email: EmailStr | None = None
    location: str | None = Field(default=None, max_length=255)
    profile_image_url: str | None = None
    profile_image_public_id: str | None = None