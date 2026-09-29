import React from 'react';
import { PartyPopper, ArrowRight, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EventCard } from './EventCard';

export const WeekendEvents: React.FC = () => {
  const { events, setCurrentView } = useApp();

  const weekendList = events.filter((e) => e.is_weekend);

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-2.5">
              <PartyPopper className="w-3.5 h-3.5 text-emerald-600" />
              <span>Weekend Plans Made Easy</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Weekend Events
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-xl">
              Don’t stay indoors this Friday, Saturday & Sunday. Discover trips, sunset cruises, rugby derbies, and concerts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setCurrentView('events');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900 cursor-pointer self-start md:self-auto group"
          >
            <span>All Weekend Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Weekend Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {weekendList.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

      </div>
    </section>
  );
};
