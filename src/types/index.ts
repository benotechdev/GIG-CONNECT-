import { UserRole } from './rbac';
export * from './rbac';
export * from './payments';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  link?: string;
  completed_date?: string;
}

export interface TicketTier {
  id: string;
  name: string; // e.g. 'Early Bird', 'Regular / General', 'VIP', 'VVIP Table of 8', 'Free Pass'
  price_ugx: number; // 0 for free
  capacity?: number;
  sold_count?: number;
  perks?: string[];
  description?: string;
}

export interface EventPerformer {
  id: string;
  name: string;
  role: string; // e.g. 'Headline DJ', 'Live Artist', 'Host / MC', 'Guest Performer'
  avatar_url?: string;
}

export interface EventItem {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  category: string; // 'Concerts' | 'Parties' | 'Festivals' | 'Trips' | 'Sports' | 'School Events' | 'Comedy' | 'Workshops' | 'More'
  poster_url: string;
  gallery_images?: string[];
  organizer_id: string;
  organizer_name: string;
  organizer_avatar: string;
  organizer_verified: boolean;
  date: string; // ISO date '2026-10-15'
  end_date?: string;
  time: string; // e.g. '2:00 PM - Late'
  venue: string; // e.g. 'Lugogo Cricket Oval'
  location: string; // e.g. 'Kampala, Lugogo'
  city: string; // e.g. 'Kampala'
  ticket_tiers: TicketTier[];
  starting_price_ugx: number; // Lowest price or 0 for Free
  activities: string[];
  lineup?: EventPerformer[];
  is_featured: boolean;
  is_trending: boolean;
  is_weekend: boolean;
  is_sponsored: boolean;
  status: 'published' | 'draft' | 'cancelled' | 'ended';
  views_count: number;
  attendees_count: number;
  created_at: string;

  // Compatibility aliases with Job interface
  budget_ugx?: number;
  client_id?: string;
  client_name?: string;
  client_avatar?: string;
  skills_required?: string[];
  applications_count?: number;
}

// Aliases for unified architecture
export type Job = EventItem;
export type Event = EventItem;

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string;
  phone?: string;
  location: string; // e.g. "Kampala, Nakasero", "Jinja", "Entebbe", "Mbarara"
  title: string; // e.g. "Lead Concert Producer & Event Creator"
  bio: string;
  events_count?: number;
  followers_count?: number;
  rating: number;
  total_reviews: number;
  completed_jobs_count?: number;
  earnings_ugx: number; // Revenue from ticket sales in UGX
  spent_ugx: number; // Tickets bought in UGX
  is_verified: boolean;
  is_featured: boolean;
  is_premium: boolean;
  portfolio?: PortfolioItem[];
  created_at: string;
  total_tickets_sold?: number;
  // Compatibility
  hourly_rate_ugx?: number;
  skills?: string[];
}

export interface TicketBooking {
  id: string;
  event_id: string;
  event_title: string;
  event_poster: string;
  event_date: string;
  event_time: string;
  event_venue: string;
  event_location: string;
  attendee_id: string;
  attendee_name: string;
  attendee_email: string;
  attendee_phone: string;
  tier_id: string;
  tier_name: string;
  quantity: number;
  unit_price_ugx: number;
  total_amount_ugx: number;
  platform_fee_ugx: number; // e.g. 5-8%
  organizer_payout_ugx: number;
  payment_method: 'mtn_momo' | 'airtel_money' | 'card' | 'free';
  payment_status: 'paid' | 'pending' | 'refunded';
  qr_code_ref: string;
  created_at: string;

  // Compatibility aliases with Application and ProjectContract
  job_id?: string;
  job_title?: string;
  client_id?: string;
  client_name?: string;
  freelancer_id?: string;
  freelancer_name?: string;
  freelancer_avatar?: string;
  proposed_budget_ugx?: number;
  status?: string;
  stage?: string;
  agreed_amount_ugx?: number;
  freelancer_payout_ugx?: number;
  is_paid?: boolean;
}

export type Application = TicketBooking;
export type ProjectContract = TicketBooking;
export type ProjectStage = 'posted' | 'applied' | 'hired' | 'in_progress' | 'completed';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  receiver_id: string;
  text: string;
  created_at: string;
  is_read: boolean;
}

export interface Conversation {
  id: string;
  participant_ids: string[];
  other_user: {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
    title: string;
  };
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export interface Review {
  id: string;
  project_id: string;
  project_title: string;
  from_user_id: string;
  from_user_name: string;
  from_user_avatar: string;
  to_user_id: string;
  rating: number; // 1 to 5
  comment: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'ticket' | 'event' | 'message' | 'review' | 'system' | 'payment' | 'application' | 'hire';
  link_tab?: string;
  is_read: boolean;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reporter_name: string;
  target_type: 'event' | 'user' | 'job';
  target_id: string;
  target_name_or_title: string;
  reason: string;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
}

export interface PlatformMonetizationSettings {
  commission_rate_percent: number; // e.g. 6% commission on ticket bookings
  featured_event_fee_ugx: number; // e.g. 50,000 UGX to feature on hero & trending
  sponsored_banner_fee_ugx: number; // e.g. 120,000 UGX for homepage banner
  premium_organizer_monthly_ugx: number; // e.g. 75,000 UGX/month
  escrow_protection_active: boolean; // Guaranteed payouts

  // Legacy aliases
  featured_job_fee_ugx?: number;
  featured_freelancer_fee_ugx?: number;
  premium_freelancer_monthly_ugx?: number;
}

export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
    icon?: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
  category?: string;
  language?: string;
  country?: string[];
  keywords?: string[];
  article_id?: string;
}

export interface NewsDataItem {
  article_id: string;
  link: string;
  title: string;
  description: string | null;
  content: string | null;
  keywords?: string[] | null;
  creator?: string[] | null;
  language?: string;
  country?: string[];
  category?: string[];
  datatype?: string;
  pubDate: string;
  pubDateTZ?: string;
  fetched_at?: string;
  image_url?: string | null;
  video_url?: string | null;
  source_id?: string;
  source_name: string;
  source_priority?: number;
  source_url?: string;
  source_icon?: string;
  duplicate?: boolean;
}

