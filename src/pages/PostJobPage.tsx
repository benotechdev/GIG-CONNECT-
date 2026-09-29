import React, { useState } from 'react';
import {
  Briefcase,
  Coins,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { formatUGX } from '../utils/formatters';

export const PostJobPage: React.FC = () => {
  const {
    currentUser,
    postJob,
    setCurrentView,
    setAuthModalOpen,
    monetizationSettings,
    can,
    loginAs,
    users,
    setRolesModalOpen,
  } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [description, setDescription] = useState('');
  const [skillsString, setSkillsString] = useState('React, Tailwind CSS, TypeScript');
  const [budgetUgx, setBudgetUgx] = useState<number>(1500000);
  const [budgetType, setBudgetType] = useState<'fixed' | 'hourly'>('fixed');
  const [duration, setDuration] = useState('2-3 Weeks');
  const [experienceLevel, setExperienceLevel] = useState<'Entry' | 'Intermediate' | 'Expert'>('Intermediate');
  const [location, setLocation] = useState('Kampala / Remote');
  const [isRemote, setIsRemote] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const featuredFee = monetizationSettings.featured_job_fee_ugx || 50000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    if (title.trim().length < 5) {
      setError('Please provide a descriptive job title (at least 5 characters).');
      return;
    }

    if (description.trim().length < 20) {
      setError('Please describe the job scope thoroughly (at least 20 characters).');
      return;
    }

    if (budgetUgx < 50000) {
      setError('Minimum job budget is UGX 50,000.');
      return;
    }

    const skillsArray = skillsString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    postJob({
      title: title.trim(),
      category,
      description: description.trim(),
      skills_required: skillsArray,
      budget_ugx: budgetUgx,
      budget_type: budgetType,
      duration,
      experience_level: experienceLevel,
      location,
      is_remote: isRemote,
      is_featured: isFeatured,
      status: 'open',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    });

    setSubmitted(true);
    setTimeout(() => {
      setCurrentView('client-dashboard');
    }, 1600);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
            <span>CLIENT PORTAL</span>
            <span className="w-6 h-0.5 bg-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Post a Job in Ugandan Shillings (UGX)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Reach thousands of vetted Ugandan developers, designers, and marketing professionals within minutes.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {currentUser && !can('jobs:create') ? (
            <div className="p-8 sm:p-12 text-center space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  Role Restricted: jobs:create
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Freelancer Account Detected
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto pt-1">
                  On <strong>Gig Connect UG</strong>, job posting and milestone funding are strictly managed by Client accounts. Freelancer accounts submit proposals and build portfolios.
                </p>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl max-w-md mx-auto text-left text-xs space-y-1.5 text-slate-700">
                <span className="font-bold text-amber-950 block">Looking to hire other talent?</span>
                <p>
                  You can switch into a Client demo account to test publishing listings, reviewing candidate proposals, and funding escrow in UGX.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => loginAs('user-client-1')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
                >
                  Switch to Client (David Ssekandi)
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentView('jobs')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  Browse Open Jobs
                </button>

                <button
                  type="button"
                  onClick={() => setRolesModalOpen(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-purple-700 hover:bg-purple-50 font-semibold text-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Coins className="w-4 h-4" />
                  <span>Inspect Roles Matrix</span>
                </button>
              </div>
            </div>
          ) : submitted ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Job Posted Successfully!</h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your listing is now live across Uganda. You will receive notifications as freelancers submit proposals.
              </p>
              <div className="pt-2 text-xs text-blue-700 font-semibold animate-pulse">
                Redirecting to your Client Dashboard...
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MTN MoMo API Integration for E-Commerce Checkout"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              {/* Category & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white text-slate-800 focus:outline-hidden focus:border-blue-600 cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Experience Level *
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white text-slate-800 focus:outline-hidden focus:border-blue-600 cursor-pointer"
                  >
                    <option value="Entry">Entry Level (Junior)</option>
                    <option value="Intermediate">Intermediate Level</option>
                    <option value="Expert">Expert Level (Senior / Lead)</option>
                  </select>
                </div>
              </div>

              {/* Budget & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Budget Amount (UGX) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="50000"
                      min="50000"
                      required
                      value={budgetUgx}
                      onChange={(e) => setBudgetUgx(Number(e.target.value))}
                      className="w-full pl-3.5 pr-14 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-blue-950 focus:outline-hidden focus:border-blue-600"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">
                      UGX
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Equivalent to {formatUGX(budgetUgx)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Budget Structure
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBudgetType('fixed')}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                        budgetType === 'fixed'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      Fixed Price
                    </button>
                    <button
                      type="button"
                      onClick={() => setBudgetType('hourly')}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                        budgetType === 'hourly'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      Hourly Rate
                    </button>
                  </div>
                </div>
              </div>

              {/* Duration & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 2-3 Weeks or 1 Month"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Kampala, Uganda or Remote"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Required Skills (comma separated) *
                </label>
                <input
                  type="text"
                  required
                  value={skillsString}
                  onChange={(e) => setSkillsString(e.target.value)}
                  placeholder="React, Node.js, Flutter, Figma, SEO"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Project Description & Deliverables *
                </label>
                <textarea
                  rows={5}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the scope of work, technical requirements, deliverables, milestones, and any specific experience required from the freelancer..."
                  className="w-full p-4 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-hidden focus:border-blue-600 leading-relaxed"
                />
              </div>

              {/* Monetization: Featured Job Option */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="featuredToggle" className="cursor-pointer text-xs">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Feature this job listing (+{formatUGX(featuredFee)})
                  </span>
                  <span className="text-amber-800/80 block mt-0.5">
                    Featured jobs appear pinned on the homepage and at the very top of search results, attracting 3x more top applicants.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Publish Job for {formatUGX(budgetUgx)}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
