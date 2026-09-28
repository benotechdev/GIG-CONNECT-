import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Star,
  CheckCircle2,
  Heart,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUGX } from '../utils/formatters';

export const BrowseFreelancersPage: React.FC = () => {
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

  const [keyword, setKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [maxHourlyRate, setMaxHourlyRate] = useState<number>(100000);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);

  const freelancers = useMemo(() => {
    return users
      .filter((u) => u.role === 'freelancer')
      .filter((u) => {
        // Keyword
        if (keyword.trim()) {
          const q = keyword.toLowerCase();
          const matchName = u.full_name.toLowerCase().includes(q);
          const matchTitle = u.title.toLowerCase().includes(q);
          const matchBio = u.bio.toLowerCase().includes(q);
          const matchSkills = u.skills.some((s) => s.toLowerCase().includes(q));
          if (!matchName && !matchTitle && !matchBio && !matchSkills) return false;
        }

        // Location
        if (selectedLocation !== 'all') {
          if (!u.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
        }

        // Rate
        if ((u.hourly_rate_ugx || 40000) > maxHourlyRate) return false;

        // Verified
        if (verifiedOnly && !u.is_verified) return false;

        // Featured
        if (featuredOnly && !u.is_featured) return false;

        // Rating
        if (u.rating < minRating) return false;

        return true;
      })
      .sort((a, b) => {
        if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
        return b.rating - a.rating;
      });
  }, [users, keyword, selectedLocation, maxHourlyRate, verifiedOnly, featuredOnly, minRating]);

  const handleSelectFreelancer = (id: string) => {
    setSelectedFreelancerId(id);
    setCurrentView('freelancer-detail');
  };

  const handleMessage = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setActiveConversationUserId(id);
    setCurrentView('messages');
  };

  const locations = ['Kampala', 'Entebbe', 'Jinja', 'Mbarara', 'Gulu', 'Wakiso'];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
            <span>UGANDAN TALENT POOL</span>
            <span className="w-6 h-0.5 bg-amber-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Discover Top Ugandan Freelancers
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Hire pre-vetted local software engineers, UI/UX designers, copywriters, and consultants ready to deliver in UGX.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-8 relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                placeholder="Search by skill (e.g. React, Flutter, Figma, SEO, Legal, Accounting)..."
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
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-blue-600 cursor-pointer"
              >
                <option value="all">All Uganda Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc} Region
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-amber-500" />
                  Filter Talent
                </span>
                {(keyword || selectedLocation !== 'all' || verifiedOnly || featuredOnly || minRating > 0) && (
                  <button
                    onClick={() => {
                      setKeyword('');
                      setSelectedLocation('all');
                      setMaxHourlyRate(100000);
                      setVerifiedOnly(false);
                      setFeaturedOnly(false);
                      setMinRating(0);
                    }}
                    className="text-[11px] text-amber-700 font-bold hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Max Hourly Rate */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-bold text-slate-700">Max Rate</span>
                  <span className="font-mono font-bold text-blue-800">
                    {formatUGX(maxHourlyRate)}/hr
                  </span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="150000"
                  step="5000"
                  value={maxHourlyRate}
                  onChange={(e) => setMaxHourlyRate(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Minimum Rating
                </label>
                <div className="space-y-1 text-xs text-slate-600">
                  {[0, 4.5, 4.8].map((r) => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="ratingFilter"
                        checked={minRating === r}
                        onChange={() => setMinRating(r)}
                        className="text-amber-500"
                      />
                      <span>{r === 0 ? 'Any Rating' : `${r}★ & above`}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Checkbox Toggles */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Verified Freelancers Only</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(e) => setFeaturedOnly(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span>Featured Talent Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Freelancers List */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-3 px-1">
              <span>
                Found <strong className="text-slate-900 font-bold">{freelancers.length}</strong> Ugandan specialists
              </span>
            </div>

            {freelancers.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">No freelancers match criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your filters or search terms to discover more talent across Uganda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {freelancers.map((freelancer) => {
                  const isFav = favoriteFreelancerIds.includes(freelancer.id);

                  return (
                    <div
                      key={freelancer.id}
                      onClick={() => handleSelectFreelancer(freelancer.id)}
                      className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer group relative"
                    >
                      {freelancer.is_featured && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-xs">
                            <Sparkles className="w-2.5 h-2.5" />
                            Featured
                          </span>
                        </div>
                      )}

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
                        title="Save to favorites"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-red-600' : ''}`} />
                      </button>

                      <div className="p-5">
                        <div className="flex flex-col items-center text-center">
                          <div className="relative mb-3">
                            <img
                              src={freelancer.avatar_url}
                              alt={freelancer.full_name}
                              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
                            />
                            {freelancer.is_verified && (
                              <div className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-xs">
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

                          <div className="flex items-center gap-1.5 mt-2 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-bold text-amber-900">
                              {freelancer.rating.toFixed(1)}
                            </span>
                            <span className="text-[11px] text-amber-700">
                              ({freelancer.total_reviews})
                            </span>
                          </div>
                        </div>

                        {/* Skills */}
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

                      {/* Footer */}
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
                            onClick={(e) => handleMessage(e, freelancer.id)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-700 hover:bg-white transition-colors cursor-pointer"
                            title="Direct Message"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-bold text-blue-700 group-hover:translate-x-0.5 transition-transform">
                            View &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
