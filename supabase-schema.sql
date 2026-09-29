-- =========================================================================
-- Gig Connect UG - Complete Supabase PostgreSQL Schema
-- Platform: Connect. Work. Earn. (Uganda Freelance Marketplace)
-- Features: Scalable RBAC, Granular Permissions, Payment Gateway & Escrow Transactions
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. SCALABLE ROLES & PERMISSIONS SYSTEM (RBAC)
-- =========================================================================

-- Roles definition table (Scalable for future additions: moderator, agency, enterprise, etc.)
CREATE TABLE IF NOT EXISTS public.roles (
  id TEXT PRIMARY KEY, -- 'client', 'freelancer', 'admin', 'moderator', 'agency'
  name TEXT NOT NULL,
  description TEXT,
  is_system_role BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.roles (id, name, description, is_system_role) VALUES
  ('client', 'Client / Business', 'Hires talent, posts jobs, funds escrow in UGX, and releases milestone payments', true),
  ('freelancer', 'Freelancer', 'Submits proposals, executes milestones, and withdraws funds via MTN/Airtel MoMo', true),
  ('admin', 'Super Administrator', 'Full platform governance, fee configuration, user verification, and financial oversight', true),
  ('moderator', 'Trust & Safety Moderator', 'Dispute resolution, KYC verification, and report triage', false),
  ('agency', 'Agency / Studio', 'Manages team members, submits high-volume bids, and handles multi-client delivery', false)
ON CONFLICT (id) DO UPDATE SET description = EXCLUDED.description;

-- Granular permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
  id TEXT PRIMARY KEY, -- e.g. 'jobs:create', 'payments:initiate_escrow'
  category TEXT NOT NULL,
  description TEXT NOT NULL
);

INSERT INTO public.permissions (id, category, description) VALUES
  ('jobs:create', 'Jobs', 'Create and publish job listings in UGX'),
  ('jobs:edit_own', 'Jobs', 'Edit own job postings and scopes'),
  ('jobs:delete_own', 'Jobs', 'Delete or cancel own job postings'),
  ('jobs:feature', 'Jobs', 'Promote listings to featured spotlight'),
  ('jobs:moderate', 'Jobs', 'Takedown fraudulent or spam listings'),
  ('jobs:view_proposals', 'Jobs', 'Inspect received candidate proposals'),
  ('applications:submit', 'Applications', 'Submit custom bids to open listings'),
  ('applications:view_own', 'Applications', 'View own submitted applications'),
  ('applications:accept', 'Applications', 'Accept proposal and hire freelancer'),
  ('applications:reject', 'Applications', 'Reject candidate proposal'),
  ('projects:create_contract', 'Projects', 'Establish binding contract agreement'),
  ('projects:submit_deliverables', 'Projects', 'Submit deliverables and demo links'),
  ('projects:approve_deliverables', 'Projects', 'Approve deliverables and sign off'),
  ('projects:release_payment', 'Projects', 'Release escrow funds to freelancer'),
  ('projects:dispute', 'Projects', 'Raise formal arbitration dispute'),
  ('profile:manage_own', 'Profile', 'Edit profile information and biography'),
  ('portfolio:edit', 'Profile', 'Upload and maintain portfolio projects'),
  ('freelancer:badge_verify', 'Trust', 'Verify identity and award verified badge'),
  ('freelancer:feature', 'Trust', 'Feature profile in top freelancer showcase'),
  ('payments:initiate_escrow', 'Payments', 'Deposit funds into escrow via MTN/Airtel/Card'),
  ('payments:request_payout', 'Payments', 'Withdraw earnings to MTN/Airtel Mobile Money'),
  ('payments:view_transactions', 'Payments', 'View transaction ledger and receipts'),
  ('payments:manage_gateways', 'Payments', 'Configure gateway provider credentials'),
  ('admin:view_dashboard', 'Admin', 'Access platform administrative dashboard'),
  ('admin:manage_users', 'Admin', 'Manage user accounts and verification'),
  ('admin:manage_monetization', 'Admin', 'Adjust platform commission rates and listing fees'),
  ('admin:moderate_reports', 'Admin', 'Investigate and resolve reported abuse'),
  ('admin:audit_logs', 'Admin', 'View security and administrative audit trails'),
  ('admin:manage_roles', 'Admin', 'Assign roles and custom permission overrides'),
  ('admin:finance_overview', 'Admin', 'Inspect gross merchandise volume and fees')
ON CONFLICT (id) DO UPDATE SET description = EXCLUDED.description;

-- Role permissions mapping table
CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id TEXT REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id TEXT REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- Seed permissions for standard roles
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
  -- Client permissions
  ('client', 'jobs:create'),
  ('client', 'jobs:edit_own'),
  ('client', 'jobs:delete_own'),
  ('client', 'jobs:feature'),
  ('client', 'jobs:view_proposals'),
  ('client', 'applications:accept'),
  ('client', 'applications:reject'),
  ('client', 'projects:create_contract'),
  ('client', 'projects:approve_deliverables'),
  ('client', 'projects:release_payment'),
  ('client', 'projects:dispute'),
  ('client', 'profile:manage_own'),
  ('client', 'payments:initiate_escrow'),
  ('client', 'payments:view_transactions'),
  -- Freelancer permissions
  ('freelancer', 'applications:submit'),
  ('freelancer', 'applications:view_own'),
  ('freelancer', 'projects:submit_deliverables'),
  ('freelancer', 'projects:dispute'),
  ('freelancer', 'profile:manage_own'),
  ('freelancer', 'portfolio:edit'),
  ('freelancer', 'payments:request_payout'),
  ('freelancer', 'payments:view_transactions'),
  -- Moderator permissions
  ('moderator', 'jobs:moderate'),
  ('moderator', 'freelancer:badge_verify'),
  ('moderator', 'admin:view_dashboard'),
  ('moderator', 'admin:moderate_reports'),
  ('moderator', 'admin:audit_logs'),
  ('moderator', 'projects:dispute')
ON CONFLICT DO NOTHING;

-- Grant all permissions to Admin
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 'admin', id FROM public.permissions
ON CONFLICT DO NOTHING;

-- =========================================================================
-- 2. PROFILES TABLE (Extends Supabase auth.users)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL REFERENCES public.roles(id) DEFAULT 'freelancer',
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
  custom_permissions TEXT[] DEFAULT '{}', -- Per-user permission overrides
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 3. PORTFOLIO ITEMS TABLE
-- =========================================================================
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

-- =========================================================================
-- 4. JOBS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  skills_required TEXT[] DEFAULT '{}',
  budget_ugx NUMERIC NOT NULL CHECK (budget_ugx >= 50000),
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

-- =========================================================================
-- 5. APPLICATIONS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  freelancer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  proposed_budget_ugx NUMERIC NOT NULL CHECK (proposed_budget_ugx > 0),
  estimated_days INTEGER NOT NULL CHECK (estimated_days > 0),
  cover_letter TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 6. PROJECT CONTRACTS TABLE (Project tracking pipeline)
-- =========================================================================
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
  escrow_transaction_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- =========================================================================
-- 7. PAYMENT TRANSACTIONS & ESCROW LEDGER (UGX Gateway Integration)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
  freelancer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('escrow_deposit', 'platform_commission', 'freelancer_payout', 'featured_fee', 'refund')),
  amount_ugx NUMERIC NOT NULL CHECK (amount_ugx >= 0),
  platform_fee_ugx NUMERIC NOT NULL DEFAULT 0,
  freelancer_net_ugx NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'UGX',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('mtn_momo', 'airtel_money', 'card', 'bank_transfer')),
  payment_gateway TEXT NOT NULL CHECK (payment_gateway IN ('flutterwave', 'pesapal', 'direct_momo')),
  gateway_reference TEXT NOT NULL, -- e.g. FLW-UG-MOMO-12345
  gateway_transaction_id TEXT,
  phone_number TEXT, -- Ugandan MSISDN format: +25677... or +25670...
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'escrow_locked', 'released', 'refunded', 'failed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  released_at TIMESTAMPTZ
);

-- Index for fast transaction queries
CREATE INDEX IF NOT EXISTS idx_transactions_client ON public.payment_transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_transactions_freelancer ON public.payment_transactions(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_project ON public.payment_transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_transactions_gateway_ref ON public.payment_transactions(gateway_reference);

-- =========================================================================
-- 8. PAYOUT REQUESTS TABLE (Mobile Money Withdrawals)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.payout_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  freelancer_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
  amount_ugx NUMERIC NOT NULL CHECK (amount_ugx >= 5000), -- Minimum UGX 5,000 withdrawal
  fee_ugx NUMERIC NOT NULL DEFAULT 1500, -- Telecom withdrawal charge
  net_payout_ugx NUMERIC NOT NULL CHECK (net_payout_ugx > 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('mtn_momo', 'airtel_money')),
  account_phone TEXT NOT NULL,
  account_name TEXT NOT NULL,
  gateway_reference TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payouts_freelancer ON public.payout_requests(freelancer_id);

-- =========================================================================
-- 9. ESCROW DOUBLE-ENTRY ACCOUNTING LEDGER
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.escrow_ledger (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
  freelancer_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('credit_deposit', 'debit_payout', 'debit_commission', 'debit_refund')),
  amount_ugx NUMERIC NOT NULL,
  balance_after_ugx NUMERIC NOT NULL,
  reference TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 10. AUDIT LOGS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL, -- 'ESCROW_FUNDED', 'ESCROW_RELEASED', 'ROLE_ELEVATION', 'USER_VERIFIED'
  resource_type TEXT NOT NULL CHECK (resource_type IN ('job', 'user', 'project', 'payment', 'role', 'setting')),
  resource_id TEXT NOT NULL,
  details TEXT NOT NULL,
  ip_address TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);

-- =========================================================================
-- 11. MESSAGES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 12. REVIEWS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 13. NOTIFICATIONS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('application', 'hire', 'message', 'review', 'system', 'payment')),
  link_tab TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 14. REPORTS & MODERATION TABLE
-- =========================================================================
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

-- =========================================================================
-- 15. SAVED JOBS & FAVORITE FREELANCERS
-- =========================================================================
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

-- =========================================================================
-- 16. PLATFORM MONETIZATION CONFIGURATION
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  commission_rate_percent NUMERIC DEFAULT 10.0,
  featured_job_fee_ugx NUMERIC DEFAULT 50000,
  featured_freelancer_fee_ugx NUMERIC DEFAULT 35000,
  premium_freelancer_monthly_ugx NUMERIC DEFAULT 75000,
  escrow_protection_active BOOLEAN DEFAULT true,
  primary_gateway TEXT DEFAULT 'flutterwave',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 17. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can view, owner can update
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Jobs: Public can view open jobs, clients can create/edit own jobs
CREATE POLICY "Jobs viewable by everyone" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Clients can create jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Clients can update own jobs" ON public.jobs FOR UPDATE USING (auth.uid() = client_id);

-- Applications: Clients of job and applying freelancer can view
CREATE POLICY "Applications viewable by job client and applicant" ON public.applications
  FOR SELECT USING (auth.uid() = freelancer_id OR auth.uid() IN (SELECT client_id FROM public.jobs WHERE id = job_id));
CREATE POLICY "Freelancers can submit applications" ON public.applications
  FOR INSERT WITH CHECK (auth.uid() = freelancer_id);

-- Payment Transactions: Client and Freelancer of transaction can view; Admins view all
CREATE POLICY "Users view own transactions" ON public.payment_transactions
  FOR SELECT USING (
    auth.uid() = client_id OR
    auth.uid() = freelancer_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Payout Requests: Freelancer can view own; Admins view all
CREATE POLICY "Freelancers view own payouts" ON public.payout_requests
  FOR SELECT USING (
    auth.uid() = freelancer_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
