import React from 'react';
import { CheckCircle2, Star, Users, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TopOrganizers: React.FC = () => {
  const { users, setSelectedOrganizerId, setCurrentView, favoriteOrganizerIds, toggleFavoriteOrganizer } = useApp();

  const organizers = users.filter((u) => u.role === 'organizer' || u.role === 'agency');

  const handleOrganizerClick = (orgId: string) => {
    setSelectedOrganizerId(orgId);
    setCurrentView('organizer-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold uppercase tracking-wider mb-2.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Verified Experience Creators</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Top Organizers
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-xl">
              Follow Uganda’s premier event brands, tour guides, and entertainment houses to never miss an announcement.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setCurrentView('organizers');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900 cursor-pointer self-start md:self-auto group"
          >
            <span>View All Organizers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Organizers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {organizers.slice(0, 4).map((org) => {
            const isFollowing = favoriteOrganizerIds.includes(org.id);

            return (
              <div
                key={org.id}
                onClick={() => handleOrganizerClick(org.id)}
                className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer text-center relative"
              >
                <div>
                  {/* Avatar */}
                  <div className="relative inline-block mx-auto mb-3">
                    <img
                      src={org.avatar_url}
                      alt={org.full_name}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-100 group-hover:ring-amber-300 transition-all mx-auto"
                    />
                    {org.is_verified && (
                      <span
                        className="absolute bottom-0 right-0 p-1 rounded-full bg-blue-600 text-white ring-2 ring-white"
                        title="Verified Organizer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                    {org.full_name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{org.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{org.location}</p>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-3 leading-relaxed">
                    {org.bio}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-around text-xs text-slate-600">
                    <div>
                      <span className="font-bold text-slate-900 block font-mono">
                        {org.events_count || 12}
                      </span>
                      <span className="text-[11px] text-slate-400">Events</span>
                    </div>

                    <div className="h-6 w-px bg-slate-200" />

                    <div>
                      <span className="font-bold text-amber-500 flex items-center justify-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {org.rating}
                      </span>
                      <span className="text-[11px] text-slate-400">Rating</span>
                    </div>

                    <div className="h-6 w-px bg-slate-200" />

                    <div>
                      <span className="font-bold text-slate-900 block font-mono">
                        {org.followers_count ? `${Math.round(org.followers_count / 1000)}k` : '5k'}
                      </span>
                      <span className="text-[11px] text-slate-400">Followers</span>
                    </div>
                  </div>

                  {/* Follow / View Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteOrganizer(org.id);
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isFollowing
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {isFollowing ? 'Following ✓' : '+ Follow Organizer'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Organizer Host Callout Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-blue-800/40">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase tracking-wider inline-block">
              Host With Us
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Are you planning a concert, trip, party, or school gala?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Publish your event in minutes, sell tickets in UGX with instant MTN MoMo & Airtel Money collections, and access real-time attendee check-in.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setCurrentView('create-event');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-sm shadow-md transition-all whitespace-nowrap cursor-pointer uppercase tracking-wider shrink-0"
          >
            Create & Publish Event
          </button>
        </div>

      </div>
    </section>
  );
};
