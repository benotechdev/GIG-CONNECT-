import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportModal: React.FC = () => {
  const { reportModalData, setReportModalData, submitReport } = useApp();

  const [reason, setReason] = useState('Suspicious or potential scam');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!reportModalData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(
      reportModalData.targetType,
      reportModalData.targetId,
      reportModalData.targetTitle,
      reason,
      details
    );
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReportModalData(null);
    }, 1500);
  };

  const reportReasons = [
    'Suspicious or potential scam',
    'Asking for payment outside Gig Connect UG',
    'Unprofessional or abusive communication',
    'Misleading job description or requirements',
    'Violates Ugandan labor or copyright laws',
    'Spam or duplicate listing',
    'Other concern',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-red-50/50">
          <div className="flex items-center gap-2 text-red-700">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-sm">
              Report {reportModalData.targetType === 'job' ? 'Job Posting' : 'User Profile'}
            </h3>
          </div>
          <button
            onClick={() => setReportModalData(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                ✓
              </div>
              <h4 className="font-bold text-slate-900">Report Submitted</h4>
              <p className="text-xs text-slate-500">
                Our trust & safety team will review this report promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500 block">Target:</span>
                <span className="font-bold text-slate-800">{reportModalData.targetTitle}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Report
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 focus:outline-hidden focus:border-red-500"
                >
                  {reportReasons.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Additional Details
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide any relevant context, messages, or links to help our moderation team investigate..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalData(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs"
                >
                  Submit Report
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
