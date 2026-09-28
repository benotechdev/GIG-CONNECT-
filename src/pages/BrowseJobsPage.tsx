import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Bookmark,
  Sparkles,
  DollarSign,
  ArrowRight,
  Briefcase,
  X,
  Share2,
  AlertCircle,
  Flag,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { Job } from '../types';
import { formatUGX, timeAgo } from '../utils/formatters';

interface BrowseJobsPageProps {
  initialCategory?: string;
  initialKeyword?: string;
}

export const BrowseJobsPage: React.FC<BrowseJobsPageProps> = ({
  initialCategory = '',
  initialKeyword = '',
}) => {
  const {
    jobs,
    savedJobIds,
    toggleSaveJob,
    selectedJobId,
    setSelectedJobId,
    setApplyModalOpen,
    setReportModalData,
    currentUser,
    setAuthModalOpen,
    setCurrentView,
  } = useApp();

  const [keyword, setKeyword] = useState(initialKeyword);
  const [category, setCategory] = useState(initialCategory);
  const [budgetType, setBudgetType] = useState<'all' | 'fixed' | 'hourly'>('all');
  const [experienceLevel, setExperienceLevel] = useState<string>('all');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [maxBudget, setMaxBudget] = useState<number>(5000000);
  const [sortBy, setSortBy] = useState<'newest' | 'budget_high' | 'proposals'>('newest');

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        // Status must be open
        if (job.status !== 'open') return false;

        // Keyword filter
        if (keyword.trim()) {
          const q = keyword.toLowerCase();
          const matchesTitle = job.title.toLowerCase().includes(q);
          const matchesDesc = job.description.toLowerCase().includes(q);
          const matchesSkills = job.skills_required.some((s) => s.toLowerCase().includes(q));
          if (!matchesTitle && !matchesDesc && !matchesSkills) return false;
        }

        // Category filter
        if (category && job.category !== category) return false;

        // Budget type
        if (budgetType !== 'all' && job.budget_type !== budgetType) return false;

        // Experience
        if (experienceLevel !== 'all' && job.experience_level !== experienceLevel) return false;

        // Remote only
        if (remoteOnly && !job.is_remote) return false;

        // Max budget
        if (job.budget_ugx > maxBudget) return false;

        return true;
      })
      .sort((a, b) => {
        // Featured jobs on top
        if (a.is_featured !== b.is_featured) {
          return a.is_featured ? -1 : 1;
        }
        if (sortBy === 'budget_high') {
          return b.budget_ugx - a.budget_ugx;
        }
        if (sortBy === 'proposals') {
          return b.applications_count - a.applications_count;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [jobs, keyword, category, budgetType, experienceLevel, remoteOnly, maxBudget, sortBy]);

  // Selected job for detail modal
  const activeJob = jobs.find((j) => j.id === selectedJobId);

  const handleApplyClick = (jobId: string) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setSelectedJobId(jobId);
    setApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
              <span>EXPLORE OPPORTUNITIES</span>
              <span className="w-6 h-0.5 bg-blue-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Browse Freelance Jobs in Uganda
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Find verified client projects with guaranteed escrow payments in UGX.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('post-job')}
            className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer self-start md:self-auto"
          >
            + Post a Job (UGX)
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                placeholder="Search jobs by title or skill (e.g. MoMo API, Flutter)..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-slate-900"
              />
              {keyword && (
                <button
                  onClick={() => setKeyword('')}
                  className="absolute right-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="md:col-span-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-blue-600 cursor-pointer"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-blue-600 cursor-pointer font-medium"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="budget_high">Sort: Highest Budget</option>
                <option value="proposals">Sort: Most Proposals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-blue-600" />
                  Filter Gigs
                </span>
                {(category || budgetType !== 'all' || experienceLevel !== 'all' || remoteOnly || keyword) && (
                  <button
                    onClick={() => {
                      setCategory('');
                      setKeyword('');
                      setBudgetType('all');
                      setExperienceLevel('all');
                      setRemoteOnly(false);
                      setMaxBudget(5000000);
                    }}
                    className="text-[11px] text-blue-700 font-bold hover:underline cursor-pointer"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Budget Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Project Type</label>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="budgetType"
                      checked={budgetType === 'all'}
                      onChange={() => setBudgetType('all')}
                      className="text-blue-600"
                    />
                    <span>All Types</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="budgetType"
                      checked={budgetType === 'fixed'}
                      onChange={() => setBudgetType('fixed')}
                      className="text-blue-600"
                    />
                    <span>Fixed Price</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="budgetType"
                      checked={budgetType === 'hourly'}
                      onChange={() => setBudgetType('hourly')}
                      className="text-blue-600"
                    />
                    <span>Hourly Rate</span>
                  </label>
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Experience Level</label>
                <div className="space-y-1.5 text-xs text-slate-600">
                  {['all', 'Entry', 'Intermediate', 'Expert'].map((lvl) => (
                    <label key={lvl} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="expLevel"
                        checked={experienceLevel === lvl}
                        onChange={() => setExperienceLevel(lvl)}
                        className="text-blue-600"
                      />
                      <span className="capitalize">{lvl === 'all' ? 'Any Experience' : lvl}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Max Budget Slider */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-bold text-slate-700">Max Budget</span>
                  <span className="font-mono font-bold text-blue-700">{formatUGX(maxBudget)}</span>
                </div>
                <input
                  type="range"
                  min="200000"
                  max="10000000"
                  step="200000"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Remote toggle */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remoteOnly}
                    onChange={(e) => setRemoteOnly(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remote Jobs Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Job Feed List */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2 px-1">
              <span>
                Showing <strong className="text-slate-900 font-bold">{filteredJobs.length}</strong> available gigs
              </span>
              {category && (
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">
                  Category: {category}
                </span>
              )}
            </div>

            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">No matching jobs found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing your filters or searching with different keywords like "MoMo", "React", or "Design".
                </p>
                <button
                  onClick={() => {
                    setCategory('');
                    setKeyword('');
                    setBudgetType('all');
                    setExperienceLevel('all');
                    setMaxBudget(5000000);
                  }}
                  className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-blue-800"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const isSaved = savedJobIds.includes(job.id);

                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer group relative ${
                      job.is_featured
                        ? 'border-amber-300 bg-amber-50/20 hover:border-amber-400 hover:shadow-md'
                        : 'border-slate-200 hover:border-blue-400 hover:shadow-md bg-white'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {job.is_featured && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950 shadow-xs">
                              <Sparkles className="w-3 h-3" />
                              Featured
                            </span>
                          )}

                          <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-[11px]">
                            {job.category}
                          </span>

                          <span className="text-slate-400 font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {timeAgo(job.created_at)}
                          </span>

                          <span className="text-slate-400 font-medium flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {job.location} {job.is_remote ? '(Remote)' : ''}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {job.title}
                        </h3>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {job.skills_required.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right budget & CTA */}
                      <div className="flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 gap-3 shrink-0">
                        <div className="text-left lg:text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                            {job.budget_type} Budget
                          </span>
                          <span className="text-base sm:text-lg font-extrabold text-blue-900 font-mono">
                            {formatUGX(job.budget_ugx)}
                          </span>
                          <span className="block text-[11px] text-slate-500">
                            {job.applications_count} submitted bids
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveJob(job.id);
                            }}
                            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                              isSaved
                                ? 'bg-blue-50 border-blue-200 text-blue-600'
                                : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                            title={isSaved ? 'Remove from saved' : 'Save job'}
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600' : ''}`} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApplyClick(job.id);
                            }}
                            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Selected Job Detail Modal */}
      {activeJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-xs">
                  {activeJob.category}
                </span>
                {activeJob.is_featured && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px]">
                    Featured
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedJobId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                  {activeJob.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                  <span>Posted {timeAgo(activeJob.created_at)}</span>
                  <span>·</span>
                  <span>{activeJob.location} {activeJob.is_remote ? '(Remote allowed)' : ''}</span>
                  <span>·</span>
                  <span>Experience: {activeJob.experience_level}</span>
                  <span>·</span>
                  <span>Est. Duration: {activeJob.duration}</span>
                </div>
              </div>

              {/* Budget Hero Card */}
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-bold block">
                    Agreed Budget ({activeJob.budget_type})
                  </span>
                  <span className="text-2xl font-black text-blue-900 font-mono">
                    {formatUGX(activeJob.budget_ugx)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Proposals Received</span>
                  <span className="text-base font-bold text-slate-800">
                    {activeJob.applications_count} freelancers
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Job Description & Scope
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {activeJob.description}
                </p>
              </div>

              {/* Skills */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Required Skills & Expertise
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeJob.skills_required.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Client Info snippet */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={activeJob.client_avatar}
                    alt={activeJob.client_name}
                    className="w-11 h-11 rounded-full object-cover border border-slate-300"
                  />
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <span>{activeJob.client_name}</span>
                      <CheckCircle2 className="w-4 h-4 text-blue-600 fill-white" />
                    </h5>
                    <p className="text-xs text-slate-500">
                      {activeJob.client_company || 'Verified Client'} · {activeJob.client_rating.toFixed(1)} ★
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setReportModalData({
                      targetType: 'job',
                      targetId: activeJob.id,
                      targetTitle: activeJob.title,
                    })
                  }
                  className="text-xs text-slate-400 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Report</span>
                </button>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <button
                onClick={() => toggleSaveJob(activeJob.id)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer flex items-center gap-1.5"
              >
                <Bookmark className="w-4 h-4" />
                <span>{savedJobIds.includes(activeJob.id) ? 'Saved' : 'Save Job'}</span>
              </button>

              <button
                onClick={() => handleApplyClick(activeJob.id)}
                className="flex-1 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm cursor-pointer shadow-md transition-all text-center"
              >
                Apply for this Gig ({formatUGX(activeJob.budget_ugx)})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
