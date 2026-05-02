-- ============================================================
-- Hasibul Hasan Portfolio — Supabase Database Schema
-- Run this in Supabase SQL Editor (in order)
-- ============================================================

-- Enable UUID extension
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
-- Auto-update updated_at via trigger
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────
-- Row Level Security (RLS)
-- ─────────────────────────────────────────────
ALTER TABLE projects      ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills        ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents     ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE hire_requests ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read projects"      ON projects      FOR SELECT USING (true);
CREATE POLICY "Public can read skills"        ON skills        FOR SELECT USING (true);
CREATE POLICY "Public can read certificates"  ON certificates  FOR SELECT USING (true);
CREATE POLICY "Public can read active docs"   ON documents     FOR SELECT USING (is_active = true);

-- Public can insert contacts and hire requests
CREATE POLICY "Public can submit contact"     ON contacts      FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can submit hire"        ON hire_requests FOR INSERT WITH CHECK (true);

-- Authenticated (admin) full access
CREATE POLICY "Admin full access projects"      ON projects      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access skills"        ON skills        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access certificates"  ON certificates  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access documents"     ON documents     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access contacts"      ON contacts      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access hire"          ON hire_requests FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────
-- Seed data (optional — remove in production)
-- ─────────────────────────────────────────────
INSERT INTO skills (name, category, proficiency, order_index) VALUES
  ('React / Next.js',  'Frontend', 95, 1),
  ('TypeScript',       'Frontend', 90, 2),
  ('Tailwind CSS',     'Frontend', 92, 3),
  ('Node.js',          'Backend',  85, 4),
  ('PostgreSQL',       'Database', 80, 5),
  ('Supabase',         'Database', 88, 6),
  ('Docker',           'DevOps',   72, 7),
  ('Git / GitHub',     'DevOps',   90, 8)
ON CONFLICT DO NOTHING;
