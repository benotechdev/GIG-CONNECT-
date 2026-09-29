import React from 'react';
import { Flame, ArrowRight, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EventCard } from './EventCard';

export const TrendingEvents: React.FC = () => {
  const { events, setCurrentView } = useApp();

  const trendingList = events.filter((e) => e.is_trending);

  return (
    <section className="py-14 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-300 text-xs font-bold uppercase tracking-wider mb-2.5">
              <Flame className="w-3.5 h-3.5 text-red-400 fill-red-400" />
              <span>High Demand & Viral</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Trending Events in Uganda
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-xl">
              Fastest selling tickets and most viewed experiences this week in Kampala and beyond.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setCurrentView('events');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 cursor-pointer self-start md:self-auto group"
          >
            <span>See What’s Buzzing</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Trending Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {trendingList.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

      </div>
    </section>
  );
};
