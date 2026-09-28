import React, { useState } from 'react';
import {
  CheckCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Coins,
  ShieldCheck,
  Send,
  Sparkles,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProjectContract, ProjectStage } from '../types';
import { formatUGX, formatDate } from '../utils/formatters';

export const ProjectTrackingPage: React.FC = () => {
  const {
    projects,
    currentUser,
    updateProjectStage,
    completeAndReleaseProject,
    setActiveConversationUserId,
    setCurrentView,
    setAuthModalOpen,
  } = useApp();

  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');
  const [activeContractId, setActiveContractId] = useState<string | null>(
    projects.length > 0 ? projects[0].id : null
  );

  // Deliverable submission state
  const [deliverableNote, setDeliverableNote] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [submittingDeliverable, setSubmittingDeliverable] = useState(false);

  // Filter projects relevant to current user, or show all if admin/demo
  const userProjects = projects.filter((p) => {
    if (!currentUser) return true;
    if (currentUser.role === 'admin') return true;
    return p.client_id === currentUser.id || p.freelancer_id === currentUser.id;
  });

  const filteredProjects = userProjects.filter((p) => {
    if (selectedStageFilter === 'all') return true;
    return p.stage === selectedStageFilter;
  });

  const activeContract = projects.find((p) => p.id === activeContractId) || filteredProjects[0];

  const pipelineStages: { stage: ProjectStage; label: string; desc: string }[] = [
    { stage: 'posted', label: '1. Posted', desc: 'Job live on Gig Connect UG' },
    { stage: 'applied', label: '2. Applied', desc: 'Proposals reviewed' },
    { stage: 'hired', label: '3. Hired', desc: 'Contract created & funded' },
    { stage: 'in_progress', label: '4. In Progress', desc: 'Active execution' },
    { stage: 'completed', label: '5. Completed', desc: 'Payment released in UGX' },
  ];

  const getStageIndex = (stage: ProjectStage): number => {
    switch (stage) {
      case 'posted':
        return 0;
      case 'applied':
        return 1;
      case 'hired':
        return 2;
      case 'in_progress':
        return 3;
      case 'completed':
        return 4;
      default:
        return 2;
    }
  };

  const handleStartWork = (contractId: string) => {
    updateProjectStage(contractId, 'in_progress');
  };

  const handleSubmitWork = (e: React.FormEvent, contractId: string) => {
    e.preventDefault();
    if (!deliverableNote.trim()) return;

    updateProjectStage(
      contractId,
      'in_progress',
      deliverableNote.trim(),
      deliverableUrl.trim()
    );
    setSubmittingDeliverable(false);
  };

  const handleApproveAndRelease = (contractId: string) => {
    completeAndReleaseProject(contractId);
  };

  const handleOpenChat = (otherUserId: string) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setActiveConversationUserId(otherUserId);
    setCurrentView('messages');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
              <span>MILESTONE ESCROW SYSTEM</span>
              <span className="w-6 h-0.5 bg-blue-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Project Pipeline Tracker
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Transparent 5-step lifecycle: <strong>Posted → Applied → Hired → In Progress → Completed</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filter by Stage:</span>
            <select
              value={selectedStageFilter}
              onChange={(e) => setSelectedStageFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 font-semibold focus:outline-hidden focus:border-blue-600"
            >
              <option value="all">All Stages</option>
              <option value="hired">Hired (Pre-start)</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed & Paid</option>
            </select>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contracts Sidebar List */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Active Contracts ({filteredProjects.length})
            </h3>

            {filteredProjects.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-xs text-slate-500">
                No contracts in this view.
              </div>
            ) : (
              filteredProjects.map((contract) => {
                const isSelected = activeContract?.id === contract.id;
                const isClient = currentUser?.id === contract.client_id;
                const counterPartyName = isClient
                  ? contract.freelancer_name
                  : contract.client_name;
                const counterPartyAvatar = isClient
                  ? contract.freelancer_avatar
                  : contract.client_avatar;

                return (
                  <div
                    key={contract.id}
                    onClick={() => setActiveContractId(contract.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 shadow-md ring-1 ring-blue-600'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          contract.stage === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : contract.stage === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {contract.stage.replace('_', ' ')}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {formatUGX(contract.agreed_amount_ugx)}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {contract.job_title}
                    </h4>

                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-200/60">
                      <img
                        src={counterPartyAvatar}
                        alt={counterPartyName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs text-slate-600 truncate">
                        {isClient ? 'Freelancer: ' : 'Client: '}
                        <strong>{counterPartyName}</strong>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Active Contract Deep Dive */}
          <div className="lg:col-span-8">
            {activeContract ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-8">
                {/* Title & Parties */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                      Contract #{activeContract.id}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                      {activeContract.job_title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Initiated on {formatDate(activeContract.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        handleOpenChat(
                          currentUser?.id === activeContract.client_id
                            ? activeContract.freelancer_id
                            : activeContract.client_id
                        )
                      }
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                      <span>Chat Directly</span>
                    </button>
                  </div>
                </div>

                {/* 5-Step Visual Pipeline */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-6">
                    Project Stage Progression
                  </h3>

                  <div className="relative">
                    {/* Background line */}
                    <div className="absolute top-5 left-4 right-4 h-1 bg-slate-200 -z-0" />
                    {/* Active line */}
                    <div
                      className="absolute top-5 left-4 h-1 bg-blue-600 -z-0 transition-all duration-500"
                      style={{
                        width: `${(getStageIndex(activeContract.stage) / 4) * 100}%`,
                      }}
                    />

                    <div className="grid grid-cols-5 gap-2 relative z-10">
                      {pipelineStages.map((s, idx) => {
                        const currentIndex = getStageIndex(activeContract.stage);
                        const isDone = idx < currentIndex;
                        const isCurrent = idx === currentIndex;

                        return (
                          <div key={s.stage} className="flex flex-col items-center text-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all ${
                                isDone
                                  ? 'bg-blue-600 text-white'
                                  : isCurrent
                                  ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 scale-110'
                                  : 'bg-white border-2 border-slate-300 text-slate-400'
                              }`}
                            >
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span
                              className={`text-xs mt-2 font-bold ${
                                isCurrent
                                  ? 'text-amber-900'
                                  : isDone
                                  ? 'text-blue-900'
                                  : 'text-slate-400'
                              }`}
                            >
                              {s.label.split('. ')[1]}
                            </span>
                            <span className="hidden sm:inline text-[10px] text-slate-400 max-w-[90px] leading-tight mt-0.5">
                              {s.desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Financial Escrow Breakdown */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Escrow Financial Breakdown (UGX)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Agreed Total Amount</span>
                      <span className="text-base font-extrabold text-slate-900 font-mono">
                        {formatUGX(activeContract.agreed_amount_ugx)}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Platform Commission (10%)</span>
                      <span className="text-base font-bold text-slate-600 font-mono">
                        {formatUGX(activeContract.platform_fee_ugx)}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-emerald-200 bg-emerald-50/20">
                      <span className="text-emerald-800 font-bold block text-[11px]">Freelancer Payout</span>
                      <span className="text-base font-extrabold text-emerald-700 font-mono">
                        {formatUGX(activeContract.freelancer_payout_ugx)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deliverables & Work Submission Area */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-blue-600" />
                    <span>Project Deliverables & Handover</span>
                  </h4>

                  {activeContract.deliverable_note ? (
                    <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-950">Submitted Work Deliverable:</span>
                        <span className="text-slate-400">
                          Updated {formatDate(activeContract.updated_at)}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        {activeContract.deliverable_note}
                      </p>
                      {activeContract.deliverable_url && (
                        <a
                          href={activeContract.deliverable_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-700 font-bold hover:underline pt-1"
                        >
                          <span>Open Deliverable Link / Repository</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      No deliverables submitted yet. Freelancer is currently working on the milestones.
                    </p>
                  )}

                  {/* Actions for Freelancer */}
                  {currentUser?.id === activeContract.freelancer_id && activeContract.stage !== 'completed' && (
                    <div className="pt-2">
                      {activeContract.stage === 'hired' && (
                        <button
                          onClick={() => handleStartWork(activeContract.id)}
                          className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          Start Active Development
                        </button>
                      )}

                      {activeContract.stage === 'in_progress' && (
                        <div>
                          {!submittingDeliverable ? (
                            <button
                              onClick={() => setSubmittingDeliverable(true)}
                              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                            >
                              Submit Completed Work / Update Deliverables
                            </button>
                          ) : (
                            <form
                              onSubmit={(e) => handleSubmitWork(e, activeContract.id)}
                              className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3"
                            >
                              <h5 className="font-bold text-xs text-slate-900">
                                Submit Deliverables for Client Review
                              </h5>
                              <textarea
                                rows={3}
                                required
                                placeholder="Describe what you built, how to test it, and deliverables included..."
                                value={deliverableNote}
                                onChange={(e) => setDeliverableNote(e.target.value)}
                                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                              />
                              <input
                                type="url"
                                placeholder="Link to GitHub, Figma, Google Drive, or Live App URL"
                                value={deliverableUrl}
                                onChange={(e) => setDeliverableUrl(e.target.value)}
                                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                              />
                              <div className="flex gap-2">
                                <button
                                  type="submit"
                                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                                >
                                  Submit Deliverable
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSubmittingDeliverable(false)}
                                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions for Client */}
                  {currentUser?.id === activeContract.client_id && activeContract.stage !== 'completed' && (
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>Client Action: Milestone Review & Payment Release</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Once you verify the deliverables provided by {activeContract.freelancer_name}, click below to release <strong>{formatUGX(activeContract.freelancer_payout_ugx)}</strong> directly to their Ugandan Mobile Money wallet.
                      </p>
                      <button
                        onClick={() => handleApproveAndRelease(activeContract.id)}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve Deliverables & Release {formatUGX(activeContract.agreed_amount_ugx)}</span>
                      </button>
                    </div>
                  )}

                  {activeContract.stage === 'completed' && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 font-bold">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span>
                        Project Completed & Funds Released to Freelancer on {formatDate(activeContract.completed_at || activeContract.updated_at)}!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
                Select a contract to view details and progression.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
