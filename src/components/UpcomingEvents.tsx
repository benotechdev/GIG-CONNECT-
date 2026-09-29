import React, { useState } from 'react';
import { Calendar, ArrowRight, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EventCard } from './EventCard';

export const UpcomingEvents: React.FC = () => {
  const { events, setCurrentView } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Concerts',
    'Parties',
    'Festivals',
    'Trips',
    'Sports',
    'Comedy',
    'Workshops',
  ];

  const filteredEvents =
    selectedCategory === 'All'
      ? events
      : events.filter((e) => e.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold uppercase tracking-wider mb-2.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Live Entertainment Schedule</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Upcoming Events
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-xl">
              Discover what’s happening in Kampala, Jinja, Entebbe, and across Uganda this month.
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
            <span>View Full Calendar</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredEvents.slice(0, 6).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => {
              setCurrentView('events');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Explore All {events.length} Live Events</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
