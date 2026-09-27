-- ==============================================================================
-- KERIS Website - Supabase Database Schema & Storage Setup (Production-Hardened)
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 0. CLEAN DATABASE (Like starting a new project)
-- ------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.rls_auto_enable() CASCADE;

DROP TABLE IF EXISTS public.scholars CASCADE;
DROP TABLE IF EXISTS public.scholarships CASCADE;
DROP TABLE IF EXISTS public.committee CASCADE;
DROP TABLE IF EXISTS public.history_entries CASCADE;
DROP TABLE IF EXISTS public.news_entries CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ------------------------------------------------------------------------------
-- 1. Users Table (Role-based access tied to Supabase auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role = ANY (ARRAY['user'::text, 'admin'::text])),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- Database Functions & Triggers
-- ------------------------------------------------------------------------------

-- Clean up any legacy or unwanted functions flagged by security linter
DROP FUNCTION IF EXISTS public.rls_auto_enable();

-- 1. Automatically create a profile in public.users when a user signs up
-- Security hardened with explicit search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (new.id, new.email, 'user')
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN new;
END;
$$;

-- Trigger executing handle_new_user on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Secure the function by revoking execute from PUBLIC (prevents anon access)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

-- 2. Helper function to check if the current authenticated user has admin role
-- Security hardened with explicit search_path and SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = (select auth.uid()) AND role = 'admin'
  );
END;
$$;

-- Secure the function by revoking execute from PUBLIC and anon
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ------------------------------------------------------------------------------
-- 2. Scholarships Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'closed' CHECK (status = ANY (ARRAY['open'::text, 'soon'::text, 'closed'::text])),
  about TEXT,
  courses_offered TEXT[],
  study_duration TEXT,
  country TEXT,
  application_url TEXT,
  is_bumiputera BOOLEAN DEFAULT false,
  is_anak_negeri BOOLEAN DEFAULT false,
  income_group TEXT,
  min_result TEXT,
  logo_url TEXT,
  extra_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 3. Scholars Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.scholars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  batch INT,
  spm_batch INT,
  scholarship_id UUID REFERENCES public.scholarships(id) ON DELETE SET NULL,
  past_school TEXT,
  current_university TEXT,
  course TEXT,
  photo_url TEXT,
  vlog_url TEXT,
  instagram TEXT,
  contact_email TEXT,
  about TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create covering index for foreign key to improve query performance
CREATE INDEX IF NOT EXISTS idx_scholars_scholarship_id ON public.scholars(scholarship_id);

-- ------------------------------------------------------------------------------
-- 4. Committee Members Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.committee (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  photo_url TEXT,
  batch_year INT,
  department TEXT NOT NULL DEFAULT 'Directors',
  is_head BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 5. History Entries Table (Timeline & Milestones)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.history_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 6. News & Announcements Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.news_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  category TEXT CHECK (category = ANY (ARRAY['Event'::text, 'Update'::text, 'Announcement'::text])),
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- Row Level Security (RLS) - Production Hardened
-- ------------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.committee ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_entries ENABLE ROW LEVEL SECURITY;

-- 1. Users Policies (Prevent privilege escalation)
DROP POLICY IF EXISTS "Admin can read all users" ON public.users;
DROP POLICY IF EXISTS "Users can read own row" ON public.users;
DROP POLICY IF EXISTS "Users can read own row or admin can read all" ON public.users;
CREATE POLICY "Users can read own row or admin can read all" ON public.users FOR SELECT TO authenticated
USING ( (select auth.uid()) = id OR public.is_admin() );

-- Only admins can modify users and roles (prevents users from promoting themselves)
DROP POLICY IF EXISTS "Admin can update users" ON public.users;
DROP POLICY IF EXISTS "Users can update own row" ON public.users;
CREATE POLICY "Admin can update users" ON public.users FOR UPDATE TO authenticated
USING ( public.is_admin() )
WITH CHECK ( public.is_admin() );

DROP POLICY IF EXISTS "Admin can delete users" ON public.users;
CREATE POLICY "Admin can delete users" ON public.users FOR DELETE TO authenticated
USING ( public.is_admin() );

-- 2. Scholarships Policies (Public read-only, admin mutate)
DROP POLICY IF EXISTS "Anyone can read scholarships" ON public.scholarships;
DROP POLICY IF EXISTS "Public can read scholarships" ON public.scholarships;
CREATE POLICY "Public can read scholarships" ON public.scholarships FOR SELECT TO public
USING ( true );

DROP POLICY IF EXISTS "Anyone can insert scholarships" ON public.scholarships;
DROP POLICY IF EXISTS "Admin can insert scholarships" ON public.scholarships;
CREATE POLICY "Admin can insert scholarships" ON public.scholarships FOR INSERT TO authenticated
WITH CHECK ( public.is_admin() );

DROP POLICY IF EXISTS "Anyone can update scholarships" ON public.scholarships;
DROP POLICY IF EXISTS "Admin can update scholarships" ON public.scholarships;
CREATE POLICY "Admin can update scholarships" ON public.scholarships FOR UPDATE TO authenticated
USING ( public.is_admin() )
WITH CHECK ( public.is_admin() );

DROP POLICY IF EXISTS "Anyone can delete scholarships" ON public.scholarships;
DROP POLICY IF EXISTS "Admin can delete scholarships" ON public.scholarships;
CREATE POLICY "Admin can delete scholarships" ON public.scholarships FOR DELETE TO authenticated
USING ( public.is_admin() );

-- 3. Scholars Policies (Public read-only, admin mutate)
DROP POLICY IF EXISTS "Anyone can read scholars" ON public.scholars;
DROP POLICY IF EXISTS "Public can read scholars" ON public.scholars;
CREATE POLICY "Public can read scholars" ON public.scholars FOR SELECT TO public
USING ( true );

DROP POLICY IF EXISTS "Anyone can insert scholars" ON public.scholars;
DROP POLICY IF EXISTS "Admin can insert scholars" ON public.scholars;
CREATE POLICY "Admin can insert scholars" ON public.scholars FOR INSERT TO authenticated
WITH CHECK ( public.is_admin() );

DROP POLICY IF EXISTS "Anyone can update scholars" ON public.scholars;
DROP POLICY IF EXISTS "Admin can update scholars" ON public.scholars;
CREATE POLICY "Admin can update scholars" ON public.scholars FOR UPDATE TO authenticated
USING ( public.is_admin() )
WITH CHECK ( public.is_admin() );

DROP POLICY IF EXISTS "Anyone can delete scholars" ON public.scholars;
DROP POLICY IF EXISTS "Admin can delete scholars" ON public.scholars;
CREATE POLICY "Admin can delete scholars" ON public.scholars FOR DELETE TO authenticated
USING ( public.is_admin() );

-- 4. Committee Policies (Public read-only, admin mutate)
DROP POLICY IF EXISTS "Anyone can read committee" ON public.committee;
DROP POLICY IF EXISTS "Public can read committee" ON public.committee;
CREATE POLICY "Public can read committee" ON public.committee FOR SELECT TO public
USING ( true );

DROP POLICY IF EXISTS "Anyone can insert committee" ON public.committee;
DROP POLICY IF EXISTS "Admin can insert committee" ON public.committee;
CREATE POLICY "Admin can insert committee" ON public.committee FOR INSERT TO authenticated
WITH CHECK ( public.is_admin() );

DROP POLICY IF EXISTS "Anyone can update committee" ON public.committee;
DROP POLICY IF EXISTS "Admin can update committee" ON public.committee;
CREATE POLICY "Admin can update committee" ON public.committee FOR UPDATE TO authenticated
USING ( public.is_admin() )
WITH CHECK ( public.is_admin() );

DROP POLICY IF EXISTS "Anyone can delete committee" ON public.committee;
DROP POLICY IF EXISTS "Admin can delete committee" ON public.committee;
CREATE POLICY "Admin can delete committee" ON public.committee FOR DELETE TO authenticated
USING ( public.is_admin() );

-- 5. History Entries Policies (Public read-only, admin mutate)
DROP POLICY IF EXISTS "Anyone can read history" ON public.history_entries;
DROP POLICY IF EXISTS "Public can read history" ON public.history_entries;
CREATE POLICY "Public can read history" ON public.history_entries FOR SELECT TO public
USING ( true );

DROP POLICY IF EXISTS "Anyone can insert history" ON public.history_entries;
DROP POLICY IF EXISTS "Admin can insert history" ON public.history_entries;
CREATE POLICY "Admin can insert history" ON public.history_entries FOR INSERT TO authenticated
WITH CHECK ( public.is_admin() );

DROP POLICY IF EXISTS "Anyone can update history" ON public.history_entries;
DROP POLICY IF EXISTS "Admin can update history" ON public.history_entries;
CREATE POLICY "Admin can update history" ON public.history_entries FOR UPDATE TO authenticated
USING ( public.is_admin() )
WITH CHECK ( public.is_admin() );

DROP POLICY IF EXISTS "Anyone can delete history" ON public.history_entries;
DROP POLICY IF EXISTS "Admin can delete history" ON public.history_entries;
CREATE POLICY "Admin can delete history" ON public.history_entries FOR DELETE TO authenticated
USING ( public.is_admin() );

-- 6. News Entries Policies (Public read-only, admin mutate, RLS strictly enabled)
DROP POLICY IF EXISTS "Public read" ON public.news_entries;
DROP POLICY IF EXISTS "Public can read news" ON public.news_entries;
CREATE POLICY "Public can read news" ON public.news_entries FOR SELECT TO public
USING ( true );

DROP POLICY IF EXISTS "Auth insert" ON public.news_entries;
DROP POLICY IF EXISTS "Admin can insert news" ON public.news_entries;
CREATE POLICY "Admin can insert news" ON public.news_entries FOR INSERT TO authenticated
WITH CHECK ( public.is_admin() );

DROP POLICY IF EXISTS "Auth update" ON public.news_entries;
DROP POLICY IF EXISTS "Admin can update news" ON public.news_entries;
CREATE POLICY "Admin can update news" ON public.news_entries FOR UPDATE TO authenticated
USING ( public.is_admin() )
WITH CHECK ( public.is_admin() );

DROP POLICY IF EXISTS "Auth delete" ON public.news_entries;
DROP POLICY IF EXISTS "Admin can delete news" ON public.news_entries;
CREATE POLICY "Admin can delete news" ON public.news_entries FOR DELETE TO authenticated
USING ( public.is_admin() );

-- ------------------------------------------------------------------------------
-- 7. Storage Buckets
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('scholarship-logos', 'scholarship-logos', true),
  ('scholar-photos', 'scholar-photos', true),
  ('committee-photos', 'committee-photos', true),
  ('news-images', 'news-images', true),
  ('history-images', 'history-images', true),
  ('documents', 'documents', false)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- ------------------------------------------------------------------------------
-- Storage Policies (Production-Hardened)
-- ------------------------------------------------------------------------------

-- Public Buckets: Anyone can view/download
DROP POLICY IF EXISTS "Public can read media assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can read scholar photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can read scholarship logos" ON storage.objects;
DROP POLICY IF EXISTS "committee-photos open" ON storage.objects;
DROP POLICY IF EXISTS "news-images open access" ON storage.objects;

CREATE POLICY "Public can read media assets" ON storage.objects FOR SELECT TO public
USING ( bucket_id IN ('scholarship-logos', 'scholar-photos', 'committee-photos', 'news-images', 'history-images') );

-- Public Buckets: Only authenticated admins can upload
DROP POLICY IF EXISTS "Admin can upload media assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload scholar photos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload scholarship logos" ON storage.objects;
CREATE POLICY "Admin can upload media assets" ON storage.objects FOR INSERT TO authenticated
WITH CHECK ( 
  bucket_id IN ('scholarship-logos', 'scholar-photos', 'committee-photos', 'news-images', 'history-images')
  AND public.is_admin()
);

-- Public Buckets: Only authenticated admins can update/overwrite
DROP POLICY IF EXISTS "Admin can update media assets" ON storage.objects;
CREATE POLICY "Admin can update media assets" ON storage.objects FOR UPDATE TO authenticated
USING ( 
  bucket_id IN ('scholarship-logos', 'scholar-photos', 'committee-photos', 'news-images', 'history-images')
  AND public.is_admin()
)
WITH CHECK ( 
  bucket_id IN ('scholarship-logos', 'scholar-photos', 'committee-photos', 'news-images', 'history-images')
  AND public.is_admin()
);

-- Public Buckets: Only authenticated admins can delete
DROP POLICY IF EXISTS "Admin can delete media assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete scholar photos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete scholarship logos" ON storage.objects;
CREATE POLICY "Admin can delete media assets" ON storage.objects FOR DELETE TO authenticated
USING ( 
  bucket_id IN ('scholarship-logos', 'scholar-photos', 'committee-photos', 'news-images', 'history-images')
  AND public.is_admin()
);

-- Documents Bucket (Private): Scoped by user folder or admin override
DROP POLICY IF EXISTS "Users can read own documents" ON storage.objects;
CREATE POLICY "Users can read own documents" ON storage.objects FOR SELECT TO authenticated
USING ( 
  bucket_id = 'documents' 
  AND ( (storage.foldername(name))[1] = (select auth.uid())::text OR public.is_admin() )
);

DROP POLICY IF EXISTS "Users can upload own documents" ON storage.objects;
CREATE POLICY "Users can upload own documents" ON storage.objects FOR INSERT TO authenticated
WITH CHECK ( 
  bucket_id = 'documents' 
  AND ( (storage.foldername(name))[1] = (select auth.uid())::text OR public.is_admin() )
);

DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects;
CREATE POLICY "Users can delete own documents" ON storage.objects FOR DELETE TO authenticated
USING ( 
  bucket_id = 'documents' 
  AND ( (storage.foldername(name))[1] = (select auth.uid())::text OR public.is_admin() )
);
