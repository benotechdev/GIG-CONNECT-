import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Twitter, Facebook, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ShareModal: React.FC = () => {
  const { shareModalEvent, setShareModalEvent } = useApp();
  const [copied, setCopied] = useState(false);

  if (!shareModalEvent) return null;

  const eventUrl = `${window.location.origin}/#event-${shareModalEvent.id}`;
  const shareText = `Check out "${shareModalEvent.title}" on Gig Connect UG! Happening at ${shareModalEvent.venue} on ${shareModalEvent.date}. Get your tickets now:`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText} ${eventUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${eventUrl}`)}`;
    window.open(url, '_blank');
  };

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(eventUrl)}`;
    window.open(url, '_blank');
  };

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 overflow-hidden">
        <button
          type="button"
          onClick={() => setShareModalEvent(null)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Share2 className="w-5 h-5 text-blue-600" />
          <h3 className="font-extrabold text-lg text-slate-900">Share This Event</h3>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Invite friends, group chats, and family to attend together!
        </p>

        {/* Event Preview Mini Card */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 mb-6">
          <img
            src={shareModalEvent.poster_url}
            alt={shareModalEvent.title}
            className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
          />
          <div className="min-w-0">
            <h4 className="font-bold text-xs text-slate-900 truncate">
              {shareModalEvent.title}
            </h4>
            <p className="text-[11px] text-slate-500 truncate">
              {shareModalEvent.date} · {shareModalEvent.venue}
            </p>
          </div>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleTwitter}
            className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Twitter className="w-5 h-5 text-blue-600" />
            <span>X (Twitter)</span>
          </button>

          <button
            type="button"
            onClick={handleFacebook}
            className="p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 text-xs font-bold flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Facebook className="w-5 h-5 text-indigo-600" />
            <span>Facebook</span>
          </button>
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 bg-slate-50">
          <input
            type="text"
            readOnly
            value={eventUrl}
            className="flex-1 bg-transparent px-2.5 text-xs text-slate-700 outline-none truncate"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
