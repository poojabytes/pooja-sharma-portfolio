# Environment Variables

## Backend (`backend/.env`)

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes (prod) | Neon **pooled** connection for runtime / Vercel |
| `DIRECT_DATABASE_URL` | Yes (migrations) | Neon **direct** URL for Alembic only |
| `JWT_SECRET_KEY` | Yes (prod) | JWT signing secret — long random string |
| `JWT_ALGORITHM` | No | Default `HS256` |
| `JWT_EXPIRE_MINUTES` | No | Session lifetime (default `60`) |
| `ADMIN_EMAIL` | Init only | Used by `python -m app.cli init-admin` |
| `ADMIN_INITIAL_PASSWORD` | Init only | One-time admin setup (never commit) |
| `FRONTEND_URL` | Yes | CORS allowlist + must match browser origin exactly (no trailing slash) |
| `ENVIRONMENT` | No | `development` or `production` — drives cookie `Secure` / `SameSite` |
| `COOKIE_SECURE` | No | Local override; production forces `true` |
| `COOKIE_SAMESITE` | No | Local default `lax`; production forces `none` for cross-origin Vercel |
| `CLOUDINARY_CLOUD_NAME` | Uploads | Cloudinary cloud |
| `CLOUDINARY_API_KEY` | Uploads | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Uploads | Server-only secret |

### Production cookie note (Vercel)

Frontend and backend run on **different domains**. Set:

- `ENVIRONMENT=production`
- `FRONTEND_URL=https://your-frontend.vercel.app` (or custom domain)
- Cookies: `Secure` + `SameSite=None` (automatic when `ENVIRONMENT=production`)

Admin login requires `withCredentials: true` on the frontend (already configured).

## Frontend (`frontend/.env`)

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_API_BASE_URL` | Yes | Backend root URL, e.g. `https://your-api.vercel.app` |

**Never** expose database URLs, JWT secrets, admin passwords, or Cloudinary secrets in `VITE_*` variables.

## Local pairing

```env
# backend
FRONTEND_URL=http://localhost:5173
ENVIRONMENT=development

# frontend
VITE_API_BASE_URL=http://localhost:8000
```