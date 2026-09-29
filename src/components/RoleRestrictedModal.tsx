import React from 'react';
import { ShieldAlert, ArrowRight, UserCheck, X, Briefcase, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ROLE_DEFINITIONS, UserRole } from '../types';

export const RoleRestrictedModal: React.FC = () => {
  const {
    roleRestrictedNotice,
    setRoleRestrictedNotice,
    currentUser,
    loginAs,
    users,
    setCurrentView,
  } = useApp();

  if (!roleRestrictedNotice) return null;

  const { action, requiredRole, reason } = roleRestrictedNotice;
  const currentRoleDef = currentUser && (currentUser.role in ROLE_DEFINITIONS) ? ROLE_DEFINITIONS[currentUser.role as UserRole] : null;
  const requiredRoleDef = (requiredRole in ROLE_DEFINITIONS) ? ROLE_DEFINITIONS[requiredRole as UserRole] : null;

  const targetDemoUser = users.find((u) => u.role === requiredRole);

  const handleSwitchToRequiredRole = () => {
    if (targetDemoUser) {
      loginAs(targetDemoUser.id);
    }
    setRoleRestrictedNotice(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden relative">
        {/* Banner */}
        <div className="bg-amber-500/10 border-b border-amber-200/60 p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-700 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
              Access Permission Guard
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              Action Restricted: {action}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              {reason}
            </p>
          </div>
          <button
            onClick={() => setRoleRestrictedNotice(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison card */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-medium block">Current Account Role</span>
              <span className="font-bold text-slate-900 mt-0.5 block capitalize">
                {currentRoleDef?.name || 'Guest / Not Signed In'}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {currentRoleDef?.tagline || 'Browse public directory'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
              <span className="text-blue-600 font-medium block">Required Role</span>
              <span className="font-bold text-blue-950 mt-0.5 block capitalize">
                {requiredRoleDef?.name || requiredRole}
              </span>
              <span className="text-[11px] text-blue-700 mt-1 block">
                {requiredRoleDef?.tagline || 'Authorized capabilities'}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-600">
            <p className="font-semibold text-slate-800">Why does Gig Connect UG enforce role boundaries?</p>
            <p>
              To protect Ugandan clients and freelancers, job posting and milestone escrow are strictly handled by Client accounts, while proposal bids and portfolio submissions are handled by verified Freelancers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            {targetDemoUser && (
              <button
                onClick={handleSwitchToRequiredRole}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>Switch to Demo {requiredRoleDef?.name || requiredRole}</span>
              </button>
            )}

            <button
              onClick={() => {
                setRoleRestrictedNotice(null);
                if (requiredRole === 'client') {
                  setCurrentView('jobs');
                } else {
                  setCurrentView('freelancers');
                }
              }}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs cursor-pointer"
            >
              Cancel & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
