import React from 'react';
import {
  Star,
  MapPin,
  CheckCircle2,
  Heart,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUGX } from '../utils/formatters';

export const FeaturedFreelancers: React.FC = () => {
  const {
    users,
    favoriteFreelancerIds,
    toggleFavoriteFreelancer,
    setSelectedFreelancerId,
    setCurrentView,
    setActiveConversationUserId,
    currentUser,
    setAuthModalOpen,
  } = useApp();

  // Get freelancers, prioritizing featured or top rated
  const freelancers = users
    .filter((u) => u.role === 'freelancer')
    .sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0) || b.rating - a.rating)
    .slice(0, 4);

  const handleFreelancerClick = (freelancerId: string) => {
    setSelectedFreelancerId(freelancerId);
    setCurrentView('freelancer-detail');
  };

  const handleMessageClick = (e: React.MouseEvent, freelancerId: string) => {
    e.stopPropagation();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setActiveConversationUserId(freelancerId);
    setCurrentView('messages');
  };

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>TOP-RATED TALENT IN UGANDA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Freelancers
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Collaborate with verified Ugandan professionals with proven project track records.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('freelancers')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-800 transition-colors cursor-pointer group"
          >
            <span>Browse All Talent</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {freelancers.map((freelancer) => {
            const isFav = favoriteFreelancerIds.includes(freelancer.id);

            return (
              <div
                key={freelancer.id}
                onClick={() => handleFreelancerClick(freelancer.id)}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer group relative"
              >
                {/* Featured Badge */}
                {freelancer.is_featured && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-xs">
                      <Sparkles className="w-2.5 h-2.5" />
                      Featured
                    </span>
                  </div>
                )}

                {/* Bookmark Heart */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteFreelancer(freelancer.id);
                  }}
                  className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
                    isFav
                      ? 'bg-red-50 text-red-600'
                      : 'bg-white/80 text-slate-400 hover:text-red-500'
                  }`}
                  title={isFav ? 'Remove from favorites' : 'Save freelancer'}
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-red-600' : ''}`} />
                </button>

                <div className="p-5">
                  {/* Avatar & Header */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-3">
                      <img
                        src={freelancer.avatar_url}
                        alt={freelancer.full_name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
                      />
                      {freelancer.is_verified && (
                        <div
                          className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-xs"
                          title="Verified Ugandan Professional"
                        >
                          <CheckCircle2 className="w-4 h-4 text-blue-600 fill-white" />
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700 transition-colors">
                      {freelancer.full_name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">
                      {freelancer.title}
                    </p>

                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{freelancer.location}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mt-2 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-amber-900">
                        {freelancer.rating.toFixed(1)}
                      </span>
                      <span className="text-[11px] text-amber-700">
                        ({freelancer.total_reviews} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
                    {freelancer.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {freelancer.skills.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center">
                        +{freelancer.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer price & message */}
                <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                      Rate
                    </span>
                    <span className="text-xs font-bold text-blue-900">
                      {formatUGX(freelancer.hourly_rate_ugx || 40000)}/hr
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleMessageClick(e, freelancer.id)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-700 hover:bg-white transition-colors cursor-pointer"
                      title="Direct Chat"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-blue-700 group-hover:translate-x-0.5 transition-transform">
                      Profile &rarr;
                    </span>
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
