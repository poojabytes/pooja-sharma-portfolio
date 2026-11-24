# Local Setup

## Prerequisites

- Node.js 20+
- Python 3.12
- Neon PostgreSQL (pooled + direct URLs)
- Cloudinary account (for uploads)
- Git

## 1. Clone and env files

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Fill Neon, JWT, Cloudinary, and `FRONTEND_URL` / `VITE_API_BASE_URL` as described in [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md).

## 2. Backend

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Migrations (uses DIRECT_DATABASE_URL)
export DIRECT_DATABASE_URL="postgresql://..."
.venv/bin/alembic upgrade head

# One-time admin + profile seed
.venv/bin/python -m app.cli init-admin

.venv/bin/uvicorn app.main:app --reload --port 8000
```

Verify: [http://localhost:8000/health](http://localhost:8000/health), [http://localhost:8000/docs](http://localhost:8000/docs)

## 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and [http://localhost:5173/admin/login](http://localhost:5173/admin/login).

## 4. Integration checklist

- [ ] Home loads profile from `GET /api/v1/profile`
- [ ] Contact form returns 201
- [ ] Admin login sets cookie; `GET /api/v1/admin/me` succeeds
- [ ] Profile save reflects on public site after reload
- [ ] Image/resume uploads (requires Cloudinary env)

## 5. Tests

```bash
cd backend && .venv/bin/pytest
cd ../frontend && npm run typecheck && npm run lint && npm run build
```