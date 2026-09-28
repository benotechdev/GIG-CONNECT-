import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Sparkles, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';

interface HeroSectionProps {
  onSearch: (keyword: string, category: string, location: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const { setCurrentView } = useApp();
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword, category, location);
    setCurrentView('jobs');
  };

  const trendingTags = [
    'MTN MoMo API',
    'Flutter Apps',
    'Packaging Design',
    'FinTech UI/UX',
    'SEO Uganda',
    'URSB Legal',
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 text-white pt-12 pb-20 sm:pt-18 sm:pb-28">
      {/* Decorative gradient light orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.5 0H0V1.5V30H1.5V1.5H30V0H1.5Z' fill='white'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-800/60 border border-blue-400/30 text-xs sm:text-sm font-semibold text-blue-200 mb-6 backdrop-blur-xs">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Uganda's Leading Freelance Ecosystem</span>
            <span className="text-amber-400 font-bold">· Connect. Work. Earn.</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Hire Top Ugandan Talent.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200">
              Pay & Earn in UGX.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Bridging Ugandan businesses with vetted local software developers, designers, marketers, and consultants. Safe milestone escrow payments backed by MTN MoMo & Airtel Money.
          </p>

          {/* Search Bar Card */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 p-2.5 sm:p-3 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-900 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              {/* Keyword input */}
              <div className="sm:col-span-5 relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, skill (e.g. React, UI/UX, SEO)..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 sm:py-3 text-sm rounded-xl focus:outline-hidden focus:bg-slate-50 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Category dropdown */}
              <div className="sm:col-span-4 relative flex items-center sm:border-l sm:border-slate-200 sm:pl-2">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-4 shrink-0 pointer-events-none" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 sm:py-3 text-sm rounded-xl focus:outline-hidden focus:bg-slate-50 text-slate-800 bg-white cursor-pointer appearance-none"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search submit button */}
              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full h-full min-h-[46px] px-6 py-2.5 bg-blue-700 hover:bg-blue-800 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Trending Tags */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Popular:</span>
            {trendingTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setKeyword(tag);
                  onSearch(tag, '', '');
                  setCurrentView('jobs');
                }}
                className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 transition-colors cursor-pointer text-[11px]"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-12 pt-8 border-t border-slate-800/70 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="text-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <p className="text-xl sm:text-2xl font-black text-amber-400 font-mono">4,500+</p>
              <p className="text-xs text-slate-400 mt-0.5">Vetted Ugandan Talents</p>
            </div>

            <div className="text-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">UGX 2.8B+</p>
              <p className="text-xs text-slate-400 mt-0.5">Paid to Freelancers</p>
            </div>

            <div className="text-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <p className="text-xl sm:text-2xl font-black text-blue-400 font-mono">98.4%</p>
              <p className="text-xs text-slate-400 mt-0.5">Client Satisfaction</p>
            </div>

            <div className="text-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <p className="text-xl sm:text-2xl font-black text-amber-300 font-mono">MTN / Airtel</p>
              <p className="text-xs text-slate-400 mt-0.5">Zero-Friction Escrow</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
