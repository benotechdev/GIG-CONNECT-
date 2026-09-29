import React from 'react';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EventCard } from './EventCard';

export const FeaturedEvents: React.FC = () => {
  const { events, setCurrentView } = useApp();

  const featuredList = events.filter((e) => e.is_featured);

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Editor's Spotlight</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured Events
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-xl">
              Flagship festivals, international tours, and top concerts with guaranteed VIP experiences.
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
            <span>Explore All Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Featured Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredList.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} featured={true} />
          ))}
        </div>

      </div>
    </section>
  );
};
