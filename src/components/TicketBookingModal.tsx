import React, { useState } from 'react';
import {
  X,
  Ticket,
  Smartphone,
  CreditCard,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  Loader2,
  QrCode,
  Download,
  ArrowRight,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUGX } from '../utils/formatters';

export const TicketBookingModal: React.FC = () => {
  const {
    ticketBookingModalEvent,
    setTicketBookingModalEvent,
    bookTicket,
    currentUser,
    setCurrentView,
  } = useApp();

  const event = ticketBookingModalEvent;

  const [selectedTierId, setSelectedTierId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [attendeeName, setAttendeeName] = useState<string>(currentUser?.full_name || '');
  const [attendeePhone, setAttendeePhone] = useState<string>(currentUser?.phone || '+256 772 123 456');
  const [attendeeEmail, setAttendeeEmail] = useState<string>(currentUser?.email || 'user@example.ug');
  const [paymentMethod, setPaymentMethod] = useState<'mtn_momo' | 'airtel_money' | 'card' | 'free'>('mtn_momo');

  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  // Auto-select first tier
  React.useEffect(() => {
    if (event && event.ticket_tiers.length > 0 && !selectedTierId) {
      setSelectedTierId(event.ticket_tiers[0].id);
    }
    if (event && event.starting_price_ugx === 0) {
      setPaymentMethod('free');
    }
  }, [event]);

  if (!event) return null;

  const selectedTier =
    event.ticket_tiers.find((t) => t.id === selectedTierId) || event.ticket_tiers[0];
  const unitPrice = selectedTier ? selectedTier.price_ugx : 0;
  const totalAmount = unitPrice * quantity;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTier) return;

    setIsProcessing(true);

    setTimeout(() => {
      const booking = bookTicket({
        eventId: event.id,
        tierId: selectedTier.id,
        quantity,
        attendeeName: attendeeName || 'Valued Guest',
        attendeePhone,
        attendeeEmail,
        paymentMethod: unitPrice === 0 ? 'free' : paymentMethod,
      });

      setIsProcessing(false);
      setConfirmedBooking(booking);
    }, 1200);
  };

  const handleClose = () => {
    setTicketBookingModalEvent(null);
    setConfirmedBooking(null);
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <img
              src={event.poster_url}
              alt={event.title}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/20 shrink-0"
            />
            <div className="min-w-0 pr-6">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                {event.category}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white truncate">
                {event.title}
              </h3>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{event.date}</span>
                <span>·</span>
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="truncate">{event.venue}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        {confirmedBooking ? (
          // Booking Success & E-Ticket QR
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="text-2xl font-black text-slate-900">
                You're Going! 🎟️
              </h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Your ticket has been confirmed. Instant confirmation sent via SMS to {attendeePhone}.
              </p>
            </div>

            {/* E-Ticket Pass Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-4 shadow-xs relative">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Pass Reference
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-800">
                    {confirmedBooking.qr_code_ref}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Tier & Qty
                  </span>
                  <span className="text-xs font-bold text-blue-700">
                    {confirmedBooking.quantity}x {confirmedBooking.tier_name}
                  </span>
                </div>
              </div>

              {/* QR Mock */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-slate-900">{confirmedBooking.attendee_name}</p>
                  <p className="text-slate-500 text-[11px]">{confirmedBooking.event_venue}, {event.city}</p>
                  <p className="text-slate-500 text-[11px]">{confirmedBooking.event_date} at {confirmedBooking.event_time}</p>
                  <p className="font-mono font-bold text-emerald-600 pt-1">
                    {confirmedBooking.total_amount_ugx === 0
                      ? 'Free Pass'
                      : formatUGX(confirmedBooking.total_amount_ugx)}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-300 shrink-0 shadow-xs flex flex-col items-center">
                  <QrCode className="w-16 h-16 text-slate-900" />
                  <span className="text-[8px] font-mono text-slate-400 mt-1 uppercase">Scan at Gate</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  setCurrentView('my-tickets');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-95 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Ticket className="w-4 h-4" />
                <span>View My E-Tickets</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          // Ticket Selection & Checkout Form
          <form onSubmit={handleBookingSubmit} className="p-5 sm:p-6 space-y-5">
            
            {/* Step 1: Select Ticket Tier */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span>1. Select Ticket Tier</span>
                <span className="text-[11px] font-normal text-slate-400">UGX Ugandan Shillings</span>
              </label>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {event.ticket_tiers.map((tier) => (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      selectedTierId === tier.id
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{tier.name}</span>
                        {tier.sold_count && tier.capacity && tier.sold_count / tier.capacity > 0.8 && (
                          <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full">
                            Almost Sold Out
                          </span>
                        )}
                      </div>
                      {tier.perks && tier.perks.length > 0 && (
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {tier.perks.join(' · ')}
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-black font-mono text-slate-900 block">
                        {tier.price_ugx === 0 ? 'FREE' : formatUGX(tier.price_ugx)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Quantity Selector */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Number of Tickets</span>
                <span className="text-[11px] text-slate-500">Max 10 tickets per transaction</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center disabled:opacity-40 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <span className="font-mono font-bold text-base text-slate-900 min-w-5 text-center">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  disabled={quantity >= 10}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center disabled:opacity-40 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Step 3: Contact Details */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                2. Attendee Contact (For E-Ticket SMS & QR Pass)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Full Name (on ID)"
                    value={attendeeName}
                    onChange={(e) => setAttendeeName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-600"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Money Phone (+256 77...)"
                    value={attendeePhone}
                    onChange={(e) => setAttendeePhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <input
                  type="email"
                  required
                  placeholder="Email Address (for PDF Ticket Backup)"
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>

            {/* Step 4: Payment Method (if not free) */}
            {unitPrice > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  3. Payment Method (UGX Checkout)
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mtn_momo')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'mtn_momo'
                        ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-400/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                    <span className="text-xs font-bold text-slate-900 block">MTN MoMo</span>
                    <span className="text-[10px] text-slate-500">USSD STK Push</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('airtel_money')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'airtel_money'
                        ? 'border-red-500 bg-red-50/80 ring-2 ring-red-400/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-red-600 mx-auto mb-1" />
                    <span className="text-xs font-bold text-slate-900 block">Airtel Money</span>
                    <span className="text-[10px] text-slate-500">USSD STK Push</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-400/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <span className="text-xs font-bold text-slate-900 block">Visa / Card</span>
                    <span className="text-[10px] text-slate-500">Instant Debit</span>
                  </button>
                </div>
              </div>
            )}

            {/* Total Summary & Submit */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  Total ({quantity}x {selectedTier?.name}):
                </span>
                <span className="text-xl font-black text-slate-900 font-mono">
                  {totalAmount === 0 ? 'FREE' : formatUGX(totalAmount)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-black text-base tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Telecom USSD Push...</span>
                  </>
                ) : (
                  <>
                    <Ticket className="w-5 h-5 text-slate-950" />
                    <span>
                      {totalAmount === 0
                        ? 'Confirm Free Pass'
                        : `Pay ${formatUGX(totalAmount)} via ${paymentMethod === 'mtn_momo' ? 'MTN MoMo' : paymentMethod === 'airtel_money' ? 'Airtel Money' : 'Card'}`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero fee markup · Verified gate check-in · Official ticket</span>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
