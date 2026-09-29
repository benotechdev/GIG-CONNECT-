import React, { useState } from 'react';
import {
  X,
  Coins,
  Smartphone,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUGX } from '../utils/formatters';
import { PaymentMethod } from '../types';

export const EscrowDepositModal: React.FC = () => {
  const {
    escrowDepositModalProject,
    setEscrowDepositModalProject,
    initiateEscrowDeposit,
    currentUser,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mtn_momo');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '+256 772 900 800');
  const [cardHolder, setCardHolder] = useState('David Ssekandi');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [step, setStep] = useState<'input' | 'prompt' | 'success'>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!escrowDepositModalProject) return null;

  const amountUgx = escrowDepositModalProject.agreed_amount_ugx;
  const platformFeeUgx = escrowDepositModalProject.platform_fee_ugx;
  const freelancerPayoutUgx = escrowDepositModalProject.freelancer_payout_ugx;

  const handleStartDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (paymentMethod !== 'card') {
      const cleanPhone = phoneNumber.replace(/\s+/g, '');
      if (cleanPhone.length < 9) {
        setError('Please enter a valid Ugandan mobile money phone number.');
        return;
      }
    }

    setLoading(true);
    setStep('prompt');

    // Simulate USSD STK Push prompt response
    setTimeout(() => {
      setLoading(false);
    }, 1800);
  };

  const handleConfirmPIN = () => {
    setLoading(true);
    setTimeout(() => {
      initiateEscrowDeposit({
        projectId: escrowDepositModalProject.id,
        amountUgx,
        paymentMethod,
        phoneNumber,
        notes: `Milestone escrow funded for "${escrowDepositModalProject.job_title}". Verified via ${paymentMethod}.`,
      });
      setLoading(false);
      setStep('success');

      setTimeout(() => {
        setEscrowDepositModalProject(null);
        setStep('input');
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                Secure Escrow Deposit
              </span>
              <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                Fund Contract #{escrowDepositModalProject.id}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setEscrowDepositModalProject(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 'input' && (
            <form onSubmit={handleStartDeposit} className="space-y-5">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Amount Breakdown */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-600">
                  <span>Job Scope / Milestone:</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[200px]">
                    {escrowDepositModalProject.job_title}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-600">
                  <span>Assigned Freelancer:</span>
                  <span className="font-semibold text-slate-900">{escrowDepositModalProject.freelancer_name}</span>
                </div>
                <div className="border-t border-amber-200/60 pt-2 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-amber-950 uppercase">Total Escrow Amount:</span>
                  <span className="text-xl font-black font-mono text-slate-900">
                    {formatUGX(amountUgx)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 pt-1">
                  🔒 Funds are held safely in Bank of Uganda compliant escrow. They will not be disbursed until you inspect and approve the completed deliverables.
                </p>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Payment Method (Uganda)
                </label>
                <div className="grid grid-cols-3 gap-2">
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
                    <span className="text-xs font-bold text-slate-900 block">MTN MoMo</span>
                    <span className="text-[10px] text-slate-500 font-mono">*165#</span>
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
                    <span className="text-[10px] text-slate-500 font-mono">*185#</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-500/10 shadow-xs ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                    <span className="text-xs font-bold text-slate-900 block">Card (Visa/MC)</span>
                    <span className="text-[10px] text-slate-500">Local & Global</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Inputs */}
              {paymentMethod !== 'card' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {paymentMethod === 'mtn_momo' ? 'MTN' : 'Airtel'} Phone Number (Uganda) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+256 772 123 456"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                    <span className="absolute right-3 top-3 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                      UG (+256)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    You will receive an automated push prompt on this phone to enter your Mobile Money PIN.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to Gateway...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize Deposit of {formatUGX(amountUgx)}</span>
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'prompt' && (
            <div className="py-8 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto text-amber-700 animate-pulse">
                <Smartphone className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  USSD Push Prompt Sent to {phoneNumber}
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Please check your phone screen. You should see a prompt:
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs max-w-xs mx-auto text-left shadow-lg border border-slate-700 space-y-1">
                <p className="text-amber-400 font-bold">MTN/Airtel MoMo Push:</p>
                <p className="text-slate-200">Approve escrow payment of {formatUGX(amountUgx)} to Gig Connect UG?</p>
                <p className="text-slate-400 pt-1 text-[11px]">Enter MM PIN to approve</p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  type="button"
                  onClick={handleConfirmPIN}
                  disabled={loading}
                  className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying PIN with Telco...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>I Have Entered My PIN</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer"
                >
                  Cancel / Re-enter Number
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Escrow Locked Successfully! 🔒</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                {formatUGX(amountUgx)} is now locked securely in escrow. {escrowDepositModalProject.freelancer_name} has been notified to commence project work.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
