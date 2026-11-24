from datetime import date, datetime

from pydantic import BaseModel, Field


class SocialLinkPublic(BaseModel):
    id: int
    platform: str
    label: str
    url: str
    display_order: int
    model_config = {"from_attributes": True}


class SocialLinkCreate(BaseModel):
    platform: str = Field(max_length=64)
    label: str = Field(max_length=128)
    url: str = Field(max_length=1024)
    display_order: int = 0


class SkillPublic(BaseModel):
    id: int
    name: str
    category: str
    display_order: int
    model_config = {"from_attributes": True}


class SkillCreate(BaseModel):
    name: str = Field(max_length=128)
    category: str = Field(max_length=128)
    display_order: int = 0


class ProjectImagePublic(BaseModel):
    id: int
    image_url: str
    image_type: str
    display_order: int
    model_config = {"from_attributes": True}


class ProjectPublic(BaseModel):
    id: int
    title: str
    description: str | None = None
    thumbnail_url: str | None = None
    technologies: str | None = None
    github_url: str | None = None
    live_url: str | None = None
    is_featured: bool
    display_order: int
    images: list[ProjectImagePublic] = []
    model_config = {"from_attributes": True}


class ProjectCreate(BaseModel):
    title: str = Field(max_length=255)
    description: str | None = None
    technologies: str | None = None
    github_url: str | None = None
    live_url: str | None = None
    is_featured: bool = False
    display_order: int = 0


class ExperiencePublic(BaseModel):
    id: int
    company: str
    designation: str
    employment_type: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    is_current: bool
    responsibilities: str | None = None
    technologies: str | None = None
    display_order: int
    model_config = {"from_attributes": True}


class ExperienceCreate(BaseModel):
    company: str
    designation: str
    employment_type: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    is_current: bool = False
    responsibilities: str | None = None
    technologies: str | None = None
    display_order: int = 0


class EducationPublic(BaseModel):
    id: int
    institution: str
    degree: str
    field_of_study: str | None = None
    start_year: int | None = None
    end_year: int | None = None
    description: str | None = None
    display_order: int
    model_config = {"from_attributes": True}


class EducationCreate(BaseModel):
    institution: str
    degree: str
    field_of_study: str | None = None
    start_year: int | None = None
    end_year: int | None = None
    description: str | None = None
    display_order: int = 0


class CertificatePublic(BaseModel):
    id: int
    title: str
    issuer: str | None = None
    issue_date: date | None = None
    image_url: str | None = None
    pdf_url: str | None = None
    display_order: int
    model_config = {"from_attributes": True}


class ResumePublic(BaseModel):
    id: int
    file_url: str
    file_name: str
    updated_at: datetime
    model_config = {"from_attributes": True}


class WebsiteSettingPublic(BaseModel):
    key: str
    value: str
    model_config = {"from_attributes": True}