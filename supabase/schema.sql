-- ==============================================================================
-- KERIS Website - Supabase Database Schema & Storage Setup
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Scholarships Table
CREATE TABLE IF NOT EXISTS public.scholarships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'Open',
  about TEXT,
  courses_offered TEXT[],
  study_duration TEXT,
  country TEXT,
  application_url TEXT,
  extra_details TEXT,
  income_group TEXT,
  min_result TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Scholars Table
CREATE TABLE IF NOT EXISTS public.scholars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  spm_batch INT,
  scholarship_id UUID REFERENCES public.scholarships(id) ON DELETE SET NULL,
  past_school TEXT,
  current_university TEXT,
  course TEXT,
  photo_url TEXT,
  instagram TEXT,
  contact_email TEXT,
  about TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Committee Members Table
CREATE TABLE IF NOT EXISTS public.committee (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  department TEXT NOT NULL,
  is_head BOOLEAN DEFAULT false,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. News & Announcements Table
CREATE TABLE IF NOT EXISTS public.news_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  category TEXT,
  image_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- Row Level Security (RLS) Policies
-- ------------------------------------------------------------------------------
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.committee ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_entries ENABLE ROW LEVEL SECURITY;

-- Allow public read access to everyone
CREATE POLICY "Allow public read on scholarships" ON public.scholarships FOR SELECT USING (true);
CREATE POLICY "Allow public read on scholars" ON public.scholars FOR SELECT USING (true);
CREATE POLICY "Allow public read on committee" ON public.committee FOR SELECT USING (true);
CREATE POLICY "Allow public read on news_entries" ON public.news_entries FOR SELECT USING (true);

-- Allow full access for admin operations
CREATE POLICY "Allow admin operations on scholarships" ON public.scholarships FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin operations on scholars" ON public.scholars FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin operations on committee" ON public.committee FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin operations on news_entries" ON public.news_entries FOR ALL USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 5. Storage Buckets for Uploads
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('scholarship-logos', 'scholarship-logos', true),
  ('scholar-photos', 'scholar-photos', true),
  ('committee-photos', 'committee-photos', true),
  ('news-images', 'news-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies: Public Access
CREATE POLICY "Public Access" ON storage.objects FOR SELECT
USING ( bucket_id IN ('scholarship-logos', 'scholar-photos', 'committee-photos', 'news-images') );

CREATE POLICY "Public Uploads" ON storage.objects FOR INSERT
WITH CHECK ( bucket_id IN ('scholarship-logos', 'scholar-photos', 'committee-photos', 'news-images') );

CREATE POLICY "Public Updates" ON storage.objects FOR UPDATE
USING ( bucket_id IN ('scholarship-logos', 'scholar-photos', 'committee-photos', 'news-images') );

CREATE POLICY "Public Deletes" ON storage.objects FOR DELETE
USING ( bucket_id IN ('scholarship-logos', 'scholar-photos', 'committee-photos', 'news-images') );
