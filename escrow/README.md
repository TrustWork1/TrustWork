# Escrow Microservice

Django microservice for TrustWork payment workflows. It handles escrow records, subscription initialization, MTN MoMo collection/disbursement, Orange Money payments, Stripe sessions, and webhook processing.

## Requirements

- Python 3.12
- Poetry 1.8.3
- PostgreSQL
- Redis, for Celery broker support

## Included Apps

- `escrow_management`
- `orange_management`
- `payment_handler`
- `user_management`
- `core`

## Setup

Install dependencies, including the development lint/format tools:

```bash
poetry install --with dev
```

Create a local `.env` file with the required database, TrustWork API, escrow API, MTN MoMo, Orange Money, Stripe, Redis, and webhook settings. Keep local environment files and provider credentials out of git.

Run database migrations:

```bash
poetry run python manage.py migrate
```

Start the development server:

```bash
poetry run python manage.py runserver
```

Start a Celery worker when testing async payment tasks:

```bash
poetry run celery -A core worker -l info
```

## Code Quality

Black and Ruff are configured in `pyproject.toml`.

```bash
poetry run black .
poetry run ruff check .
poetry run ruff format .
```

## Useful Commands

```bash
poetry run python manage.py makemigrations
poetry run python manage.py migrate
poetry run python manage.py test
```

## Git Hygiene

Runtime logs, generated files, local editor settings, Codex/agent folders, environment files, and credentials are ignored. If any local-only file was committed earlier, remove it from git tracking with `git rm --cached` while keeping the local copy on disk.
