from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str = Field(default="", alias="DATABASE_URL")
    direct_database_url: str | None = Field(default=None, alias="DIRECT_DATABASE_URL")

    jwt_secret_key: str = Field(
        default="local-dev-only-set-jwt-secret-key",
        alias="JWT_SECRET_KEY",
    )
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    jwt_expire_minutes: int = Field(default=60, alias="JWT_EXPIRE_MINUTES")

    admin_email: str | None = Field(default=None, alias="ADMIN_EMAIL")
    admin_initial_password: str | None = Field(default=None, alias="ADMIN_INITIAL_PASSWORD")

    frontend_url: str = Field(default="http://localhost:5173", alias="FRONTEND_URL")

    cloudinary_cloud_name: str | None = Field(default=None, alias="CLOUDINARY_CLOUD_NAME")
    cloudinary_api_key: str | None = Field(default=None, alias="CLOUDINARY_API_KEY")
    cloudinary_api_secret: str | None = Field(default=None, alias="CLOUDINARY_API_SECRET")

    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = Field(
        default="INFO", alias="LOG_LEVEL"
    )

    environment: Literal["development", "production", "test"] = Field(
        default="development", alias="ENVIRONMENT"
    )

    cookie_secure: bool = Field(default=False, alias="COOKIE_SECURE")
    cookie_samesite: Literal["lax", "strict", "none"] = Field(
        default="lax", alias="COOKIE_SAMESITE"
    )
    access_token_cookie_name: str = "portfolio_admin_token"

    @property
    def cors_origins(self) -> list[str]:
        return [self.frontend_url.rstrip("/")]

    @property
    def resolved_cookie_secure(self) -> bool:
        if self.environment == "production":
            return True
        return self.cookie_secure

    @property
    def resolved_cookie_samesite(self) -> Literal["lax", "strict", "none"]:
        """Cross-origin Vercel deploys need `none` + `Secure` for admin cookies."""
        if self.environment == "production":
            return "none"
        return self.cookie_samesite


@lru_cache
def get_settings() -> Settings:
    return Settings()