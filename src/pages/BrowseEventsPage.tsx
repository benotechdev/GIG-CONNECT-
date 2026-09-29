import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Filter,
  SlidersHorizontal,
  X,
  Sparkles,
  Flame,
  ArrowUpDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { EventCard } from '../components/EventCard';

interface BrowseEventsPageProps {
  initialCategory?: string;
  initialKeyword?: string;
}

export const BrowseEventsPage: React.FC<BrowseEventsPageProps> = ({
  initialCategory = '',
  initialKeyword = '',
}) => {
  const { events, setCurrentView } = useApp();

  const [keyword, setKeyword] = useState<string>(initialKeyword);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<'all' | 'weekend' | 'month'>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'under50k' | '50k-150k' | 'over150k'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'popular' | 'price-asc' | 'price-desc'>('date');

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const locations = [
    'All Uganda',
    'Kampala',
    'Jinja',
    'Entebbe',
    'Mbarara',
    'Gulu',
    'Fort Portal',
    'Kabale',
  ];

  // Filtering logic
  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        // Keyword
        if (keyword.trim()) {
          const q = keyword.toLowerCase();
          const matchTitle = event.title.toLowerCase().includes(q);
          const matchDesc = event.description.toLowerCase().includes(q);
          const matchVenue = event.venue.toLowerCase().includes(q);
          const matchOrg = event.organizer_name.toLowerCase().includes(q);
          const matchAct = event.activities.some((a) => a.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchVenue && !matchOrg && !matchAct) return false;
        }

        // Category
        if (selectedCategory && selectedCategory !== 'All Categories') {
          if (event.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
        }

        // Location
        if (selectedLocation && selectedLocation !== 'All Uganda') {
          const matchLoc =
            event.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
            event.city.toLowerCase().includes(selectedLocation.toLowerCase());
          if (!matchLoc) return false;
        }

        // Date filter
        if (dateFilter === 'weekend' && !event.is_weekend) return false;

        // Price filter
        if (priceFilter === 'free' && event.starting_price_ugx > 0) return false;
        if (priceFilter === 'under50k' && (event.starting_price_ugx === 0 || event.starting_price_ugx > 50000)) return false;
        if (priceFilter === '50k-150k' && (event.starting_price_ugx < 50000 || event.starting_price_ugx > 150000)) return false;
        if (priceFilter === 'over150k' && event.starting_price_ugx < 150000) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.attendees_count || 0) - (a.attendees_count || 0);
        if (sortBy === 'price-asc') return a.starting_price_ugx - b.starting_price_ugx;
        if (sortBy === 'price-desc') return b.starting_price_ugx - a.starting_price_ugx;
        // default date soonest
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
  }, [events, keyword, selectedCategory, selectedLocation, dateFilter, priceFilter, sortBy]);

  const clearAllFilters = () => {
    setKeyword('');
    setSelectedCategory('');
    setSelectedLocation('');
    setDateFilter('all');
    setPriceFilter('all');
    setSortBy('date');
  };

  const hasActiveFilters =
    Boolean(keyword) ||
    Boolean(selectedCategory) ||
    Boolean(selectedLocation) ||
    dateFilter !== 'all' ||
    priceFilter !== 'all';

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Explore Live Events in Uganda
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Concerts, parties, trips, festivals, school events, comedy & more.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCurrentView('create-event');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-sm transition-all cursor-pointer uppercase"
            >
              + Post an Event
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 sm:p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            
            {/* Search Input */}
            <div className="sm:col-span-5 relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                placeholder="Search event title, venue, or artist..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-slate-900"
              />
            </div>

            {/* Category Dropdown */}
            <div className="sm:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 bg-white text-slate-800 cursor-pointer"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Dropdown */}
            <div className="sm:col-span-2">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 bg-white text-slate-800 cursor-pointer"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc === 'All Uganda' ? '' : loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="sm:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 bg-white text-slate-800 cursor-pointer"
              >
                <option value="date">Date: Soonest First</option>
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

          </div>

          {/* Quick Filter Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-medium mr-1">Filter by:</span>

              <button
                type="button"
                onClick={() => setDateFilter(dateFilter === 'weekend' ? 'all' : 'weekend')}
                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  dateFilter === 'weekend'
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                🎉 This Weekend
              </button>

              <button
                type="button"
                onClick={() => setPriceFilter(priceFilter === 'free' ? 'all' : 'free')}
                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  priceFilter === 'free'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Free Events
              </button>

              <button
                type="button"
                onClick={() => setPriceFilter(priceFilter === 'under50k' ? 'all' : 'under50k')}
                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  priceFilter === 'under50k'
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Under UGX 50k
              </button>

              <button
                type="button"
                onClick={() => setPriceFilter(priceFilter === 'over150k' ? 'all' : 'over150k')}
                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  priceFilter === 'over150k'
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                VIP (150k+)
              </button>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>
            Showing <strong className="text-slate-900">{filteredEvents.length}</strong> events in Uganda
          </span>
          <span className="text-emerald-600 font-semibold">
            All tickets backed by MTN & Airtel MoMo guarantee
          </span>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No events matched your search criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your category, keyword, or location filters to see more events.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-6 py-2.5 rounded-xl bg-blue-700 text-white text-xs font-bold cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
