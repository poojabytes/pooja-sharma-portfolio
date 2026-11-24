# Database Schema

> **Status:** Phase 1 placeholder. Full table definitions, relationships, and indexes will be added in Phase 5.

## Planned tables

1. `admins` — single owner authentication
2. `profiles` — public profile (name, headline, bio, photo, location)
3. `social_links` — LinkedIn, GitHub, email, website, custom links
4. `skills` — categorized, ordered skills
5. `projects` — portfolio projects with featured flag and display order
6. `project_images` — thumbnails and screenshots (Cloudinary URLs)
7. `experiences` — employment history
8. `education` — academic records
9. `certificates` — certificate metadata + image/PDF URLs
10. `resumes` — current resume PDF metadata
11. `contact_messages` — inbound contact form messages
12. `website_settings` — theme defaults, SEO, site metadata

## Conventions

- `created_at`, `updated_at` on all content tables
- Foreign keys with explicit `ON DELETE` behavior
- Soft delete where useful (e.g. contact messages)
- Neon: runtime uses `DATABASE_URL` (pooled); Alembic uses `DIRECT_DATABASE_URL`