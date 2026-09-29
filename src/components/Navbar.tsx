import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  PlusCircle,
  MessageSquare,
  Bell,
  Bookmark,
  ChevronDown,
  Shield,
  User as UserIcon,
  LogOut,
  Database,
  Menu,
  X,
  CheckCircle,
  ExternalLink,
  Coins,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { formatCompactUGX } from '../utils/formatters';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    users,
    loginAs,
    logout,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    savedJobIds,
    currentView,
    setCurrentView,
    setAuthModalOpen,
    setAuthModalMode,
    setSupabaseModalOpen,
    setRolesModalOpen,
    setPaymentDocsModalOpen,
    isSupabaseLive,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Unread notifications for current user
  const userNotifications = notifications.filter(
    (n) => currentUser && n.user_id === currentUser.id
  );
  const unreadCount = userNotifications.filter((n) => !n.is_read).length;

  const navigateTo = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setNotifDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top micro announcement bar */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500 text-slate-950">
              UGANDA
            </span>
            <span className="hidden sm:inline text-slate-300">
              Empowering local tech, creative & business talent. Pay & earn securely in UGX.
            </span>
            <span className="sm:hidden text-slate-300">Uganda's Freelance Platform</span>
          </div>

          <div className="flex items-center gap-3 text-slate-300 text-[11px]">
            {/* RBAC Matrix button */}
            <button
              onClick={() => setRolesModalOpen(true)}
              className="hidden lg:inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              title="Inspect user roles & granular permissions system"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Roles & RBAC</span>
            </button>

            {/* Payment gateway docs pill */}
            <button
              onClick={() => setPaymentDocsModalOpen(true)}
              className="inline-flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer"
              title="View Uganda Payment Gateway recommendation & technical integration report"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-amber-300">UGX Escrow & Gateway</span>
            </button>

            {/* Supabase status pill */}
            <button
              onClick={() => setSupabaseModalOpen(true)}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer group"
              title="Click to view Supabase database schema & configuration"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-[10px] font-medium hidden sm:inline">
                {isSupabaseLive ? 'Supabase: Live' : 'DB: Ready / SQL'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            {/* Quick demo switcher */}
            <div className="hidden md:flex items-center gap-1.5 border-l border-slate-700 pl-3">
              <span className="text-slate-400 text-[10px]">Test Role:</span>
              <button
                onClick={() => loginAs('user-org-1')}
                className={`px-1.5 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                  currentUser?.id === 'user-org-1'
                    ? 'bg-amber-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
                title="Talent Africa Group"
              >
                Organizer
              </button>
              <button
                onClick={() => loginAs('user-attendee-1')}
                className={`px-1.5 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                  currentUser?.id === 'user-attendee-1'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
                title="Brian Kato"
              >
                Attendee
              </button>
              <button
                onClick={() => loginAs('user-admin-1')}
                className={`px-1.5 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                  currentUser?.id === 'user-admin-1'
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => loginAs('user-mod-1')}
                className={`px-1.5 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                  currentUser?.id === 'user-mod-1'
                    ? 'bg-teal-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                Moderator
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 text-left cursor-pointer group focus:outline-hidden"
          >
            <BrandLogo size="md" showTagline={true} />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => navigateTo('events')}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                currentView === 'events'
                  ? 'bg-blue-50 text-blue-700 font-extrabold'
                  : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              Browse Events
            </button>

            <button
              onClick={() => navigateTo('organizers')}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                currentView === 'organizers'
                  ? 'bg-blue-50 text-blue-700 font-extrabold'
                  : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              Top Organizers
            </button>

            <button
              onClick={() => navigateTo('my-tickets')}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                currentView === 'my-tickets'
                  ? 'bg-emerald-50 text-emerald-800 font-extrabold'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              My E-Tickets
            </button>

            {(currentUser?.role === 'organizer' || currentUser?.role === 'client' || currentUser?.role === 'agency') && (
              <button
                onClick={() => navigateTo('organizer-dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                  currentView === 'organizer-dashboard'
                    ? 'bg-amber-50 text-amber-900 font-extrabold'
                    : 'text-slate-700 hover:text-amber-800 hover:bg-slate-50'
                }`}
              >
                Organizer Dashboard
              </button>
            )}

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => navigateTo('admin-dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'admin-dashboard'
                    ? 'bg-purple-50 text-purple-700 font-extrabold'
                    : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </button>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Bookmarks */}
            <button
              onClick={() => navigateTo('saved')}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative cursor-pointer"
              title="Saved Jobs & Favorites"
            >
              <Bookmark className="w-5 h-5" />
              {savedJobIds.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>

            {/* Messages */}
            <button
              onClick={() => navigateTo('messages')}
              className={`p-2 rounded-lg relative cursor-pointer ${
                currentView === 'messages'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Direct Messages"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                    <h4 className="font-semibold text-sm text-slate-900">Notifications</h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {userNotifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-slate-500">
                        No notifications yet.
                      </div>
                    ) : (
                      userNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            if (notif.link_tab) {
                              navigateTo(notif.link_tab);
                            }
                          }}
                          className={`p-3 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                            !notif.is_read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-900">
                              {notif.title}
                            </span>
                            {!notif.is_read && (
                              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Post a Job button (Bold Primary CTA) */}
            <button
              onClick={() => navigateTo('post-job')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-xs sm:text-sm font-black shadow-md shadow-amber-500/20 transition-all cursor-pointer uppercase tracking-wider"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Post a Job</span>
            </button>

            {/* User Profile / Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
                >
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.full_name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">
                      {currentUser.full_name}
                    </span>
                    <span className="text-[10px] text-slate-500 capitalize font-medium">
                      {currentUser.role} · {currentUser.location.split(',')[0]}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900">{currentUser.full_name}</p>
                      <p className="text-xs text-blue-700 capitalize font-semibold flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {currentUser.role} Account
                      </p>
                      {currentUser.role === 'freelancer' && (
                        <p className="text-[11px] text-slate-600 mt-1">
                          Earnings: <span className="font-bold text-emerald-700">{formatCompactUGX(currentUser.earnings_ugx)}</span>
                        </p>
                      )}
                      {currentUser.role === 'client' && (
                        <p className="text-[11px] text-slate-600 mt-1">
                          Total Spent: <span className="font-bold text-blue-700">{formatCompactUGX(currentUser.spent_ugx)}</span>
                        </p>
                      )}
                    </div>

                    <div className="py-1">
                      {currentUser.role === 'client' ? (
                        <button
                          onClick={() => navigateTo('client-dashboard')}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                        >
                          <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                          Client Dashboard
                        </button>
                      ) : currentUser.role === 'freelancer' ? (
                        <button
                          onClick={() => navigateTo('freelancer-dashboard')}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                          Freelancer Dashboard & Profile
                        </button>
                      ) : (
                        <button
                          onClick={() => navigateTo('admin-dashboard')}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-purple-700 hover:bg-purple-50 cursor-pointer flex items-center gap-2"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          Admin Overview
                        </button>
                      )}

                      <button
                        onClick={() => navigateTo('projects')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-slate-500" />
                        Project Pipeline Tracker
                      </button>

                      <button
                        onClick={() => {
                          setRolesModalOpen(true);
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-purple-700 hover:bg-purple-50 cursor-pointer flex items-center gap-2"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        Roles & Permissions Matrix
                      </button>

                      <button
                        onClick={() => {
                          setPaymentDocsModalOpen(true);
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-amber-800 hover:bg-amber-50 cursor-pointer flex items-center gap-2"
                      >
                        <Coins className="w-3.5 h-3.5" />
                        UGX Payment & Escrow Docs
                      </button>

                      <button
                        onClick={() => {
                          setAuthModalMode('switch');
                          setAuthModalOpen(true);
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50 cursor-pointer flex items-center gap-2"
                      >
                        <Users className="w-3.5 h-3.5" />
                        Switch Role / Demo Account
                      </button>

                      <button
                        onClick={() => {
                          setSupabaseModalOpen(true);
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 cursor-pointer flex items-center gap-2"
                      >
                        <Database className="w-3.5 h-3.5" />
                        Database & Supabase Settings
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Join Free
                </button>
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <button
            onClick={() => navigateTo('home')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              currentView === 'home' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => navigateTo('jobs')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              currentView === 'jobs' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
            }`}
          >
            Browse Jobs
          </button>
          <button
            onClick={() => navigateTo('freelancers')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              currentView === 'freelancers' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
            }`}
          >
            Find Freelancers
          </button>
          <button
            onClick={() => navigateTo('projects')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              currentView === 'projects' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
            }`}
          >
            Project Tracker
          </button>
          <button
            onClick={() => navigateTo('post-job')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold bg-blue-700 text-white flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Post a Job (UGX)
          </button>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-semibold mb-2">Switch Demo Account:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => loginAs('user-client-1')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-blue-100 text-slate-800 rounded text-xs text-center font-medium"
              >
                Client
              </button>
              <button
                onClick={() => loginAs('user-free-1')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-amber-100 text-slate-800 rounded text-xs text-center font-medium"
              >
                Freelancer
              </button>
              <button
                onClick={() => loginAs('user-admin-1')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-purple-100 text-slate-800 rounded text-xs text-center font-medium"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
