# Pooja Sharma — Personal Developer Portfolio

Production-ready portfolio with a public site and private admin dashboard.

## Repository layout

| Path | Description |
|------|-------------|
| `frontend/` | React + TypeScript + Vite (live: **https://itspooja.vercel.app**, Vercel project **itspooja**) |
| `backend/` | FastAPI + SQLAlchemy (Vercel: **pooja-portfolio-backend**) |
| `docs/` | Architecture, API, deployment, and setup guides |

## Tech stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router
- **Backend:** Python 3.12, FastAPI, SQLAlchemy 2.0, Alembic, PyJWT, pwdlib (Argon2)
- **Database:** Neon PostgreSQL (pooled URL at runtime, direct URL for migrations)
- **Media:** Cloudinary
- **Deploy:** GitHub + Vercel (two projects)

## Quick start

1. Copy `backend/.env.example` → `backend/.env` and `frontend/.env.example` → `frontend/.env`
2. `cd backend && python3.12 -m venv .venv && .venv/bin/pip install -r requirements.txt`
3. `alembic upgrade head` with `DIRECT_DATABASE_URL`
4. `.venv/bin/python -m app.cli init-admin`
5. `.venv/bin/uvicorn app.main:app --reload`
6. `cd frontend && npm install && npm run dev`

Public site: `http://localhost:5173` · Admin: `/admin/login` · API docs: `http://localhost:8000/docs`

## Documentation

- [PROJECT_ARCHITECTURE.md](docs/PROJECT_ARCHITECTURE.md)
- [LOCAL_SETUP.md](docs/LOCAL_SETUP.md)
- [VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md)

## License

See [LICENSE](LICENSE).

Owner: **Pooja Sharma**