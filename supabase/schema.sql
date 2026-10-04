-- ============================================================
-- Hasibul Hasan Portfolio — Supabase Database Schema
-- Run this in the Supabase SQL Editor.
--
-- The script is idempotent: it is safe to run on a fresh project AND to
-- re-run on an existing one to upgrade it (security policies, storage
-- buckets/policies and constraints are all re-applied).
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- 1. PROJECTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  description      TEXT NOT NULL,
  long_description TEXT,
  tech_stack       TEXT[] NOT NULL DEFAULT '{}',
  image_url        TEXT,
  live_url         TEXT,
  github_url       TEXT,
  category         TEXT NOT NULL DEFAULT 'Full-Stack',
  featured         BOOLEAN NOT NULL DEFAULT false,
  order_index      INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 2. SKILLS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  proficiency INTEGER NOT NULL DEFAULT 80 CHECK (proficiency BETWEEN 1 AND 100),
  icon        TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 3. CERTIFICATES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certificates (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title          TEXT NOT NULL,
  issuer         TEXT NOT NULL,
  issue_date     DATE NOT NULL,
  expiry_date    DATE,
  credential_url TEXT,
  image_url      TEXT,
  file_url       TEXT,
  description    TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 4. DOCUMENTS (CV, Cover Letter)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type       TEXT NOT NULL CHECK (type IN ('cv', 'cover_letter')),
  title      TEXT NOT NULL,
  file_url   TEXT NOT NULL,
  file_name  TEXT NOT NULL,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 5. CONTACTS (contact form messages)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 6. HIRE REQUESTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hire_requests (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  company      TEXT,
  project_type TEXT NOT NULL,
  budget       TEXT NOT NULL,
  timeline     TEXT,
  message      TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 7. ADMIN USERS
-- Only users listed here are treated as admins. Having a Supabase account
-- is NOT enough — this is what makes sign-ups harmless.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
-- Deliberately no policies: the table is only writable from the SQL editor / service role.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid());
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- ► Register yourself as the admin (create the user in Authentication → Users first).
--   Change the e-mail if needed, then re-run this statement.
INSERT INTO admin_users (user_id)
SELECT id FROM auth.users WHERE lower(email) = lower('mh.hasan14200@gmail.com')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- Auto-update updated_at via trigger
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_projects_updated_at  ON projects;
DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────
-- Data integrity (NOT VALID = enforced for new/changed rows, existing rows untouched)
-- ─────────────────────────────────────────────
ALTER TABLE projects      DROP CONSTRAINT IF EXISTS projects_urls_http;
ALTER TABLE projects      ADD  CONSTRAINT projects_urls_http CHECK (
  (image_url  IS NULL OR image_url  ~* '^https?://[^[:space:]]+$') AND
  (live_url   IS NULL OR live_url   ~* '^https?://[^[:space:]]+$') AND
  (github_url IS NULL OR github_url ~* '^https?://[^[:space:]]+$')
) NOT VALID;

ALTER TABLE certificates  DROP CONSTRAINT IF EXISTS certificates_urls_http;
ALTER TABLE certificates  ADD  CONSTRAINT certificates_urls_http CHECK (
  (credential_url IS NULL OR credential_url ~* '^https?://[^[:space:]]+$') AND
  (image_url      IS NULL OR image_url      ~* '^https?://[^[:space:]]+$') AND
  (file_url       IS NULL OR file_url       ~* '^https?://[^[:space:]]+$')
) NOT VALID;

ALTER TABLE documents     DROP CONSTRAINT IF EXISTS documents_url_http;
ALTER TABLE documents     ADD  CONSTRAINT documents_url_http CHECK (
  file_url ~* '^https?://[^[:space:]]+$'
) NOT VALID;

ALTER TABLE contacts      DROP CONSTRAINT IF EXISTS contacts_lengths;
ALTER TABLE contacts      ADD  CONSTRAINT contacts_lengths CHECK (
  char_length(name) BETWEEN 1 AND 100 AND char_length(email) <= 255 AND
  char_length(message) BETWEEN 1 AND 2000 AND (subject IS NULL OR char_length(subject) <= 200)
) NOT VALID;

ALTER TABLE hire_requests DROP CONSTRAINT IF EXISTS hire_requests_lengths;
ALTER TABLE hire_requests ADD  CONSTRAINT hire_requests_lengths CHECK (
  char_length(name) BETWEEN 1 AND 100 AND char_length(email) <= 255 AND
  char_length(message) BETWEEN 1 AND 3000 AND char_length(project_type) <= 100 AND
  char_length(budget) <= 50 AND (company IS NULL OR char_length(company) <= 200) AND
  (timeline IS NULL OR char_length(timeline) <= 100)
) NOT VALID;

-- ─────────────────────────────────────────────
-- Row Level Security (RLS)
-- ─────────────────────────────────────────────
ALTER TABLE projects      ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills        ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents     ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE hire_requests ENABLE ROW LEVEL SECURITY;

-- Remove every policy from earlier versions of this schema
DROP POLICY IF EXISTS "Public can read projects"     ON projects;
DROP POLICY IF EXISTS "Public can read skills"       ON skills;
DROP POLICY IF EXISTS "Public can read certificates" ON certificates;
DROP POLICY IF EXISTS "Public can read active docs"  ON documents;
DROP POLICY IF EXISTS "Public can submit contact"    ON contacts;
DROP POLICY IF EXISTS "Public can submit hire"       ON hire_requests;
DROP POLICY IF EXISTS "Admin full access projects"     ON projects;
DROP POLICY IF EXISTS "Admin full access skills"       ON skills;
DROP POLICY IF EXISTS "Admin full access certificates" ON certificates;
DROP POLICY IF EXISTS "Admin full access documents"    ON documents;
DROP POLICY IF EXISTS "Admin full access contacts"     ON contacts;
DROP POLICY IF EXISTS "Admin full access hire"         ON hire_requests;

-- Public read access to portfolio content
CREATE POLICY "Public can read projects"     ON projects     FOR SELECT USING (true);
CREATE POLICY "Public can read skills"       ON skills       FOR SELECT USING (true);
CREATE POLICY "Public can read certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Public can read active docs"  ON documents    FOR SELECT USING (is_active = true);

-- Contact / hire submissions go through the server API routes (service role, with
-- validation + rate limiting). There is intentionally NO public INSERT policy, so
-- nobody can bypass the API by calling Supabase directly with the public anon key.

-- Admin-only write access (and read access to private inbox tables)
CREATE POLICY "Admin full access projects"     ON projects      FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access skills"       ON skills        FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access certificates" ON certificates  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access documents"    ON documents     FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access contacts"     ON contacts      FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access hire"         ON hire_requests FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ─────────────────────────────────────────────
-- Storage buckets (public read, admin-only write, size + MIME limits)
-- ─────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
  ('documents',    'documents',    true, 10485760, ARRAY['application/pdf']),
  ('certificates', 'certificates', true, 10485760, ARRAY['application/pdf','image/jpeg','image/png','image/webp']),
  ('projects',     'projects',     true,  5242880, ARRAY['image/jpeg','image/png','image/webp']),
  ('profile',      'profile',      true,  5242880, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Legacy policies from earlier setups that let ANY signed-in user write files
DROP POLICY IF EXISTS "Authenticated can upload certificates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload documents"    ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload profile"      ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload projects"     ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update storage"      ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete storage"      ON storage.objects;
DROP POLICY IF EXISTS "Public can read documents"             ON storage.objects;
DROP POLICY IF EXISTS "Portfolio files are public"      ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload portfolio files" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update portfolio files" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete portfolio files" ON storage.objects;

CREATE POLICY "Portfolio files are public" ON storage.objects
  FOR SELECT USING (bucket_id IN ('documents','certificates','projects','profile'));

CREATE POLICY "Admin can upload portfolio files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('documents','certificates','projects','profile') AND public.is_admin()
  );

CREATE POLICY "Admin can update portfolio files" ON storage.objects
  FOR UPDATE USING (
    bucket_id IN ('documents','certificates','projects','profile') AND public.is_admin()
  );

CREATE POLICY "Admin can delete portfolio files" ON storage.objects
  FOR DELETE USING (
    bucket_id IN ('documents','certificates','projects','profile') AND public.is_admin()
  );

-- ─────────────────────────────────────────────
-- Seed data
-- ─────────────────────────────────────────────
-- None on purpose: until a table has rows, the site renders its built-in
-- content (lib/fallback-data.ts). Adding your first row in the admin panel
-- replaces that section's fallback content with your own data.
