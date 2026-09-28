import React from 'react';
import { ArrowRight, Briefcase, Sparkles, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CallToAction: React.FC = () => {
  const { setCurrentView, setAuthModalOpen, setAuthModalMode } = useApp();

  return (
    <section className="py-16 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white relative overflow-hidden">
      {/* Decorative radial blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Card 1: For Businesses */}
          <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5" />
                <span>For Ugandan Businesses</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Find your next high-impact freelancer today.
              </h3>
              <p className="text-sm text-blue-100/90 leading-relaxed">
                Post your project scope and connect with vetted developers, creatives, and marketers ready to deliver quality results in UGX.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setCurrentView('post-job')}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Post a Job Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentView('freelancers')}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all cursor-pointer"
              >
                Browse Freelancers
              </button>
            </div>
          </div>

          {/* Card 2: For Freelancers */}
          <div className="p-8 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-700/60 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>For Local Freelancers</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Turn your skills into steady earnings in UGX.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Join thousands of Ugandan specialists working flexibly with forward-thinking companies. Guaranteed escrow payouts to MTN MoMo & Airtel Money.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setAuthModalOpen(true);
                }}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Apply as a Freelancer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentView('jobs')}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all cursor-pointer"
              >
                View Active Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
