"""Secure one-time admin and seed initialization."""

import argparse
import getpass
import os
import sys

from app.core.config import get_settings
from app.core.security import hash_password
from app.db.database import get_session_factory
from app.models.education import Education
from app.repositories.admin_repository import AdminRepository
from app.repositories.generic_repository import OrderedRepository
from app.repositories.profile_repository import ProfileRepository
from app.services.auth_service import AuthService


def init_admin() -> None:
    settings = get_settings()
    email = settings.admin_email or os.getenv("ADMIN_EMAIL")
    password = settings.admin_initial_password or os.getenv("ADMIN_INITIAL_PASSWORD")

    if not email:
        email = input("Admin email: ").strip()
    if not password:
        password = getpass.getpass("Admin password: ")
        confirm = getpass.getpass("Confirm password: ")
        if password != confirm:
            print("Passwords do not match", file=sys.stderr)
            sys.exit(1)

    if len(password) < 12:
        print("Use at least 12 characters for the admin password.", file=sys.stderr)
        sys.exit(1)

    session = get_session_factory()()
    try:
        AuthService(session).ensure_admin_exists_for_init(email)
        AdminRepository(session).create(email=email, password_hash=hash_password(password))

        ProfileRepository(session).upsert_singleton(
            name="Pooja Sharma",
            designation="Python Backend Developer | FastAPI | Full Stack Developer",
            biography="Professional introduction — edit this in the admin dashboard.",
        )

        edu_repo = OrderedRepository(session, Education)
        if not edu_repo.list_all():
            edu_repo.create(
                institution="Lal Bahadur Shastri Institute of Management & Development Studies",
                degree="MCA",
                start_year=2023,
                end_year=2025,
                display_order=0,
            )

        session.commit()
        print(f"Admin initialized for {email}")
        print("Default profile and MCA education seed created (edit via admin dashboard).")
    except Exception as exc:
        session.rollback()
        print(f"Initialization failed: {exc}", file=sys.stderr)
        sys.exit(1)
    finally:
        session.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Portfolio backend CLI")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("init-admin", help="Create the single owner admin account")
    args = parser.parse_args()
    if args.command == "init-admin":
        init_admin()


if __name__ == "__main__":
    main()