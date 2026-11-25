# Project Architecture

## Overview

Monorepo **`pooja-sharma-portfolio`** contains two deployable applications that share one GitHub repository and two Vercel projects.

```
┌─────────────────┐     HTTPS (cookies + CORS)     ┌─────────────────┐
│  Vercel Frontend │ ◄──────────────────────────► │  Vercel Backend  │
│  (Vite/React)    │         /api/v1/*            │  (FastAPI)       │
└────────┬────────┘                              └────────┬────────┘
         │                                                 │
         │ VITE_API_BASE_URL only                          │ DATABASE_URL (pooled)
         │                                                 │ DIRECT_DATABASE_URL (migrations)
         ▼                                                 ▼
   Static SPA + CDN                                  Neon PostgreSQL
                                                            │
                                                      Cloudinary (media)
```

## Layered backend design

| Layer | Responsibility |
|-------|----------------|
| `api/v1/endpoints` | HTTP routing, status codes, dependency injection |
| `schemas` | Pydantic v2 request/response validation |
| `services` | Business logic (auth, uploads, email) |
| `repositories` | SQLAlchemy queries and transactions |
| `models` | Table definitions and relationships |
| `core` | Config, security (JWT, Argon2), shared dependencies |

## Authentication model

- Single admin account (no public registration)
- Argon2 password hashing via pwdlib
- JWT stored in **HttpOnly** cookies (not localStorage)
- Admin routes protected by `get_current_admin` dependency
- CORS restricted to `FRONTEND_URL`

## Serverless constraints (Vercel)

- No migrations on application startup
- No `create_all()` on every request
- Short-lived DB connections via Neon **pooled** URL
- Alembic runs locally/CI with **direct** URL only
- Permanent files only on Cloudinary

## Frontend structure

- **Public routes:** Home, About, Projects, Experience, Contact (+ sections on home)
- **Admin routes:** `/admin/login`, `/admin/dashboard` (protected)
- **Services:** Axios client with credentials for cookie auth
- **Data:** All portfolio content from public GET APIs

## API surface (versioned)

Base path: `/api/v1`

**Public (read + contact):** profile, social-links, skills, projects, experience, education, certificates, resume, POST contact

**Admin:** login, logout, me, CRUD for all content entities, settings, contact message management, uploads via backend-signed Cloudinary flow

## Database entities

`admins`, `profiles`, `social_links`, `skills`, `projects`, `project_images`, `experiences`, `education`, `certificates`, `resumes`, `contact_messages`, `website_settings`

Details: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

## Deployment topology

| Vercel project | Root | Entry |
|--------------|------|--------|
| itspooja | `frontend/` | `dist` after `npm run build` |
| pooja-portfolio-backend | `backend/` | `index.py` → `app.main:app` |

## Phase roadmap

1. **Architecture & folders** ✓
2. Frontend scaffolding ✓
3. Backend scaffolding ✓
4. Neon integration ✓
5. Models & Alembic ✓
6. APIs & auth ✓
7. Cloudinary ✓
8. Public UI ✓
9. Admin dashboard ✓
10. Integration ✓
11. Testing (baseline) ✓
12. Deploy docs ✓
13. Documentation (ongoing)