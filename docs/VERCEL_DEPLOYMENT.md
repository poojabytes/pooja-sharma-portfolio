# Vercel Deployment

Two Vercel projects from one GitHub monorepo: **pooja-portfolio-frontend** and **pooja-portfolio-backend**.

## Project configuration

| Vercel project | Root | Build | Output |
|----------------|------|-------|--------|
| `pooja-portfolio-frontend` | `frontend` | `npm run build` | `dist` |
| `pooja-portfolio-backend` | `backend` | (auto Python) | `index.py` → FastAPI |

## Step-by-step

1. Create GitHub repository `pooja-sharma-portfolio` and push this monorepo.
2. Create a **Neon** PostgreSQL project.
3. Copy the **pooled** connection string → `DATABASE_URL`.
4. Copy the **direct** connection string → `DIRECT_DATABASE_URL`.
5. Create a **Cloudinary** account.
6. Copy `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
7. Configure `backend/.env` and `frontend/.env` locally (see [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)).
8. Run `alembic upgrade head` locally against Neon using `DIRECT_DATABASE_URL`.
9. Run `python -m app.cli init-admin` once.
10. Test backend locally (`uvicorn app.main:app --reload`).
11. Test frontend locally (`npm run dev`) against local API.
12. Push the complete project to GitHub.
13. In Vercel, **Import** the GitHub repository (twice — two projects).
14. Create frontend project with root directory **`frontend`**.
15. Set frontend env: `VITE_API_BASE_URL=https://<backend-domain>` (no trailing slash).
16. Create backend project with root directory **`backend`**.
17. Set backend env: `DATABASE_URL`, `JWT_SECRET_KEY`, Cloudinary, `ENVIRONMENT=production`, etc.
18. Set `FRONTEND_URL` to the **exact** deployed frontend origin (e.g. `https://pooja-portfolio-frontend.vercel.app`).
19. Deploy the **backend** first.
20. Verify `GET /health`, `GET /docs`, and `GET /api/v1/profile`.
21. Deploy the **frontend**.
22. Verify home page loads API data; check browser network tab for CORS + 200 responses.
23. Test **admin login** on production (`/admin/login`) — cookie must be set (`Secure`, `SameSite=None`).
24. Test **profile photo** upload (Cloudinary).
25. Test **resume** upload and public download.
26. Test **project** create + thumbnail upload.
27. Test public site on mobile and desktop; contact form 201.
28. Attach **custom domains** when ready; update `FRONTEND_URL` and `VITE_API_BASE_URL` to match.

## Critical integration settings

- `FRONTEND_URL` must match the browser origin used to access the SPA (scheme + host, no path).
- Production admin auth uses **HttpOnly** cookies with `ENVIRONMENT=production` → `SameSite=None` + `Secure`.
- Frontend axios uses `withCredentials: true` for all API calls.
- Do **not** run Alembic on Vercel deploy; migrate from CI or local only.

## Pre-deploy verification

```bash
cd backend && .venv/bin/pytest
cd ../frontend && npm run typecheck && npm run lint && npm run build
python -c "from backend.index import app"  # from repo root, or cd backend
```