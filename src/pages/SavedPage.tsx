import React, { useState } from 'react';
import { Bookmark, Heart, Star, MapPin, Clock, ArrowRight, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUGX, timeAgo } from '../utils/formatters';

export const SavedPage: React.FC = () => {
  const {
    jobs,
    users,
    savedJobIds,
    favoriteFreelancerIds,
    toggleSaveJob,
    toggleFavoriteFreelancer,
    setSelectedJobId,
    setSelectedFreelancerId,
    setCurrentView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'jobs' | 'freelancers'>('jobs');

  const savedJobs = jobs.filter((j) => savedJobIds.includes(j.id));
  const favoriteFreelancers = users.filter((u) => favoriteFreelancerIds.includes(u.id));

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
            <span>SAVED ITEMS</span>
            <span className="w-6 h-0.5 bg-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bookmarks & Favorites
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Quickly return to jobs you bookmarked and top Ugandan freelancers you want to hire.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 space-x-6 text-sm">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 ${
              activeTab === 'jobs'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Saved Jobs ({savedJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('freelancers')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 ${
              activeTab === 'freelancers'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Favorite Freelancers ({favoriteFreelancers.length})
          </button>
        </div>

        {activeTab === 'jobs' ? (
          <div className="space-y-4">
            {savedJobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm text-slate-500">You haven't saved any jobs yet.</p>
                <button
                  onClick={() => setCurrentView('jobs')}
                  className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold"
                >
                  Browse Available Jobs
                </button>
              </div>
            ) : (
              savedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-blue-700">{job.category}</span>
                    <h3
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setCurrentView('jobs');
                      }}
                      className="font-bold text-base text-slate-900 hover:text-blue-700 cursor-pointer"
                    >
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{job.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span>{job.location}</span>
                      <span>·</span>
                      <span>{timeAgo(job.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-bold">Budget</span>
                      <span className="text-base font-extrabold text-blue-900 font-mono">
                        {formatUGX(job.budget_ugx)}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-slate-50 border border-slate-200 cursor-pointer"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favoriteFreelancers.length === 0 ? (
              <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm text-slate-500">No favorite freelancers saved yet.</p>
                <button
                  onClick={() => setCurrentView('freelancers')}
                  className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold"
                >
                  Discover Ugandan Talent
                </button>
              </div>
            ) : (
              favoriteFreelancers.map((freelancer) => (
                <div
                  key={freelancer.id}
                  onClick={() => {
                    setSelectedFreelancerId(freelancer.id);
                    setCurrentView('freelancer-detail');
                  }}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-400 cursor-pointer transition-colors relative space-y-3"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteFreelancer(freelancer.id);
                    }}
                    className="absolute top-3 right-3 p-1.5 text-red-600 hover:bg-red-50 rounded-full cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-red-600" />
                  </button>

                  <div className="flex items-center gap-3">
                    <img
                      src={freelancer.avatar_url}
                      alt={freelancer.full_name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{freelancer.full_name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{freelancer.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="font-bold text-blue-900 font-mono">
                      {formatUGX(freelancer.hourly_rate_ugx || 40000)}/hr
                    </span>
                    <span className="text-amber-700 font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {freelancer.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
