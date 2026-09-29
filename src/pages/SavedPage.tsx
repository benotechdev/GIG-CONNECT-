import React, { useState } from 'react';
import { Heart, Users, Calendar, ArrowRight, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EventCard } from '../components/EventCard';

export const SavedPage: React.FC = () => {
  const {
    events,
    users,
    savedEventIds,
    favoriteOrganizerIds,
    toggleSaveEvent,
    toggleFavoriteOrganizer,
    setSelectedOrganizerId,
    setCurrentView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'events' | 'organizers'>('events');

  const savedEvents = events.filter((e) => savedEventIds.includes(e.id));
  const followedOrganizers = users.filter((u) => favoriteOrganizerIds.includes(u.id));

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
            <span>SAVED EXPERIENCES</span>
            <span className="w-6 h-0.5 bg-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Saved Events & Organizers
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Keep track of upcoming concerts, festivals, parties, and organizers you follow.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 space-x-6 text-sm">
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 ${
              activeTab === 'events'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Saved Events ({savedEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('organizers')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 ${
              activeTab === 'organizers'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Followed Organizers ({followedOrganizers.length})
          </button>
        </div>

        {/* Events tab */}
        {activeTab === 'events' && (
          <div>
            {savedEvents.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">No saved events yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the heart icon on any event to bookmark it for later!
                </p>
                <button
                  onClick={() => setCurrentView('events')}
                  className="px-5 py-2.5 rounded-xl bg-blue-700 text-white font-bold text-xs cursor-pointer"
                >
                  Browse Events
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedEvents.map((evt) => (
                  <EventCard key={evt.id} event={evt} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Organizers tab */}
        {activeTab === 'organizers' && (
          <div>
            {followedOrganizers.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <Users className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">You haven’t followed any organizers yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Follow top producers and tour clubs to stay updated on new festival releases and ticket drops.
                </p>
                <button
                  onClick={() => setCurrentView('organizers')}
                  className="px-5 py-2.5 rounded-xl bg-blue-700 text-white font-bold text-xs cursor-pointer"
                >
                  Browse Organizers
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {followedOrganizers.map((org) => (
                  <div
                    key={org.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={org.avatar_url}
                        alt={org.full_name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-base text-slate-900 truncate">{org.full_name}</h4>
                        <p className="text-xs text-slate-500 truncate">{org.title}</p>
                        <p className="text-[11px] text-slate-400">{org.location}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setSelectedOrganizerId(org.id);
                          setCurrentView('organizer-detail');
                        }}
                        className="font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                      >
                        View Events <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => toggleFavoriteOrganizer(org.id)}
                        className="text-red-600 hover:text-red-700 text-xs font-semibold cursor-pointer"
                      >
                        Unfollow
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
