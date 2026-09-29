import React, { useState } from 'react';
import {
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Star,
  Calendar,
  Users,
  Ticket,
  ChevronLeft,
  Share2,
  Heart,
  MessageSquare,
  Camera,
  X,
  Edit3,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EventCard } from '../components/EventCard';
import { ImageUploadPanel } from '../components/ImageUploadPanel';

export const OrganizerProfilePage: React.FC = () => {
  const {
    users,
    currentUser,
    selectedOrganizerId,
    setCurrentView,
    events,
    favoriteOrganizerIds,
    toggleFavoriteOrganizer,
    setActiveConversationUserId,
    updateCurrentUserProfile,
  } = useApp();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bioText, setBioText] = useState('');

  const organizer =
    users.find((u) => u.id === selectedOrganizerId) ||
    users.find((u) => u.role === 'organizer') ||
    users[0];

  if (!organizer) {
    return (
      <div className="py-20 text-center">
        <p>Organizer not found.</p>
      </div>
    );
  }

  const isFollowing = favoriteOrganizerIds.includes(organizer.id);
  const isOwner = currentUser?.id === organizer.id || currentUser?.role === 'admin';

  // Filter events organized by this user
  const organizerEvents = events.filter((e) => e.organizer_id === organizer.id);

  const handleOpenEdit = () => {
    setAvatarUrl(organizer.avatar_url);
    setBioText(organizer.bio || '');
    setEditModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (avatarUrl) {
      updateCurrentUserProfile({
        avatar_url: avatarUrl,
        bio: bioText,
      });
    }
    setEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setCurrentView('organizers');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>All Organizers</span>
          </button>

          {isOwner && (
            <button
              type="button"
              onClick={handleOpenEdit}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Update Logo / Photo</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative group">
              <img
                src={organizer.avatar_url}
                alt={organizer.full_name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-slate-100 shadow-md shrink-0"
              />
              {isOwner && (
                <button
                  type="button"
                  onClick={handleOpenEdit}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-md cursor-pointer transition-transform group-hover:scale-110"
                  title="Upload / Change Photo from Device"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {organizer.full_name}
                </h1>
                {organizer.is_verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Verified Organizer</span>
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-slate-600">{organizer.title}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{organizer.location}</span>
                </span>

                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{organizer.rating} Rating</span>
                </span>

                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>{organizer.followers_count ? `${Math.round(organizer.followers_count / 1000)}k` : '12k'} Followers</span>
                </span>
              </div>
            </div>

            <div className="flex sm:flex-col items-center gap-2 self-stretch sm:self-auto shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => toggleFavoriteOrganizer(organizer.id)}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isFollowing
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-blue-700 text-white hover:bg-blue-800 shadow-sm'
                }`}
              >
                {isFollowing ? 'Following ✓' : '+ Follow Organizer'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveConversationUserId(organizer.id);
                  setCurrentView('messages');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message Organizer</span>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 max-w-3xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              About the Organizer
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {organizer.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Events by this organizer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Events by {organizer.full_name} ({organizerEvents.length})
          </h2>
        </div>

        {organizerEvents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm text-slate-600">No active events currently listed by this organizer.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {organizerEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* Upload/Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Upload Organizer Photo</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <ImageUploadPanel
                value={avatarUrl}
                onChange={(url) => setAvatarUrl(url)}
                label="Organizer Logo / Avatar"
                sublabel="Drag and drop or select your photo from phone or computer storage"
                aspectRatio="square"
                maxSizeMB={5}
              />

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Organizer Bio
                </label>
                <textarea
                  rows={3}
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
