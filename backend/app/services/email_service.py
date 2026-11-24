import logging

logger = logging.getLogger(__name__)


def send_contact_notification(name: str, email: str, subject: str) -> None:
    """Placeholder for future email integration (e.g. Resend, SES)."""
    logger.info("Contact message stored from %s <%s>: %s", name, email, subject)