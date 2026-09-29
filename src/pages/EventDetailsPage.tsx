import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Heart,
  Share2,
  CheckCircle2,
  Star,
  Users,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ArrowRight,
  Flame,
  MessageSquare,
  Building,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUGX } from '../utils/formatters';
import { EventCountdown } from '../components/EventCountdown';
import { EventCard } from '../components/EventCard';

export const EventDetailsPage: React.FC = () => {
  const {
    events,
    selectedEventId,
    setCurrentView,
    savedEventIds,
    toggleSaveEvent,
    setTicketBookingModalEvent,
    setShareModalEvent,
    setSelectedOrganizerId,
    users,
    reviews,
    submitReview,
    currentUser,
  } = useApp();

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'about' | 'tickets' | 'lineup' | 'reviews'>('about');

  const event = events.find((e) => e.id === selectedEventId) || events[0];

  if (!event) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto px-4">
        <p className="text-slate-500 mb-4">Event not found.</p>
        <button
          onClick={() => setCurrentView('events')}
          className="px-6 py-2.5 bg-blue-700 text-white font-bold rounded-xl"
        >
          Back to Events
        </button>
      </div>
    );
  }

  const isSaved = savedEventIds.includes(event.id);
  const organizer = users.find((u) => u.id === event.organizer_id);
  const eventReviews = reviews.filter((r) => r.project_id === event.id);

  // Similar events in same category
  const similarEvents = events
    .filter((e) => e.id !== event.id && e.category === event.category)
    .slice(0, 3);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    submitReview(event.id, event.organizer_id, reviewRating, reviewComment.trim());
    setReviewComment('');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setCurrentView('events');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Events</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShareModalEvent(event)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              type="button"
              onClick={() => toggleSaveEvent(event.id)}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-500' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Banner with Poster & Live Countdown */}
      <div className="relative bg-slate-950 text-white overflow-hidden">
        {/* Blurred background backdrop */}
        <div
          className="absolute inset-0 opacity-25 filter blur-3xl scale-110 pointer-events-none"
          style={{
            backgroundImage: `url(${event.poster_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Poster Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 max-w-lg mx-auto bg-slate-900">
                <img
                  src={event.poster_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/90 text-amber-300 border border-slate-700/80 backdrop-blur-md">
                    {event.category}
                  </span>
                  {event.is_trending && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white flex items-center gap-1 shadow-md">
                      <Flame className="w-3 h-3 fill-white" />
                      <span>Trending</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Event Meta */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Countdown Component */}
              <div className="flex items-center gap-3">
                <EventCountdown targetDate={event.date} className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 backdrop-blur-md" />
                {event.attendees_count > 0 && (
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
                    {event.attendees_count} people booked
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {event.title}
              </h1>

              {event.tagline && (
                <p className="text-base sm:text-lg text-amber-300/90 font-medium">
                  {event.tagline}
                </p>
              )}

              {/* Event Date, Time, Venue Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Date & Day</span>
                    <span className="text-sm font-bold text-white">{event.date}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Event Time</span>
                    <span className="text-sm font-bold text-white">{event.time}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 sm:col-span-2">
                  <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block font-medium">Venue & Location</span>
                    <span className="text-sm font-bold text-white truncate block">
                      {event.venue}, {event.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Action CTA inside Hero */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setTicketBookingModalEvent(event)}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-95 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  <Ticket className="w-5 h-5 text-slate-950" />
                  <span>
                    Get Tickets (From {event.starting_price_ugx === 0 ? 'Free' : formatUGX(event.starting_price_ugx)})
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Instant MTN MoMo & Airtel Money STK Push</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Details, Lineup, Activities, Reviews */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
              {(['about', 'tickets', 'lineup', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab === 'about' && 'About Event'}
                  {tab === 'tickets' && `Ticket Options (${event.ticket_tiers.length})`}
                  {tab === 'lineup' && `Lineup & Artists (${event.lineup?.length || 0})`}
                  {tab === 'reviews' && `Reviews (${eventReviews.length})`}
                </button>
              ))}
            </div>

            {/* TAB: About */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-xl font-extrabold text-slate-900">Experience Overview</h3>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </div>

                {/* Activities Checklist */}
                {event.activities && event.activities.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                    <h3 className="text-lg font-extrabold text-slate-900">What to Expect & Activities</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {event.activities.map((act, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Venue & Directions */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-lg font-extrabold text-slate-900">Venue & Location</h3>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{event.venue}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{event.location}, {event.city}, Uganda</p>
                      <p className="text-xs text-slate-500 mt-2">
                        Parking is available at the venue with armed security personnel on duty. Ride-hailing pickups (SafeBoda, Uber) operate 24/7 at the designated gate.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Ticket Tiers */}
            {activeTab === 'tickets' && (
              <div className="space-y-4">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-xl font-extrabold text-slate-900">Official Ticket Tiers</h3>
                  <p className="text-xs text-slate-500">
                    All prices are in UGX. Secure instant checkout via MTN MoMo, Airtel Money, or Card.
                  </p>

                  <div className="space-y-3 pt-2">
                    {event.ticket_tiers.map((tier) => (
                      <div
                        key={tier.id}
                        className="p-5 rounded-2xl border border-slate-200 hover:border-amber-400 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-base text-slate-900">{tier.name}</h4>
                            {tier.sold_count && tier.capacity && tier.sold_count / tier.capacity > 0.8 && (
                              <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                                Selling Fast
                              </span>
                            )}
                          </div>
                          {tier.perks && (
                            <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5 pt-1">
                              {tier.perks.map((p, idx) => (
                                <li key={idx}>{p}</li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                          <span className="font-mono font-black text-lg sm:text-xl text-slate-900">
                            {tier.price_ugx === 0 ? 'FREE' : formatUGX(tier.price_ugx)}
                          </span>

                          <button
                            type="button"
                            onClick={() => setTicketBookingModalEvent(event)}
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase shadow-sm transition-all cursor-pointer"
                          >
                            Select & Book
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Lineup */}
            {activeTab === 'lineup' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <h3 className="text-xl font-extrabold text-slate-900">Performers, Hosts & Artists</h3>

                {event.lineup && event.lineup.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {event.lineup.map((artist) => (
                      <div
                        key={artist.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2"
                      >
                        <img
                          src={artist.avatar_url}
                          alt={artist.name}
                          className="w-16 h-16 rounded-full object-cover mx-auto ring-2 ring-blue-500/30"
                        />
                        <h4 className="font-extrabold text-sm text-slate-900">{artist.name}</h4>
                        <span className="text-xs text-slate-500 block">{artist.role}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Full artist and performer lineup to be released closer to event date. Follow organizer for announcements!
                  </p>
                )}
              </div>
            )}

            {/* TAB: Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-xl font-extrabold text-slate-900">Attendee Reviews</h3>

                  {eventReviews.length === 0 ? (
                    <p className="text-xs text-slate-500">
                      No reviews yet for this edition. Be the first to leave feedback after attending!
                    </p>
                  ) : (
                    <div className="space-y-4 divide-y divide-slate-100">
                      {eventReviews.map((rev) => (
                        <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={rev.from_user_avatar}
                                alt={rev.from_user_name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <span className="text-sm font-bold text-slate-900">{rev.from_user_name}</span>
                            </div>
                            <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{rev.rating}.0</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Leave a review */}
                <form
                  onSubmit={handleReviewSubmit}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4"
                >
                  <h4 className="font-extrabold text-base text-slate-900">Leave a Review</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 font-semibold">Your Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Share your experience (sound, atmosphere, venue, crowd)..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600"
                  />

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-sm cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            )}

          </div>

          {/* Right Column: Organizer Card & Booking Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Ticket Booking Quick Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-5 sticky top-24">
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">
                  Tickets Starting At
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  {event.starting_price_ugx === 0 ? 'FREE' : formatUGX(event.starting_price_ugx)}
                </span>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Available Tiers:</span>
                  <span className="font-bold text-slate-900">{event.ticket_tiers.length} types</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Payment Methods:</span>
                  <span className="font-bold text-emerald-600">MTN / Airtel / Card</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Pass Delivery:</span>
                  <span className="font-bold text-blue-700">Instant QR SMS & Email</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTicketBookingModalEvent(event)}
                className="w-full py-4 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-sm tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Ticket className="w-5 h-5 text-slate-950" />
                <span>Book Tickets Now</span>
              </button>

              <button
                type="button"
                onClick={() => setShareModalEvent(event)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share with Friends</span>
              </button>
            </div>

            {/* Organizer Profile Card */}
            {organizer && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={organizer.avatar_url}
                    alt={organizer.full_name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-base text-slate-900 truncate">
                        {organizer.full_name}
                      </h4>
                      {organizer.is_verified && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{organizer.title}</p>
                    <p className="text-[11px] text-slate-400">{organizer.location}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {organizer.bio}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Followers: <strong className="text-slate-900">{organizer.followers_count || 1200}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOrganizerId(organizer.id);
                      setCurrentView('organizer-detail');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                  >
                    View Organizer <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Similar Events */}
        {similarEvents.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-200 space-y-6">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              More {event.category} in Uganda
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarEvents.map((sim) => (
                <EventCard key={sim.id} event={sim} />
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
