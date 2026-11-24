from fastapi import APIRouter

from app.core.dependencies import CurrentAdmin, DbSession
from app.core.exceptions import NotFoundError
from app.repositories.contact_repository import ContactRepository
from app.schemas.common import MessageResponse
from app.schemas.contact import ContactCreate, ContactMessagePublic
from app.services.email_service import send_contact_notification

public_router = APIRouter(prefix="/contact", tags=["contact"])
admin_router = APIRouter(prefix="/admin/contact-messages", tags=["admin-contact"])


@public_router.post("", response_model=MessageResponse, status_code=201)
def submit_contact(payload: ContactCreate, db: DbSession) -> MessageResponse:
    ContactRepository(db).create(**payload.model_dump())
    send_contact_notification(payload.name, payload.email, payload.subject)
    return MessageResponse(message="Message received. Thank you for reaching out.")


@admin_router.get("", response_model=list[ContactMessagePublic])
def list_messages(_admin: CurrentAdmin, db: DbSession) -> list[ContactMessagePublic]:
    return [ContactMessagePublic.model_validate(m) for m in ContactRepository(db).list_admin()]


@admin_router.patch("/{message_id}/read", response_model=ContactMessagePublic)
def mark_read(message_id: int, _admin: CurrentAdmin, db: DbSession) -> ContactMessagePublic:
    repo = ContactRepository(db)
    message = repo.get(message_id)
    if not message or message.is_deleted:
        raise NotFoundError()
    message.is_read = True
    return ContactMessagePublic.model_validate(message)


@admin_router.delete("/{message_id}", response_model=MessageResponse)
def delete_message(message_id: int, _admin: CurrentAdmin, db: DbSession) -> MessageResponse:
    repo = ContactRepository(db)
    message = repo.get(message_id)
    if not message:
        raise NotFoundError()
    message.is_deleted = True
    return MessageResponse(message="Message deleted")