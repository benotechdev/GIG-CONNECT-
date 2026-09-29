import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Ticket,
  Users,
  Play,
  Pause,
  ChevronRight,
  BadgeCheck,
  Flame,
  Star,
  Coins,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { formatUGX } from '../utils/formatters';

interface HeroSectionProps {
  onSearch: (keyword: string, category: string, location: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const {
    setCurrentView,
    setSelectedEventId,
    setSelectedOrganizerId,
    setRolesModalOpen,
    setPaymentDocsModalOpen,
    setTicketBookingModalEvent,
    events,
  } = useApp();

  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<'normal' | 'fast'>('normal');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword, category, location);
    setCurrentView('events');
  };

  const trendingTags = [
    { label: 'Blankets & Wine', cat: 'Festivals' },
    { label: 'Nyege Nyege', cat: 'Festivals' },
    { label: 'Comedy Store UG', cat: 'Comedy' },
    { label: 'Jinja Nile Rafting', cat: 'Trips' },
    { label: 'Swangz All-Star', cat: 'Concerts' },
    { label: 'Rooftop Sundowner', cat: 'Parties' },
    { label: 'Rugby 7s Derby', cat: 'Sports' },
  ];

  // Dynamic cards for background ticker moving to the right
  const row1Cards = [
    {
      type: 'event' as const,
      id: 'event-1',
      title: 'Blankets & Wine Kampala 2026',
      organizer: 'Talent Africa Group',
      location: 'Lugogo Cricket Oval, Kampala',
      price: 80000,
      badge: 'Selling Fast',
      date: 'Oct 18, 2026',
      poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
    },
    {
      type: 'organizer' as const,
      id: 'user-org-1',
      name: 'Talent Africa Group',
      title: 'Premier Festival & Concert Producer',
      location: 'Kampala, Kololo',
      rating: 4.95,
      followers: '14.2k',
      avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80',
      badge: 'Verified Creator',
    },
    {
      type: 'booking' as const,
      id: 'tx-live-1',
      amount: 160000,
      title: '2x Early Bird Tickets Booked',
      detail: 'Blankets & Wine via MTN MoMo',
      time: 'Just now',
      gateway: 'MTN MoMo',
    },
    {
      type: 'event' as const,
      id: 'event-2',
      title: 'Nyege Nyege International Festival 2026',
      organizer: 'Talent Africa Group',
      location: 'Itanda Falls, Jinja',
      price: 160000,
      badge: '4-Day Festival',
      date: 'Nov 5 - 8, 2026',
      poster: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
    },
    {
      type: 'organizer' as const,
      id: 'user-org-2',
      name: 'Swangz Avenue Events',
      title: 'Music Powerhouse & Live Shows',
      location: 'Kampala, Industrial Area',
      rating: 4.98,
      followers: '21.8k',
      avatar: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=200&q=80',
      badge: 'Top Rated',
    },
    {
      type: 'booking' as const,
      id: 'tx-live-2',
      amount: 400000,
      title: 'VIP Table of 5 Confirmed',
      detail: 'Comedy Store UG via Airtel Money',
      time: '3 mins ago',
      gateway: 'Airtel Money',
    },
  ];

  const row2Cards = [
    {
      type: 'event' as const,
      id: 'event-3',
      title: 'Comedy Store UG Live with Alex Muhangi',
      organizer: 'Comedy Store Uganda',
      location: 'UMA Multipurpose Hall, Lugogo',
      price: 25000,
      badge: 'This Thursday',
      date: 'Oct 8, 2026',
      poster: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=400&q=80',
    },
    {
      type: 'organizer' as const,
      id: 'user-org-4',
      name: 'Rough Riders Adventure Club',
      title: 'White Water Rafting & Island Camping',
      location: 'Jinja & Kampala',
      rating: 4.96,
      followers: '8.9k',
      avatar: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=200&q=80',
      badge: 'Adventure Leader',
    },
    {
      type: 'event' as const,
      id: 'event-5',
      title: 'Jinja Nile White Water Rafting Weekend',
      organizer: 'Rough Riders Adventure Club',
      location: 'Explorers River Camp, Jinja',
      price: 180000,
      badge: 'Grade 5 Rafting',
      date: 'Oct 24, 2026',
      poster: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80',
    },
    {
      type: 'booking' as const,
      id: 'tx-live-3',
      amount: 320000,
      title: 'Full Weekend Tour Booked',
      detail: 'Jinja Rafting & Camping Package',
      time: '8 mins ago',
      gateway: 'MTN MoMo',
    },
    {
      type: 'event' as const,
      id: 'event-4',
      title: 'Sip & Paint Kampala Sunset Rooftop',
      organizer: 'David Ssekandi',
      location: 'Skyz Hotel Rooftop, Naguru',
      price: 75000,
      badge: 'Wine & Art',
      date: 'Oct 10, 2026',
      poster: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80',
    },
    {
      type: 'booking' as const,
      id: 'tx-live-4',
      amount: 1500000,
      title: 'Platinum Table Reserved',
      detail: 'Swangz All-Star Concert VIP',
      time: '15 mins ago',
      gateway: 'Direct MoMo',
    },
  ];

  const handleCardClick = (card: any) => {
    if (card.type === 'event') {
      setSelectedEventId(card.id);
      setCurrentView('event-detail');
    } else if (card.type === 'organizer') {
      setSelectedOrganizerId(card.id);
      setCurrentView('organizer-detail');
    } else if (card.type === 'booking') {
      setPaymentDocsModalOpen(true);
    }
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-800/80">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[520px] h-[520px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[550px] h-[550px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Grid texture for modern aesthetic */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 0H0V1V40H1V1H40V0H1Z' fill='white'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ========================================================================= */}
      {/* BACKGROUND SCROLLING CARDS IN DESIGNED ORIENTATION (MOVING TO THE RIGHT)   */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="relative w-full h-full flex flex-col justify-around py-4 hero-tilted-band opacity-45 hover:opacity-75 transition-opacity duration-500">
          
          {/* TRACK 1: Moving to the RIGHT */}
          <div className="relative w-full overflow-hidden flex pointer-events-auto">
            <div
              className={`flex items-center gap-4 ${
                speedMultiplier === 'fast' ? 'animate-scroll-right-fast' : 'animate-scroll-right-slow'
              } ${isAnimationPaused ? 'animation-paused' : ''}`}
            >
              {[...row1Cards, ...row1Cards].map((card, idx) => (
                <div
                  key={`hero-track1-${idx}`}
                  onClick={() => handleCardClick(card)}
                  className="w-[280px] sm:w-[320px] p-3.5 sm:p-4 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-800/90 hover:border-amber-400/80 hover:bg-slate-900/95 transition-all duration-200 cursor-pointer shadow-xl hover:shadow-amber-500/10 hover:scale-[1.03] group shrink-0"
                >
                  {card.type === 'event' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-semibold text-amber-400 flex items-center gap-1">
                          <Ticket className="w-3.5 h-3.5" />
                          <span>Live Event</span>
                        </span>
                        <span className="text-amber-300 font-bold bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full text-[10px]">
                          {card.badge}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                        {card.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {card.organizer} · <span className="text-slate-300">{card.location}</span>
                      </p>
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-amber-400">
                          From {formatUGX(card.price)}
                        </span>
                        <span className="text-[11px] text-slate-400 group-hover:text-white transition-colors flex items-center gap-1 font-medium">
                          Get Tickets <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  )}

                  {card.type === 'organizer' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-semibold text-blue-400 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>Top Organizer</span>
                        </span>
                        <span className="text-blue-300 font-medium bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded-full text-[10px]">
                          {card.badge}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <img
                          src={card.avatar}
                          alt={card.name}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/40"
                        />
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                            {card.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate">{card.title}</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-emerald-400">
                          {card.followers} Followers
                        </span>
                        <span className="text-[11px] text-amber-400 flex items-center gap-0.5 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {card.rating}
                        </span>
                      </div>
                    </div>
                  )}

                  {card.type === 'booking' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-emerald-400 flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5" />
                          <span>Live Ticket Sale</span>
                        </span>
                        <span className="text-amber-400 font-mono text-[10px] bg-amber-950/50 border border-amber-800/50 px-2 py-0.5 rounded-full">
                          {card.gateway}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-emerald-300 group-hover:text-white transition-colors">
                        {formatUGX(card.amount)}
                      </h4>
                      <p className="text-xs text-slate-300 line-clamp-1">{card.detail}</p>
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="text-emerald-400/90 font-medium">Instant E-Ticket Issued</span>
                        <span>{card.time}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* TRACK 2: Also Moving to the RIGHT */}
          <div className="relative w-full overflow-hidden flex pointer-events-auto mt-2">
            <div
              className={`flex items-center gap-4 ${
                speedMultiplier === 'fast' ? 'animate-scroll-right-fast' : 'animate-scroll-right'
              } ${isAnimationPaused ? 'animation-paused' : ''}`}
            >
              {[...row2Cards, ...row2Cards].map((card, idx) => (
                <div
                  key={`hero-track2-${idx}`}
                  onClick={() => handleCardClick(card)}
                  className="w-[280px] sm:w-[320px] p-3.5 sm:p-4 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-800/90 hover:border-emerald-400/80 hover:bg-slate-900/95 transition-all duration-200 cursor-pointer shadow-xl hover:shadow-emerald-500/10 hover:scale-[1.03] group shrink-0"
                >
                  {card.type === 'event' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-semibold text-emerald-400 flex items-center gap-1">
                          <Ticket className="w-3.5 h-3.5" />
                          <span>Upcoming Experience</span>
                        </span>
                        <span className="text-emerald-300 font-bold bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full text-[10px]">
                          {card.badge}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                        {card.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {card.organizer} · <span className="text-slate-300">{card.location}</span>
                      </p>
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-amber-400">
                          From {formatUGX(card.price)}
                        </span>
                        <span className="text-[11px] text-slate-400 group-hover:text-white transition-colors flex items-center gap-1 font-medium">
                          Book Now <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  )}

                  {card.type === 'organizer' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-semibold text-blue-400 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>Adventure Club</span>
                        </span>
                        <span className="text-blue-300 font-medium bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded-full text-[10px]">
                          {card.badge}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <img
                          src={card.avatar}
                          alt={card.name}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/40"
                        />
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                            {card.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate">{card.title}</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-emerald-400">
                          {card.followers} Followers
                        </span>
                        <span className="text-[11px] text-amber-400 flex items-center gap-0.5 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {card.rating}
                        </span>
                      </div>
                    </div>
                  )}

                  {card.type === 'booking' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-amber-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Instant Ticket Push</span>
                        </span>
                        <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/50 border border-emerald-800/50 px-2 py-0.5 rounded-full">
                          {card.gateway}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-amber-300 group-hover:text-white transition-colors">
                        {formatUGX(card.amount)}
                      </h4>
                      <p className="text-xs text-slate-300 line-clamp-1">{card.detail}</p>
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="text-emerald-400/90 font-medium">QR Pass Generated</span>
                        <span>{card.time}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Masking gradients on left & right edges */}
        <div className="absolute inset-y-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-slate-950 via-slate-950/90 to-transparent pointer-events-none" />
      </div>

      {/* Layer Vignette Overlay for Crisp Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/95 pointer-events-none" />

      {/* ========================================================================= */}
      {/* FOREGROUND HERO CONTENT: PUNCHY COPY, BOLD BUTTONS, FAST SEARCH & METRICS */}
      {/* ========================================================================= */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Control Badge */}
        <div className="flex items-center justify-between max-w-5xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300 backdrop-blur-md shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-amber-400 font-bold">Uganda's Events & Entertainment Hub</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300 hidden sm:inline">Pay & Earn in UGX via MTN & Airtel MoMo</span>
          </div>

          {/* Quick interactive controls for background cards */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded-full px-3 py-1 text-[11px] text-slate-400 backdrop-blur-md">
            <span className="hidden md:inline text-slate-400 mr-1">Live Feed:</span>
            <button
              type="button"
              onClick={() => setIsAnimationPaused(!isAnimationPaused)}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer font-medium"
              title={isAnimationPaused ? 'Resume live cards' : 'Pause live cards'}
            >
              {isAnimationPaused ? (
                <>
                  <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>Pause</span>
                </>
              )}
            </button>
            <span className="text-slate-700">|</span>
            <button
              type="button"
              onClick={() => setSpeedMultiplier(speedMultiplier === 'normal' ? 'fast' : 'normal')}
              className={`hover:text-white transition-colors cursor-pointer ${
                speedMultiplier === 'fast' ? 'text-amber-400 font-bold' : 'text-slate-400'
              }`}
            >
              {speedMultiplier === 'fast' ? 'Fast' : 'Normal'}
            </button>
          </div>
        </div>

        {/* Central Hero Headline: Discover Events. Create Experiences. */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
            Discover Events.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-200">
              Create Experiences.
            </span>
          </h1>

          <p className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Your all-in-one Ugandan platform for concerts, festivals, parties, Nile rafting trips, comedy nights, and school galas.
            Instant e-tickets paid in <span className="text-amber-400 font-semibold">UGX</span> via MTN MoMo & Airtel Money.
          </p>

          {/* ===================================================================== */}
          {/* BOLD ACTION BUTTONS (HIGH CONTRAST, TACTILE, CLEAR NEXT ACTIONS)       */}
          {/* ===================================================================== */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            
            {/* Primary Action Button: Explore Events */}
            <button
              type="button"
              onClick={() => {
                setCurrentView('events');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm sm:text-base tracking-wide shadow-xl shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer uppercase"
            >
              <Ticket className="w-5 h-5 text-slate-950 shrink-0" />
              <span>Explore Live Events</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            {/* Secondary Action Button: Publish / Host an Event */}
            <button
              type="button"
              onClick={() => {
                setCurrentView('create-event');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3.5 sm:px-7 sm:py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm sm:text-base border border-slate-700/80 hover:border-slate-500 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg backdrop-blur-md"
            >
              <Calendar className="w-5 h-5 text-blue-400 shrink-0" />
              <span>Host an Event</span>
            </button>

            {/* Feature Action Button: MoMo Ticket Guarantee */}
            <button
              type="button"
              onClick={() => setPaymentDocsModalOpen(true)}
              className="px-5 py-3.5 sm:py-4 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 font-bold text-xs sm:text-sm border border-emerald-700/60 hover:border-emerald-500 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg backdrop-blur-md"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>UGX Ticket Protection</span>
            </button>

            {/* Role Architecture Explorer Button */}
            <button
              type="button"
              onClick={() => setRolesModalOpen(true)}
              className="px-5 py-3.5 sm:py-4 rounded-xl bg-blue-950/50 hover:bg-blue-900/60 text-blue-300 font-bold text-xs sm:text-sm border border-blue-700/60 hover:border-blue-500 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg backdrop-blur-md"
            >
              <BadgeCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Test User Roles (RBAC)</span>
            </button>
          </div>

          {/* ===================================================================== */}
          {/* FAST SEARCH BAR (SEARCH, LOCATION, CATEGORY, INSTANT SUBMISSION)       */}
          {/* ===================================================================== */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 p-2.5 sm:p-3 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-900 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              
              {/* Keyword input */}
              <div className="sm:col-span-4 relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 shrink-0" />
                <input
                  type="text"
                  placeholder="Concert, party, trip, comedy, artist..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 text-sm rounded-xl focus:outline-hidden focus:bg-slate-50 text-slate-900 placeholder:text-slate-400 font-medium"
                />
              </div>

              {/* Location dropdown */}
              <div className="sm:col-span-3 relative flex items-center sm:border-l sm:border-slate-200 sm:pl-2">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-4 shrink-0 pointer-events-none" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-6 py-3 text-sm rounded-xl focus:outline-hidden focus:bg-slate-50 text-slate-800 bg-white cursor-pointer appearance-none font-medium"
                >
                  <option value="">All Locations</option>
                  <option value="Kampala">Kampala</option>
                  <option value="Jinja">Jinja</option>
                  <option value="Entebbe">Entebbe</option>
                  <option value="Mbarara">Mbarara</option>
                  <option value="Gulu">Gulu</option>
                  <option value="Fort Portal">Fort Portal</option>
                  <option value="Kabale">Kabale</option>
                </select>
              </div>

              {/* Category dropdown */}
              <div className="sm:col-span-3 relative flex items-center sm:border-l sm:border-slate-200 sm:pl-2">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-4 shrink-0 pointer-events-none" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-9 pr-6 py-3 text-sm rounded-xl focus:outline-hidden focus:bg-slate-50 text-slate-800 bg-white cursor-pointer appearance-none font-medium truncate"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bold Search submit button */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full h-full min-h-[48px] px-5 py-3 bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </form>

          {/* Fast Popular Tags */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-400">
            <span className="font-semibold text-slate-300 mr-1">Trending Experiences:</span>
            {trendingTags.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => {
                  setKeyword(tag.label);
                  setCategory(tag.cat);
                  onSearch(tag.label, tag.cat, '');
                  setCurrentView('events');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer text-[11px] font-medium"
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* ===================================================================== */}
          {/* SAFE & FAST TRUST PILLARS BAR (METRICS, SPEED & SECURITY ASSURANCE)   */}
          {/* ===================================================================== */}
          <div className="mt-10 pt-6 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            
            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 text-left flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-amber-400 font-mono">180+ Live</p>
                <p className="text-xs text-slate-400 mt-0.5">Events Across Uganda</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 text-left flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-emerald-400 font-mono">UGX 1.2B+</p>
                <p className="text-xs text-slate-400 mt-0.5">Tickets Sold in UGX</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 text-left flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-blue-400 font-mono">100% Verified</p>
                <p className="text-xs text-slate-400 mt-0.5">Anti-Counterfeit QR Pass</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 text-left flex items-start gap-3">
              <div className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-yellow-300 font-mono">&lt; 30 Secs</p>
                <p className="text-xs text-slate-400 mt-0.5">MoMo USSD Push Checkout</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
