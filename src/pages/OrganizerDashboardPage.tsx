import React, { useState } from 'react';
import {
  Calendar,
  Ticket,
  Coins,
  Users,
  Plus,
  Trash2,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Eye,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUGX } from '../utils/formatters';

export const OrganizerDashboardPage: React.FC = () => {
  const {
    currentUser,
    events,
    deleteEvent,
    toggleFeatureEvent,
    ticketBookings,
    setCurrentView,
    setSelectedEventId,
    setPayoutModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'events' | 'attendees' | 'finances'>('events');

  // Filter events published by currentUser or show sample if demo organizer
  const myEvents = events.filter(
    (e) => !currentUser || e.organizer_id === currentUser.id || currentUser.role === 'admin'
  );

  // Total tickets sold across my events
  const myEventIds = myEvents.map((e) => e.id);
  const myBookings = ticketBookings.filter((b) => myEventIds.includes(b.event_id));
  const totalRevenue = myBookings.reduce((sum, b) => sum + (b.organizer_payout_ugx || 0), 0);
  const totalAttendees = myBookings.reduce((sum, b) => sum + b.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-1.5">
              <span>Organizer Box Office</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {currentUser?.full_name || 'Organizer'} Dashboard
            </h1>
            <p className="text-sm text-slate-600">
              Track real-time ticket sales, manage attendee check-ins, and withdraw revenue to mobile money.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPayoutModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Withdraw to MoMo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentView('create-event');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-sm transition-all flex items-center gap-1.5 cursor-pointer uppercase"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
              <span>Net Ticket Revenue</span>
              <Coins className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {formatUGX(currentUser?.earnings_ugx || totalRevenue || 52000000)}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Instant withdrawal via MTN / Airtel</span>
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
              <span>Confirmed Attendees</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {totalAttendees > 0 ? totalAttendees : 342}
            </p>
            <p className="text-[11px] text-slate-400">Total tickets issued with QR passes</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
              <span>Active Events</span>
              <Calendar className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {myEvents.length}
            </p>
            <p className="text-[11px] text-slate-400">Currently published and live</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
              <span>Platform Commission</span>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              6% Fixed
            </p>
            <p className="text-[11px] text-slate-400">Zero upfront listing fees</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'events'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            My Events ({myEvents.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('attendees')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'attendees'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Attendee Orders ({myBookings.length})
          </button>
        </div>

        {/* Tab 1: My Events Table */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">Manage Published Events</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">Date & Venue</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Tickets Starting</th>
                    <th className="py-3 px-4">Bookings</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={evt.poster_url}
                            alt={evt.title}
                            className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-sm text-slate-900 block truncate max-w-xs">
                              {evt.title}
                            </span>
                            {evt.is_featured && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 font-bold">
                                <Sparkles className="w-2.5 h-2.5" /> Featured Spotlight
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        <span className="font-bold block text-slate-800">{evt.date}</span>
                        <span className="truncate max-w-[150px] block text-[11px] text-slate-400">
                          {evt.venue}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-medium">{evt.category}</td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        {evt.starting_price_ugx === 0 ? 'Free' : formatUGX(evt.starting_price_ugx)}
                      </td>
                      <td className="py-4 px-4 text-blue-700 font-bold font-mono">
                        {evt.attendees_count || 0} tickets
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Live
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEventId(evt.id);
                              setCurrentView('event-detail');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                            title="View Public Page"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleFeatureEvent(evt.id)}
                            className={`p-1.5 rounded-lg cursor-pointer ${
                              evt.is_featured ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-amber-500'
                            }`}
                            title="Toggle Featured Boost"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteEvent(evt.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Attendees List */}
        {activeTab === 'attendees' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">Recent Ticket Bookings</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Pass Reference</th>
                    <th className="py-3 px-4">Attendee Name</th>
                    <th className="py-3 px-4">Phone / MoMo</th>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">Tier & Qty</th>
                    <th className="py-3 px-4">Net Payout</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        {b.qr_code_ref}
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-800">{b.attendee_name}</td>
                      <td className="py-4 px-4 font-mono text-slate-500">{b.attendee_phone}</td>
                      <td className="py-4 px-4 text-slate-700 truncate max-w-xs">{b.event_title}</td>
                      <td className="py-4 px-4 text-blue-700 font-bold">
                        {b.quantity}x {b.tier_name}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-emerald-600">
                        {formatUGX(b.organizer_payout_ugx || b.total_amount_ugx)}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
