import React, { useState } from 'react';
import {
  Ticket,
  Calendar,
  MapPin,
  Clock,
  QrCode,
  Download,
  Share2,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUGX } from '../utils/formatters';

export const MyTicketsPage: React.FC = () => {
  const { ticketBookings, currentUser, setCurrentView, setSelectedEventId, setShareModalEvent, events } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming'>('all');

  // Filter bookings for current attendee or show all if demo
  const myBookings = ticketBookings.filter(
    (b) => !currentUser || b.attendee_id === currentUser.id || currentUser.role === 'admin'
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Ticket className="w-3.5 h-3.5" />
              <span>Attendee E-Ticket Wallet</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              My E-Tickets & Passes
            </h1>
            <p className="text-sm text-slate-600">
              Present these official QR code passes at the event entrance for instant scan and wristband access.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setCurrentView('events');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-95 text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span>Explore More Events</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tickets List */}
        {myBookings.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
            <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">You don’t have any event tickets yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Ready for an unforgettable weekend? Browse concerts, rooftop parties, festivals, and Nile trips in Uganda!
            </p>
            <button
              type="button"
              onClick={() => {
                setCurrentView('events');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              Browse Live Events
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {myBookings.map((ticket) => {
              const matchedEvent = events.find((e) => e.id === ticket.event_id);

              return (
                <div
                  key={ticket.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row"
                >
                  {/* Left: Poster Thumbnail */}
                  <div className="md:w-64 h-48 md:h-auto bg-slate-900 relative shrink-0">
                    <img
                      src={ticket.event_poster}
                      alt={ticket.event_title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/90 text-amber-300 backdrop-blur-md">
                        {ticket.tier_name}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Confirmed & Paid
                        </span>
                        <span className="text-xs text-slate-400 font-mono font-medium">
                          Ref: {ticket.qr_code_ref}
                        </span>
                      </div>

                      <h3 className="font-black text-lg sm:text-xl text-slate-900">
                        {ticket.event_title}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>{ticket.event_date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                          <span>{ticket.event_time}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                          <span className="truncate">{ticket.event_venue}, {ticket.event_location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Attendee</span>
                        <span className="font-bold text-slate-800">{ticket.attendee_name} ({ticket.quantity} Tickets)</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px]">Amount Paid</span>
                        <span className="font-mono font-bold text-emerald-600">
                          {ticket.total_amount_ugx === 0 ? 'Free Pass' : formatUGX(ticket.total_amount_ugx)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: QR Code Gate Scan Pass */}
                  <div className="p-6 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 flex flex-col items-center justify-center text-center space-y-3 shrink-0 md:w-56">
                    <div className="p-3 bg-white rounded-2xl border border-slate-300 shadow-xs">
                      <QrCode className="w-24 h-24 text-slate-900" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                      Scan at Entrance
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEventId(ticket.event_id);
                        setCurrentView('event-detail');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Event Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
