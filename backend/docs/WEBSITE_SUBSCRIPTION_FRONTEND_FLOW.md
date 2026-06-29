# Website Subscription Frontend API Flow

This document explains how the website frontend should call the TrustWork subscription APIs for Option 1: website subscription payment through MTN MoMo, Orange Money, or Stripe.

## Base Rules

- Use the TrustWork backend base URL for all endpoints.
- For protected subscription APIs, send the user token in the header:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

- Supported subscription frequencies:

```text
weekly
monthly
yearly
```

The API also accepts aliases like `week`, `month`, and `year`.

- On successful payment confirmation, the backend activates the user subscription and sets `is_payment_verified=true`.
- On successful payment confirmation, the backend sends a TrustWork payment receipt email with an attached PDF receipt.
- Failed or pending payments do not receive a PDF receipt. Frontend should show the normal failed/pending state instead.
- The website should keep polling the provider status endpoint while `payment_status` is `pending`.
- If the user already has an active subscription, all payment initiate APIs return `409`.
- If the user already has a non-expired pending subscription payment attempt, all payment initiate APIs return `409` until that pending attempt is completed, failed, or expires.
- Pending attempts expire after 30 minutes by default.
- Backend can override the pending attempt window with `WEBSITE_SUBSCRIPTION_PENDING_TTL_MINUTES`.

Active-subscription block response:

```json
{
  "status": "409",
  "type": "error",
  "code": "active_subscription_exists",
  "message": "You already have an active subscription. Please wait until it expires before purchasing another plan.",
  "active_subscription": {
    "id": 101,
    "subscription_frequency": "monthly",
    "subscription_plan": "Membership_monthly",
    "expire_at": "2026-06-25T10:30:00Z",
    "purchase_token": "pi_123"
  }
}
```

Pending-payment block response:

```json
{
  "status": "409",
  "type": "error",
  "code": "subscription_payment_pending",
  "message": "A subscription payment is already pending. Please complete it or wait until it expires before starting another payment.",
  "pending_attempt": {
    "id": 55,
    "provider": "mtn",
    "referenceId": "c24fbf18-3a4a-43db-9f81-7a7f998ae6b1",
    "payment_status": "pending",
    "subscription_frequency": "monthly",
    "amount": "10000.00",
    "currency": "XAF",
    "pricing_plan_id": 2,
    "expires_at": "2026-05-29T08:30:00Z",
    "retry_after_seconds": 1200
  }
}
```

Frontend should show the existing active/pending state instead of opening another payment flow.

## Payment Receipt Email

The backend sends a branded receipt email only after a payment is confirmed as successful.
The email uses the TrustWork logo from `static/images/logo.png` and attaches a PDF receipt.

Covered successful-payment cases:

- Website subscription paid through MTN MoMo, Orange Money, or Stripe.
- Mobile subscription activation through MTN/Orange subscription code or app-store subscription handling.
- Project/bid collection payment marked as `completed`.

Receipt email subject format:

```text
TrustWork Payment Receipt - TW-SUB-000101
TrustWork Payment Receipt - TW-PAY-000222
```

Frontend does not need a separate API for receipt email. After the status API returns
`payment_status=paid` and `subscription_activated=true`, the frontend can show success
and optionally tell the user:

```text
Payment successful. A receipt has been sent to your email.
```

If the payment is `pending` or `failed`, do not show any receipt message.

## Domains And Local Setup

Local domains:

| Service | Local base URL |
| --- | --- |
| Website frontend | `http://127.0.0.1:3000` |
| TrustWork backend | `http://127.0.0.1:8000` |
| Escrow microservice | `http://127.0.0.1:8001` |

Server domains:

| Service | Dev/staging URL | Live URL |
| --- | --- | --- |
| Website frontend | `https://trustwork-dev.dedicateddevelopers.us` | `https://trustwork.live` |
| TrustWork backend API | `https://trustwork-api.dedicateddevelopers.us` | `https://api.trustwork.live` |
| Escrow microservice API | `https://trustwork-escrow.dedicateddevelopers.us` | `https://escrow.trustwork.live` |

Local backend run:

```bash
cd "/home/user470/Webskitters Workspace/trustwork-backend"
source .venv/bin/activate
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

Local escrow run:

```bash
cd "/home/user470/Webskitters Workspace/escrow-microservice"
source .venv/bin/activate
python manage.py migrate
python manage.py runserver 127.0.0.1:8001
```

Orange asynchronous callbacks/status notifications use Celery in the escrow service:

```bash
cd "/home/user470/Webskitters Workspace/escrow-microservice"
source .venv/bin/activate
celery -A core worker -l info
```

Local `.env` files currently point both projects to the remote PostgreSQL server
`192.168.2.21`, so no local database dump is required just to run the APIs locally.
Run migrations only when new migration files exist.

For local payment testing, active Stripe keys must be test-mode keys. Do not keep live
Stripe keys active in local `.env` files.

## Pricing Plan Source

The website cards under "Best Packages For You" come from the backend CMS pricing tables,
not from `profile_management.MembershipPlans`.

Live website source:

```http
GET /api/home-page/
```

Relevant response path:

```text
data.pricing_plan_section.pricing_plans[]
```

Direct packages endpoint:

```http
GET /api/app-packages/
```

Single subscription plan details endpoint:

```http
GET /api/v1/subscription/plans/{planId}/
```

Use this endpoint on the buy/payment page when the frontend only has the selected plan id.
It returns name, description, price, billing cycle, normalized subscription frequency,
section copy, and feature bullets for the left-side subscription summary.

Example response:

```json
{
  "status": "200",
  "type": "success",
  "message": "Subscription plan details fetched successfully.",
  "data": {
    "id": 2,
    "plan_name": "Monthly",
    "description": "Flexible plan with full premium access for regular users.",
    "price": "10000.00",
    "amount": "10000.00",
    "amount_integer": 10000,
    "currency": "XAF",
    "billing_cycle": "Month",
    "subscription_frequency": "monthly",
    "is_popular": true,
    "features": [
      {"id": 117, "features": "Affordable short-term access"},
      {"id": 118, "features": "Great for trying out premium features"}
    ],
    "section": {
      "id": 1,
      "header": "Best Packages For You",
      "description": "These special prices are available for a limited time — only for the first 3 months."
    }
  }
}
```

Database/model mapping:

| Screen value | Django model | Database table | Field |
| --- | --- | --- | --- |
| Section title/description | `PricingPlanSection` | `content_management_pricingplansection` | `header`, `description` |
| Plan name/description/price/cycle | `PricingPlan` | `content_management_pricingplan` | `plan_name`, `description`, `price`, `billing_cycle`, `is_popular` |
| Plan bullet list | `PriceFeatures` | `content_management_pricefeatures` | `features`, `pricing_plan_id` |
| Purchased user subscription | `Subscriptions` | `profile_management_subscriptions` | `subscription_frequency`, `expire_at`, `purchase_token`, `receipt_amount`, `receipt_currency`, `receipt_payment_method`, `receipt_email_sent_at` |

Current live plan ids and prices:

| Plan id | Plan | Price | Billing cycle | Payment frequency |
| --- | --- | --- | --- | --- |
| `1` | Weekly | `3000.00` | `Week` | `weekly` |
| `2` | Monthly | `10000.00` | `Month` | `monthly` |
| `3` | Yearly | `100000.00` | `Year` | `yearly` |

Frontend should pass the selected CMS plan id as `pricing_plan_id` to payment initiate APIs.
When `pricing_plan_id` is sent, the backend resolves amount and subscription frequency from
the CMS table, so the browser cannot tamper with the payable amount.

## Frontend Quick Flow

Use this order from the subscription cards:

```text
select plan
-> fetch selected plan details by id
-> check-email
-> login
-> validate-token
-> initiate selected payment provider
-> confirm/approve payment
-> poll provider status
-> show success when payment_status=paid
```

User compatibility:

- Website-created users are normal TrustWork client users. They receive a generated password by email and can also login to the mobile app with `/api/login/`.
- Mobile-app users can pay through the website. Use the same email in `check-email`, then ask them to login with their existing password.
- The website flow is email based. If a user does not have an email on the account, collect/add email before using this flow.

## Idempotency-Key

`Idempotency-Key` is generated by the frontend; it does not come from the backend.
Create one unique key per checkout attempt and reuse the same key if the same initiate
request is retried because of a network error or double click.

Browser example:

```js
const checkoutAttemptId =
  crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

await fetch(`${API_BASE}/api/v1/subscription/stripe/initiate/`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    "Idempotency-Key": checkoutAttemptId,
  },
  body: JSON.stringify({
    pricing_plan_id: selectedPlan.id,
    currency: "xaf",
  }),
});
```

For the current backend, this key is meaningful for Stripe initiate because Stripe
uses it to avoid duplicate PaymentIntents. MTN and Orange can omit it unless
server-side duplicate prevention is added for those providers later.

## 1. Website Email/Login Flow

The website has no normal login page, so start with the email modal from the subscription cards.

### Step 1: Check Email

```http
POST /api/v1/subscription/auth/check-email/
```

Request:

```json
{
  "email": "user@example.com"
}
```

Existing user response:

```json
{
  "message": "Account found. Please login with your password.",
  "email": "user@example.com",
  "exists": true,
  "created": false,
  "password_sent": false,
  "can_login": true,
  "login_endpoint": "/api/login/"
}
```

New user response:

```json
{
  "message": "We created your TrustWork account and sent a login password to your email.",
  "email": "user@example.com",
  "exists": false,
  "created": true,
  "password_sent": true,
  "can_login": true,
  "login_endpoint": "/api/login/"
}
```

If `exists=true`, show the existing-user login modal.
If `exists=false`, show the "check your email" state, then show the login modal with the email prefilled.

### Step 2: Login

Use the existing login API:

```http
POST /api/login/
```

Request:

```json
{
  "email": "user@example.com",
  "password": "password-from-email"
}
```

Success response includes `accessToken`. Store it and use it as `Authorization: Bearer <accessToken>` for the payment APIs below.

### Step 3: Resend Generated Password

Only use this for users created by the website subscription flow.

```http
POST /api/v1/subscription/auth/resend-password/
```

Request:

```json
{
  "email": "user@example.com"
}
```

Success response:

```json
{
  "message": "A new login password has been sent to your email.",
  "password_sent": true
}
```

## 2. Validate User Token

Call this before showing the subscription/payment screen.

```http
POST /subscription/validate-token/
```

Headers:

```http
Authorization: Bearer <token>
```

Alternative body format if header is not convenient:

```json
{
  "token": "<token>"
}
```

Success response:

```json
{
  "valid": true,
  "user": {
    "id": 12,
    "email": "user@example.com",
    "full_name": "User Name",
    "user_type": "provider",
    "profile_id": 5,
    "is_payment_verified": false,
    "active_subscription": null
  }
}
```

If `is_payment_verified=true`, the website can skip payment and show subscription active state.

## 3. MTN MoMo Flow

### Step 1: Initiate MTN Payment

```http
POST /api/v1/subscription/mtn/initiate/
```

Request:

```json
{
  "phone_number": "+237651890022",
  "pricing_plan_id": 2
}
```

Notes:

- `email` is optional. If not sent, backend uses the logged-in user email.
- `pricing_plan_id` should come from `data.pricing_plan_section.pricing_plans[]`.
- If `pricing_plan_id` is sent, backend derives amount and frequency from CMS.
- Legacy fallback: `amount` and `subscription_frequency` can still be sent when no CMS plan id is available.
- Phone can be `651890022`, `237651890022`, or `+237 651 890 022`.

Success response:

```json
{
  "message": "MTN subscription payment request sent successfully.",
  "referenceId": "c24fbf18-3a4a-43db-9f81-7a7f998ae6b1",
  "subscription_id": "0ebfe2b6-8d3b-4a58-bbd4-dc1c01f35766",
  "payment_status": "pending",
  "next_action": {
    "type": "mtn_momo_approval",
    "message": "Approve the MTN MoMo payment prompt on your phone. If the prompt does not appear automatically, open MTN MoMo or dial your MTN MoMo code to find and approve the pending payment request."
  },
  "payment_response": {}
}
```

MTN user guidance:

- Backend can create the MTN MoMo payment request, but MTN controls whether the mobile prompt appears automatically.
- If the automatic prompt does not appear, the user may still be able to open MTN MoMo or dial the MTN MoMo code and approve the pending payment manually.
- Frontend should show `next_action.message` immediately after MTN initiate succeeds.

### Step 2: Poll MTN Status

```http
GET /api/v1/subscription/mtn/preapproval-status/{referenceId}/
```

Pending response:

```json
{
  "payment_status": "pending",
  "subscription_activated": false,
  "is_payment_verified": false,
  "active_subscription": null,
  "payment_response": {}
}
```

Paid response:

```json
{
  "payment_status": "paid",
  "subscription_activated": true,
  "is_payment_verified": true,
  "active_subscription": {
    "id": 101,
    "subscription_frequency": "monthly",
    "subscription_plan": "Membership_monthly",
    "expire_at": "2026-06-25T10:30:00Z",
    "purchase_token": "c24fbf18-3a4a-43db-9f81-7a7f998ae6b1"
  },
  "payment_response": {}
}
```

Frontend behavior:

- If `pending`, keep polling every 5-10 seconds.
- If `paid`, show success and allow access.
- If `failed`, show retry/payment failed message.

## 4. Orange Money Flow

### Step 1: Initiate Orange Payment

```http
POST /api/v1/subscription/orange/initiate/
```

Request:

```json
{
  "phone_number": "+237697279862",
  "pricing_plan_id": 2
}
```

Notes:

- `email` is optional. If not sent, backend uses the logged-in user email.
- `pricing_plan_id` should come from `data.pricing_plan_section.pricing_plans[]`.
- If `pricing_plan_id` is sent, backend derives amount and frequency from CMS.
- Legacy fallback: `amount` and `subscription_frequency` can still be sent when no CMS plan id is available.
- Orange requires minimum amount `10`.

Success response:

```json
{
  "message": "Orange subscription payment request sent successfully.",
  "referenceId": "PAY_TOKEN_VALUE",
  "orderId": "ORD-ABC123",
  "payToken": "PAY_TOKEN_VALUE",
  "orangeTransactionId": 15,
  "payment_status": "pending",
  "next_action": {
    "type": "orange_money_approval",
    "message": "Approve the Orange Money payment prompt on your phone. If the prompt does not appear automatically, open Orange Money or use the Orange Money approval flow available on your phone, then approve the pending payment request if it is shown."
  },
  "payment_response": {}
}
```

Orange user guidance:

- Backend can create the Orange Money payment request, but Orange controls whether the mobile prompt appears automatically.
- If the automatic prompt does not appear, the user should open Orange Money or use the Orange Money approval flow available on their phone and check for the pending payment.
- Frontend should show `next_action.message` immediately after Orange initiate succeeds.

### Step 2: Poll Orange Status

```http
GET /api/v1/subscription/orange/status/{referenceId}/
```

Use `referenceId` from initiate response. This will usually be `payToken`.

Paid response:

```json
{
  "payment_status": "paid",
  "subscription_activated": true,
  "is_payment_verified": true,
  "active_subscription": {
    "id": 102,
    "subscription_frequency": "monthly",
    "subscription_plan": "Membership_monthly",
    "expire_at": "2026-06-25T10:30:00Z",
    "purchase_token": "PAY_TOKEN_VALUE"
  },
  "payment_response": {}
}
```

Frontend behavior:

- If `pending`, keep polling every 5-10 seconds.
- If `paid`, show success and allow access.
- If `failed`, show retry/payment failed message.

## 5. Stripe Flow

### Step 1: Create Stripe PaymentIntent

```http
POST /api/v1/subscription/stripe/initiate/
```

Request:

```json
{
  "pricing_plan_id": 2,
  "currency": "xaf"
}
```

Notes:

- `pricing_plan_id` should come from `data.pricing_plan_section.pricing_plans[]`.
- If `pricing_plan_id` is sent, backend derives amount and frequency from CMS.
- Legacy fallback: `amount`, `currency`, and `subscription_frequency` can still be sent when no CMS plan id is available.

Recommended header for safe retries:

```http
Idempotency-Key: <unique-checkout-attempt-id>
```

Success response:

```json
{
  "message": "Stripe subscription PaymentIntent created successfully.",
  "referenceId": "pi_123",
  "payment_intent_id": "pi_123",
  "client_secret": "pi_123_secret_abc",
  "publishable_key": "pk_live_or_pk_test",
  "payment_status": "pending",
  "payment_response": {}
}
```

### Step 2: Confirm Stripe Payment on Frontend

Use Stripe.js with the returned `client_secret`.

Important: do not send card number, CVV/CVC, or expiry values to TrustWork backend.
The backend creates only the PaymentIntent and returns `client_secret`; raw card details
must stay inside Stripe Elements. If card details are sent to the initiate API, the
backend rejects the request.

Example frontend intent:

```js
const result = await stripe.confirmPayment({
  elements,
  clientSecret,
  confirmParams: {
    return_url: `${window.location.origin}/subscription/status?provider=stripe&referenceId=${paymentIntentId}`,
  },
});
```

### Step 3: Check Stripe Status

```http
GET /api/v1/subscription/stripe/status/{paymentIntentId}/
```

Paid response:

```json
{
  "payment_status": "paid",
  "subscription_activated": true,
  "is_payment_verified": true,
  "active_subscription": {
    "id": 103,
    "subscription_frequency": "monthly",
    "subscription_plan": "Membership_monthly",
    "expire_at": "2026-06-25T10:30:00Z",
    "purchase_token": "pi_123"
  },
  "payment_response": {}
}
```

Frontend behavior:

- If `pending`, show processing and poll again.
- If `paid`, show success and allow access.
- If `failed`, ask user to retry with another payment method.

## 6. Recommended Frontend State Machine

```text
select_plan
  -> fetch_plan_details_by_id
  -> check_email
  -> if exists: show login modal
  -> if not exists: generated password sent, show email-check state
  -> login with email/password
  -> receive accessToken

validate_token
  -> if invalid: show login modal again
  -> if is_payment_verified: show active subscription
  -> else: show payment methods

select_plan_and_provider
  -> initiate_provider_payment
  -> receive referenceId/client_secret
  -> provider_payment_action
  -> poll_status
  -> if paid: success/access enabled
  -> if pending: continue polling
  -> if failed: show retry
```

## 7. Error Handling

Common error response:

```json
{
  "error": "Human readable error message."
}
```

Frontend should handle:

- `400`: bad request, invalid phone, invalid amount, invalid frequency.
- `401`: token invalid or expired.
- `403`: payment reference does not belong to the logged-in user.
- `409`: user already has an active subscription or an existing pending payment attempt.
- `404`: payment/subscription reference not found.
- `502`: payment provider or escrow service communication failed.

## 8. Provider Selection Summary

| Provider | Initiate Endpoint | Status Endpoint | Frontend Extra Work |
|---|---|---|---|
| Plan details | `GET /api/v1/subscription/plans/{planId}/` | - | Use selected CMS plan id to render checkout summary |
| Website auth | `POST /api/v1/subscription/auth/check-email/` | `POST /api/login/` | New users receive generated password by email |
| MTN MoMo | `POST /api/v1/subscription/mtn/initiate/` | `GET /api/v1/subscription/mtn/preapproval-status/{referenceId}/` | User approves MTN prompt on phone |
| Orange Money | `POST /api/v1/subscription/orange/initiate/` | `GET /api/v1/subscription/orange/status/{referenceId}/` | User approves Orange payment |
| Stripe | `POST /api/v1/subscription/stripe/initiate/` | `GET /api/v1/subscription/stripe/status/{paymentIntentId}/` | Use Stripe.js with `client_secret` |

## 9. Final Sync for Mobile App

After website payment is successful:

- Backend updates `Subscriptions`.
- Backend sets profile `is_payment_verified=true`.
- User can log in to the mobile app with the same credentials.
- Mobile app should call its normal profile/login APIs and use `is_payment_verified` to allow access.
