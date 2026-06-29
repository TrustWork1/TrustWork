import contextlib
import logging
import os
from datetime import timedelta
from decimal import ROUND_HALF_UP, Decimal, InvalidOperation
from uuid import uuid4

import stripe
from django.conf import settings
from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.core.validators import validate_email
from django.db import transaction
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.utils.safestring import mark_safe
from rest_framework import status
from rest_framework.authentication import get_authorization_header
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api.referal_management.services import handle_successful_referral_subscription
from content_management.models.home_page_models import PricingPlan
from core.authentication import SubscriptionAwareTokenAuthentication
from customuser.models import CustomUser
from payment_handle.gateways.escrow import (
    PaymentGatewayAPI,
    normalize_mtn_cameroon_msisdn,
    normalize_orange_cameroon_msisdn,
)
from profile_management.models import (
    Profile,
    SubscriptionPaymentAttempt,
    Subscriptions,
)
from profile_management.subscriptions import refresh_profile_subscription_status

logger = logging.getLogger(__name__)
stripe.api_key = settings.STRIPE_TEST_SECRET_KEY

SUBSCRIPTION_CYCLE_MAP = {
    "week": "weekly",
    "weekly": "weekly",
    "month": "monthly",
    "monthly": "monthly",
    "year": "yearly",
    "yearly": "yearly",
}

SUBSCRIPTION_DURATION_DAYS = {
    "weekly": 7,
    "monthly": 30,
    "yearly": 365,
}

ZERO_DECIMAL_CURRENCIES = {
    "bif",
    "clp",
    "djf",
    "gnf",
    "jpy",
    "kmf",
    "krw",
    "mga",
    "pyg",
    "rwf",
    "ugx",
    "vnd",
    "vuv",
    "xaf",
    "xof",
    "xpf",
}

STRIPE_FORBIDDEN_PAYMENT_FIELDS = {
    "card_number",
    "cardNumber",
    "number",
    "cvv",
    "cvc",
    "expiry",
    "expiry_date",
    "expiryDate",
    "exp_month",
    "expMonth",
    "exp_year",
    "expYear",
    "payment_method_data",
    "source",
    "stripe_token",
}

WEBSITE_SUBSCRIPTION_PENDING_TTL_MINUTES = int(
    getattr(settings, "WEBSITE_SUBSCRIPTION_PENDING_TTL_MINUTES", 30)
)

MTN_MOMO_APPROVAL_NEXT_ACTION = {
    "type": "mtn_momo_approval",
    "message": (
        "Approve the MTN MoMo payment prompt on your phone. If the prompt does "
        "not appear automatically, open MTN MoMo or dial your MTN MoMo code to "
        "find and approve the pending payment request."
    ),
}

ORANGE_MONEY_APPROVAL_NEXT_ACTION = {
    "type": "orange_money_approval",
    "message": (
        "Approve the Orange Money payment prompt on your phone. If the prompt "
        "does not appear automatically, open Orange Money or use the Orange "
        "Money approval flow available on your phone, then approve the pending "
        "payment request if it is shown."
    ),
}


def _first_error_message(errors):
    if isinstance(errors, dict):
        for value in errors.values():
            message = _first_error_message(value)
            if message:
                return message
        return "Invalid input."
    if isinstance(errors, list | tuple):
        return _first_error_message(errors[0]) if errors else "Invalid input."
    return str(errors) if errors else "Invalid input."


class WebsiteSubscriptionTokenAuthentication(SubscriptionAwareTokenAuthentication):
    """Token auth that accepts both DRF `Token` and website-friendly `Bearer` headers."""

    def authenticate(self, request):
        auth = get_authorization_header(request).split()
        if auth and auth[0].lower() == b"bearer":
            if len(auth) == 1:
                raise AuthenticationFailed("Invalid token header. No credentials provided.")
            if len(auth) > 2:
                raise AuthenticationFailed(
                    "Invalid token header. Token string should not contain spaces."
                )
            try:
                token_key = auth[1].decode()
            except UnicodeError as exc:
                raise AuthenticationFailed(
                    "Invalid token header. Token string should not contain invalid characters."
                ) from exc
            return self.authenticate_credentials(token_key)

        return super().authenticate(request)


def _token_from_request(request):
    auth = get_authorization_header(request).split()
    if auth and len(auth) == 2 and auth[0].lower() in {b"token", b"bearer"}:
        try:
            return auth[1].decode()
        except UnicodeError:
            return ""

    data = getattr(request, "data", {}) or {}
    return str(
        data.get("token")
        or data.get("access_token")
        or data.get("auth_token")
        or ""
    ).strip()


def _normalize_subscription_frequency(frequency):
    return SUBSCRIPTION_CYCLE_MAP.get(str(frequency or "").strip().lower())


def _subscription_duration_days(frequency):
    return SUBSCRIPTION_DURATION_DAYS.get(str(frequency or "").strip().lower(), 0)


def _active_subscription_payload(profile):
    active_subscription = (
        Subscriptions.objects.filter(
            profile=profile,
            is_active=True,
            expire_at__gt=timezone.now(),
        )
        .order_by("-expire_at")
        .first()
    )
    if not active_subscription:
        return None

    return {
        "id": active_subscription.id,
        "subscription_frequency": active_subscription.subscription_frequency,
        "subscription_plan": active_subscription.subscription_plan,
        "expire_at": active_subscription.expire_at,
        "purchase_token": active_subscription.purchase_token,
    }


def _payment_attempt_payload(attempt):
    seconds_remaining = max(
        0,
        int((attempt.expires_at - timezone.now()).total_seconds()),
    )
    return {
        "id": attempt.id,
        "provider": attempt.provider,
        "referenceId": attempt.reference_id,
        "payment_status": attempt.payment_status,
        "subscription_frequency": attempt.subscription_frequency,
        "amount": str(attempt.amount) if attempt.amount is not None else None,
        "currency": attempt.currency,
        "pricing_plan_id": attempt.pricing_plan_id,
        "expires_at": attempt.expires_at,
        "retry_after_seconds": seconds_remaining,
    }


def _expire_stale_subscription_payment_attempts(profile):
    if not profile:
        return
    SubscriptionPaymentAttempt.objects.filter(
        profile=profile,
        payment_status="pending",
        expires_at__lte=timezone.now(),
    ).update(payment_status="expired")


def _pending_subscription_payment_attempt(profile):
    if not profile:
        return None
    _expire_stale_subscription_payment_attempts(profile)
    return (
        SubscriptionPaymentAttempt.objects.filter(
            profile=profile,
            payment_status="pending",
            expires_at__gt=timezone.now(),
        )
        .order_by("-created_at")
        .first()
    )


def _subscription_checkout_block_response(user):
    profile = _ensure_subscription_profile(user)
    if refresh_profile_subscription_status(profile):
        return Response(
            {
                "status": "409",
                "type": "error",
                "code": "active_subscription_exists",
                "message": (
                    "You already have an active subscription. Please wait until it "
                    "expires before purchasing another plan."
                ),
                "active_subscription": _active_subscription_payload(profile),
            },
            status=status.HTTP_409_CONFLICT,
        )

    pending_attempt = _pending_subscription_payment_attempt(profile)
    if pending_attempt:
        return Response(
            {
                "status": "409",
                "type": "error",
                "code": "subscription_payment_pending",
                "message": (
                    "A subscription payment is already pending. Please complete it "
                    "or wait until it expires before starting another payment."
                ),
                "pending_attempt": _payment_attempt_payload(pending_attempt),
            },
            status=status.HTTP_409_CONFLICT,
        )

    return None


def _reference_owner_block_response(user, reference_id):
    attempt = SubscriptionPaymentAttempt.objects.filter(
        reference_id=str(reference_id)
    ).select_related("profile__user").first()
    if attempt and attempt.profile.user_id != user.id:
        return Response(
            {"error": "Subscription payment reference does not belong to this user."},
            status=status.HTTP_403_FORBIDDEN,
        )
    return None


def _record_subscription_payment_attempt(
    user,
    *,
    provider,
    reference_id,
    payment_status,
    subscription_frequency,
    amount,
    currency="XAF",
    pricing_plan=None,
    provider_response=None,
    idempotency_key=None,
):
    if not reference_id:
        return None

    profile = _ensure_subscription_profile(user)
    attempt_status = _payment_status(payment_status)
    expires_at = timezone.now() + timedelta(
        minutes=WEBSITE_SUBSCRIPTION_PENDING_TTL_MINUTES
    )
    pricing_plan_id = pricing_plan["id"] if pricing_plan else None
    amount_value = None
    if amount is not None:
        with contextlib.suppress(InvalidOperation, TypeError, ValueError):
            amount_value = _normalize_decimal_amount(amount)

    attempt, _ = SubscriptionPaymentAttempt.objects.update_or_create(
        reference_id=str(reference_id),
        defaults={
            "profile": profile,
            "provider": provider,
            "payment_status": attempt_status,
            "subscription_frequency": subscription_frequency,
            "amount": amount_value,
            "currency": str(currency or "XAF").upper(),
            "pricing_plan_id": pricing_plan_id,
            "idempotency_key": idempotency_key,
            "expires_at": expires_at,
            "provider_response": provider_response or {},
        },
    )
    return attempt


def _update_subscription_payment_attempt(reference_id, payment_response):
    attempt = SubscriptionPaymentAttempt.objects.filter(
        reference_id=str(reference_id)
    ).first()
    if not attempt:
        return None

    attempt.payment_status = _payment_status(
        payment_response.get("payment_status") or payment_response.get("status")
    )
    attempt.provider_response = payment_response or {}
    attempt.save(update_fields=["payment_status", "provider_response", "updated_at"])
    return attempt


def _user_profile(user):
    try:
        return user.profile
    except Exception:
        return None


def _profile_payload(user):
    profile = _user_profile(user)
    is_payment_verified = refresh_profile_subscription_status(profile) if profile else False
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "user_type": user.user_type,
        "profile_id": getattr(profile, "id", None),
        "is_payment_verified": is_payment_verified,
        "active_subscription": _active_subscription_payload(profile) if profile else None,
    }


def _subscription_full_name(email, full_name=""):
    name = str(full_name or "").strip()
    if name:
        return name
    local_part = str(email or "").split("@", 1)[0].replace(".", " ").replace("_", " ")
    return local_part.title() or "TrustWork User"


def _apply_name(user, full_name):
    full_name = str(full_name or "").strip()
    if not full_name:
        return []
    parts = full_name.split()
    user.full_name = full_name
    user.first_name = parts[0]
    user.last_name = " ".join(parts[1:]) if len(parts) > 1 else ""
    return ["full_name", "first_name", "last_name"]


def _ensure_subscription_profile(user):
    profile, _ = Profile.objects.get_or_create(user=user)
    if profile.status in {"deleted", "inactive", "block"}:
        profile.status = "active"
        profile.save(update_fields=["status", "updated_at"])
    return profile


def _assign_subscription_group(user):
    group, _ = Group.objects.get_or_create(name="Client")
    user.groups.add(group)


def _send_generated_password_email(user, password):
    message = (
        f"Hello {user.email},\n\n"
        "Use the password below to login and continue your subscription purchase:\n\n"
        f"Password: {password}\n\n"
        "For best results, copy only the password value shown after Password."
    )
    html_message_body = (
        f"Hello {user.email},<br /><br />"
        "Use the password below to login and continue your subscription purchase:"
        "<br /><br />"
        '<span style="display:inline-block;padding:10px 16px;'
        "background:#ffffff;border:1px solid #d7e7dc;border-radius:6px;"
        'font-size:20px;font-weight:700;letter-spacing:1px;color:#2f2f2f;">'
        f"{password}</span>"
        "<br /><br />"
        "Copy only the password shown in the box above."
    )
    html_message = render_to_string(
        "email_temp.html",
        {
            "title": "Your TrustWork Login Password",
            "otp": mark_safe(html_message_body),
            "image": os.getenv("TRUSTWORK_BASE_API"),
        },
    )
    send_mail(
        subject="Your TrustWork Login Password",
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def _generate_subscription_password_for_user(user):
    password = get_random_string(length=10)
    user.set_password(password)
    user.is_active = True
    user.is_user_active = True
    user.subscription_password_generated_at = timezone.now()
    _send_generated_password_email(user, password)
    user.save(
        update_fields=[
            "password",
            "is_active",
            "is_user_active",
            "subscription_password_generated_at",
        ]
    )
    return password


def _website_auth_payload(user, *, exists, password_sent, message, created=False):
    return {
        "status": "200",
        "type": "success",
        "message": message,
        "email": user.email,
        "exists": exists,
        "created": created,
        "password_sent": password_sent,
        "can_login": True,
        "login_endpoint": "/api/login/",
        "user": _profile_payload(user),
    }


def _normalize_amount(amount):
    try:
        amount_value = round(float(str(amount).strip()))
    except (TypeError, ValueError) as exc:
        raise ValueError("Invalid amount.") from exc

    if amount_value <= 0:
        raise ValueError("Amount must be positive.")
    return str(amount_value)


def _normalize_decimal_amount(amount):
    try:
        amount_value = Decimal(str(amount).strip())
    except (InvalidOperation, TypeError, ValueError) as exc:
        raise ValueError("Invalid amount.") from exc

    if amount_value <= 0:
        raise ValueError("Amount must be positive.")
    return amount_value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def _pricing_plan_from_request(data):
    """Resolve a website CMS pricing plan so checkout does not trust browser prices."""
    plan_id = data.get("pricing_plan_id") or data.get("plan_id")
    if not plan_id:
        return None

    try:
        plan = PricingPlan.objects.get(id=plan_id)
    except (PricingPlan.DoesNotExist, TypeError, ValueError) as exc:
        raise ValueError("Invalid pricing plan.") from exc

    frequency = _normalize_subscription_frequency(plan.billing_cycle)
    if not frequency:
        raise ValueError("Pricing plan has an invalid billing cycle.")

    amount = _normalize_decimal_amount(plan.price)
    return {
        "id": plan.id,
        "plan_name": plan.plan_name,
        "billing_cycle": plan.billing_cycle,
        "subscription_frequency": frequency,
        "amount": amount,
        "whole_amount": _normalize_amount(amount),
    }


def _pricing_plan_detail_payload(plan):
    """Build a frontend-friendly CMS subscription plan payload."""
    frequency = _normalize_subscription_frequency(plan.billing_cycle)
    amount = _normalize_decimal_amount(plan.price) if plan.price is not None else None
    amount_text = str(amount) if amount is not None else None
    amount_integer = (
        int(amount.quantize(Decimal("1"), rounding=ROUND_HALF_UP))
        if amount is not None
        else None
    )
    section = getattr(plan, "pricingplan_section", None)
    return {
        "id": plan.id,
        "plan_name": plan.plan_name,
        "description": plan.description,
        "price": amount_text,
        "amount": amount_text,
        "amount_integer": amount_integer,
        "currency": "XAF",
        "billing_cycle": plan.billing_cycle,
        "subscription_frequency": frequency,
        "is_popular": plan.is_popular,
        "features": [
            {
                "id": feature.id,
                "features": feature.features,
            }
            for feature in plan.price_features.all()
        ],
        "section": {
            "id": getattr(section, "id", None),
            "header": getattr(section, "header", None),
            "description": getattr(section, "description", None),
        },
    }


def _stripe_minor_units(amount, currency):
    currency = str(currency or "usd").strip().lower()
    if currency in ZERO_DECIMAL_CURRENCIES:
        return int(amount.quantize(Decimal("1"), rounding=ROUND_HALF_UP))
    return int((amount * Decimal("100")).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def _payment_status(value):
    normalized = str(value or "").strip().lower()
    if normalized in {"paid", "success", "successful", "successfull", "completed"}:
        return "paid"
    if normalized in {"failed", "fail", "error", "cancelled", "canceled", "expired"}:
        return "failed"
    return "pending"


def _provider_reference(payment_response):
    return (
        payment_response.get("referenceId")
        or payment_response.get("reference_id")
        or payment_response.get("payment_intent_id")
        or payment_response.get("paymentIntentId")
        or payment_response.get("payToken")
        or payment_response.get("orderId")
        or payment_response.get("subscription_id")
    )


def _activate_subscription_for_reference(user, payment_response, provider):
    """Idempotently activate a TrustWork subscription after provider-confirmed payment."""
    payment_state = _payment_status(payment_response.get("payment_status"))
    if payment_state != "paid":
        return False

    frequency = _normalize_subscription_frequency(
        payment_response.get("subscription_frequency")
    )
    days = _subscription_duration_days(frequency)
    reference_id = _provider_reference(payment_response)
    if not frequency or not days or not reference_id:
        return False

    profile = _user_profile(user)
    if not profile:
        return False
    now = timezone.now()
    existing_subscription = Subscriptions.objects.filter(
        profile=profile,
        purchase_token=str(reference_id),
    ).first()
    if existing_subscription:
        profile.is_payment_verified = True
        profile.save(update_fields=["is_payment_verified", "updated_at"])
        return True

    has_other_active_subscription = Subscriptions.objects.filter(
        profile=profile,
        is_active=True,
        expire_at__gt=now,
    ).exists()
    if has_other_active_subscription:
        profile.is_payment_verified = True
        profile.save(update_fields=["is_payment_verified", "updated_at"])
        return False

    Subscriptions.objects.filter(profile=profile, is_active=True).update(
        is_active=False
    )
    Subscriptions.objects.create(
        profile=profile,
        subscription_frequency=frequency,
        subscription_plan=f"Membership_{frequency}",
        purchase_token=str(reference_id),
        expire_at=now + timedelta(days=days),
        receipt_amount=payment_response.get("amount"),
        receipt_currency=payment_response.get("currency") or "XAF",
        receipt_payment_method=provider,
    )
    handle_successful_referral_subscription(
        user,
        subscription_price=payment_response.get("amount", 0),
        provider=provider,
    )

    profile.is_payment_verified = True
    profile.save(update_fields=["is_payment_verified", "updated_at"])
    return True


def _stripe_object_value(stripe_object, key, default=None):
    if hasattr(stripe_object, "get"):
        return stripe_object.get(key, default)
    return getattr(stripe_object, key, default)


def _stripe_payment_response(payment_intent):
    metadata = dict(_stripe_object_value(payment_intent, "metadata", {}) or {})
    intent_id = _stripe_object_value(payment_intent, "id")
    intent_status = _stripe_object_value(payment_intent, "status")
    payment_status = "pending"
    if intent_status == "succeeded":
        payment_status = "paid"
    elif intent_status in {"canceled", "requires_payment_method"}:
        payment_status = "failed"

    return {
        "payment_intent_id": intent_id,
        "referenceId": intent_id,
        "reference_id": intent_id,
        "payment_status": payment_status,
        "stripe_status": intent_status,
        "email": metadata.get("email"),
        "amount": metadata.get("subscription_amount"),
        "currency": metadata.get("currency"),
        "subscription_frequency": metadata.get("subscription_frequency"),
        "provider_response": {
            "id": intent_id,
            "status": intent_status,
            "client_secret": _stripe_object_value(payment_intent, "client_secret"),
            "metadata": metadata,
        },
    }


class SubscriptionTokenValidationView(APIView):
    """Validate a website/mobile token before showing subscription payment options."""

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        token_key = _token_from_request(request)
        if not token_key:
            return Response(
                {"valid": False, "error": "Token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        token = Token.objects.select_related("user").filter(key=token_key).first()
        if not token or not token.user.is_active:
            return Response(
                {"valid": False, "error": "Invalid token."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response({"valid": True, "user": _profile_payload(token.user)})


class WebsiteSubscriptionEmailCheckView(APIView):
    """Prepare website subscription login for existing or new email-only users."""

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data or {}
        email = str(data.get("email") or "").strip().lower()
        full_name = _subscription_full_name(email, data.get("full_name"))

        try:
            validate_email(email)
        except ValidationError:
            return Response(
                {
                    "status": "400",
                    "type": "error",
                    "message": "Enter a valid email address.",
                    "data": {"email": ["Enter a valid email address."]},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = CustomUser.objects.filter(email__iexact=email).first()
        if user and user.user_type == "admin":
            return Response(
                {
                    "status": "400",
                    "type": "error",
                    "message": "This email cannot be used for website subscription checkout.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user:
            profile = _user_profile(user)
            profile_status = getattr(profile, "status", None)
            if profile_status not in {"deleted", "inactive", "block"}:
                _ensure_subscription_profile(user)
                update_fields = _apply_name(user, data.get("full_name"))
                if update_fields:
                    user.save(update_fields=update_fields)
                return Response(
                    _website_auth_payload(
                        user,
                        exists=True,
                        created=False,
                        password_sent=False,
                        message="Account found. Please login with your password.",
                    ),
                    status=status.HTTP_200_OK,
                )

        try:
            with transaction.atomic():
                if not user:
                    user = CustomUser.objects.create_user(
                        email=email,
                        password=None,
                        user_type="client",
                        full_name=full_name,
                        first_name=full_name.split()[0],
                        last_name=" ".join(full_name.split()[1:]),
                        is_active=True,
                        is_user_active=True,
                    )
                    _assign_subscription_group(user)
                    _ensure_subscription_profile(user)
                    created = True
                else:
                    update_fields = ["user_type", "is_active", "is_user_active"]
                    user.user_type = "client"
                    user.is_active = True
                    user.is_user_active = True
                    update_fields.extend(_apply_name(user, data.get("full_name") or full_name))
                    user.save(update_fields=list(dict.fromkeys(update_fields)))
                    _assign_subscription_group(user)
                    _ensure_subscription_profile(user)
                    created = False

                _generate_subscription_password_for_user(user)
        except Exception as exc:
            logger.exception("Unable to prepare website subscription account for %s", email)
            return Response(
                {
                    "status": "500",
                    "type": "error",
                    "message": "Unable to send login password. Please try again.",
                    "detail": str(exc) if settings.DEBUG else None,
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        message = (
            "We created your TrustWork account and sent a login password to your email."
            if created
            else "Your TrustWork account has been reactivated and a login password was sent to your email."
        )
        return Response(
            _website_auth_payload(
                user,
                exists=False,
                created=created,
                password_sent=True,
                message=message,
            ),
            status=status.HTTP_200_OK,
        )


class WebsiteSubscriptionPasswordResendView(APIView):
    """Resend a generated website-subscription password without exposing it."""

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        email = str((request.data or {}).get("email") or "").strip().lower()
        try:
            validate_email(email)
        except ValidationError:
            return Response(
                {
                    "status": "400",
                    "type": "error",
                    "message": "Enter a valid email address.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = CustomUser.objects.filter(email__iexact=email).first()
        if not user:
            return Response(
                {
                    "status": "404",
                    "type": "error",
                    "message": "Account not found. Please continue with email check first.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if not user.subscription_password_generated_at:
            return Response(
                {
                    "status": "400",
                    "type": "error",
                    "message": "Use forgot password for this existing account.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            _ensure_subscription_profile(user)
            _generate_subscription_password_for_user(user)
        except Exception as exc:
            logger.exception("Unable to resend website subscription password for %s", email)
            return Response(
                {
                    "status": "500",
                    "type": "error",
                    "message": "Unable to resend login password. Please try again.",
                    "detail": str(exc) if settings.DEBUG else None,
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            _website_auth_payload(
                user,
                exists=False,
                created=False,
                password_sent=True,
                message="A new login password has been sent to your email.",
            ),
            status=status.HTTP_200_OK,
        )


class WebsiteSubscriptionPlanDetailView(APIView):
    """Return CMS subscription plan details for the website checkout summary."""

    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, plan_id):
        plan = (
            PricingPlan.objects.select_related("pricingplan_section")
            .prefetch_related("price_features")
            .filter(id=plan_id)
            .first()
        )
        if not plan:
            return Response(
                {
                    "status": "404",
                    "type": "error",
                    "message": "Subscription plan not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {
                "status": "200",
                "type": "success",
                "message": "Subscription plan details fetched successfully.",
                "data": _pricing_plan_detail_payload(plan),
            },
            status=status.HTTP_200_OK,
        )


class WebsiteMtnSubscriptionInitiateView(APIView):
    """Start an MTN MoMo website subscription payment through escrow-microservice."""

    authentication_classes = [WebsiteSubscriptionTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data or {}
        email = str(data.get("email") or request.user.email or "").strip()
        try:
            validate_email(email)
        except ValidationError:
            return Response(
                {"error": "Invalid email address."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        block_response = _subscription_checkout_block_response(request.user)
        if block_response:
            return block_response

        phone_number = str(
            data.get("phone_number")
            or data.get("phone_no")
            or data.get("subscriberMsisdn")
            or getattr(_user_profile(request.user), "phone", "")
            or ""
        ).strip()
        if not phone_number:
            return Response(
                {"error": "Phone number is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            phone_number = normalize_mtn_cameroon_msisdn(phone_number)
            pricing_plan = _pricing_plan_from_request(data)
            amount = (
                pricing_plan["whole_amount"]
                if pricing_plan
                else _normalize_amount(data.get("amount"))
            )
        except ValueError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        subscription_frequency = (
            pricing_plan["subscription_frequency"]
            if pricing_plan
            else _normalize_subscription_frequency(
                data.get("subscription_frequency")
                or data.get("frequency")
                or data.get("billing_cycle")
            )
        )
        if not subscription_frequency:
            return Response(
                {"error": "Invalid subscription frequency."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        gateway = PaymentGatewayAPI()
        payment_response = gateway.initialize_subscription(
            {
                "email": email,
                "phone_number": phone_number,
                "amount": amount,
                "subscription_frequency": subscription_frequency,
            }
        )
        if not payment_response:
            return Response(
                {"error": "MTN subscription initiation failed."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        response_status = _payment_status(
            payment_response.get("status") or payment_response.get("payment_status")
        )
        if response_status == "failed":
            return Response(
                {
                    "error": payment_response.get(
                        "message", "MTN subscription initiation failed."
                    ),
                    "payment_response": payment_response,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        reference_id = (
            payment_response.get("referenceId")
            or payment_response.get("reference_id")
            or payment_response.get("subscription_id")
        )
        _record_subscription_payment_attempt(
            request.user,
            provider="mtn",
            reference_id=reference_id,
            payment_status=payment_response.get("payment_status", "pending"),
            subscription_frequency=subscription_frequency,
            amount=amount,
            pricing_plan=pricing_plan,
            provider_response=payment_response,
        )
        return Response(
            {
                "message": "MTN subscription payment request sent successfully.",
                "referenceId": reference_id,
                "subscription_id": payment_response.get("subscription_id"),
                "payment_status": payment_response.get("payment_status", "pending"),
                "next_action": MTN_MOMO_APPROVAL_NEXT_ACTION,
                "pricing_plan": pricing_plan,
                "payment_response": payment_response,
            },
            status=status.HTTP_200_OK,
        )


class WebsiteMtnPreapprovalStatusView(APIView):
    """Poll MTN MoMo subscription status and activate access once payment is paid."""

    authentication_classes = [WebsiteSubscriptionTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, reference_id):
        owner_block_response = _reference_owner_block_response(request.user, reference_id)
        if owner_block_response:
            return owner_block_response

        payment_response = PaymentGatewayAPI().get_mtn_subscription_preapproval_status(
            reference_id
        )
        if not payment_response:
            return Response(
                {"error": "MTN preapproval status lookup failed."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        if payment_response.get("error"):
            return Response(payment_response, status=status.HTTP_404_NOT_FOUND)

        _update_subscription_payment_attempt(reference_id, payment_response)
        subscription_activated = _activate_subscription_for_reference(
            request.user,
            payment_response,
            provider="mtn_website_subscription",
        )
        profile = _user_profile(request.user)
        is_payment_verified = refresh_profile_subscription_status(profile)
        return Response(
            {
                "payment_status": _payment_status(payment_response.get("payment_status")),
                "subscription_activated": subscription_activated,
                "is_payment_verified": is_payment_verified,
                "active_subscription": _active_subscription_payload(profile),
                "payment_response": payment_response,
            },
            status=status.HTTP_200_OK,
        )


class WebsiteOrangeSubscriptionInitiateView(APIView):
    """Start an Orange Money website subscription payment through escrow-microservice."""

    authentication_classes = [WebsiteSubscriptionTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data or {}
        email = str(data.get("email") or request.user.email or "").strip()
        try:
            validate_email(email)
        except ValidationError:
            return Response(
                {"error": "Invalid email address."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        block_response = _subscription_checkout_block_response(request.user)
        if block_response:
            return block_response

        phone_number = str(
            data.get("phone_number")
            or data.get("phone_no")
            or data.get("subscriberMsisdn")
            or getattr(_user_profile(request.user), "phone", "")
            or ""
        ).strip()
        if not phone_number:
            return Response(
                {"error": "Phone number is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            phone_number = normalize_orange_cameroon_msisdn(phone_number)
            pricing_plan = _pricing_plan_from_request(data)
            amount = (
                pricing_plan["whole_amount"]
                if pricing_plan
                else _normalize_amount(data.get("amount"))
            )
        except ValueError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        subscription_frequency = (
            pricing_plan["subscription_frequency"]
            if pricing_plan
            else _normalize_subscription_frequency(
                data.get("subscription_frequency")
                or data.get("frequency")
                or data.get("billing_cycle")
            )
        )
        if not subscription_frequency:
            return Response(
                {"error": "Invalid subscription frequency."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        gateway = PaymentGatewayAPI()
        payment_response = gateway.initialize_orange_website_subscription(
            {
                "email": email,
                "subscriberMsisdn": phone_number,
                "amount": amount,
                "subscription_frequency": subscription_frequency,
                "description": f"TrustWork {subscription_frequency} website subscription",
                "user_id": request.user.id,
            }
        )
        if not payment_response:
            return Response(
                {"error": "Orange subscription initiation failed."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        if payment_response.get("success") is False:
            return Response(
                {
                    "error": payment_response.get(
                        "message", "Orange subscription initiation failed."
                    ),
                    "payment_response": payment_response,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        reference_id = payment_response.get("payToken") or payment_response.get("orderId")
        _record_subscription_payment_attempt(
            request.user,
            provider="orange",
            reference_id=reference_id,
            payment_status=payment_response.get("status") or "pending",
            subscription_frequency=subscription_frequency,
            amount=amount,
            pricing_plan=pricing_plan,
            provider_response=payment_response,
        )
        return Response(
            {
                "message": "Orange subscription payment request sent successfully.",
                "referenceId": reference_id,
                "orderId": payment_response.get("orderId"),
                "payToken": payment_response.get("payToken"),
                "orangeTransactionId": payment_response.get("orangeTransactionId"),
                "payment_status": _payment_status(payment_response.get("status")),
                "next_action": ORANGE_MONEY_APPROVAL_NEXT_ACTION,
                "pricing_plan": pricing_plan,
                "payment_response": payment_response,
            },
            status=status.HTTP_200_OK,
        )


class WebsiteOrangeSubscriptionStatusView(APIView):
    """Poll Orange subscription status and activate access once payment is paid."""

    authentication_classes = [WebsiteSubscriptionTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, reference_id):
        owner_block_response = _reference_owner_block_response(request.user, reference_id)
        if owner_block_response:
            return owner_block_response

        payment_response = PaymentGatewayAPI().get_orange_subscription_status(reference_id)
        if not payment_response:
            return Response(
                {"error": "Orange subscription status lookup failed."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        if payment_response.get("error"):
            return Response(payment_response, status=status.HTTP_404_NOT_FOUND)

        _update_subscription_payment_attempt(reference_id, payment_response)
        subscription_activated = _activate_subscription_for_reference(
            request.user,
            payment_response,
            provider="orange_website_subscription",
        )
        profile = _user_profile(request.user)
        is_payment_verified = refresh_profile_subscription_status(profile)
        return Response(
            {
                "payment_status": _payment_status(payment_response.get("payment_status")),
                "subscription_activated": subscription_activated,
                "is_payment_verified": is_payment_verified,
                "active_subscription": _active_subscription_payload(profile),
                "payment_response": payment_response,
            },
            status=status.HTTP_200_OK,
        )


class WebsiteStripeSubscriptionInitiateView(APIView):
    """Create a Stripe PaymentIntent for website subscription checkout."""

    authentication_classes = [WebsiteSubscriptionTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data or {}
        forbidden_fields = sorted(
            field for field in STRIPE_FORBIDDEN_PAYMENT_FIELDS if data.get(field)
        )
        if forbidden_fields:
            return Response(
                {
                    "error": (
                        "Do not send card details to this API. Use Stripe.js / "
                        "Stripe Elements with the returned client_secret."
                    ),
                    "forbidden_fields": forbidden_fields,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = str(data.get("email") or request.user.email or "").strip()
        try:
            validate_email(email)
        except ValidationError:
            return Response(
                {"error": "Invalid email address."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        block_response = _subscription_checkout_block_response(request.user)
        if block_response:
            return block_response

        try:
            pricing_plan = _pricing_plan_from_request(data)
        except ValueError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        subscription_frequency = (
            pricing_plan["subscription_frequency"]
            if pricing_plan
            else _normalize_subscription_frequency(
                data.get("subscription_frequency")
                or data.get("frequency")
                or data.get("billing_cycle")
            )
        )
        if not subscription_frequency:
            return Response(
                {"error": "Invalid subscription frequency."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        currency = str(data.get("currency") or ("xaf" if pricing_plan else "usd")).strip().lower()
        try:
            amount = pricing_plan["amount"] if pricing_plan else _normalize_decimal_amount(data.get("amount"))
            stripe_amount = _stripe_minor_units(amount, currency)
        except ValueError as exc:
            return Response({"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        metadata = {
            "trustwork_subscription": "website",
            "user_id": str(request.user.id),
            "email": email,
            "subscription_frequency": subscription_frequency,
            "subscription_amount": str(amount),
            "currency": currency,
        }
        if pricing_plan:
            metadata["pricing_plan_id"] = str(pricing_plan["id"])
            metadata["pricing_plan_name"] = str(pricing_plan["plan_name"] or "")
        idempotency_key = (
            request.headers.get("Idempotency-Key")
            or data.get("idempotency_key")
            or f"trustwork-subscription-{request.user.id}-{uuid4()}"
        )

        try:
            payment_intent = stripe.PaymentIntent.create(
                amount=stripe_amount,
                currency=currency,
                automatic_payment_methods={"enabled": True},
                metadata=metadata,
                description=f"TrustWork {subscription_frequency} website subscription",
                receipt_email=email,
                idempotency_key=idempotency_key,
            )
        except stripe.error.StripeError as exc:
            logger.exception("Stripe subscription initiate failed")
            return Response(
                {"error": getattr(exc, "user_message", None) or str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        payment_response = _stripe_payment_response(payment_intent)
        _record_subscription_payment_attempt(
            request.user,
            provider="stripe",
            reference_id=payment_response["referenceId"],
            payment_status=payment_response["payment_status"],
            subscription_frequency=subscription_frequency,
            amount=amount,
            currency=currency,
            pricing_plan=pricing_plan,
            provider_response=payment_response,
            idempotency_key=idempotency_key,
        )
        return Response(
            {
                "message": "Stripe subscription PaymentIntent created successfully.",
                "referenceId": payment_response["referenceId"],
                "payment_intent_id": payment_response["payment_intent_id"],
                "client_secret": _stripe_object_value(payment_intent, "client_secret"),
                "publishable_key": settings.STRIPE_TEST_PUBLIC_KEY,
                "payment_status": payment_response["payment_status"],
                "pricing_plan": pricing_plan,
                "payment_response": payment_response,
            },
            status=status.HTTP_200_OK,
        )


class WebsiteStripeSubscriptionStatusView(APIView):
    """Retrieve Stripe PaymentIntent status and activate paid subscriptions."""

    authentication_classes = [WebsiteSubscriptionTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, payment_intent_id):
        owner_block_response = _reference_owner_block_response(
            request.user,
            payment_intent_id,
        )
        if owner_block_response:
            return owner_block_response

        try:
            payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        except stripe.error.StripeError as exc:
            return Response(
                {"error": getattr(exc, "user_message", None) or str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        payment_response = _stripe_payment_response(payment_intent)
        _update_subscription_payment_attempt(payment_intent_id, payment_response)
        metadata_user_id = (
            payment_response.get("provider_response", {})
            .get("metadata", {})
            .get("user_id")
        )
        if metadata_user_id and str(metadata_user_id) != str(request.user.id):
            return Response(
                {"error": "Stripe payment reference does not belong to this user."},
                status=status.HTTP_403_FORBIDDEN,
            )

        subscription_activated = _activate_subscription_for_reference(
            request.user,
            payment_response,
            provider="stripe_website_subscription",
        )
        profile = _user_profile(request.user)
        is_payment_verified = refresh_profile_subscription_status(profile)
        return Response(
            {
                "payment_status": payment_response["payment_status"],
                "subscription_activated": subscription_activated,
                "is_payment_verified": is_payment_verified,
                "active_subscription": _active_subscription_payload(profile),
                "payment_response": payment_response,
            },
            status=status.HTTP_200_OK,
        )


class WebsiteStripeSubscriptionWebhookView(APIView):
    """Stripe webhook for server-side subscription activation."""

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        webhook_secret = (
            getattr(settings, "STRIPE_SUBSCRIPTION_WEBHOOK_SECRET", None)
            or os.getenv("STRIPE_SUBSCRIPTION_WEBHOOK_SECRET")
        )
        if not webhook_secret:
            return Response(
                {"error": "Stripe subscription webhook secret is not configured."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            event = stripe.Webhook.construct_event(
                request.body,
                request.META.get("HTTP_STRIPE_SIGNATURE"),
                webhook_secret,
            )
        except ValueError:
            return Response({"error": "Invalid Stripe payload."}, status=400)
        except stripe.error.SignatureVerificationError:
            return Response({"error": "Invalid Stripe signature."}, status=400)

        if event.get("type") == "payment_intent.succeeded":
            payment_intent = event["data"]["object"]
            payment_response = _stripe_payment_response(payment_intent)
            metadata = dict(_stripe_object_value(payment_intent, "metadata", {}) or {})
            user_id = metadata.get("user_id")
            from customuser.models import CustomUser

            user = CustomUser.objects.filter(id=user_id, is_active=True).first()
            if user:
                _update_subscription_payment_attempt(
                    payment_response["referenceId"],
                    payment_response,
                )
                _activate_subscription_for_reference(
                    user,
                    payment_response,
                    provider="stripe_website_subscription",
                )

        return Response({"received": True}, status=status.HTTP_200_OK)
