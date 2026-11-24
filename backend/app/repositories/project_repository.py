from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.project import Project


class ProjectRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_public(self, featured_only: bool = False) -> list[Project]:
        stmt = (
            select(Project)
            .where(Project.is_deleted.is_(False))
            .options(selectinload(Project.images))
            .order_by(Project.display_order, Project.id)
        )
        if featured_only:
            stmt = stmt.where(Project.is_featured.is_(True))
        return list(self.db.scalars(stmt).all())

    def get_public(self, project_id: int) -> Project | None:
        stmt = (
            select(Project)
            .where(Project.id == project_id, Project.is_deleted.is_(False))
            .options(selectinload(Project.images))
        )
        return self.db.scalars(stmt).first()

    def create(self, **kwargs) -> Project:
        project = Project(**kwargs)
        self.db.add(project)
        self.db.flush()
        return project

    def soft_delete(self, project: Project) -> None:
        project.is_deleted = True
        self.db.flush()