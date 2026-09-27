-- ====================================================================
-- AI Agriculture Assistant - Supabase Database Schema
-- Paste this script into your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ====================================================================

-- 1. Farmer Profiles & Land Registry
CREATE TABLE IF NOT EXISTS public.farmer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  location TEXT DEFAULT 'Guntur Agri Zone',
  main_crop TEXT DEFAULT 'Tomato',
  preferred_language TEXT DEFAULT 'te',
  farm_size TEXT DEFAULT '3.5 Acres',
  soil_type TEXT DEFAULT 'Sandy Clay Loam',
  irrigation_type TEXT DEFAULT 'Subsurface Drip Irrigation',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) and public access for demo
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read farmer_profiles" 
  ON public.farmer_profiles FOR SELECT USING (true);

CREATE POLICY "Allow public insert/update farmer_profiles" 
  ON public.farmer_profiles FOR ALL USING (true) WITH CHECK (true);

-- 2. Irrigation Intelligence Telemetry Logs
CREATE TABLE IF NOT EXISTS public.irrigation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_phone TEXT,
  crop TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 20,
  water_saved_liters NUMERIC,
  status TEXT DEFAULT 'Completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.irrigation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/insert irrigation_logs" 
  ON public.irrigation_logs FOR ALL USING (true) WITH CHECK (true);

-- 3. AI Plant Doctor Pathology Diagnoses
CREATE TABLE IF NOT EXISTS public.diagnosis_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_phone TEXT,
  plant TEXT NOT NULL,
  disease_name TEXT NOT NULL,
  confidence NUMERIC DEFAULT 95.0,
  severity TEXT DEFAULT 'Moderate',
  recommended_medicine TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.diagnosis_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/insert diagnosis_history" 
  ON public.diagnosis_history FOR ALL USING (true) WITH CHECK (true);
