# Hasibul Hasan — Portfolio

A modern, full-stack personal portfolio built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

🌐 **Live:** [hasibul-hasan-portfolio-main.vercel.app](https://hasibul-hasan-portfolio-main.vercel.app)

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Framework  | Next.js 15 (App Router)                         |
| Language   | TypeScript                                      |
| Styling    | Tailwind CSS v4                                 |
| Database   | Supabase (PostgreSQL + Realtime)                |
| Auth       | Supabase Auth                                   |
| Storage    | Supabase Storage                                |
| Animation  | Framer Motion                                   |
| Forms      | React Hook Form + Zod                           |
| Icons      | Lucide React                                    |
| Deployment | Vercel                                          |

---

## Features

- **Hero** — Profile picture upload from admin, live stats, availability & timezone, social links
- **About** — Bento layout: story, current role, education, working style, core stack
- **Experience** — Timeline of work experience and education
- **Skills** — Grouped category cards with proficiency indicators
- **Projects** — Dynamic project cards with live/source links
- **Certificates** — Certificate gallery with credential verification and PDF/image support
- **Resume** — CV & Cover Letter preview/download
- **Hire Me / Contact** — Validated, rate-limited, spam-protected forms
- **Admin Panel** — Full CRUD for all sections, restricted to registered admins
- **Global-ready** — USD budgets, timezone/availability info, SEO (Open Graph image, sitemap, robots, JSON-LD), light/dark theme, reduced-motion & keyboard accessible
- **Fast** — Server-rendered content cached for 60 s (ISR); no Supabase client shipped to public visitors

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/hasib61714/hasibul-hasan-portfolio-main.git
cd hasibul-hasan-portfolio-main
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Supabase Setup

1. Go to [supabase.com](https://supabase.com) → New Project
2. **Authentication** → Users → add your admin user, then turn **off** public sign-ups (Authentication → Providers → Email)
3. **SQL Editor** → run `supabase/schema.sql`. It creates the tables, RLS policies, storage buckets
   (`documents`, `certificates`, `projects`, `profile`) with size/type limits and storage policies, and registers
   your admin account. It is idempotent — re-run it any time to upgrade an existing project.
   If your admin e-mail differs from `mh.hasan14200@gmail.com`, edit it in the `INSERT INTO admin_users` statement.

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Admin Access

Go to `/auth/login` and sign in with your admin credentials. Only users listed in the `admin_users` table can access the panel or write data.

---

## Project Structure

```
app/
├── page.tsx              # Public portfolio
├── admin/                # Admin panel (protected)
│   ├── page.tsx          # Dashboard
│   ├── projects/
│   ├── skills/
│   ├── certificates/
│   ├── documents/
│   ├── messages/
│   └── hire-requests/
├── api/
│   ├── contact/          # Contact form API
│   └── hire/             # Hire request API
components/
├── sections/             # Portfolio sections
├── admin/                # Admin UI components
├── layout/               # Navbar, Footer
└── ui/                   # Reusable components
lib/
└── supabase/             # Supabase client (browser + server)
```

---

## Deployment

Deploy to Vercel:

```bash
vercel --prod
```

Add all environment variables in Vercel dashboard → Project → Settings → Environment Variables.

---

## Author

**Md Hasibul Hasan**  
Software Engineer at Red Data (Pvt.) Ltd.  
[LinkedIn](https://linkedin.com/in/hasibulhasan) · [GitHub](https://github.com/hasib61714)

