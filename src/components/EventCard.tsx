import React from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Heart,
  Share2,
  CheckCircle2,
  Flame,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { EventItem } from '../types';
import { useApp } from '../context/AppContext';
import { formatUGX } from '../utils/formatters';

interface EventCardProps {
  event: EventItem;
  featured?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, featured = false }) => {
  const {
    setSelectedEventId,
    setCurrentView,
    savedEventIds,
    toggleSaveEvent,
    setTicketBookingModalEvent,
    setShareModalEvent,
  } = useApp();

  const isSaved = savedEventIds.includes(event.id);

  // Format date nicely e.g. "Sat, Oct 18, 2026"
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-UG', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleCardClick = () => {
    setSelectedEventId(event.id);
    setCurrentView('event-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col cursor-pointer ${
        featured ? 'ring-2 ring-amber-400/30' : ''
      }`}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-900">
        <img
          src={event.poster_url}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient shadow overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/85 backdrop-blur-md text-amber-300 border border-slate-700/60 shadow-xs">
              {event.category}
            </span>

            {event.is_trending && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-600/90 text-white backdrop-blur-md flex items-center gap-1 shadow-xs">
                <Flame className="w-3 h-3 fill-white" />
                <span>Trending</span>
              </span>
            )}

            {event.is_featured && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950 backdrop-blur-md flex items-center gap-0.5 shadow-xs">
                <Sparkles className="w-3 h-3 fill-slate-950" />
                <span>Featured</span>
              </span>
            )}
          </div>

          {/* Quick Action Buttons: Heart & Share */}
          <div className="flex items-center gap-1 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShareModalEvent(event);
              }}
              className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white hover:text-amber-400 backdrop-blur-md border border-white/20 transition-all cursor-pointer"
              title="Share Event"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveEvent(event.id);
              }}
              className={`p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                isSaved
                  ? 'bg-red-500 text-white border-red-400'
                  : 'bg-slate-900/80 hover:bg-slate-900 text-white hover:text-red-400 border-white/20'
              }`}
              title={isSaved ? 'Remove from Saved' : 'Save Event'}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom Banner on Image: Date & Venue */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs pointer-events-none">
          <div className="flex items-center gap-1.5 font-semibold text-amber-300 drop-shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{formatDate(event.date)}</span>
            <span className="text-white/60">·</span>
            <span className="text-white drop-shadow-sm font-medium">{event.time.split(' - ')[0]}</span>
          </div>

          <div className="flex items-center gap-1 text-slate-200 text-[11px] truncate max-w-[45%]">
            <MapPin className="w-3 h-3 text-red-400 shrink-0" />
            <span className="truncate">{event.city}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1 leading-snug">
            {event.title}
          </h3>

          <p className="text-xs text-slate-500 flex items-center gap-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-700">{event.venue}</span>
            <span>·</span>
            <span>{event.location}</span>
          </p>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
            {event.description}
          </p>
        </div>

        {/* Organizer info */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={event.organizer_avatar}
              alt={event.organizer_name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
            />
            <span className="truncate font-medium text-slate-700">{event.organizer_name}</span>
            {event.organizer_verified && (
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" title="Verified Organizer" />
            )}
          </div>

          <span className="text-[11px] text-slate-400 shrink-0">
            {event.attendees_count > 0 ? `${event.attendees_count} going` : 'Selling fast'}
          </span>
        </div>

        {/* Card Footer: Price & Bold Ticket Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Tickets from</span>
            <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
              {event.starting_price_ugx === 0 ? (
                <span className="text-emerald-600 uppercase font-sans">Free Entry</span>
              ) : (
                <span className="text-blue-800">{formatUGX(event.starting_price_ugx)}</span>
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setTicketBookingModalEvent(event);
            }}
            className="px-4 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer uppercase"
          >
            <Ticket className="w-4 h-4 text-slate-950" />
            <span>Get Tickets</span>
          </button>
        </div>
      </div>
    </div>
  );
};
