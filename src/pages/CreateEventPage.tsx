import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Image as ImageIcon,
  Flame,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { formatUGX } from '../utils/formatters';
import { TicketTier } from '../types';
import { ImageUploadPanel } from '../components/ImageUploadPanel';

export const CreateEventPage: React.FC = () => {
  const { publishEvent, currentUser, setCurrentView, monetizationSettings } = useApp();

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('Concerts');
  const [description, setDescription] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [date, setDate] = useState('2026-10-25');
  const [time, setTime] = useState('6:00 PM - Midnight');
  const [venue, setVenue] = useState('');
  const [location, setLocation] = useState('Kampala');
  const [activitiesInput, setActivitiesInput] = useState('Live Bands, DJ Sets, VIP Bar');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isWeekend, setIsWeekend] = useState(true);

  // Ticket Tiers
  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>([
    {
      id: 'tier-init-1',
      name: 'Regular Admission',
      price_ugx: 30000,
      capacity: 500,
      sold_count: 0,
      perks: ['General Admission', 'Live Stage Access'],
    },
    {
      id: 'tier-init-2',
      name: 'VIP Experience',
      price_ugx: 100000,
      capacity: 100,
      sold_count: 0,
      perks: ['VIP Front Stage Access', 'Welcome Cocktail', 'Private Bar'],
    },
  ]);

  const [submitted, setSubmitted] = useState(false);
  const [createdEventId, setCreatedEventId] = useState('');

  // Sample Ugandan posters ready to click
  const samplePosters = [
    { name: 'Festival Vibes', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80' },
    { name: 'Live Concert', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80' },
    { name: 'Rooftop Party', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80' },
    { name: 'Nile Adventure', url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80' },
    { name: 'Comedy Night', url: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=800&q=80' },
  ];

  const handleAddTier = () => {
    setTicketTiers((prev) => [
      ...prev,
      {
        id: `tier-${Date.now()}`,
        name: 'VIP Table / Custom Pass',
        price_ugx: 250000,
        capacity: 50,
        sold_count: 0,
        perks: ['Table Seating', 'Dedicated Service'],
      },
    ]);
  };

  const handleRemoveTier = (id: string) => {
    if (ticketTiers.length <= 1) return;
    setTicketTiers((prev) => prev.filter((t) => t.id !== id));
  };

  const handleTierChange = (id: string, field: keyof TicketTier, value: any) => {
    setTicketTiers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !venue.trim()) return;

    const activities = activitiesInput
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    const newEvent = publishEvent({
      title: title.trim(),
      tagline: tagline.trim() || undefined,
      category,
      description: description.trim(),
      poster_url: posterUrl.trim() || samplePosters[0].url,
      gallery_images: galleryImages.length > 0 ? galleryImages : undefined,
      date,
      time,
      venue: venue.trim(),
      location: location.trim(),
      city: location.includes(',') ? location.split(',')[0].trim() : location,
      ticket_tiers: ticketTiers,
      activities: activities.length > 0 ? activities : ['Live Music', 'Food & Drinks'],
      is_featured: isFeatured,
      is_weekend: isWeekend,
    });

    setCreatedEventId(newEvent.id);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Event Published Successfully! 🎉</h2>
            <p className="text-sm text-slate-600">
              "{title}" is now visible to thousands of event-goers in Uganda. Attendees can immediately buy tickets in UGX with MTN MoMo and Airtel Money.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => {
                setCurrentView('events');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Browse Live Events
            </button>

            <button
              onClick={() => {
                setCurrentView('organizer-dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
            >
              Organizer Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Ticket className="w-4 h-4 text-blue-600" />
            <span>Event Creator Studio</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Publish & Promote Your Event
          </h1>
          <p className="text-sm text-slate-600">
            Concerts, festivals, parties, weekend trips, school galas & comedy shows. Sell tickets in UGX with instant MTN MoMo & Airtel Money payouts.
          </p>
        </div>

        {/* Create Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          
          {/* Section 1: Basic Event Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2">
              1. Event Basics
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blankets & Wine Kampala 2026, Jinja Nile Rafting Weekend..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Catchy Tagline (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Uganda’s iconic picnic style music & lifestyle festival"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-600 bg-white cursor-pointer font-medium"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Event Time / Schedule *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2:00 PM - Late, 6:00 PM - 11:30 PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    City / District *
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-600 bg-white cursor-pointer"
                  >
                    <option value="Kampala">Kampala</option>
                    <option value="Jinja">Jinja</option>
                    <option value="Entebbe">Entebbe</option>
                    <option value="Mbarara">Mbarara</option>
                    <option value="Gulu">Gulu</option>
                    <option value="Fort Portal">Fort Portal</option>
                    <option value="Kabale">Kabale</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Venue Name & Exact Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lugogo Cricket Oval, Itanda Falls Jinja, Speke Resort Munyonyo..."
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Description & Event Vibe *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your event, dress code, age limits, security, and what guests should bring..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Activities (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Live Bands, Food Trucks, Sunset Cruise, Campfire, VIP Lounges"
                  value={activitiesInput}
                  onChange={(e) => setActivitiesInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Event Poster & Image Drag/Select Upload Panel */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2">
              2. Event Poster & Media Artwork
            </h3>

            {/* Primary Poster */}
            <ImageUploadPanel
              value={posterUrl}
              onChange={(url) => setPosterUrl(url)}
              label="Primary Event Poster (Required)"
              sublabel="Drag and drop your event flyer or click to select from device storage (JPEG, PNG, WebP, GIF)"
              aspectRatio="poster"
              maxSizeMB={10}
              sampleImages={samplePosters}
            />

            {/* Optional Gallery Photos */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Event Atmosphere & Venue Photos (Optional Gallery)
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Showcase stage setups, VIP areas, venue panoramas, or past editions to boost ticket sales.
                </p>
              </div>

              {/* Upload panel to add a gallery photo */}
              <ImageUploadPanel
                value=""
                onChange={(url) => {
                  if (url && !galleryImages.includes(url)) {
                    setGalleryImages((prev) => [...prev, url]);
                  }
                }}
                label="Add Gallery Photo"
                sublabel="Select or drag any photo from device storage to add to your event gallery"
                aspectRatio="banner"
                maxSizeMB={8}
              />

              {/* Gallery Thumbnails List */}
              {galleryImages.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Attached Gallery Photos ({galleryImages.length})</span>
                    <button
                      type="button"
                      onClick={() => setGalleryImages([])}
                      className="text-red-600 hover:text-red-700 text-xs font-semibold cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {galleryImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-xl overflow-hidden aspect-4/3 border border-slate-200 group bg-slate-100 shadow-2xs"
                      >
                        <img
                          src={imgUrl}
                          alt={`Gallery photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setGalleryImages((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-950/80 text-white hover:bg-red-600 transition-colors shadow-xs"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-slate-950/70 text-white text-[10px] font-mono">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Ticket Tiers & UGX Pricing */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-lg font-black text-slate-900">
                3. Ticket Tiers & UGX Pricing
              </h3>

              <button
                type="button"
                onClick={handleAddTier}
                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tier</span>
              </button>
            </div>

            <div className="space-y-3">
              {ticketTiers.map((tier, idx) => (
                <div
                  key={tier.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-500">Tier #{idx + 1}</span>
                    {ticketTiers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTier(tier.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Tier Name</label>
                      <input
                        type="text"
                        value={tier.name}
                        onChange={(e) => handleTierChange(tier.id, 'name', e.target.value)}
                        placeholder="e.g. Regular, VIP, Table of 8"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:outline-hidden focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Price in UGX (0 for Free)</label>
                      <input
                        type="number"
                        min={0}
                        step={5000}
                        value={tier.price_ugx}
                        onChange={(e) => handleTierChange(tier.id, 'price_ugx', Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold focus:outline-hidden focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Capacity / Quantity</label>
                      <input
                        type="number"
                        min={1}
                        value={tier.capacity || 500}
                        onChange={(e) => handleTierChange(tier.id, 'capacity', Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Monetization & Boost Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>4. Promotion & Monetization Boosts</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setIsFeatured(!isFeatured)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  isFeatured
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={() => {}}
                  className="mt-1 w-4 h-4 text-amber-500 rounded"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-slate-900">Featured Spotlight Listing</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                      +UGX {monetizationSettings.featured_event_fee_ugx.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Pinned to homepage Hero ribbon and Editor's Spotlight with priority ranking.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setIsWeekend(!isWeekend)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  isWeekend
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isWeekend}
                  onChange={() => {}}
                  className="mt-1 w-4 h-4 text-blue-600 rounded"
                />
                <div>
                  <span className="font-extrabold text-sm text-slate-900">Weekend Events Showcase</span>
                  <p className="text-xs text-slate-600 mt-1">
                    Display inside the dedicated "This Weekend in Uganda" countdown section.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Free listing · 6% commission deducted only upon ticket sales</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Publish Event to Live Feed</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
