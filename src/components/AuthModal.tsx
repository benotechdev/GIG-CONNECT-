import React, { useState } from 'react';
import { X, User, Briefcase, Shield, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginAs,
    signUp,
    users,
  } = useApp();

  const [role, setRole] = useState<UserRole>('freelancer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+256 ');
  const [location, setLocation] = useState('Kampala, Uganda');
  const [title, setTitle] = useState('');
  const [hourlyRate, setHourlyRate] = useState('45000');
  const [skills, setSkills] = useState('React, TypeScript, Tailwind');

  if (!authModalOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signUp({
      full_name: fullName || (role === 'client' ? 'Acme Client' : 'Ugandan Specialist'),
      email: email || `user-${Date.now()}@gigconnect.ug`,
      role,
      phone,
      location,
      title: title || (role === 'client' ? 'Business Founder' : 'Freelance Specialist'),
      hourly_rate_ugx: Number(hourlyRate) || 45000,
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Login with existing user by email or pick first matching
    const match = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (match) {
      loginAs(match.id);
    } else {
      // If not found, log in as first user or demo
      loginAs('user-free-1');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <BrandLogo size="sm" showTagline={false} />
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto">
          {/* Quick Demo Logins Section */}
          <div className="mb-6 p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
            <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
              ⚡ Instant 1-Click Demo Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => loginAs('user-client-1')}
                className="p-2.5 rounded-xl bg-white hover:bg-blue-600 hover:text-white border border-blue-200 text-left transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-1 text-[11px] font-bold text-blue-800 group-hover:text-white">
                  <Briefcase className="w-3 h-3" />
                  <span>Client</span>
                </div>
                <p className="text-[10px] text-slate-500 group-hover:text-blue-100 truncate mt-0.5">
                  David Ssekandi
                </p>
              </button>

              <button
                type="button"
                onClick={() => loginAs('user-free-1')}
                className="p-2.5 rounded-xl bg-white hover:bg-amber-600 hover:text-white border border-amber-200 text-left transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800 group-hover:text-white">
                  <User className="w-3 h-3" />
                  <span>Freelancer</span>
                </div>
                <p className="text-[10px] text-slate-500 group-hover:text-amber-100 truncate mt-0.5">
                  Brian Kato
                </p>
              </button>

              <button
                type="button"
                onClick={() => loginAs('user-admin-1')}
                className="p-2.5 rounded-xl bg-white hover:bg-purple-600 hover:text-white border border-purple-200 text-left transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-1 text-[11px] font-bold text-purple-800 group-hover:text-white">
                  <Shield className="w-3 h-3" />
                  <span>Admin</span>
                </div>
                <p className="text-[10px] text-slate-500 group-hover:text-purple-100 truncate mt-0.5">
                  Grace Atuhaire
                </p>
              </button>
            </div>
          </div>

          {/* Mode switch tabs */}
          <div className="flex border-b border-slate-200 mb-5">
            <button
              onClick={() => setAuthModalMode('login')}
              className={`pb-2.5 px-4 text-sm font-bold cursor-pointer transition-colors ${
                authModalMode === 'login'
                  ? 'border-b-2 border-blue-600 text-blue-700'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthModalMode('register')}
              className={`pb-2.5 px-4 text-sm font-bold cursor-pointer transition-colors ${
                authModalMode === 'register'
                  ? 'border-b-2 border-blue-600 text-blue-700'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Mode: Login */}
          {authModalMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. brian.kato@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600 text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Sign In to Gig Connect UG
              </button>
            </form>
          )}

          {/* Mode: Register */}
          {authModalMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Role selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  I want to:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('freelancer')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      role === 'freelancer'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <User className="w-4 h-4 mb-1 text-blue-600" />
                    <div className="text-xs">Work as Freelancer</div>
                    <div className="text-[10px] text-slate-500 font-normal">Earn in UGX</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      role === 'client'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 mb-1 text-blue-600" />
                    <div className="text-xs">Hire Freelancers</div>
                    <div className="text-[10px] text-slate-500 font-normal">Post jobs in UGX</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brian Kato or Sarah Namubiru"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.ug"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone (MoMo/Airtel)
                  </label>
                  <input
                    type="text"
                    placeholder="+256 772 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Location (City / District)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kampala, Nakasero or Jinja"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Professional Title / Role
                </label>
                <input
                  type="text"
                  placeholder={
                    role === 'freelancer'
                      ? 'e.g. Senior Mobile App Developer'
                      : 'e.g. Managing Director at Nile Tech'
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600 text-slate-900"
                />
              </div>

              {role === 'freelancer' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Hourly Rate (UGX)
                    </label>
                    <input
                      type="number"
                      step="5000"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Top Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="React, Figma, SEO"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600 text-slate-900"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-colors cursor-pointer shadow-xs mt-2"
              >
                Join Gig Connect UG Free
              </button>
            </form>
          )}

          {/* Switch tab mode */}
          {authModalMode === 'switch' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Choose an existing account to test different roles and perspectives:
              </p>
              <div className="space-y-2">
                {users.slice(0, 6).map((u) => (
                  <div
                    key={u.id}
                    onClick={() => loginAs(u.id)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar_url}
                        alt={u.full_name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{u.full_name}</p>
                        <p className="text-[11px] text-slate-500 capitalize">
                          {u.role} · {u.title}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
