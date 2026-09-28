import React from 'react';
import {
  ShieldCheck,
  Zap,
  Globe,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Database,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentView, setSupabaseModalOpen } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Trust & payment bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Ugandan Escrow Protection Guarantee</p>
                <p className="text-xs text-slate-400">
                  Client funds held securely until milestones are approved. 100% satisfaction or dispute resolution.
                </p>
              </div>
            </div>

            {/* Payment methods supported */}
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="hidden sm:inline font-medium">Supported Payments:</span>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-yellow-400/20 text-yellow-300 font-bold border border-yellow-400/30 text-[11px]">
                  MTN MoMo
                </span>
                <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-300 font-bold border border-red-500/30 text-[11px]">
                  Airtel Money
                </span>
                <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30 text-[11px]">
                  Card / Bank
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Mission column */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" showTagline={true} darkTheme={true} />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Gig Connect UG is Uganda's premier freelance marketplace connecting progressive businesses with top local tech developers, creative designers, copywriters, and consultants.
            </p>

            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Kampala Innovation Hub, Nakasero & Kololo, Uganda</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@gigconnect.ug</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+256 (0) 700 800 900 / MTN Toll-Free</span>
              </div>
            </div>

            <button
              onClick={() => setSupabaseModalOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white hover:border-slate-500 transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supabase Database Schema & Setup</span>
            </button>
          </div>

          {/* For Clients */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">For Clients</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView('post-job')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Post a Job in UGX
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('freelancers')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Browse Vetted Freelancers
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('projects')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Milestone Escrow System
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('client-dashboard')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Client Dashboard
                </button>
              </li>
              <li>
                <span className="text-slate-500">Enterprise Hiring (Kampala)</span>
              </li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">For Freelancers</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView('jobs')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Find Jobs in Uganda
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('freelancer-dashboard')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Freelancer Dashboard
                </button>
              </li>
              <li>
                <span className="text-slate-500">Mobile Money Instant Payouts</span>
              </li>
              <li>
                <span className="text-slate-500">Verified Skills Badge</span>
              </li>
              <li>
                <span className="text-slate-500">Community Workshops & Meetups</span>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Categories</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView('jobs')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Web & Mobile Apps
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('jobs')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Graphic & Brand Design
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('jobs')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  SEO & Social Media Marketing
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('jobs')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Legal & URSB Compliance
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('jobs')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Data Science & Finance
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & flag row */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Gig Connect UG. All rights reserved.</span>
            <span>·</span>
            <span>Tagline: Connect. Work. Earn.</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span>Made with pride in Uganda</span>
              {/* Flag ribbon */}
              <span className="inline-flex flex-col w-4 h-2.5 rounded-[1px] overflow-hidden">
                <span className="bg-black h-1/3 w-full" />
                <span className="bg-yellow-400 h-1/3 w-full" />
                <span className="bg-red-600 h-1/3 w-full" />
              </span>
            </span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms & Escrow</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
