import React, { useState } from 'react';
import {
  Shield,
  Users,
  Briefcase,
  Coins,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Sparkles,
  Award,
  Settings,
  Trash2,
  Save,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUGX, formatDate } from '../utils/formatters';

export const AdminDashboardPage: React.FC = () => {
  const {
    users,
    jobs,
    projects,
    reports,
    monetizationSettings,
    updateMonetizationSettings,
    toggleVerifyUser,
    toggleFeatureFreelancer,
    togglePremiumFreelancer,
    toggleFeatureJob,
    deleteJob,
    resolveReport,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'kpis' | 'reports' | 'jobs' | 'freelancers' | 'monetization'>('kpis');

  // Monetization form settings state
  const [commissionRate, setCommissionRate] = useState(monetizationSettings.commission_rate_percent);
  const [featuredJobFee, setFeaturedJobFee] = useState(monetizationSettings.featured_job_fee_ugx);
  const [featuredFreelancerFee, setFeaturedFreelancerFee] = useState(monetizationSettings.featured_freelancer_fee_ugx);
  const [premiumFee, setPremiumFee] = useState(monetizationSettings.premium_freelancer_monthly_ugx);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Platform KPIs
  const totalVolumeUgx = projects.reduce((acc, p) => acc + p.agreed_amount_ugx, 0);
  const totalCommissionEarnedUgx = projects
    .filter((p) => p.stage === 'completed')
    .reduce((acc, p) => acc + p.platform_fee_ugx, 0);
  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateMonetizationSettings({
      commission_rate_percent: Number(commissionRate),
      featured_job_fee_ugx: Number(featuredJobFee),
      featured_freelancer_fee_ugx: Number(featuredFreelancerFee),
      premium_freelancer_monthly_ugx: Number(premiumFee),
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md border border-purple-900/40">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">Platform Administration</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500 text-white">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Moderation queue, user verification, job listings & platform monetization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-purple-900/60 border border-purple-700/50 text-xs font-mono text-purple-200">
              Uganda Market Ops
            </span>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase block">Registered Users</span>
            <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
              {users.length}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase block">Total Job Postings</span>
            <span className="text-2xl font-black text-blue-600 font-mono mt-1 block">
              {jobs.length}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase block">Total Project Volume</span>
            <span className="text-xl font-black text-slate-900 font-mono mt-1 block truncate">
              {formatUGX(totalVolumeUgx)}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase block">Platform Fee Revenue</span>
            <span className="text-xl font-black text-emerald-700 font-mono mt-1 block truncate">
              {formatUGX(totalCommissionEarnedUgx)}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
              {monetizationSettings.commission_rate_percent}% cut
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase block">Pending Reports</span>
            <span className={`text-2xl font-black font-mono mt-1 block ${
              pendingReportsCount > 0 ? 'text-red-600' : 'text-slate-400'
            }`}>
              {pendingReportsCount}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 space-x-6 text-sm">
          <button
            onClick={() => setActiveTab('kpis')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 ${
              activeTab === 'kpis'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Activity
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 relative ${
              activeTab === 'reports'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Trust & Moderation Reports ({reports.length})
            {pendingReportsCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                {pendingReportsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 ${
              activeTab === 'jobs'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Manage Jobs ({jobs.length})
          </button>

          <button
            onClick={() => setActiveTab('freelancers')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 ${
              activeTab === 'freelancers'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Manage Freelancers ({users.filter((u) => u.role === 'freelancer').length})
          </button>

          <button
            onClick={() => setActiveTab('monetization')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 ${
              activeTab === 'monetization'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Monetization & Fees Settings
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'kpis' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Recent Contracts in Uganda
              </h3>
              <div className="space-y-3">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{p.job_title}</span>
                      <span className="text-slate-400">
                        {p.client_name} → {p.freelancer_name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 font-mono block">
                        {formatUGX(p.agreed_amount_ugx)}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold capitalize">
                        {p.stage.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Active Fee Structure
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-100 flex justify-between items-center">
                  <span className="font-medium text-purple-900">Platform Commission</span>
                  <span className="font-bold font-mono text-purple-900">
                    {monetizationSettings.commission_rate_percent}% per completed job
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100 flex justify-between items-center">
                  <span className="font-medium text-amber-900">Featured Job Listing Fee</span>
                  <span className="font-bold font-mono text-amber-900">
                    {formatUGX(monetizationSettings.featured_job_fee_ugx)}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 flex justify-between items-center">
                  <span className="font-medium text-blue-900">Featured Freelancer Profile</span>
                  <span className="font-bold font-mono text-blue-900">
                    {formatUGX(monetizationSettings.featured_freelancer_fee_ugx)}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 flex justify-between items-center">
                  <span className="font-medium text-emerald-900">Premium Freelancer Monthly</span>
                  <span className="font-bold font-mono text-emerald-900">
                    {formatUGX(monetizationSettings.premium_freelancer_monthly_ugx)} / mo
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-xs text-slate-500">
                No user or job reports filed.
              </div>
            ) : (
              reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          report.status === 'pending'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        Status: {report.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        Filed by {report.reporter_name} · {formatDate(report.created_at)}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-red-700">
                      Reason: {report.reason}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 text-xs">
                    <span className="font-bold text-slate-800 block">
                      Target {report.target_type}: {report.target_name_or_title}
                    </span>
                    <p className="text-slate-600 mt-1">{report.details}</p>
                  </div>

                  {report.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => resolveReport(report.id, 'resolved')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Resolve & Action Taken
                      </button>
                      <button
                        onClick={() => resolveReport(report.id, 'dismissed')}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Dismiss Report
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Manage Jobs */}
        {activeTab === 'jobs' && (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-blue-700">{job.category}</span>
                    {job.is_featured && (
                      <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold text-[10px]">
                        Featured
                      </span>
                    )}
                    <span className="text-slate-400 capitalize">({job.status})</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{job.title}</h4>
                  <p className="text-slate-500">
                    Client: {job.client_name} · Budget: {formatUGX(job.budget_ugx)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFeatureJob(job.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                      job.is_featured
                        ? 'border-amber-400 bg-amber-50 text-amber-900'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {job.is_featured ? 'Unfeature' : 'Make Featured'}
                  </button>

                  <button
                    onClick={() => deleteJob(job.id)}
                    className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 cursor-pointer"
                    title="Delete job listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Manage Freelancers */}
        {activeTab === 'freelancers' && (
          <div className="space-y-3">
            {users
              .filter((u) => u.role === 'freelancer')
              .map((f) => (
                <div
                  key={f.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={f.avatar_url}
                      alt={f.full_name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{f.full_name}</h4>
                        {f.is_verified && (
                          <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                            Verified
                          </span>
                        )}
                        {f.is_featured && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500">
                        {f.title} · {f.location} · {formatUGX(f.hourly_rate_ugx || 40000)}/hr
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleVerifyUser(f.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                        f.is_verified
                          ? 'border-blue-500 bg-blue-50 text-blue-800'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {f.is_verified ? 'Verified ✓' : 'Verify ID'}
                    </button>

                    <button
                      onClick={() => toggleFeatureFreelancer(f.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                        f.is_featured
                          ? 'border-amber-400 bg-amber-50 text-amber-900'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {f.is_featured ? 'Featured ★' : 'Feature'}
                    </button>

                    <button
                      onClick={() => togglePremiumFreelancer(f.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                        f.is_premium
                          ? 'border-purple-400 bg-purple-50 text-purple-900'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {f.is_premium ? 'PRO Badge' : 'Make PRO'}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Tab 5: Monetization */}
        {activeTab === 'monetization' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-2xl">
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-2">
              Monetization & Commission Engine
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Configure platform service commissions on completed jobs, featured badges, and premium subscription fees in UGX.
            </p>

            {settingsSaved && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Monetization parameters saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Platform Commission on Completed Jobs (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    step="0.5"
                    required
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-purple-600"
                  />
                  <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">
                    %
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Automatically deducted from contract amount upon client approval.
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Featured Job Listing Fee (UGX)
                </label>
                <input
                  type="number"
                  step="5000"
                  required
                  value={featuredJobFee}
                  onChange={(e) => setFeaturedJobFee(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Featured Freelancer Placement Fee (UGX)
                </label>
                <input
                  type="number"
                  step="5000"
                  required
                  value={featuredFreelancerFee}
                  onChange={(e) => setFeaturedFreelancerFee(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Premium Freelancer PRO Monthly Subscription (UGX)
                </label>
                <input
                  type="number"
                  step="5000"
                  required
                  value={premiumFee}
                  onChange={(e) => setPremiumFee(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-purple-600"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Monetization Settings</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
