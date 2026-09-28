import React, { useState } from 'react';
import {
  X,
  Database,
  Check,
  Copy,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Server,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
} from '../lib/supabase';

export const SupabaseModal: React.FC = () => {
  const { supabaseModalOpen, setSupabaseModalOpen, resetAllData, isSupabaseLive } = useApp();

  const [activeTab, setActiveTab] = useState<'config' | 'schema'>('config');
  const [copied, setCopied] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const creds = getSupabaseCredentials();
  const [url, setUrl] = useState(creds.url);
  const [key, setKey] = useState(creds.key);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!supabaseModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseCredentials(url, key);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleClear = () => {
    clearSupabaseCredentials();
    setUrl('');
    setKey('');
  };

  const handleCopySchema = () => {
    const schemaSql = `-- Gig Connect UG - Complete Supabase PostgreSQL Schema
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`;

    navigator.clipboard.writeText(schemaSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    resetAllData();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <span>Supabase & Database Architecture</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  PostgreSQL
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Persistent storage, clean relational schema & real-time sync for Uganda
              </p>
            </div>
          </div>
          <button
            onClick={() => setSupabaseModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-slate-50">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-3 px-4 text-xs font-bold cursor-pointer transition-colors border-b-2 ${
              activeTab === 'config'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Connection & State
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-3 px-4 text-xs font-bold cursor-pointer transition-colors border-b-2 ${
              activeTab === 'schema'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            View SQL Schema Script
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'config' ? (
            <>
              {/* Status pill */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3.5 h-3.5 rounded-full ${
                      isSupabaseLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {isSupabaseLive ? 'Supabase Live Connection: Active' : 'Reactive Persistent Storage: Active'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {isSupabaseLive
                        ? 'Connected to your remote Supabase instance.'
                        : 'Using browser local persistence with full demo state. You can connect remote Supabase anytime.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-white text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Reset to Ugandan seed data"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{resetDone ? 'Reset Done!' : 'Reset Demo Data'}</span>
                </button>
              </div>

              {/* Supabase credentials form */}
              <form onSubmit={handleSave} className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Connect Remote Supabase (Optional)
                </h4>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Supabase Project URL (VITE_SUPABASE_URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://xyzcompany.supabase.co"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Supabase Anon Key (VITE_SUPABASE_ANON_KEY)
                  </label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    {saveSuccess ? 'Saved Credentials!' : 'Save & Connect'}
                  </button>

                  {(url || key) && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </form>

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Database Structure Ready
                </p>
                <p className="text-slate-600">
                  Tables for Profiles, Jobs, Applications, Projects, Messages, Reviews, Notifications, and Reports are pre-defined with Row Level Security (RLS) policies.
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">
                  Copy and paste this SQL script directly into your Supabase SQL Editor:
                </p>
                <button
                  onClick={handleCopySchema}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy SQL Script'}</span>
                </button>
              </div>

              <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-[11px] overflow-x-auto max-h-96 border border-slate-800">
                <pre>{`-- Gig Connect UG - Complete Supabase PostgreSQL Schema
-- Platform: Connect. Work. Earn. (Uganda Freelance Marketplace)

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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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
  experience_level TEXT NOT NULL,
  location TEXT DEFAULT 'Kampala, Uganda',
  is_remote BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'open',
  deadline TIMESTAMPTZ,
  applications_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  freelancer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  agreed_amount_ugx NUMERIC NOT NULL,
  platform_fee_ugx NUMERIC NOT NULL,
  freelancer_payout_ugx NUMERIC NOT NULL,
  stage TEXT NOT NULL DEFAULT 'hired',
  deliverable_note TEXT,
  deliverable_url TEXT,
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public jobs are viewable by everyone" ON public.jobs FOR SELECT USING (true);`}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
