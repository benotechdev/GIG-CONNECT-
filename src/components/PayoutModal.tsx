import React, { useState } from 'react';
import {
  X,
  Coins,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Wallet,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUGX } from '../utils/formatters';

export const PayoutModal: React.FC = () => {
  const {
    payoutModalOpen,
    setPayoutModalOpen,
    currentUser,
    requestPayout,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'mtn_momo' | 'airtel_money'>('mtn_momo');
  const [amountUgx, setAmountUgx] = useState<number>(currentUser?.earnings_ugx || 500000);
  const [accountPhone, setAccountPhone] = useState(currentUser?.phone || '+256 772 123 456');
  const [accountName, setAccountName] = useState(currentUser?.full_name || 'BRIAN KATO');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!payoutModalOpen) return null;

  const currentBalance = currentUser?.earnings_ugx || 0;
  const telecomFeeUgx = 1500;
  const netReceivedUgx = Math.max(0, amountUgx - telecomFeeUgx);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (amountUgx < 5000) {
      setError('Minimum withdrawal is UGX 5,000.');
      return;
    }

    if (amountUgx > currentBalance && currentBalance > 0) {
      setError(`Cannot withdraw more than your available balance of ${formatUGX(currentBalance)}.`);
      return;
    }

    const cleanPhone = accountPhone.replace(/\s+/g, '');
    if (cleanPhone.length < 9) {
      setError('Please provide a valid Ugandan mobile number.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      requestPayout({
        amountUgx,
        paymentMethod,
        accountPhone,
        accountName,
      });

      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        setPayoutModalOpen(false);
        setSuccess(false);
      }, 1800);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                Instant MoMo Withdrawal
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Cash Out to Mobile Money
              </h3>
            </div>
          </div>
          <button
            onClick={() => setPayoutModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Transfer Successful! 📲</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                {formatUGX(netReceivedUgx)} has been disbursed to {accountPhone} ({paymentMethod === 'mtn_momo' ? 'MTN MoMo' : 'Airtel Money'}).
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Current balance chip */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                <span className="text-slate-500">Available Wallet Balance:</span>
                <span className="font-black font-mono text-emerald-700 text-sm">
                  {formatUGX(currentBalance)}
                </span>
              </div>

              {/* Network Provider Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Telecom Network
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mtn_momo')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'mtn_momo'
                        ? 'border-amber-500 bg-amber-500/10 shadow-xs ring-1 ring-amber-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto text-amber-600 mb-1" />
                    <span className="text-xs font-bold text-slate-900 block">MTN Mobile Money</span>
                    <span className="text-[10px] text-slate-500">Instant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('airtel_money')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'airtel_money'
                        ? 'border-red-500 bg-red-500/10 shadow-xs ring-1 ring-red-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto text-red-600 mb-1" />
                    <span className="text-xs font-bold text-slate-900 block">Airtel Money</span>
                    <span className="text-[10px] text-slate-500">Instant</span>
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Amount to Withdraw (UGX) *
                </label>
                <input
                  type="number"
                  required
                  min={5000}
                  step={5000}
                  value={amountUgx}
                  onChange={(e) => setAmountUgx(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Phone number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Money Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={accountPhone}
                  onChange={(e) => setAccountPhone(e.target.value)}
                  placeholder="+256 772 123 456"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Account name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Name as Registered on SIM *
                </label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. BRIAN KATO"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Calculation summary */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Withdrawal:</span>
                  <span className="font-mono font-semibold">{formatUGX(amountUgx)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Telecom Transfer Fee:</span>
                  <span className="font-mono">- {formatUGX(telecomFeeUgx)}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-bold border-t border-slate-200 pt-1">
                  <span>Net Landing in Wallet:</span>
                  <span className="font-mono">{formatUGX(netReceivedUgx)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Telecom Transfer...</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4" />
                    <span>Withdraw {formatUGX(netReceivedUgx)} to Mobile</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
