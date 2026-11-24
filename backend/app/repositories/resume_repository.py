from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.models.resume import Resume


class ResumeRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_active(self) -> Resume | None:
        stmt = select(Resume).where(Resume.is_active.is_(True)).order_by(Resume.id.desc()).limit(1)
        return self.db.scalars(stmt).first()

    def set_active(self, resume: Resume) -> Resume:
        self.db.execute(update(Resume).values(is_active=False))
        resume.is_active = True
        self.db.add(resume)
        self.db.flush()
        return resume