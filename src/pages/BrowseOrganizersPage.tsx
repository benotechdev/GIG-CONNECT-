import React, { useState } from 'react';
import {
  Search,
  MapPin,
  CheckCircle2,
  Star,
  Users,
  Calendar,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BrowseOrganizersPage: React.FC = () => {
  const { users, setSelectedOrganizerId, setCurrentView, favoriteOrganizerIds, toggleFavoriteOrganizer } = useApp();

  const [keyword, setKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const organizers = users.filter((u) => u.role === 'organizer' || u.role === 'agency');

  const filteredOrganizers = organizers.filter((org) => {
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      const matchName = org.full_name.toLowerCase().includes(q);
      const matchTitle = org.title.toLowerCase().includes(q);
      const matchBio = org.bio.toLowerCase().includes(q);
      if (!matchName && !matchTitle && !matchBio) return false;
    }

    if (selectedLocation) {
      if (!org.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
    }

    return true;
  });

  const handleOrganizerClick = (orgId: string) => {
    setSelectedOrganizerId(orgId);
    setCurrentView('organizer-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Top Event Organizers in Uganda
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Follow Uganda’s best concert promoters, adventure clubs, and festival creators.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setCurrentView('create-event');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-sm transition-all cursor-pointer uppercase self-start sm:self-auto"
          >
            + Register as Organizer
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
            <input
              type="text"
              placeholder="Search organizer by name, festival, or genre..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-slate-900"
            />
          </div>

          <div className="sm:w-48">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 bg-white text-slate-800 cursor-pointer"
            >
              <option value="">All Locations</option>
              <option value="Kampala">Kampala</option>
              <option value="Jinja">Jinja</option>
              <option value="Entebbe">Entebbe</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizers.map((org) => {
            const isFollowing = favoriteOrganizerIds.includes(org.id);

            return (
              <div
                key={org.id}
                onClick={() => handleOrganizerClick(org.id)}
                className="group p-6 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer space-y-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={org.avatar_url}
                    alt={org.full_name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-amber-300 transition-all shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                        {org.full_name}
                      </h3>
                      {org.is_verified && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{org.title}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-red-400" />
                      <span>{org.location}</span>
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {org.bio}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">
                      {org.events_count || 12} <span className="text-slate-400 font-normal">events</span>
                    </span>
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{org.rating}</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteOrganizer(org.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isFollowing
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {isFollowing ? 'Following ✓' : '+ Follow'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
