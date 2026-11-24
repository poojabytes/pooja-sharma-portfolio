# GitHub Setup

**Owner:** [poojabytes](https://github.com/poojabytes/)  
**Repository:** `pooja-sharma-portfolio`  
**Target URL:** https://github.com/poojabytes/pooja-sharma-portfolio

## 1. Sign in to GitHub as `poojabytes`

The GitHub CLI on this machine is currently active as another user. Switch or add `poojabytes`:

```bash
gh auth login -h github.com -p https -w
```

When the browser opens, sign in as **poojabytes** (not another account).

Verify:

```bash
gh auth status
gh api user -q .login
# should print: poojabytes
```

Optional — add a second account without removing the first:

```bash
gh auth login -h github.com -p https -w
gh auth switch -u poojabytes
```

Do **not** run `gh auth setup-git` if you want to avoid changing global git user.name/email.

## 2. Create the repository

From the project root:

```bash
cd /home/poojas/self_study/portfolio

gh repo create poojabytes/pooja-sharma-portfolio \
  --public \
  --source=. \
  --remote=origin \
  --description "Pooja Sharma — portfolio monorepo (React + FastAPI)" \
  --push
```

If the repo name is taken, use a variant and update Vercel import accordingly.

**Manual alternative:** create an empty repo at https://github.com/new (owner `poojabytes`, name `pooja-sharma-portfolio`), then:

```bash
git remote add origin https://github.com/poojabytes/pooja-sharma-portfolio.git
git push -u origin main
```

## 3. Before the first push

- Confirm `.env` files are **not** tracked (see root `.gitignore`)
- Commit only when ready: `git add -A && git commit -m "Initial portfolio monorepo"`

## 4. Vercel

Import `https://github.com/poojabytes/pooja-sharma-portfolio` twice (frontend + backend roots). See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md).

## Monorepo layout

| Path | Vercel project |
|------|----------------|
| `frontend/` | `pooja-portfolio-frontend` |
| `backend/` | `pooja-portfolio-backend` |