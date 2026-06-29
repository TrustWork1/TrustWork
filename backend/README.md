# TrustWork Backend

Django REST backend for the TrustWork platform. This service owns the core API surface for authentication, profiles, projects, content pages, chat, admin management, and payment handling.

## Requirements

- Python 3.12
- Poetry 1.8.3
- PostgreSQL
- Redis, for Channels/WebSocket support

## Included Apps

- `customuser`
- `profile_management`
- `project_management`
- `content_management`
- `chat_management`
- `adminsite_management`
- `master`
- `payment_handle`
- `api`
- `core`

## Setup

Install dependencies, including the development lint/format tools:

```bash
poetry install --with dev
```

Create a local `.env` file with the required database, Stripe, Firebase, and service credentials. Keep local environment files and service account JSON files out of git.

Run database migrations:

```bash
poetry run python manage.py migrate
```

Start the development server:

```bash
poetry run python manage.py runserver
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
poetry run python manage.py collectstatic
poetry run python manage.py test
```

## Git Hygiene

Runtime logs, generated static files, local editor settings, Codex/agent folders, local scripts, backups, and credentials are ignored. If any of those files were committed earlier, remove them from git tracking with `git rm --cached` while keeping the local files on disk.
