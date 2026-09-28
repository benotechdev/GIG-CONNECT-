-- =========================================================================
-- Gig Connect UG - Complete Supabase PostgreSQL Schema
-- Platform: Connect. Work. Earn. (Uganda Freelance Marketplace)
-- =========================================================================

-- 1. PROFILES TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('client', 'freelancer', 'admin')),
  avatar_url TEXT,
  phone TEXT,
  location TEXT DEFAULT 'Kampala, Uganda',
  title TEXT,
  bio TEXT,
  hourly_rate_ugx NUMERIC DEFAULT 40000,
  skills TEXT[] DEFAULT '{}',
  rating NUMERIC(3,2) DEFAULT 5.0,
  total_reviews INTEGER DEFAULT 0,
  completed_jobs_count INTEGER DEFAULT 0,
  earnings_ugx NUMERIC DEFAULT 0,
  spent_ugx NUMERIC DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PORTFOLIO ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  freelancer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link TEXT,
  completed_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. JOBS TABLE
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  skills_required TEXT[] DEFAULT '{}',
  budget_ugx NUMERIC NOT NULL,
  budget_type TEXT NOT NULL CHECK (budget_type IN ('fixed', 'hourly')),
  duration TEXT NOT NULL,
  experience_level TEXT NOT NULL CHECK (experience_level IN ('Entry', 'Intermediate', 'Expert')),
  location TEXT DEFAULT 'Kampala, Uganda',
  is_remote BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  deadline TIMESTAMPTZ,
  applications_count INTEGER DEFAULT 0,
  hired_freelancer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  freelancer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  proposed_budget_ugx NUMERIC NOT NULL,
  estimated_days INTEGER NOT NULL,
  cover_letter TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PROJECT CONTRACTS TABLE (Project tracking pipeline)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  freelancer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  agreed_amount_ugx NUMERIC NOT NULL,
  platform_fee_ugx NUMERIC NOT NULL,
  freelancer_payout_ugx NUMERIC NOT NULL,
  stage TEXT NOT NULL DEFAULT 'hired' CHECK (stage IN ('posted', 'applied', 'hired', 'in_progress', 'completed')),
  deliverable_note TEXT,
  deliverable_url TEXT,
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 6. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  link_tab TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('job', 'user')),
  target_id UUID NOT NULL,
  target_name_or_title TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SAVED JOBS & FAVORITE FREELANCERS
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, job_id)
);

CREATE TABLE IF NOT EXISTS public.favorite_freelancers (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  freelancer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, freelancer_id)
);

-- 11. PLATFORM MONETIZATION CONFIGURATION
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  commission_rate_percent NUMERIC DEFAULT 10.0,
  featured_job_fee_ugx NUMERIC DEFAULT 50000,
  featured_freelancer_fee_ugx NUMERIC DEFAULT 35000,
  premium_freelancer_monthly_ugx NUMERIC DEFAULT 75000,
  escrow_protection_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Allow public read of verified profiles and active jobs
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public jobs are viewable by everyone" ON public.jobs FOR SELECT USING (true);
