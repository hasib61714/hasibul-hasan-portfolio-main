# Hasibul Hasan Portfolio — Setup Guide

## Prerequisites

- Node.js 18+
- npm / pnpm / yarn
- A [Supabase](https://supabase.com) account (free tier works)
- A [Vercel](https://vercel.com) account (for deployment)

---

## 1. Clone & Install

```bash
git clone <your-repo-url>
cd hasibul-hasan-portfolio
npm install
```

---

## 2. Supabase Project Setup

### a) Create a Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a name, database password, and region

### b) Create the Admin User

1. Supabase dashboard → **Authentication** → **Users** → **Add user** (or Invite) and confirm the e-mail
2. **Authentication → Providers → Email** → turn **off** "Allow new users to sign up" so nobody else can create accounts

### c) Run the Database Schema

1. In Supabase dashboard → **SQL Editor** → **New Query**
2. Copy the contents of [`supabase/schema.sql`](./supabase/schema.sql), paste and click **Run**

This creates all tables, Row Level Security policies, the four storage buckets
(`documents`, `certificates`, `projects`, `profile`) with size/MIME limits and admin-only upload policies,
and registers your admin account in `admin_users`.

- If your admin e-mail is not `mh.hasan14200@gmail.com`, edit it in the `INSERT INTO admin_users` statement and run it again.
- The script is **idempotent** — re-run it whenever you pull an update to apply security fixes to an existing project.
- Admin access is granted **only** to users in `admin_users`. A valid Supabase account alone is not enough.

---

## 3. Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Required: used only on the server by the contact / hire API routes (never exposed to the browser)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Your public site URL (used for SEO, sitemap and Open Graph). Optional on Vercel.
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Find these values in Supabase dashboard → **Project Settings** → **API**.

---

## 4. Personalize Your Portfolio

### Core Info — `lib/site.ts`

All personal details live in one place:

```ts
export const SITE = {
  name: "Md. Hasibul Hasan",
  role: "Software & ML Engineer",
  email: "you@example.com",
  whatsapp: "8801XXXXXXXXX",   // international format, digits only
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
  location: "Dhaka, Bangladesh",
  timezone: "GMT+6",
  availability: "Open to remote roles & contracts worldwide",
  yearsExperience: "3+",
};
```

### Hero Section — `components/sections/Hero.tsx`
- Headline/description copy lives in the component; stats (projects, certifications) are computed from your data
- Upload your photo from **Admin → Dashboard → Hero Profile Picture**

### About Section — `components/sections/About.tsx`
- Update story paragraphs and expertise tags

### SEO Metadata — `app/layout.tsx`
- Update `title`, `description`, `openGraph`, `twitter` fields

---

## 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)  
Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)  
Login: [http://localhost:3000/auth/login](http://localhost:3000/auth/login)

---

## 6. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo in the Vercel dashboard for automatic deployments.

### Set Environment Variables in Vercel

In Vercel dashboard → Project → **Settings** → **Environment Variables**, add:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL` (your production URL)

---

## 7. Project Structure

```
hasibul-hasan-portfolio/
├── app/
│   ├── page.tsx                    # Public portfolio
│   ├── layout.tsx                  # Root layout + SEO + JSON-LD
│   ├── opengraph-image.tsx         # Generated social preview image
│   ├── sitemap.ts / robots.ts      # SEO files
│   ├── globals.css                 # Global styles + utilities
│   ├── providers.tsx               # Theme + toast providers
│   ├── auth/login/page.tsx         # Admin login
│   ├── admin/
│   │   ├── layout.tsx              # Admin layout (auth guard)
│   │   ├── page.tsx                # Dashboard
│   │   ├── projects/page.tsx       # Projects CRUD
│   │   ├── skills/page.tsx         # Skills CRUD
│   │   ├── certificates/page.tsx   # Certificates CRUD
│   │   ├── documents/page.tsx      # CV/Cover Letter uploads
│   │   ├── messages/page.tsx       # Contact messages
│   │   └── hire-requests/page.tsx  # Hire requests management
│   └── api/
│       ├── contact/route.ts        # Contact form endpoint
│       └── hire/route.ts           # Hire request endpoint
├── components/
│   ├── layout/                     # Navbar, Footer
│   ├── sections/                   # All 8 portfolio sections
│   ├── admin/                      # AdminSidebar, AdminHeader, StatsCard
│   └── ui/                         # Button, Card, Input, Badge, Modal, etc.
├── lib/
│   ├── site.ts                     # Personal details & site config
│   ├── data.ts                     # Server-side data loading (+ fallbacks)
│   ├── fallback-data.ts            # Built-in content until DB has rows
│   ├── validation.ts / upload.ts   # Zod schemas, upload validation
│   ├── utils.ts                    # cn(), safeUrl(), formatDate()
│   └── supabase/
│       ├── client.ts               # Browser Supabase client
│       └── server.ts               # Server Supabase clients
├── types/index.ts                  # TypeScript interfaces
├── middleware.ts                   # Auth route protection
├── supabase/schema.sql             # Database schema + RLS policies
└── .env.local.example              # Environment variable template
```

---

## 8. Database Tables

| Table           | Description                          |
|-----------------|--------------------------------------|
| `projects`      | Portfolio projects with tech stack   |
| `skills`        | Technical skills with proficiency %  |
| `certificates`  | Certifications with image + PDF      |
| `documents`     | CV and Cover Letter file uploads     |
| `contacts`      | Contact form submissions             |
| `hire_requests` | Hire/project inquiry forms           |
| `admin_users`   | Users allowed to use the admin panel |

---

## 9. Tech Stack Summary

| Technology          | Version  | Use                         |
|---------------------|----------|-----------------------------|
| Next.js             | 15.3.1   | App Router, SSR, API routes |
| TypeScript          | 5.x      | Type safety                 |
| Tailwind CSS        | 4.x      | Styling + animations        |
| Supabase            | latest   | DB + Auth + Storage         |
| Framer Motion       | 12.x     | Page animations             |
| react-hook-form     | 7.x      | Form management             |
| Zod                 | 3.x      | Schema validation           |
| next-themes         | 0.4.x    | Dark/light mode             |
| react-hot-toast     | 2.x      | Notifications               |
| lucide-react        | 0.5.x    | Icons                       |
