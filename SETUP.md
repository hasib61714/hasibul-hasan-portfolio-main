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

### b) Run the Database Schema

1. In Supabase dashboard → **SQL Editor** → **New Query**
2. Copy the contents of [`supabase/schema.sql`](./supabase/schema.sql)
3. Paste and click **Run**

This creates all 6 tables, RLS policies, and seed data.

### c) Create Storage Buckets

In Supabase dashboard → **Storage** → **New Bucket**, create these 3 buckets:

| Bucket Name    | Public | Purpose                          |
|----------------|--------|----------------------------------|
| `documents`    | ✅ Yes | CV and Cover Letter PDF uploads  |
| `certificates` | ✅ Yes | Certificate images and PDFs      |
| `projects`     | ✅ Yes | Project screenshot images        |

For each bucket, go to **Policies** → **New Policy** → allow `SELECT` for `public` role (or use the template "Give users access to their own folder").

### d) Create an Admin User

1. Supabase dashboard → **Authentication** → **Users** → **Invite User**
2. Enter your email and confirm via the email link
3. You'll use these credentials to log in at `/auth/login`

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

# Optional: only needed if using service role (admin operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Find these values in Supabase dashboard → **Project Settings** → **API**.

---

## 4. Personalize Your Portfolio

### Core Info — `lib/utils.ts`

```ts
export const WHATSAPP_NUMBER = "8801XXXXXXXXX"; // your WhatsApp number
export const EMAIL_ADDRESS   = "you@example.com";
export const GITHUB_URL      = "https://github.com/yourusername";
export const LINKEDIN_URL    = "https://linkedin.com/in/yourusername";
export const TWITTER_URL     = "https://twitter.com/yourusername";
```

### Hero Section — `components/sections/Hero.tsx`
- Update name, title, subtitle, stats numbers
- Replace the avatar placeholder with your actual image

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

---

## 7. Project Structure

```
hasibul-hasan-portfolio/
├── app/
│   ├── page.tsx                    # Public portfolio
│   ├── layout.tsx                  # Root layout + SEO
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
│   ├── utils.ts                    # cn(), formatDate(), constants
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
