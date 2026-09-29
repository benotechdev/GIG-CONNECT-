import React, { useState } from 'react';
import {
  Shield,
  X,
  Check,
  Minus,
  Users,
  Briefcase,
  Coins,
  FileCheck,
  Lock,
  ArrowRight,
  Code,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ROLE_DEFINITIONS, PERMISSION_GROUPS, UserRole, Permission } from '../types';

export const RolesExplorerModal: React.FC = () => {
  const { rolesModalOpen, setRolesModalOpen, currentUser, loginAs, users } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser?.role || 'client');
  const [activeTab, setActiveTab] = useState<'matrix' | 'scalability' | 'json'>('matrix');

  if (!rolesModalOpen) return null;

  const currentRoleDef = ROLE_DEFINITIONS[selectedRole];
  const allRoles = Object.keys(ROLE_DEFINITIONS) as UserRole[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Role & Permission System (RBAC)</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500 text-white font-mono">
                  Scalable v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Granular access control, privilege boundaries & extensible roles for Gig Connect UG
              </p>
            </div>
          </div>
          <button
            onClick={() => setRolesModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 pt-4 border-b border-slate-200 bg-slate-50 text-xs">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 ${
                activeTab === 'matrix'
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Role Permission Matrix
            </button>
            <button
              onClick={() => setActiveTab('scalability')}
              className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 ${
                activeTab === 'scalability'
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Scalability & Future Roles
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 font-mono ${
                activeTab === 'json'
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Schema & JSON Definition
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 pb-2 text-[11px] text-slate-500">
            <span>Signed in as:</span>
            <span className="font-bold text-slate-900 capitalize">{currentUser?.role || 'Guest'}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'matrix' && (
            <div className="space-y-6">
              {/* Role Select Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Role to Inspect Privileges
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {allRoles.map((r) => {
                    const def = ROLE_DEFINITIONS[r];
                    const isSelected = selectedRole === r;
                    const isCurrent = currentUser?.role === r;

                    return (
                      <button
                        key={r}
                        onClick={() => setSelectedRole(r)}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? `${def.badgeBg} ${def.borderColor} border-2 shadow-xs`
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold capitalize ${isSelected ? def.badgeText : 'text-slate-900'}`}>
                            {def.name.split(' ')[0]}
                          </span>
                          {isCurrent && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Your active role" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 block line-clamp-1">
                          {def.tagline}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Role description card */}
              <div className={`p-4 rounded-2xl border ${currentRoleDef.badgeBg} ${currentRoleDef.borderColor}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-slate-900">{currentRoleDef.name}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/80 border border-slate-300 text-slate-700">
                        {currentRoleDef.isSystemRole ? 'System Primary' : 'Extensible Custom'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1">{currentRoleDef.description}</p>
                  </div>

                  {currentUser?.role !== selectedRole && (
                    <button
                      onClick={() => {
                        const demoUser = users.find((u) => u.role === selectedRole);
                        if (demoUser) {
                          loginAs(demoUser.id);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shrink-0 cursor-pointer shadow-xs transition-colors"
                    >
                      Demo As {currentRoleDef.name.split(' ')[0]}
                    </button>
                  )}
                </div>
              </div>

              {/* Granular Permission Checklist */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Permission Matrix Evaluation ({currentRoleDef.permissions.length} Granted)
                </h4>

                <div className="space-y-4">
                  {PERMISSION_GROUPS.map((group) => {
                    return (
                      <div key={group.category} className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{group.category}</span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {group.permissions.filter((p) => currentRoleDef.permissions.includes(p.key)).length} / {group.permissions.length} allowed
                          </span>
                        </div>

                        <div className="divide-y divide-slate-100">
                          {group.permissions.map((perm) => {
                            const isAllowed = currentRoleDef.permissions.includes(perm.key);
                            return (
                              <div
                                key={perm.key}
                                className={`px-4 py-2.5 flex items-center justify-between text-xs transition-colors ${
                                  isAllowed ? 'bg-emerald-50/20' : 'bg-slate-50/20 opacity-60'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className={`font-semibold ${isAllowed ? 'text-slate-900' : 'text-slate-400'}`}>
                                      {perm.label}
                                    </span>
                                    <code className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                                      {perm.key}
                                    </code>
                                  </div>
                                  <p className="text-[11px] text-slate-500 mt-0.5">{perm.description}</p>
                                </div>

                                <div className="shrink-0 pl-3">
                                  {isAllowed ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      Granted
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-400 text-[10px] font-medium">
                                      <Minus className="w-3 h-3 text-slate-400" />
                                      Denied
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scalability' && (
            <div className="space-y-6 text-xs text-slate-700">
              <div className="bg-purple-50 p-5 rounded-2xl border border-purple-200 space-y-2">
                <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Scalable Role Architecture for Future Growth</span>
                </div>
                <p>
                  Gig Connect UG is engineered with decoupled, schema-backed RBAC rather than hardcoded boolean flags. This enables seamless future expansion without breaking existing user accounts.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                    1
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Moderator Role (Active)</h4>
                  <p className="text-slate-600 text-[11px]">
                    Equipped with <code className="text-purple-700 font-mono">jobs:moderate</code>, <code className="text-purple-700 font-mono">freelancer:badge_verify</code>, and <code className="text-purple-700 font-mono">admin:moderate_reports</code>. They review NIN identities, flag spam listings, and arbitrate escrow disputes without touching platform revenue settings.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                    2
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Agency / Studio Role (Active)</h4>
                  <p className="text-slate-600 text-[11px]">
                    Allows Ugandan design studios and software houses to manage team member rosters, submit high-tier enterprise proposals, and pool collective portfolio credentials under one corporate billing account.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    3
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Custom Permission Overrides</h4>
                  <p className="text-slate-600 text-[11px]">
                    The <code className="text-purple-700 font-mono">profiles.custom_permissions TEXT[]</code> column enables granting specific privileges to individual enterprise users (e.g., dedicated corporate finance auditors) without creating new top-level roles.
                  </p>
                </div>
              </div>

              {/* How to add a role guide */}
              <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl font-mono text-[11px] space-y-3">
                <span className="text-amber-400 font-bold block uppercase tracking-wider text-[10px]">
                  Adding a New Role in 3 Steps:
                </span>
                <p className="text-slate-400">
                  1. Insert new role into <code className="text-blue-300">public.roles (id, name, description)</code> in Supabase.
                </p>
                <p className="text-slate-400">
                  2. Map permissions in <code className="text-blue-300">public.role_permissions (role_id, permission_id)</code>.
                </p>
                <p className="text-slate-400">
                  3. Add the role identifier to the TypeScript union <code className="text-amber-300">UserRole</code> in <code className="text-slate-300">/src/types/rbac.ts</code>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">TypeScript / JSON Schema Mapping</span>
                <span className="text-slate-500 font-mono text-[11px]">5 Roles Defined · 30 Granular Permissions</span>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto max-h-96">
{JSON.stringify(ROLE_DEFINITIONS, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
