-- ====================================================================
-- SONATA VITRIFIED TILES - SUPABASE DATABASE SCHEMA SCRIPT
-- ====================================================================
-- This script contains:
--   1. Clean-slate setup (CREATE TABLE statements with defaults).
--   2. Safe incremental migrations (ALTER TABLE additions and removals).
--   3. Storage buckets initialization helper comments.
--   4. Row-Level Security (RLS) policies for secure B2B & Admin operations.
-- ====================================================================

-- ==========================================
-- 1. CLEAN SLATE SETUP (Run if starting new)
-- ==========================================

-- CREATE SERIES TABLE
CREATE TABLE IF NOT EXISTS public.series (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    dimension text NOT NULL, -- '600x600', '600x1200', '195x1200'
    image_url text, -- Visual card image for series uploader
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CREATE TILES TABLE
CREATE TABLE IF NOT EXISTS public.tiles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    location text DEFAULT 'Indoor'::text,
    thickness text DEFAULT '10mm'::text,
    dimension text DEFAULT '600x1200'::text,
    series text, -- Stores series name string
    finish text DEFAULT 'Glossy'::text,
    random_faces text DEFAULT '03'::text,
    external_link text, -- 3D Viewer action button link
    material text, -- Material type of the tile (Vitrified, Ceramic, etc.)
    image_url text, -- Product showcase slab image
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CREATE CATALOGUES TABLE
CREATE TABLE IF NOT EXISTS public.catalogues (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    cover_image_url text,
    pdf_url text,
    dimension text DEFAULT '600x1200'::text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CREATE ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.enquiries (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tile_name text NOT NULL,
    user_name text NOT NULL,
    user_email text NOT NULL,
    user_phone text,
    message text,
    status text DEFAULT 'Pending'::text, -- 'Pending', 'On Going', 'Addressed'
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ==========================================
-- 2. SAFE MIGRATIONS (Run to update existing tables)
-- ==========================================

-- Update 'series' table
DO $$ 
BEGIN
    -- Add image_url to series if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='series' AND column_name='image_url') THEN
        ALTER TABLE public.series ADD COLUMN image_url text;
    END IF;
    
    -- Add dimension to series if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='series' AND column_name='dimension') THEN
        ALTER TABLE public.series ADD COLUMN dimension text DEFAULT '600x1200';
    END IF;
END $$;

-- Update 'tiles' table (Adding new specifications & Removing style/design)
DO $$ 
BEGIN
    -- Add new metadata fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='tiles' AND column_name='dimension') THEN
        ALTER TABLE public.tiles ADD COLUMN dimension text DEFAULT '600x1200';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='tiles' AND column_name='series') THEN
        ALTER TABLE public.tiles ADD COLUMN series text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='tiles' AND column_name='material') THEN
        ALTER TABLE public.tiles ADD COLUMN material text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='tiles' AND column_name='finish') THEN
        ALTER TABLE public.tiles ADD COLUMN finish text DEFAULT 'Glossy';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='tiles' AND column_name='random_faces') THEN
        ALTER TABLE public.tiles ADD COLUMN random_faces text DEFAULT '03';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='tiles' AND column_name='external_link') THEN
        ALTER TABLE public.tiles ADD COLUMN external_link text;
    END IF;

    -- Remove legacy fields 'design' and 'style' if they still exist
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='tiles' AND column_name='design') THEN
        ALTER TABLE public.tiles DROP COLUMN design;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='tiles' AND column_name='style') THEN
        ALTER TABLE public.tiles DROP COLUMN style;
    END IF;
END $$;

-- Update 'catalogues' table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='catalogues' AND column_name='dimension') THEN
        ALTER TABLE public.catalogues ADD COLUMN dimension text DEFAULT '600x1200';
    END IF;
END $$;


-- =======================================================
-- 3. STORAGE BUCKETS INITIALIZATION
-- =======================================================
-- Make sure to create the following storage buckets in the Supabase Storage console:
--   1. 'tile-images'       (Set Public Access: TRUE)
--   2. 'series-images'     (Set Public Access: TRUE)
--   3. 'catalogues-assets' (Set Public Access: TRUE)
--
-- Alternatively, if running raw SQL script to initialize buckets in your Supabase project:
--
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('tile-images', 'tile-images', true) 
-- ON CONFLICT (id) DO NOTHING;
--
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('series-images', 'series-images', true) 
-- ON CONFLICT (id) DO NOTHING;
--
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('catalogues-assets', 'catalogues-assets', true) 
-- ON CONFLICT (id) DO NOTHING;


-- =======================================================
-- 4. ROW-LEVEL SECURITY (RLS) POLICIES
-- =======================================================

-- Enable RLS on all tables
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- 4.1 SERIES POLICIES
CREATE POLICY "Allow public read access to series" 
    ON public.series FOR SELECT USING (true);

CREATE POLICY "Allow full access to series for authenticated administrators" 
    ON public.series TO authenticated USING (true) WITH CHECK (true);

-- 4.2 TILES POLICIES
CREATE POLICY "Allow public read access to tiles" 
    ON public.tiles FOR SELECT USING (true);

CREATE POLICY "Allow full access to tiles for authenticated administrators" 
    ON public.tiles TO authenticated USING (true) WITH CHECK (true);

-- 4.3 CATALOGUES POLICIES
CREATE POLICY "Allow public read access to catalogues" 
    ON public.catalogues FOR SELECT USING (true);

CREATE POLICY "Allow full access to catalogues for authenticated administrators" 
    ON public.catalogues TO authenticated USING (true) WITH CHECK (true);

-- 4.4 ENQUIRIES POLICIES
CREATE POLICY "Allow anonymous users to log enquiries" 
    ON public.enquiries FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow full access to enquiries for authenticated administrators" 
    ON public.enquiries TO authenticated USING (true) WITH CHECK (true);


-- 4.5 STORAGE BUCKET OBJECTS POLICIES
-- Allow public read access to all uploaded assets in our custom buckets
CREATE POLICY "Allow public read access to storage objects"
    ON storage.objects FOR SELECT USING (
        bucket_id IN ('tile-images', 'series-images', 'catalogues-assets')
    );

-- Allow authenticated users (administrators) to upload/insert assets
CREATE POLICY "Allow authenticated administrators to upload assets"
    ON storage.objects FOR INSERT TO authenticated WITH CHECK (
        bucket_id IN ('tile-images', 'series-images', 'catalogues-assets')
    );

-- Allow authenticated users (administrators) to update/overwrite assets
CREATE POLICY "Allow authenticated administrators to update assets"
    ON storage.objects FOR UPDATE TO authenticated WITH CHECK (
        bucket_id IN ('tile-images', 'series-images', 'catalogues-assets')
    );

-- Allow authenticated users (administrators) to delete assets
CREATE POLICY "Allow authenticated administrators to delete assets"
    ON storage.objects FOR DELETE TO authenticated USING (
        bucket_id IN ('tile-images', 'series-images', 'catalogues-assets')
    );
