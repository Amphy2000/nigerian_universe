/*
# Court App — Core Schema

This migration creates the full database for a "People's Court" app where users
submit disputes, vote on outcomes, and argue in comments.

## Tables Created
1. categories — court categories (Relationship, Family, Workplace, etc.)
2. cases — user-submitted disputes with voting, evidence, timeline, status
3. comments — arguments posted on cases (prosecution/defence/neutral)
4. votes — individual vote records (for/against) per case
5. hall_of_fame — curated award entries linking to cases
6. notifications — user-facing notifications

## Security
- This is a single-tenant app with no sign-in screen, so all policies
  use TO anon, authenticated with USING (true) — the data is intentionally public.
- RLS is enabled on every table.
- 4 separate policies per table (SELECT, INSERT, UPDATE, DELETE).
*/

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  label text NOT NULL,
  emoji text NOT NULL DEFAULT '',
  accent text NOT NULL DEFAULT 'gold',
  needs_moderation boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_categories" ON categories;
CREATE POLICY "anon_insert_categories" ON categories FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_categories" ON categories;
CREATE POLICY "anon_update_categories" ON categories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_categories" ON categories;
CREATE POLICY "anon_delete_categories" ON categories FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- CASES
-- ============================================================
CREATE TABLE IF NOT EXISTS cases (
  id text PRIMARY KEY,
  case_number text NOT NULL UNIQUE,
  category text NOT NULL REFERENCES categories(id),
  title text NOT NULL,
  hook text NOT NULL DEFAULT '',
  story text NOT NULL DEFAULT '',
  question text NOT NULL DEFAULT '',
  question_type text NOT NULL DEFAULT 'who_wrong',
  for_label text NOT NULL DEFAULT 'FOR',
  against_label text NOT NULL DEFAULT 'AGAINST',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  closes_at timestamptz NOT NULL DEFAULT now() + interval '24 hours',
  votes_for int NOT NULL DEFAULT 0,
  votes_against int NOT NULL DEFAULT 0,
  arguments_count int NOT NULL DEFAULT 0,
  views int NOT NULL DEFAULT 0,
  controversial_score int NOT NULL DEFAULT 0,
  funny boolean NOT NULL DEFAULT false,
  evidence jsonb NOT NULL DEFAULT '[]'::jsonb,
  timeline jsonb NOT NULL DEFAULT '[]'::jsonb,
  twist jsonb,
  featured boolean NOT NULL DEFAULT false,
  case_of_day boolean NOT NULL DEFAULT false,
  author_name text NOT NULL DEFAULT 'Anonymous',
  author_anon boolean NOT NULL DEFAULT true
);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_cases" ON cases;
CREATE POLICY "anon_select_cases" ON cases FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_cases" ON cases;
CREATE POLICY "anon_insert_cases" ON cases FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_cases" ON cases;
CREATE POLICY "anon_update_cases" ON cases FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_cases" ON cases;
CREATE POLICY "anon_delete_cases" ON cases FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- COMMENTS (arguments)
-- ============================================================
CREATE TABLE IF NOT EXISTS comments (
  id text PRIMARY KEY,
  case_id text NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  author text NOT NULL,
  avatar text NOT NULL DEFAULT '🧑🏾',
  text text NOT NULL,
  side text NOT NULL DEFAULT 'neutral',
  likes int NOT NULL DEFAULT 0,
  replies int NOT NULL DEFAULT 0,
  agrees int NOT NULL DEFAULT 0,
  disagrees int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  top boolean NOT NULL DEFAULT false,
  argument_of_day boolean NOT NULL DEFAULT false
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_comments" ON comments;
CREATE POLICY "anon_select_comments" ON comments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_comments" ON comments;
CREATE POLICY "anon_insert_comments" ON comments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_comments" ON comments;
CREATE POLICY "anon_update_comments" ON comments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_comments" ON comments;
CREATE POLICY "anon_delete_comments" ON comments FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- VOTES
-- ============================================================
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id text NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  side text NOT NULL DEFAULT 'for',
  voter_fingerprint text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_votes" ON votes;
CREATE POLICY "anon_select_votes" ON votes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_votes" ON votes;
CREATE POLICY "anon_insert_votes" ON votes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_votes" ON votes;
CREATE POLICY "anon_update_votes" ON votes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_votes" ON votes;
CREATE POLICY "anon_delete_votes" ON votes FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- HALL OF FAME
-- ============================================================
CREATE TABLE IF NOT EXISTS hall_of_fame (
  id text PRIMARY KEY,
  category text NOT NULL,
  label text NOT NULL,
  emoji text NOT NULL DEFAULT '🏆',
  case_id text REFERENCES cases(id) ON DELETE SET NULL,
  case_number text,
  title text NOT NULL,
  metric text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0
);

ALTER TABLE hall_of_fame ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_hof" ON hall_of_fame;
CREATE POLICY "anon_select_hof" ON hall_of_fame FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_hof" ON hall_of_fame;
CREATE POLICY "anon_insert_hof" ON hall_of_fame FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_hof" ON hall_of_fame;
CREATE POLICY "anon_update_hof" ON hall_of_fame FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_hof" ON hall_of_fame;
CREATE POLICY "anon_delete_hof" ON hall_of_fame FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id text PRIMARY KEY,
  icon text NOT NULL DEFAULT 'gavel',
  text text NOT NULL,
  time_label text NOT NULL DEFAULT '',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_notifications" ON notifications;
CREATE POLICY "anon_select_notifications" ON notifications FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_notifications" ON notifications;
CREATE POLICY "anon_insert_notifications" ON notifications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_notifications" ON notifications;
CREATE POLICY "anon_update_notifications" ON notifications FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_notifications" ON notifications;
CREATE POLICY "anon_delete_notifications" ON notifications FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_category ON cases(category);
CREATE INDEX IF NOT EXISTS idx_cases_featured ON cases(featured);
CREATE INDEX IF NOT EXISTS idx_comments_case_id ON comments(case_id);
CREATE INDEX IF NOT EXISTS idx_votes_case_id ON votes(case_id);
