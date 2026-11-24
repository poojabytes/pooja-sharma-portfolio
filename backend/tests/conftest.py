import os

import pytest
from fastapi.testclient import TestClient

# In-memory SQLite for unit/API tests only — production uses Neon PostgreSQL.
os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ.setdefault("JWT_SECRET_KEY", "test-jwt-secret-key-for-pytest-only")

from app.db.base import Base  # noqa: E402
from app.db.database import get_engine, reset_engine_cache  # noqa: E402
from sqlalchemy import select

from app.core.security import hash_password
from app.db.database import get_session_factory
from app.main import app  # noqa: E402
from app.models.admin import Admin
from app.models.profile import Profile


@pytest.fixture()
def seed_admin() -> None:
    session = get_session_factory()()
    try:
        if not session.scalars(select(Admin)).first():
            session.add(
                Admin(
                    email="admin@example.com",
                    password_hash=hash_password("SecurePass123!"),
                    is_active=True,
                )
            )
        if not session.scalars(select(Profile)).first():
            session.add(Profile(name="Pooja Sharma"))
        session.commit()
    finally:
        session.close()


@pytest.fixture(autouse=True)
def _db_schema() -> None:
    reset_engine_cache()
    engine = get_engine()
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    reset_engine_cache()


@pytest.fixture()
def client() -> TestClient:
    return TestClient(app)