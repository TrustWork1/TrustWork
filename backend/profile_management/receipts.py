import logging
import os
from dataclasses import dataclass
from decimal import Decimal, InvalidOperation
from io import BytesIO
from pathlib import Path

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.html import escape
from django.utils.safestring import mark_safe
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Image,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class ReceiptPayload:
    """Normalized data needed to send one customer payment receipt."""

    receipt_number: str
    recipient_email: str
    customer_name: str
    item_name: str
    amount: str | Decimal | None
    currency: str
    payment_method: str
    payment_reference: str
    paid_at: object
    billing_period: str = ""


PAYMENT_METHOD_LABELS = {
    "mtn": "MTN Mobile Money",
    "mtn_momo": "MTN Mobile Money",
    "mtn_subscription": "MTN Mobile Money",
    "mtn_website_subscription": "MTN Mobile Money",
    "orange": "Orange Money",
    "orange_pay": "Orange Money",
    "orange_subscription": "Orange Money",
    "orange_website_subscription": "Orange Money",
    "stripe": "Stripe",
    "stripe_project_collection": "Stripe",
    "stripe_website_subscription": "Stripe",
    "google_subscription": "Google Play",
    "apple_subscription": "Apple App Store",
    "iap_subscription": "App Store / Play Store",
}


def payment_method_label(value):
    key = str(value or "").strip().lower()
    if not key:
        return "TrustWork payment"
    return PAYMENT_METHOD_LABELS.get(key, key.replace("_", " ").title())


def format_receipt_amount(amount, currency="XAF"):
    if amount in {None, ""}:
        return "Amount not available"

    try:
        value = Decimal(str(amount).replace(",", "").strip())
    except (InvalidOperation, TypeError, ValueError):
        return f"{currency} {amount}".strip()

    currency = str(currency or "XAF").upper()
    if currency in {"XAF", "XOF"}:
        return f"{currency} {value.quantize(Decimal('1'))}"
    return f"{currency} {value.quantize(Decimal('0.01'))}"


def format_receipt_datetime(value):
    if not value:
        value = timezone.now()
    if timezone.is_aware(value):
        value = timezone.localtime(value)
    return value.strftime("%d %b %Y, %I:%M %p")


def _logo_path():
    path = Path(settings.BASE_DIR) / "static" / "images" / "logo.png"
    return path if path.exists() else None


def _build_receipt_pdf(payload):
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "TrustWorkReceiptTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=28,
        textColor=colors.HexColor("#2f2f2f"),
        alignment=1,
        spaceAfter=12,
    )
    normal_style = ParagraphStyle(
        "TrustWorkReceiptNormal",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10.5,
        leading=15,
        textColor=colors.HexColor("#4b5563"),
    )
    small_style = ParagraphStyle(
        "TrustWorkReceiptSmall",
        parent=normal_style,
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#6b7280"),
        alignment=1,
    )

    story = []
    logo = _logo_path()
    if logo:
        story.append(Image(str(logo), width=34 * mm, height=24 * mm))
        story.append(Spacer(1, 6 * mm))

    story.append(Paragraph("TrustWork Payment Receipt", title_style))
    story.append(
        Paragraph(
            "This receipt confirms a successful payment received by TrustWork.",
            small_style,
        )
    )
    story.append(Spacer(1, 10 * mm))

    details = [
        ("Receipt number", payload.receipt_number),
        ("Customer", payload.customer_name),
        ("Email", payload.recipient_email),
        ("Item", payload.item_name),
        ("Amount paid", format_receipt_amount(payload.amount, payload.currency)),
        ("Payment method", payload.payment_method),
        ("Payment reference", payload.payment_reference),
        ("Paid at", format_receipt_datetime(payload.paid_at)),
    ]
    if payload.billing_period:
        details.append(("Billing period", payload.billing_period))

    table = Table(
        [
            [
                Paragraph(f"<b>{escape(label)}</b>", normal_style),
                Paragraph(escape(str(value or "Not available")), normal_style),
            ]
            for label, value in details
        ],
        colWidths=[45 * mm, 105 * mm],
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F0FFF8")),
                ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#D7E7DC")),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#D7E7DC")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
                ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    story.append(table)
    story.append(Spacer(1, 12 * mm))
    story.append(
        Paragraph(
            "Thank you for using TrustWork. Please keep this receipt for your records.",
            normal_style,
        )
    )
    story.append(Spacer(1, 6 * mm))
    story.append(
        Paragraph(
            "This is an automated receipt. Please contact TrustWork support if you need help with this payment.",
            small_style,
        )
    )
    doc.build(story)
    return buffer.getvalue()


def _email_body(payload):
    return (
        f"Hi {escape(payload.customer_name)},<br /><br />"
        f"Your payment for <strong>{escape(payload.item_name)}</strong> has been "
        "completed successfully.<br /><br />"
        f"<strong>Receipt number:</strong> {escape(payload.receipt_number)}<br />"
        f"<strong>Amount paid:</strong> {escape(format_receipt_amount(payload.amount, payload.currency))}<br />"
        f"<strong>Payment method:</strong> {escape(payload.payment_method)}<br />"
        f"<strong>Payment reference:</strong> {escape(payload.payment_reference)}<br />"
        f"<strong>Paid at:</strong> {escape(format_receipt_datetime(payload.paid_at))}<br /><br />"
        "Your receipt is attached for your records.<br /><br />"
        "Thank you for using TrustWork."
    )


def send_payment_receipt_email(payload):
    """Send a branded success receipt email with a PDF attachment."""
    if not getattr(settings, "PAYMENT_RECEIPT_EMAIL_ENABLED", True):
        return False
    if not payload.recipient_email:
        return False

    subject = f"TrustWork Payment Receipt - {payload.receipt_number}"
    text_message = (
        f"Hi {payload.customer_name},\n\n"
        f"Your payment for {payload.item_name} has been completed successfully.\n\n"
        f"Receipt number: {payload.receipt_number}\n"
        f"Amount paid: {format_receipt_amount(payload.amount, payload.currency)}\n"
        f"Payment method: {payload.payment_method}\n"
        f"Payment reference: {payload.payment_reference}\n"
        f"Paid at: {format_receipt_datetime(payload.paid_at)}\n\n"
        "Your receipt is attached for your records.\n\n"
        "Thank you for using TrustWork."
    )
    html_message = render_to_string(
        "email_temp.html",
        {
            "title": "TrustWork Payment Receipt",
            "otp": mark_safe(_email_body(payload)),
            "image": os.getenv("TRUSTWORK_BASE_API", ""),
        },
    )
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[payload.recipient_email],
    )
    email.attach_alternative(html_message, "text/html")
    email.attach(
        filename=f"{payload.receipt_number}.pdf",
        content=_build_receipt_pdf(payload),
        mimetype="application/pdf",
    )
    sent_count = email.send(fail_silently=False)
    logger.info("Payment receipt %s sent to %s", payload.receipt_number, payload.recipient_email)
    return bool(sent_count)
