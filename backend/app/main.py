import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.api.v1.router import api_router
from app.core.config import get_settings
from app.core.exceptions import AppError
from app.db.database import check_database_connection
from app.services.cloudinary_service import UPLOADS_ROOT

settings = get_settings()

logging.basicConfig(level=getattr(logging, settings.log_level, logging.INFO))
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Pooja Sharma Portfolio API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

UPLOADS_ROOT.mkdir(parents=True, exist_ok=True)
app.mount("/media", StaticFiles(directory=str(UPLOADS_ROOT)), name="media")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.exception_handler(AppError)
async def app_error_handler(_request: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})


@app.get("/")
def root() -> dict[str, str]:
    return {"status": "ok", "service": "pooja-sharma-portfolio-api"}


@app.get("/health")
def health() -> dict[str, str | bool]:
    db_ok = check_database_connection() if settings.database_url else False
    return {
        "status": "healthy" if db_ok or not settings.database_url else "degraded",
        "database": db_ok,
    }


app.include_router(api_router, prefix="/api/v1")