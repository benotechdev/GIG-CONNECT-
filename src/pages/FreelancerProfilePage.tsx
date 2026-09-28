import React, { useState } from 'react';
import {
  Star,
  MapPin,
  CheckCircle2,
  Heart,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Calendar,
  Briefcase,
  ExternalLink,
  Shield,
  Flag,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUGX, formatDate } from '../utils/formatters';

export const FreelancerProfilePage: React.FC = () => {
  const {
    selectedFreelancerId,
    users,
    reviews,
    projects,
    favoriteFreelancerIds,
    toggleFavoriteFreelancer,
    setCurrentView,
    setActiveConversationUserId,
    setReportModalData,
    currentUser,
    setAuthModalOpen,
  } = useApp();

  const freelancer = users.find((u) => u.id === selectedFreelancerId) || users.find((u) => u.role === 'freelancer');

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <p className="text-slate-600 font-bold">Freelancer profile not found.</p>
          <button
            onClick={() => setCurrentView('freelancers')}
            className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold"
          >
            Back to Freelancers
          </button>
        </div>
      </div>
    );
  }

  const isFav = favoriteFreelancerIds.includes(freelancer.id);
  const freelancerReviews = reviews.filter((r) => r.to_user_id === freelancer.id);

  const handleMessage = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setActiveConversationUserId(freelancer.id);
    setCurrentView('messages');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back Link */}
        <button
          onClick={() => setCurrentView('freelancers')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Freelancers</span>
        </button>

        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative">
                <img
                  src={freelancer.avatar_url}
                  alt={freelancer.full_name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-slate-100 shadow-md"
                />
                {freelancer.is_verified && (
                  <div
                    className="absolute bottom-1 right-1 p-1 bg-white rounded-full shadow-xs"
                    title="Verified Identity & Skills in Uganda"
                  >
                    <CheckCircle2 className="w-6 h-6 text-blue-600 fill-white" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {freelancer.full_name}
                  </h1>

                  {freelancer.is_featured && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                  {freelancer.is_premium && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-700">
                      PRO
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-base font-semibold text-slate-700">
                  {freelancer.title}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {freelancer.location}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <strong className="text-slate-800 font-bold">{freelancer.rating.toFixed(1)}</strong> ({freelancer.total_reviews} reviews)
                  </span>
                  <span>·</span>
                  <span>
                    <strong className="text-slate-800 font-bold">{freelancer.completed_jobs_count}</strong> jobs completed
                  </span>
                </div>
              </div>
            </div>

            {/* Actions & Rate */}
            <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 block sm:text-right">
                  Hourly Rate
                </span>
                <span className="text-2xl font-black text-blue-900 font-mono">
                  {formatUGX(freelancer.hourly_rate_ugx || 40000)}/hr
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => toggleFavoriteFreelancer(freelancer.id)}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    isFav
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'border-slate-200 text-slate-400 hover:text-red-500 hover:bg-slate-50'
                  }`}
                  title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                >
                  <Heart className={`w-5 h-5 ${isFav ? 'fill-red-600' : ''}`} />
                </button>

                <button
                  onClick={handleMessage}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Contact & Hire</span>
                </button>

                <button
                  onClick={() =>
                    setReportModalData({
                      targetType: 'user',
                      targetId: freelancer.id,
                      targetTitle: freelancer.full_name,
                    })
                  }
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Report user"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Bio & Portfolio */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-3">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                About {freelancer.full_name.split(' ')[0]}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {freelancer.bio}
              </p>
            </div>

            {/* Portfolio Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                  Portfolio & Completed Projects ({freelancer.portfolio.length})
                </h3>
              </div>

              {freelancer.portfolio.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4">
                  No portfolio items uploaded yet. Contact {freelancer.full_name} directly to request past work samples.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {freelancer.portfolio.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 overflow-hidden group hover:border-blue-400 transition-colors"
                    >
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-44 object-cover group-hover:scale-102 transition-transform duration-200"
                      />
                      <div className="p-4 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-blue-700">
                          {item.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {item.description}
                        </p>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 font-bold hover:underline pt-1"
                          >
                            <span>Visit Project</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Client Reviews Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                Client Reviews & Ratings ({freelancerReviews.length})
              </h3>

              {freelancerReviews.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4">
                  No public reviews yet.
                </p>
              ) : (
                <div className="space-y-4 divide-y divide-slate-100">
                  {freelancerReviews.map((rev) => (
                    <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.from_user_avatar}
                            alt={rev.from_user_name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              {rev.from_user_name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {formatDate(rev.created_at)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                      <p className="text-[11px] text-blue-700 font-medium">
                        Contract: {rev.project_title}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Skills & Verification */}
          <div className="space-y-6">
            {/* Skills */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Skills & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {freelancer.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Verification & Trust
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ugandan Phone & WhatsApp Verified</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>National ID / Passport Verified</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified MTN MoMo / Airtel Payout</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Passed Technical Skill Assessment</span>
                </div>
              </div>
            </div>

            {/* Platform Guarantee */}
            <div className="p-5 rounded-3xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Escrow Payment Guarantee</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                When you hire {freelancer.full_name}, your funds are protected in escrow until you verify the final deliverables.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
