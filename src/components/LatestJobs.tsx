import React from 'react';
import {
  Clock,
  MapPin,
  Bookmark,
  Sparkles,
  ArrowRight,
  Briefcase,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUGX, timeAgo } from '../utils/formatters';

interface LatestJobsProps {
  onSelectJob: (jobId: string) => void;
}

export const LatestJobs: React.FC<LatestJobsProps> = ({ onSelectJob }) => {
  const {
    jobs,
    savedJobIds,
    toggleSaveJob,
    setCurrentView,
    setApplyModalOpen,
    setSelectedJobId,
    currentUser,
    setAuthModalOpen,
  } = useApp();

  const openJobs = jobs.filter((j) => j.status === 'open').slice(0, 5);

  const handleApplyClick = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setSelectedJobId(jobId);
    setApplyModalOpen(true);
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
              <span>ACTIVE OPPORTUNITIES</span>
              <span className="w-6 h-0.5 bg-blue-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Latest Jobs in Uganda
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Fresh client postings offering verified budgets in Ugandan Shillings (UGX).
            </p>
          </div>

          <button
            onClick={() => setCurrentView('jobs')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-800 transition-colors cursor-pointer group"
          >
            <span>View All {jobs.length} Gigs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="space-y-4">
          {openJobs.map((job) => {
            const isSaved = savedJobIds.includes(job.id);

            return (
              <div
                key={job.id}
                onClick={() => onSelectJob(job.id)}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer group relative ${
                  job.is_featured
                    ? 'border-amber-300 bg-amber-50/20 hover:border-amber-400 hover:shadow-md'
                    : 'border-slate-200 hover:border-blue-400 hover:shadow-md bg-white'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {job.is_featured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950 shadow-xs">
                          <Sparkles className="w-3 h-3" />
                          Featured Gig
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
                        {job.location} {job.is_remote ? '(Remote ok)' : ''}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                      {job.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
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

                  {/* Budget & Action Box */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 gap-3 shrink-0">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                        Budget ({job.budget_type})
                      </span>
                      <span className="text-lg sm:text-xl font-extrabold text-blue-900 font-mono">
                        {formatUGX(job.budget_ugx)}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 lg:justify-end mt-0.5">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>{job.applications_count} proposals</span>
                      </div>
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
                        onClick={(e) => handleApplyClick(e, job.id)}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
