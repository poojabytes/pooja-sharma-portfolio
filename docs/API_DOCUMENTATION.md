# API Documentation

> **Status:** Phase 1 placeholder. Interactive docs live at `GET /docs` once the backend is running (Phase 6).

## Base URL

- Local: `http://localhost:8000`
- Production: your Vercel backend URL

## Version prefix

`/api/v1`

## Public endpoints (planned)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/profile` | Portfolio profile |
| GET | `/social-links` | Social links |
| GET | `/skills` | Skills by category |
| GET | `/projects` | Project list |
| GET | `/projects/{id}` | Project detail |
| GET | `/experience` | Experience entries |
| GET | `/education` | Education entries |
| GET | `/certificates` | Certificates |
| GET | `/resume` | Resume metadata + download URL |
| POST | `/contact` | Submit contact message |
| GET | `/settings/public` | Safe site keys (`site_title`, `default_theme`) |

## Admin endpoints (planned)

Authentication via HttpOnly JWT cookie. All admin routes except `POST /admin/login` require an authenticated admin session.

See [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md) for auth and layering details.