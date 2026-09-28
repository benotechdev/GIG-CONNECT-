import React, { useState } from 'react';
import { X, CheckCircle2, Clock, Coins, Send, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUGX } from '../utils/formatters';

export const ApplyModal: React.FC = () => {
  const {
    applyModalOpen,
    setApplyModalOpen,
    selectedJobId,
    jobs,
    applyToJob,
    monetizationSettings,
  } = useApp();

  const [proposedBudget, setProposedBudget] = useState<number>(0);
  const [days, setDays] = useState<number>(7);
  const [coverLetter, setCoverLetter] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const targetJob = jobs.find((j) => j.id === selectedJobId);

  // Sync initial budget when job changes
  React.useEffect(() => {
    if (targetJob) {
      setProposedBudget(targetJob.budget_ugx);
      setIsSuccess(false);
      setErrorMsg('');
      setCoverLetter('');
    }
  }, [targetJob]);

  if (!applyModalOpen || !targetJob) return null;

  const commissionPercent = monetizationSettings.commission_rate_percent || 10;
  const platformFee = (proposedBudget * commissionPercent) / 100;
  const netEarnings = proposedBudget - platformFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (proposedBudget <= 0) {
      setErrorMsg('Please specify a valid bid amount in UGX.');
      return;
    }
    if (days <= 0) {
      setErrorMsg('Please specify estimated days to complete.');
      return;
    }
    if (coverLetter.trim().length < 20) {
      setErrorMsg('Please write a descriptive proposal (at least 20 characters).');
      return;
    }

    const success = applyToJob({
      jobId: targetJob.id,
      proposedBudget,
      days,
      coverLetter,
    });

    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        setApplyModalOpen(false);
        setIsSuccess(false);
      }, 1800);
    } else {
      setErrorMsg('You have already submitted a proposal for this job.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
              Submit Proposal
            </span>
            <h2 className="text-base font-bold text-slate-900 line-clamp-1">{targetJob.title}</h2>
          </div>
          <button
            onClick={() => setApplyModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          {isSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Proposal Submitted!</h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                The client has been notified. You can track this proposal in your Freelancer Dashboard.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Client Job Summary snippet */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Client's Budget</span>
                  <span className="font-extrabold text-blue-900 text-sm font-mono">
                    {formatUGX(targetJob.budget_ugx)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Category</span>
                  <span className="font-semibold text-slate-800">{targetJob.category}</span>
                </div>
              </div>

              {/* Bid & Delivery Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Bid (UGX)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="10000"
                      required
                      value={proposedBudget}
                      onChange={(e) => setProposedBudget(Number(e.target.value))}
                      className="w-full pl-3 pr-12 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-blue-600"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">
                      UGX
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estimated Timeline (Days)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      required
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value))}
                      className="w-full pl-3 pr-14 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-blue-600"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">
                      Days
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Payout Breakdown */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Bid Amount</span>
                  <span className="font-mono font-medium">{formatUGX(proposedBudget)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Gig Connect UG Fee ({commissionPercent}%)</span>
                  <span className="font-mono text-red-500">-{formatUGX(platformFee)}</span>
                </div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Estimated Net Payout</span>
                  <span className="font-mono text-emerald-700">{formatUGX(netEarnings)}</span>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cover Letter / Proposal
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain why you are the best fit for this project. Mention relevant past experience, your approach, and tools you will use..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Proposal for {formatUGX(proposedBudget)}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
