from fastapi import APIRouter

from app.api.v1.endpoints import (
    admin,
    auth,
    certificates,
    contact,
    education,
    experience,
    profile,
    projects,
    resume,
    settings,
    skills,
    social_links,
)

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(settings.public_router)

for module in (
    profile,
    social_links,
    skills,
    projects,
    experience,
    education,
    certificates,
    resume,
    contact,
):
    api_router.include_router(module.public_router)
    api_router.include_router(module.admin_router)

api_router.include_router(admin.router)