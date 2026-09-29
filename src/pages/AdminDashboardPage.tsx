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
  Smartphone,
  CreditCard,
  Lock,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Filter,
  UserCheck,
  FileText,
  Clock,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUGX, formatDate } from '../utils/formatters';
import { UserRole, ROLE_DEFINITIONS } from '../types';
import { GATEWAY_CONFIGS } from '../data/mockData';

export const AdminDashboardPage: React.FC = () => {
  const {
    currentUser,
    users,
    jobs,
    projects,
    reports,
    transactions,
    payoutRequests,
    auditLogs,
    monetizationSettings,
    updateMonetizationSettings,
    toggleVerifyUser,
    toggleFeatureFreelancer,
    togglePremiumFreelancer,
    toggleFeatureJob,
    deleteJob,
    resolveReport,
    changeUserRole,
    approvePayout,
    can,
    loginAs,
    setRolesModalOpen,
    setPaymentDocsModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'kpis' | 'roles' | 'payments' | 'payouts' | 'reports' | 'jobs' | 'freelancers' | 'monetization' | 'audit'
  >('kpis');

  // Monetization form settings state
  const [commissionRate, setCommissionRate] = useState(monetizationSettings.commission_rate_percent);
  const [featuredJobFee, setFeaturedJobFee] = useState(monetizationSettings.featured_job_fee_ugx);
  const [featuredFreelancerFee, setFeaturedFreelancerFee] = useState(monetizationSettings.featured_freelancer_fee_ugx);
  const [premiumFee, setPremiumFee] = useState(monetizationSettings.premium_freelancer_monthly_ugx);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // If user does not have permission to access admin dashboard
  if (currentUser && !can('admin:view_dashboard')) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-lg mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-600">
            The Platform Administration Portal is restricted to authorized administrative and governance accounts. Current role: <strong className="capitalize">{currentUser.role}</strong>.
          </p>
          <div className="pt-2">
            <button
              onClick={() => loginAs('user-admin-1')}
              className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
            >
              Sign In as Super Admin (Grace Atuhaire)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Financial calculations
  const totalVolumeUgx = transactions.reduce((acc, t) => acc + t.amount_ugx, 0);
  const totalCommissionEarnedUgx = transactions.reduce((acc, t) => acc + t.platform_fee_ugx, 0);
  const activeEscrowLockedUgx = transactions
    .filter((t) => t.status === 'escrow_locked')
    .reduce((acc, t) => acc + t.amount_ugx, 0);
  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;
  const pendingPayoutsCount = payoutRequests.filter((p) => p.status === 'pending' || p.status === 'processing').length;

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
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-md border border-purple-900/40">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">Platform Governance & Administration</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500 text-white font-mono">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Role & permission control, UGX mobile money escrow, gateway integration, and Uganda marketplace compliance
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setRolesModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-600/50 text-xs font-semibold text-purple-200 flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Roles & Permission Matrix</span>
            </button>

            <button
              onClick={() => setPaymentDocsModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Payment Gateway & Escrow Docs</span>
            </button>
          </div>
        </div>

        {/* Top Financial & Operational KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase block">Registered Users</span>
            <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
              {users.length}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Across 5 role tiers
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase block">Total Job Listings</span>
            <span className="text-2xl font-black text-blue-600 font-mono mt-1 block">
              {jobs.length}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              UGX budget postings
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase block">Active Escrow Locked</span>
            <span className="text-xl font-black text-amber-600 font-mono mt-1 block truncate">
              {formatUGX(activeEscrowLockedUgx)}
            </span>
            <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">
              Held in Bank of Uganda trust
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase block">Platform Fee Revenue</span>
            <span className="text-xl font-black text-emerald-700 font-mono mt-1 block truncate">
              {formatUGX(totalCommissionEarnedUgx)}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
              {monetizationSettings.commission_rate_percent}% platform fee
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase block">Pending Moderation</span>
            <span className={`text-2xl font-black font-mono mt-1 block ${
              pendingReportsCount > 0 ? 'text-red-600' : 'text-slate-400'
            }`}>
              {pendingReportsCount}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              User & job reports
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 space-x-4 sm:space-x-6 text-xs sm:text-sm overflow-x-auto">
          <button
            onClick={() => setActiveTab('kpis')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'kpis'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Activity
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'roles'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Roles & RBAC ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'payments'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Gateway Transactions ({transactions.length})
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 whitespace-nowrap relative ${
              activeTab === 'payouts'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            MoMo Payouts ({payoutRequests.length})
            {pendingPayoutsCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
                {pendingPayoutsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 whitespace-nowrap relative ${
              activeTab === 'reports'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Trust Reports ({reports.length})
            {pendingReportsCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                {pendingReportsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'jobs'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Manage Events ({jobs.length})
          </button>

          <button
            onClick={() => setActiveTab('freelancers')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'freelancers'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Organizers & Users ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('monetization')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'monetization'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Monetization Settings
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Security Audit Logs ({auditLogs.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'kpis' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Recent Contracts & Milestones
                </h3>
                <span className="text-[11px] text-purple-700 font-semibold cursor-pointer" onClick={() => setActiveTab('payments')}>
                  View Ledger →
                </span>
              </div>
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
                        {formatUGX(p.agreed_amount_ugx || p.unit_price_ugx || 0)}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold capitalize">
                        {(p.stage || 'confirmed').replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Payment Gateways & Telecommunications Status
              </h3>
              <div className="space-y-3 text-xs">
                {GATEWAY_CONFIGS.map((g) => (
                  <div key={g.id} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{g.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          g.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {g.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">{g.feeStructure}</span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-slate-700">{g.settlementTime}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setPaymentDocsModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Full Payment Integration Documentation</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ROLES & RBAC MANAGEMENT */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">User Role Management & Permissions</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Dynamically assign roles and inspect privileges across all 5 extensible tiers.
                  </p>
                </div>
                <button
                  onClick={() => setRolesModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Inspect Full Matrix (30 Permissions)</span>
                </button>
              </div>

              {/* Role counters */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
                {(['client', 'freelancer', 'admin', 'moderator', 'agency'] as UserRole[]).map((r) => {
                  const def = ROLE_DEFINITIONS[r];
                  const count = users.filter((u) => u.role === r).length;
                  return (
                    <div key={r} className={`p-3.5 rounded-2xl border ${def.badgeBg} ${def.borderColor}`}>
                      <span className={`font-bold block capitalize ${def.badgeText}`}>{def.name.split(' ')[0]}</span>
                      <span className="text-xl font-black font-mono text-slate-900 mt-1 block">{count}</span>
                      <span className="text-[10px] text-slate-600 block line-clamp-1">{def.tagline}</span>
                    </div>
                  );
                })}
              </div>

              {/* Users role table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden mt-4">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <tr>
                      <th className="p-3.5">User</th>
                      <th className="p-3.5">Title / Location</th>
                      <th className="p-3.5">Current Role</th>
                      <th className="p-3.5">Modify Role</th>
                      <th className="p-3.5 text-right">Quick Demo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => {
                      const def = (u.role in ROLE_DEFINITIONS ? ROLE_DEFINITIONS[u.role as UserRole] : null) || ROLE_DEFINITIONS.freelancer;
                      return (
                        <tr key={u.id} className="hover:bg-slate-50/50">
                          <td className="p-3.5">
                            <div className="flex items-center gap-2.5">
                              <img src={u.avatar_url} alt={u.full_name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                              <div>
                                <span className="font-bold text-slate-900 block">{u.full_name}</span>
                                <span className="text-[11px] text-slate-400 font-mono">{u.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="font-medium text-slate-700 block">{u.title}</span>
                            <span className="text-[11px] text-slate-400">{u.location}</span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${def.badgeBg} ${def.badgeText} ${def.borderColor}`}>
                              {def.name}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <select
                              value={u.role}
                              onChange={(e) => changeUserRole(u.id, e.target.value as UserRole)}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 cursor-pointer focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="client">Client / Business</option>
                              <option value="freelancer">Freelancer</option>
                              <option value="admin">Super Admin</option>
                              <option value="moderator">Trust Moderator</option>
                              <option value="agency">Agency / Studio</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => loginAs(u.id)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-900 text-slate-700 font-medium text-[11px] cursor-pointer transition-colors"
                            >
                              Sign In As
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GATEWAY TRANSACTIONS & ESCROW */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Escrow & Payment Transactions Ledger</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time audit of all UGX escrow deposits, platform commissions, and disbursements.
                  </p>
                </div>
                <button
                  onClick={() => setPaymentDocsModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>Integration Architecture & Code</span>
                </button>
              </div>

              {/* Transactions Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <tr>
                      <th className="p-3.5">Tx ID / Ref</th>
                      <th className="p-3.5">Project / Job</th>
                      <th className="p-3.5">Parties</th>
                      <th className="p-3.5">Method</th>
                      <th className="p-3.5">Amount (UGX)</th>
                      <th className="p-3.5">Platform Fee</th>
                      <th className="p-3.5">Net Payout</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50">
                        <td className="p-3.5">
                          <span className="font-mono font-bold text-slate-900 block">{tx.id}</span>
                          <span className="font-mono text-[10px] text-slate-400 truncate max-w-[120px] block">
                            {tx.gateway_reference}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-slate-900 block max-w-xs truncate">
                            {tx.job_title || 'Project Contract'}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">{tx.type.replace('_', ' ')}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-slate-700 block">From: {tx.client_name}</span>
                          {tx.freelancer_name && (
                            <span className="text-slate-500 text-[10px]">To: {tx.freelancer_name}</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                            {tx.payment_method.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-slate-900">
                          {formatUGX(tx.amount_ugx)}
                        </td>
                        <td className="p-3.5 font-mono font-semibold text-purple-700">
                          {formatUGX(tx.platform_fee_ugx)}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-emerald-700">
                          {formatUGX(tx.freelancer_net_ugx)}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            tx.status === 'released'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tx.status === 'escrow_locked'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {tx.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PAYOUT REQUESTS */}
        {activeTab === 'payouts' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Freelancer Mobile Money Payouts</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated transfers to MTN MoMo and Airtel Money phone numbers across Uganda.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <tr>
                      <th className="p-3.5">Payout ID</th>
                      <th className="p-3.5">Freelancer</th>
                      <th className="p-3.5">Mobile Number & Account</th>
                      <th className="p-3.5">Gross Amount</th>
                      <th className="p-3.5">Net Disbursed</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payoutRequests.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="p-3.5 font-mono font-bold text-slate-900">{p.id}</td>
                        <td className="p-3.5 font-bold text-slate-900">{p.freelancer_name}</td>
                        <td className="p-3.5">
                          <span className="font-mono font-bold text-slate-800 block">{p.account_phone}</span>
                          <span className="text-[10px] text-slate-400 capitalize">{p.account_name} · {p.payment_method.replace('_', ' ')}</span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-700">{formatUGX(p.amount_ugx)}</td>
                        <td className="p-3.5 font-mono font-bold text-emerald-700">{formatUGX(p.net_payout_ugx)}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          {p.status !== 'completed' ? (
                            <button
                              onClick={() => approvePayout(p.id)}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer"
                            >
                              Approve Payout
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Security & Operational Audit Trail</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cryptographic logging of role escalations, escrow releases, and platform actions.
              </p>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[10px]">
                        {log.action}
                      </span>
                      <span className="font-semibold text-slate-900">{log.actor_name} ({log.actor_role})</span>
                    </div>
                    <p className="text-slate-600 mt-1">{log.details}</p>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px] shrink-0">
                    {formatDate(log.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Moderation Queue</h3>
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-red-600 uppercase">{r.reason}</span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">Target: {r.target_name_or_title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{r.details}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                  {r.status === 'pending' && (
                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => resolveReport(r.id, 'resolved')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs cursor-pointer"
                      >
                        Action & Resolve
                      </button>
                      <button
                        onClick={() => resolveReport(r.id, 'dismissed')}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-bold text-xs cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: JOBS */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">All Job Postings</h3>
            <div className="divide-y divide-slate-100">
              {jobs.map((j) => (
                <div key={j.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{j.title}</span>
                    <span className="text-slate-400">{j.client_name || j.organizer_name} · {formatUGX(j.budget_ugx || j.starting_price_ugx || 0)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFeatureJob(j.id)}
                      className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                        j.is_featured ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {j.is_featured ? 'Featured' : 'Standard'}
                    </button>
                    <button
                      onClick={() => deleteJob(j.id)}
                      className="p-1 rounded text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: FREELANCERS */}
        {activeTab === 'freelancers' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Manage Freelancers</h3>
            <div className="divide-y divide-slate-100">
              {users.filter((u) => u.role === 'freelancer').map((f) => (
                <div key={f.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={f.avatar_url} alt={f.full_name} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <span className="font-bold text-slate-900 block">{f.full_name}</span>
                      <span className="text-slate-400">{f.title} · {f.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleVerifyUser(f.id)}
                      className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                        f.is_verified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {f.is_verified ? 'Verified NIN' : 'Unverified'}
                    </button>
                    <button
                      onClick={() => toggleFeatureFreelancer(f.id)}
                      className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                        f.is_featured ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {f.is_featured ? 'Featured' : 'Normal'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: MONETIZATION */}
        {activeTab === 'monetization' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs max-w-xl space-y-6">
            <h3 className="text-base font-bold text-slate-900">Monetization & Commission Rates</h3>
            {settingsSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Monetization parameters updated successfully!</span>
              </div>
            )}
            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Platform Commission on Completed Jobs (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="30"
                  required
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                />
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
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
