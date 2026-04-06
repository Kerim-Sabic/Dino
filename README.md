# Dino Merlin Koševo Rezervacije

Production-ready Next.js platform for a private physical-ticket reservation/resale business focused on **Dino Merlin Koševo** and a single category: **Parter Zona 2**.

The product includes:

- premium Bosnian public website
- private admin auth with RBAC
- CRM pipeline for leads
- inventory tracking
- tiered pricing engine with overrides
- CMS for homepage, FAQ, trust content, meetup zones, and legal docs
- blog / SEO content system
- Prisma + PostgreSQL data model
- seed data and Vercel-ready setup

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- shadcn-style UI primitives
- Prisma ORM
- PostgreSQL
- Zod
- React Hook Form
- server actions + route handlers

## Core product model

- This is **not** an official ticketing platform.
- This is **not** checkout/ecommerce.
- Users submit a **reservation request**.
- Seller confirms manually through WhatsApp / phone / Instagram.
- Transaction completes **only in person in Sarajevo**.
- Tickets are **physical only**.
- No online payment.

## Main routes

Public:

- `/`
- `/ulaznice`
- `/rezervacija`
- `/kako-funkcionise`
- `/zasto-nama-vjeruju`
- `/faq`
- `/kontakt`
- `/blog`
- `/blog/[slug]`
- `/hvala`
- `/rasprodano`
- `/uslovi-koristenja`
- `/politika-privatnosti`
- `/odricanje-odgovornosti`

Admin:

- `/admin/prijava`
- `/admin`
- `/admin/leadovi`
- `/admin/leadovi/[id]`
- `/admin/inventar`
- `/admin/cijene`
- `/admin/sadrzaj`
- `/admin/blog`
- `/admin/blog/novi`
- `/admin/blog/[id]`
- `/admin/postavke`
- `/admin/revizija`

## Environment

Copy `.env.example` to `.env` and fill in real values:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dino_kosevo"
AUTH_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
SEED_SUPER_ADMIN_EMAIL="admin@dino-kosevo.ba"
SEED_SUPER_ADMIN_PASSWORD="replace-with-a-unique-local-password"
SEED_SUPER_ADMIN_NAME="Sarajevo Rezervacije"
```

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Generate Prisma client:

```bash
npx prisma generate
```

3. Push schema or run migrations:

For production, prefer committed Prisma migrations. Use `db:push` only for local development or disposable previews.

```bash
npm run db:push
```

or

```bash
npm run db:migrate
```

4. Seed initial content and first super admin:

```bash
npm run db:seed
```

5. Start dev server:

```bash
npm run dev
```

## Seeded business data

The seed creates:

- one inventory pool for `Parter Zona 2`
- tiered pricing:
  - first 5: `90 KM`
  - next 10: `109 KM`
  - next 10: `119 KM`
  - next 10: `129 KM`
  - next 10: `139 KM`
  - final 5: `149 KM`
- homepage Bosnian copy
- FAQ items
- testimonials
- trust badges
- meetup zones
- legal documents
- starter blog posts
- first `SUPER_ADMIN` account

## Admin capabilities

- secure credential login
- roles:
  - `SUPER_ADMIN`
  - `ADMIN`
  - `EDITOR`
- CRM pipeline with lead detail pages
- notes and communication logs
- inventory movements
- pricing config and tier editing
- homepage and site settings CMS
- FAQ / testimonial / trust badge editing
- meetup zone editing
- legal page editing
- blog CRUD
- audit log review
- user management for super admins

## Reservation flow

Public reservation submission includes:

- Zod validation
- anti-spam honeypot
- minimum completion-time check
- rate limiting via `ReservationAttempt`
- UTM / referrer / landing-page capture
- server-side price snapshot at submission time

## SEO implementation

- semantic App Router pages
- route-level metadata
- canonical URLs
- Open Graph and Twitter cards
- `robots.txt`
- `sitemap.xml`
- JSON-LD:
  - organization
  - breadcrumb
  - FAQ
  - article
- Bosnian-first content structure
- blog cluster with internal links to conversion pages

## Production deploy

Recommended:

- Vercel for app hosting
- Neon or Supabase Postgres for database

Deployment checklist:

1. Create production Postgres database.
2. Set `DATABASE_URL`, `AUTH_SECRET`, and `NEXT_PUBLIC_SITE_URL`.
3. Run `npx prisma generate`.
4. Run migrations or `npm run db:push`.
5. Run `npm run db:seed`.
6. Deploy app.
7. Sign in to `/admin/prijava`.
8. Use a unique `SEED_SUPER_ADMIN_PASSWORD` before any shared or production deploy. The seed script only tolerates the fallback password in local development.

## Verification completed

The current codebase has been verified with:

```bash
npm run typecheck
npm run lint
npm run build
```
