from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.profile import Profile


class ProfileRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_singleton(self) -> Profile | None:
        return self.db.scalars(select(Profile).order_by(Profile.id).limit(1)).first()

    def upsert_singleton(self, **fields) -> Profile:
        profile = self.get_singleton()
        if profile is None:
            profile = Profile(name=fields.get("name", "Pooja Sharma"))
            self.db.add(profile)
        for key, value in fields.items():
            if value is not None and hasattr(profile, key):
                setattr(profile, key, value)
        self.db.flush()
        return profile