import React, { useState } from 'react';
import {
  Coins,
  FileText,
  Star,
  CheckCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Edit3,
  Smartphone,
  Sparkles,
  TrendingUp,
  Save,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUGX, formatDate } from '../utils/formatters';

export const FreelancerDashboardPage: React.FC = () => {
  const {
    currentUser,
    updateCurrentUserProfile,
    applications,
    projects,
    updateProjectStage,
    setCurrentView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'proposals' | 'contracts' | 'profile'>('overview');

  // Edit profile state
  const [title, setTitle] = useState(currentUser?.title || '');
  const [hourlyRate, setHourlyRate] = useState(currentUser?.hourly_rate_ugx || 45000);
  const [location, setLocation] = useState(currentUser?.location || 'Kampala, Uganda');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [skillsString, setSkillsString] = useState(currentUser?.skills?.join(', ') || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Deliverable state for active contracts
  const [deliverableNotes, setDeliverableNotes] = useState<Record<string, string>>({});
  const [deliverableUrls, setDeliverableUrls] = useState<Record<string, string>>({});

  // Mobile money withdraw simulation state
  const [withdrawAmount, setWithdrawAmount] = useState<number>(500000);
  const [momoProvider, setMomoProvider] = useState<'mtn' | 'airtel'>('mtn');
  const [momoPhone, setMomoPhone] = useState(currentUser?.phone || '+256 772 123 456');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const myApplications = applications.filter((a) => a.freelancer_id === currentUser?.id);
  const myProjects = projects.filter((p) => p.freelancer_id === currentUser?.id);

  const totalEarnings = currentUser?.earnings_ugx || 0;
  const completedJobsCount = currentUser?.completed_jobs_count || 0;

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      title,
      hourly_rate_ugx: Number(hourlyRate),
      location,
      bio,
      skills: skillsString.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleDeliverableSubmit = (contractId: string) => {
    const note = deliverableNotes[contractId] || 'Completed work submitted for client review.';
    const url = deliverableUrls[contractId] || '';
    updateProjectStage(contractId, 'in_progress', note, url);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawSuccess(true);
    setTimeout(() => setWithdrawSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar_url}
              alt={currentUser?.full_name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/40 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">{currentUser?.full_name}</h1>
                {currentUser?.is_verified && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white">
                    Verified
                  </span>
                )}
                {currentUser?.is_featured && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentUser?.title} · {currentUser?.location} · {formatUGX(currentUser?.hourly_rate_ugx || 45000)}/hr
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('jobs')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Available Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase block">Total Net Earnings</span>
            <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">
              {formatUGX(totalEarnings)}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">UGX Mobile Money Ready</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase block">Active Proposals</span>
            <span className="text-2xl font-black text-blue-600 font-mono mt-1 block">
              {myApplications.length}
            </span>
            <span className="text-[11px] text-blue-700 font-bold mt-0.5 block">
              {myApplications.filter((a) => a.status === 'pending').length} pending decision
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase block">Ongoing Projects</span>
            <span className="text-2xl font-black text-indigo-600 font-mono mt-1 block">
              {myProjects.filter((p) => p.stage !== 'completed').length}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase block">Profile Rating</span>
            <span className="text-2xl font-black text-amber-500 font-mono mt-1 block flex items-center gap-1">
              ★ {currentUser?.rating ? currentUser.rating.toFixed(1) : '5.0'}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              {currentUser?.total_reviews || 0} client reviews
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 space-x-6 text-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Earnings & Payouts
          </button>

          <button
            onClick={() => setActiveTab('contracts')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 ${
              activeTab === 'contracts'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Contracts ({myProjects.length})
          </button>

          <button
            onClick={() => setActiveTab('proposals')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 ${
              activeTab === 'proposals'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Proposals ({myApplications.length})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Edit Profile & Rate
          </button>
        </div>

        {/* Tab 1: Earnings & Payout Simulator */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Financial Summary */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                  Wallet & Financial Summary
                </h3>

                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase block">
                      Available Balance for Withdrawal
                    </span>
                    <span className="text-3xl font-black text-emerald-900 font-mono">
                      {formatUGX(totalEarnings)}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 text-xs font-bold self-start sm:self-auto">
                    Instant MoMo Ready
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span>Lifetime Contracts Completed</span>
                    <span className="font-bold text-slate-900">{completedJobsCount} jobs</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span>Platform Service Commission</span>
                    <span className="font-bold text-slate-900">Standard 10% (Pre-deducted)</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Escrow Release Speed</span>
                    <span className="font-bold text-emerald-700">Immediate upon Client Approval</span>
                  </div>
                </div>
              </div>

              {/* Recent Completed Payments */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                  Completed Payout History
                </h3>

                {myProjects.filter((p) => p.stage === 'completed').length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4">
                    No completed contracts yet. When clients release funds, payouts appear here.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {myProjects
                      .filter((p) => p.stage === 'completed')
                      .map((p) => (
                        <div
                          key={p.id}
                          className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900 block">{p.job_title}</span>
                            <span className="text-slate-400">
                              Client: {p.client_name} · {formatDate(p.completed_at || p.updated_at)}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-emerald-700 text-sm">
                            +{formatUGX(p.freelancer_payout_ugx)}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Money Withdrawal Form */}
            <div>
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-amber-500" />
                  <span>Withdraw to Mobile Money</span>
                </h3>

                {withdrawSuccess ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                    <p className="font-bold text-emerald-900 text-xs">
                      Withdrawal Request Initiated!
                    </p>
                    <p className="text-[11px] text-emerald-700">
                      UGX {withdrawAmount.toLocaleString()} is being sent to your {momoProvider.toUpperCase()} MoMo number ({momoPhone}).
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Select Provider
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setMomoProvider('mtn')}
                          className={`p-2.5 rounded-xl border font-bold cursor-pointer transition-colors ${
                            momoProvider === 'mtn'
                              ? 'border-yellow-500 bg-yellow-50 text-yellow-900'
                              : 'border-slate-200 text-slate-600'
                          }`}
                        >
                          MTN MoMo
                        </button>
                        <button
                          type="button"
                          onClick={() => setMomoProvider('airtel')}
                          className={`p-2.5 rounded-xl border font-bold cursor-pointer transition-colors ${
                            momoProvider === 'airtel'
                              ? 'border-red-500 bg-red-50 text-red-900'
                              : 'border-slate-200 text-slate-600'
                          }`}
                        >
                          Airtel Money
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Mobile Money Phone Number
                      </label>
                      <input
                        type="text"
                        required
                        value={momoPhone}
                        onChange={(e) => setMomoPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:outline-hidden focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Withdrawal Amount (UGX)
                      </label>
                      <input
                        type="number"
                        step="10000"
                        min="20000"
                        max={totalEarnings || 500000}
                        required
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-blue-600"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      Withdraw {formatUGX(withdrawAmount)}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Contracts */}
        {activeTab === 'contracts' && (
          <div className="space-y-4">
            {myProjects.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-sm text-slate-500">
                You have no active contracts yet. Keep submitting proposals to win jobs!
              </div>
            ) : (
              myProjects.map((contract) => (
                <div
                  key={contract.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          contract.stage === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {contract.stage.replace('_', ' ')}
                      </span>
                      <h4 className="font-bold text-base text-slate-900 mt-1">
                        {contract.job_title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Client: <strong>{contract.client_name}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 uppercase font-bold block">
                        Your Payout
                      </span>
                      <span className="text-base font-black text-emerald-700 font-mono">
                        {formatUGX(contract.freelancer_payout_ugx)}
                      </span>
                    </div>
                  </div>

                  {/* Submission Form if In Progress */}
                  {contract.stage !== 'completed' && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <h5 className="font-bold text-xs text-slate-800">
                        Submit or Update Project Deliverables
                      </h5>
                      <textarea
                        rows={2}
                        placeholder="Describe completed work, updates, or instructions for the client..."
                        value={deliverableNotes[contract.id] || contract.deliverable_note || ''}
                        onChange={(e) =>
                          setDeliverableNotes({ ...deliverableNotes, [contract.id]: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
                      />
                      <input
                        type="url"
                        placeholder="Link to code repository, Figma file, Google Drive, or Preview"
                        value={deliverableUrls[contract.id] || contract.deliverable_url || ''}
                        onChange={(e) =>
                          setDeliverableUrls({ ...deliverableUrls, [contract.id]: e.target.value })
                        }
                        className="w-full p-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeliverableSubmit(contract.id)}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Save Deliverables for Client Review
                      </button>
                    </div>
                  )}

                  {contract.stage === 'completed' && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Funds released to your account. Contract closed.</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Proposals */}
        {activeTab === 'proposals' && (
          <div className="space-y-4">
            {myApplications.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-sm text-slate-500">
                You haven't submitted any proposals yet.
              </div>
            ) : (
              myApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        app.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {app.status}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{app.job_title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{app.cover_letter}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-slate-400 uppercase font-bold block">
                      Your Bid
                    </span>
                    <span className="text-sm font-bold text-blue-900 font-mono">
                      {formatUGX(app.proposed_budget_ugx)}
                    </span>
                    <span className="text-[11px] text-slate-400 block">{app.estimated_days} Days</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Edit Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-2xl">
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-4">
              Edit Freelancer Profile
            </h3>

            {savedSuccess && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Hourly Rate (UGX)
                  </label>
                  <input
                    type="number"
                    step="5000"
                    required
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={skillsString}
                  onChange={(e) => setSkillsString(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Bio / Overview
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-blue-600 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
