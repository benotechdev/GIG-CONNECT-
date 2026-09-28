import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  Clock,
  PlusCircle,
  Coins,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUGX, formatDate } from '../utils/formatters';

export const ClientDashboardPage: React.FC = () => {
  const {
    currentUser,
    jobs,
    applications,
    projects,
    acceptApplication,
    rejectApplication,
    completeAndReleaseProject,
    setCurrentView,
    setSelectedJobId,
    setActiveConversationUserId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'jobs' | 'proposals' | 'contracts'>('jobs');

  // Filter client's items
  const clientJobs = jobs.filter((j) => j.client_id === currentUser?.id || currentUser?.role === 'admin');
  const clientJobIds = clientJobs.map((j) => j.id);

  const clientApplications = applications.filter((a) => clientJobIds.includes(a.job_id));
  const pendingApplications = clientApplications.filter((a) => a.status === 'pending');

  const clientProjects = projects.filter(
    (p) => p.client_id === currentUser?.id || currentUser?.role === 'admin'
  );

  const totalSpent = currentUser?.spent_ugx || 0;

  const handleHireApplicant = (appId: string) => {
    acceptApplication(appId);
    setActiveTab('contracts');
  };

  const handleChat = (freelancerId: string) => {
    setActiveConversationUserId(freelancerId);
    setCurrentView('messages');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar_url}
              alt={currentUser?.full_name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/40 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">{currentUser?.full_name}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  Client Account
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentUser?.title} · {currentUser?.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('post-job')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Job (UGX)</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase block">Active Postings</span>
            <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
              {clientJobs.length}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase block">Total Proposals</span>
            <span className="text-2xl font-black text-blue-600 font-mono mt-1 block">
              {clientApplications.length}
            </span>
            <span className="text-[11px] text-amber-600 font-bold mt-0.5 block">
              {pendingApplications.length} awaiting review
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase block">Active Contracts</span>
            <span className="text-2xl font-black text-indigo-600 font-mono mt-1 block">
              {clientProjects.filter((p) => p.stage !== 'completed').length}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase block">Total Volume Spent</span>
            <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">
              {formatUGX(totalSpent)}
            </span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 space-x-6 text-sm">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 ${
              activeTab === 'jobs'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Job Postings ({clientJobs.length})
          </button>

          <button
            onClick={() => setActiveTab('proposals')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 relative ${
              activeTab === 'proposals'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Received Proposals ({clientApplications.length})
            {pendingApplications.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
                {pendingApplications.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('contracts')}
            className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 ${
              activeTab === 'contracts'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Contracts & Milestones ({clientProjects.length})
          </button>
        </div>

        {/* Tab 1: My Jobs */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            {clientJobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <p className="text-sm text-slate-500">You haven't posted any jobs yet.</p>
                <button
                  onClick={() => setCurrentView('post-job')}
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold"
                >
                  Post Your First Job in UGX
                </button>
              </div>
            ) : (
              clientJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-blue-700">{job.category}</span>
                      <span>·</span>
                      <span className="text-slate-400">{formatDate(job.created_at)}</span>
                      <span>·</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                          job.status === 'open'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900">{job.title}</h3>

                    <p className="text-xs text-slate-500 line-clamp-1">{job.description}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 uppercase font-bold block">Budget</span>
                      <span className="text-sm font-extrabold text-slate-900 font-mono">
                        {formatUGX(job.budget_ugx)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 uppercase font-bold block">Proposals</span>
                      <span className="text-sm font-bold text-blue-700">
                        {job.applications_count} bids
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setActiveTab('proposals');
                      }}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      View Bids
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Proposals Reviewer */}
        {activeTab === 'proposals' && (
          <div className="space-y-4">
            {clientApplications.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-sm text-slate-500">
                No proposals received yet.
              </div>
            ) : (
              clientApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.freelancer_avatar}
                        alt={app.freelancer_name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">
                            {app.freelancer_name}
                          </h4>
                          <span className="text-xs text-amber-700 font-bold">
                            ★ {app.freelancer_rating.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{app.freelancer_title}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Proposed Bid
                        </span>
                        <span className="text-base font-extrabold text-blue-900 font-mono">
                          {formatUGX(app.proposed_budget_ugx)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Timeline
                        </span>
                        <span className="text-sm font-bold text-slate-800">
                          {app.estimated_days} Days
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-500 block mb-1">
                      Applied for: <strong className="text-slate-800">{app.job_title}</strong>
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      {app.cover_letter}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => handleChat(app.freelancer_id)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>Message Freelancer</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {app.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => rejectApplication(app.id)}
                            className="px-4 py-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleHireApplicant(app.id)}
                            className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Hire & Lock Escrow ({formatUGX(app.proposed_budget_ugx)})</span>
                          </button>
                        </>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                            app.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Contracts */}
        {activeTab === 'contracts' && (
          <div className="space-y-4">
            {clientProjects.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-sm text-slate-500">
                No active contracts. Hire a freelancer from your received proposals to start a project.
              </div>
            ) : (
              clientProjects.map((contract) => (
                <div
                  key={contract.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            contract.stage === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          Stage: {contract.stage.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-400">
                          Started {formatDate(contract.created_at)}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-slate-900 mt-1">
                        {contract.job_title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Freelancer: <strong>{contract.freelancer_name}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 uppercase font-bold block">
                        Locked in Escrow
                      </span>
                      <span className="text-lg font-black text-blue-900 font-mono">
                        {formatUGX(contract.agreed_amount_ugx)}
                      </span>
                    </div>
                  </div>

                  {contract.deliverable_note && (
                    <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-blue-950 block">Freelancer Deliverables:</span>
                      <p className="text-slate-700">{contract.deliverable_note}</p>
                      {contract.deliverable_url && (
                        <a
                          href={contract.deliverable_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-700 font-bold hover:underline"
                        >
                          <span>Review Work Files</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleChat(contract.freelancer_id)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                    >
                      Chat with {contract.freelancer_name}
                    </button>

                    {contract.stage !== 'completed' ? (
                      <button
                        onClick={() => completeAndReleaseProject(contract.id)}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve Work & Release {formatUGX(contract.freelancer_payout_ugx)}</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>Completed & Paid in Full</span>
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
