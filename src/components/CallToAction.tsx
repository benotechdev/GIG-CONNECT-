import React from 'react';
import { ArrowRight, Ticket, Sparkles, Calendar, ShieldCheck, Smartphone } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CallToAction: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-r from-blue-950 via-slate-950 to-indigo-950 text-white relative overflow-hidden">
      {/* Decorative radial blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: For Event Goers / Attendees */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold uppercase tracking-wider">
                <Ticket className="w-3.5 h-3.5" />
                <span>For Experience Seekers</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Discover unforgettable events happening in Uganda.
              </h3>
              <p className="text-sm text-blue-100/90 leading-relaxed">
                From high-octane music festivals and rooftop sundowners to weekend Nile rafting adventures. Book tickets safely in UGX via MTN MoMo & Airtel Money.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentView('events');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <span>Find Events Near You</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentView('saved');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all cursor-pointer backdrop-blur-md"
              >
                Saved Events
              </button>
            </div>
          </div>

          {/* Card 2: For Organizers & Promoters */}
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>For Event Organizers</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Publish, promote, and sell out your next event.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Set custom ticket tiers, accept real-time mobile money collections, manage guest lists, and withdraw your box office revenue anytime.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentView('create-event');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <span>Publish an Event Free</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentView('organizers');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all cursor-pointer"
              >
                Browse Top Organizers
              </button>
            </div>
          </div>

        </div>

        {/* Safe & Fast Guarantee Strip */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <p className="text-lg font-black text-amber-400 font-mono">100% Secure</p>
            <p className="text-xs text-slate-400 mt-0.5">Instant QR Code E-Tickets</p>
          </div>
          <div className="p-3">
            <p className="text-lg font-black text-emerald-400 font-mono">MTN & Airtel</p>
            <p className="text-xs text-slate-400 mt-0.5">Instant Mobile Money Checkout</p>
          </div>
          <div className="p-3">
            <p className="text-lg font-black text-blue-400 font-mono">Verified</p>
            <p className="text-xs text-slate-400 mt-0.5">Trusted Ugandan Organizers</p>
          </div>
          <div className="p-3">
            <p className="text-lg font-black text-yellow-300 font-mono">24/7 Support</p>
            <p className="text-xs text-slate-400 mt-0.5">Event Day Gate Assistance</p>
          </div>
        </div>
      </div>
    </section>
  );
};
