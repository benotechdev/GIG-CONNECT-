export type UserRole = 'client' | 'freelancer' | 'admin';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  link?: string;
  completed_date?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string;
  phone?: string;
  location: string; // e.g. "Kampala, Nakasero", "Jinja", "Mbarara", "Wakiso"
  title: string; // e.g. "Senior Full-Stack Engineer" or "Founder & CEO"
  bio: string;
  hourly_rate_ugx?: number;
  skills: string[];
  rating: number;
  total_reviews: number;
  completed_jobs_count: number;
  earnings_ugx: number;
  spent_ugx: number;
  is_verified: boolean;
  is_featured: boolean;
  is_premium: boolean;
  portfolio: PortfolioItem[];
  created_at: string;
}

export interface Job {
  id: string;
  client_id: string;
  client_name: string;
  client_avatar: string;
  client_company?: string;
  client_rating: number;
  title: string;
  description: string;
  category: string;
  skills_required: string[];
  budget_ugx: number;
  budget_type: 'fixed' | 'hourly';
  duration: string;
  experience_level: 'Entry' | 'Intermediate' | 'Expert';
  location: string;
  is_remote: boolean;
  is_featured: boolean;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  deadline: string;
  applications_count: number;
  hired_freelancer_id?: string;
}

export interface Application {
  id: string;
  job_id: string;
  job_title: string;
  client_id: string;
  freelancer_id: string;
  freelancer_name: string;
  freelancer_avatar: string;
  freelancer_title: string;
  freelancer_rating: number;
  freelancer_location: string;
  proposed_budget_ugx: number;
  estimated_days: number;
  cover_letter: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export type ProjectStage = 'posted' | 'applied' | 'hired' | 'in_progress' | 'completed';

export interface Milestone {
  id: string;
  title: string;
  amount_ugx: number;
  status: 'pending' | 'in_progress' | 'submitted' | 'approved';
  due_date?: string;
}

export interface ProjectContract {
  id: string;
  job_id: string;
  job_title: string;
  client_id: string;
  client_name: string;
  client_avatar: string;
  freelancer_id: string;
  freelancer_name: string;
  freelancer_avatar: string;
  agreed_amount_ugx: number;
  platform_fee_ugx: number; // e.g. 10%
  freelancer_payout_ugx: number;
  stage: ProjectStage;
  deliverable_note?: string;
  deliverable_url?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  is_paid: boolean;
}

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
  type: 'application' | 'hire' | 'message' | 'review' | 'system' | 'payment';
  link_tab?: string;
  is_read: boolean;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reporter_name: string;
  target_type: 'job' | 'user';
  target_id: string;
  target_name_or_title: string;
  reason: string;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
}

export interface PlatformMonetizationSettings {
  commission_rate_percent: number; // e.g. 10
  featured_job_fee_ugx: number; // e.g. 50,000
  featured_freelancer_fee_ugx: number; // e.g. 35,000
  premium_freelancer_monthly_ugx: number; // e.g. 75,000
  escrow_protection_active: boolean;
}
