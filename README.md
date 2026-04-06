<div align="center">

# Dino Merlin Koševo Rezervacije

<p>
  A high-trust reservation platform for <strong>physical-ticket resale in Sarajevo</strong>.<br />
  Built for one category, one clear process, and one next step.
</p>

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js_16-App_Router-111111?style=flat-square&logo=nextdotjs&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Strict-1f6feb?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-v4-0f172a?style=flat-square&logo=tailwindcss&logoColor=38bdf8" />
  <img alt="Vercel Ready" src="https://img.shields.io/badge/Vercel-Ready-111111?style=flat-square&logo=vercel&logoColor=white" />
</p>

</div>

---

> This is **not an official ticketing platform**.  
> It is an **independent private reservation and resale system** for physical tickets, with **manual confirmation** and **in-person handoff in Sarajevo**.

## The Idea

Most reseller pages feel rushed, noisy, and suspicious.

This product is built around the opposite approach:

- one ticket category
- one public price signal
- one calm trust story
- one short reservation flow
- one operational system behind it

It is designed to feel less like a classified ad and more like a focused private service.

## At a Glance

<table>
  <tr>
    <td valign="top" width="25%">
      <strong>Public Site</strong><br />
      Premium Bosnian website built to convert cautious buyers without pretending to be official.
    </td>
    <td valign="top" width="25%">
      <strong>Reservation Flow</strong><br />
      Mobile-first lead capture with validation, anti-spam, attribution, and pricing snapshots.
    </td>
    <td valign="top" width="25%">
      <strong>Admin System</strong><br />
      CRM, inventory, pricing, CMS, blog, audit logs, and role-based access in one app.
    </td>
    <td valign="top" width="25%">
      <strong>SEO Layer</strong><br />
      Structured metadata, blog architecture, legal pages, and local-intent content.
    </td>
  </tr>
</table>

## Built for This Exact Business Model

This is not a generic event template and not a normal ecommerce build.

It is engineered around these fixed rules:

| Constraint | Implementation |
| --- | --- |
| One category only | `Parter Zona 2` |
| Limited quantity | around `50` physical tickets |
| No online payment | payment happens only in person |
| No digital delivery | handoff is physical, live, and local |
| No instant checkout | users submit a reservation request |
| Manual confirmation | seller follows up through WhatsApp, phone, or Instagram |
| Final fulfillment | only in Sarajevo |

That makes the product closer to a **conversion-first reservation operating system** than a standard ticket storefront.

## Product Experience

### Public website

- premium dark visual system
- Bosnian-first copy
- strong trust and anti-anxiety messaging
- pricing-tier presentation built around scarcity without spam
- mobile-first reservation funnel
- clear separation from any official ticketing channel

### Reservation flow

- short form shaped around buyer intent, not internal admin habits
- anti-spam honeypot
- minimum completion-time check
- fingerprint-based rate limiting
- UTM / referrer / landing-page capture
- price snapshot at time of submission
- thank-you redirect after successful request

### Internal operating system

- secure admin sign-in
- role-based access:
  - `SUPER_ADMIN`
  - `ADMIN`
  - `EDITOR`
- CRM pipeline
- notes and communication logs
- meetup planning
- price locks and final sold-price history
- inventory actions and stock adjustments
- CMS editing
- blog management
- audit logging

## Pricing Engine

The seeded ladder matches the business requirements exactly:

| Tier | Range | Price |
| --- | --- | --- |
| Tier 1 | First 5 | `90 KM` |
| Tier 2 | Next 10 | `109 KM` |
| Tier 3 | Next 10 | `119 KM` |
| Tier 4 | Next 10 | `129 KM` |
| Tier 5 | Next 10 | `139 KM` |
| Tier 6 | Final 5 | `149 KM` |

The engine also supports:

- manual public override
- promo override
- scarcity override
- public urgency override
- public price-message override
- lead-level promised price / price lock
- historical final sold-price preservation

## SEO Architecture

The content layer is built for realistic local-intent discovery, not keyword stuffing.

Implemented:

- route-level metadata
- canonical URLs
- Open Graph and Twitter cards
- `robots.txt`
- `sitemap.xml`
- JSON-LD for:
  - organization
  - breadcrumb
  - FAQ
  - article
- Bosnian-first content structure
- blog posts designed to support conversion pages through internal linking

Target search themes include:

- `dino merlin kosevo ulaznice`
- `dino merlin sarajevo ulaznice`
- `dino merlin parter zona 2`
- `fizicke ulaznice sarajevo`
- `rezervacija ulaznica sarajevo`
- `preuzimanje ulaznica sarajevo`

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI approach | shadcn-style primitives |
| Forms | React Hook Form |
| Validation | Zod |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth/session | secure custom auth/session flow |
| Supabase client layer | `@supabase/supabase-js` + `@supabase/ssr` |
| Markdown rendering | React Markdown + remark-gfm |

## Architecture

```text
src/
  app/
    (site)/                Public pages
    admin/                 Protected admin system
    api/reservations/      Reservation submission endpoint
  components/
    site/                  Public UI components
    ui/                    Reusable UI primitives
  lib/
    actions/               Admin-side mutations
    auth/                  Session and permission helpers
    metadata/              SEO helpers
    pricing/               Tier and override logic
    public-data/           Public content/data loaders
prisma/
  schema.prisma            Full database schema
  seed.ts                  Initial content and first admin seed
```

## Data Model

Core Prisma models:

- `User`
- `Lead`
- `LeadStatusEvent`
- `LeadNote`
- `CommunicationLog`
- `InventoryPool`
- `InventoryMovement`
- `PricingConfig`
- `PriceTier`
- `PriceLock`
- `SiteSettings`
- `HomepageContent`
- `FaqItem`
- `Testimonial`
- `TrustBadge`
- `MeetupZone`
- `LegalDocument`
- `BlogPost`
- `ReservationAttempt`
- `AuditLog`

Schema file: [prisma/schema.prisma](./prisma/schema.prisma)

## Route Map

### Public

| Route | Purpose |
| --- | --- |
| `/` | Homepage and primary conversion funnel |
| `/ulaznice` | Public offer page for Parter Zona 2 |
| `/rezervacija` | Reservation request page |
| `/kako-funkcionise` | Manual confirmation and handoff explanation |
| `/zasto-nama-vjeruju` | Trust page |
| `/faq` | Objection handling and process clarity |
| `/kontakt` | Contact channels and meetup guidance |
| `/blog` | Content hub |
| `/blog/[slug]` | Blog detail pages |
| `/hvala` | Thank-you page |
| `/rasprodano` | Sold-out / waitlist page |
| `/uslovi-koristenja` | Terms |
| `/politika-privatnosti` | Privacy policy |
| `/odricanje-odgovornosti` | Disclaimer |

### Admin

| Route | Purpose |
| --- | --- |
| `/admin/prijava` | Sign-in screen |
| `/admin` | Dashboard |
| `/admin/leadovi` | Lead list |
| `/admin/leadovi/[id]` | Lead detail page |
| `/admin/inventar` | Inventory management |
| `/admin/cijene` | Pricing controls |
| `/admin/sadrzaj` | CMS editing |
| `/admin/blog` | Blog management |
| `/admin/blog/novi` | Create blog post |
| `/admin/blog/[id]` | Edit blog post |
| `/admin/postavke` | Site settings |
| `/admin/revizija` | Audit logs |

## Environment Variables

Copy `.env.example` to `.env` and provide real values.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Runtime Prisma connection string. For Netlify/serverless, use the Supabase transaction pooler on port `6543` with `pgbouncer=true`. |
| `DIRECT_URL` | Yes | Direct or session-mode connection for Prisma migrations and schema operations |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Supabase project URL for browser/server SSR helpers |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Optional | Supabase publishable key for browser/server SSR helpers |
| `AUTH_SECRET` | Yes | Secret for secure session/auth flows |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public base URL for canonical and metadata generation |
| `SEED_SUPER_ADMIN_EMAIL` | Yes | Initial super-admin email |
| `SEED_SUPER_ADMIN_PASSWORD` | Yes | Initial super-admin password |
| `SEED_SUPER_ADMIN_NAME` | Yes | Initial super-admin name |

Example:

```env
DATABASE_URL="postgresql://postgres.xpqqurngwcgqbiceopfo:[YOUR-PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.xpqqurngwcgqbiceopfo:[YOUR-PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://xpqqurngwcgqbiceopfo.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_279-MVKurVsKqlS0osQpkQ_Et8igFTK"
AUTH_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
SEED_SUPER_ADMIN_EMAIL="admin@dino-kosevo.ba"
SEED_SUPER_ADMIN_PASSWORD="replace-with-a-unique-local-password"
SEED_SUPER_ADMIN_NAME="Sarajevo Rezervacije"
```

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Generate Prisma client

```bash
npx prisma generate
```

### 3. Create the database schema

For production, prefer committed Prisma migrations. Use `db:push` for local development or disposable environments.

```bash
npm run db:push
```

or

```bash
npm run db:migrate
```

If you already have committed migrations and want to apply them in a production-like environment, use:

```bash
npm run db:deploy
```

### 4. Seed content and the initial admin

```bash
npm run db:seed
```

### 5. Run the app

```bash
npm run dev
```

Open:

- public site: `http://localhost:3000`
- admin sign-in: `http://localhost:3000/admin/prijava`

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create the production build |
| `npm run start` | Run the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript without emitting |
| `npm run db:push` | Push Prisma schema to the database |
| `npm run db:migrate` | Run Prisma development migrations |
| `npm run db:deploy` | Apply committed Prisma migrations in production |
| `npm run db:seed` | Seed initial content and admin user |
| `npm run db:studio` | Open Prisma Studio |

## Seeded Content

The seed script creates the baseline operating environment:

- one inventory pool for `Parter Zona 2`
- the required pricing ladder
- Bosnian homepage copy
- FAQs
- testimonials
- trust badges
- meetup zones
- legal documents
- starter blog posts
- the first `SUPER_ADMIN`

## Deployment

Recommended hosting stack:

- app hosting: `Vercel`
- database: `Supabase Postgres` or `Neon`

### Production checklist

1. Create the production PostgreSQL database.
2. Set `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, and `NEXT_PUBLIC_SITE_URL`.
3. Generate Prisma client:

```bash
npx prisma generate
```

4. Apply the schema.

For the very first setup without migrations, you can use:

```bash
npm run db:push
```

For a production-safe workflow with committed migrations, use:

```bash
npm run db:deploy
```

5. Seed the initial content:

```bash
npm run db:seed
```

6. Deploy the app.
7. Sign in at `/admin/prijava`.
8. Rotate the seeded admin password immediately in any shared or production environment.

### Supabase connection notes

- Use the Supabase transaction pooler (`6543`) for `DATABASE_URL` in serverless/runtime environments.
- Use the Supabase session pooler (`5432`) or direct connection for `DIRECT_URL`.
- Prisma migrations and schema operations should go through `DIRECT_URL`, not the transaction pooler.

### Supabase client utilities

The repo now includes Supabase SSR/browser helpers:

- [client helper](./src/lib/supabase/client.ts)
- [server helper](./src/lib/supabase/server.ts)
- [proxy refresh helper](./src/lib/supabase/proxy.ts)
- [root proxy](./proxy.ts)

These are additive. They prepare the app for Supabase browser or SSR features without replacing the current Prisma-backed data layer or the existing custom admin auth flow.

## Verification

The codebase has been verified with:

```bash
npm run typecheck
npm run lint
npm run build
```

## Notes

- Public copy is intentionally Bosnian and written for a Sarajevo / BiH audience.
- The product is intentionally optimized for trust, clarity, and operational control over ecommerce complexity.
- Public messaging must never imply official affiliation with the artist, organizers, venue, or official ticketing partners.
