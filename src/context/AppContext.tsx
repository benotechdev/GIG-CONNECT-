import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Job,
  Application,
  ProjectContract,
  Message,
  Review,
  Notification,
  Report,
  PlatformMonetizationSettings,
  ProjectStage,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_PROJECTS,
  INITIAL_MESSAGES,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS,
  INITIAL_SETTINGS,
} from '../data/mockData';
import { isSupabaseConnected } from '../lib/supabase';

interface AppContextType {
  // Auth & User
  currentUser: User | null;
  users: User[];
  setCurrentUser: (user: User | null) => void;
  loginAs: (userId: string) => void;
  signUp: (userData: Partial<User>) => void;
  logout: () => void;
  updateCurrentUserProfile: (updates: Partial<User>) => void;
  toggleVerifyUser: (userId: string) => void;
  toggleFeatureFreelancer: (userId: string) => void;
  togglePremiumFreelancer: (userId: string) => void;

  // Jobs
  jobs: Job[];
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
  postJob: (jobData: Omit<Job, 'id' | 'client_id' | 'client_name' | 'client_avatar' | 'client_rating' | 'created_at' | 'applications_count'>) => Job;
  toggleFeatureJob: (jobId: string) => void;
  deleteJob: (jobId: string) => void;
  updateJobStatus: (jobId: string, status: Job['status']) => void;

  // Freelancer Profiles
  selectedFreelancerId: string | null;
  setSelectedFreelancerId: (id: string | null) => void;

  // Applications
  applications: Application[];
  applyToJob: (data: { jobId: string; proposedBudget: number; days: number; coverLetter: string }) => boolean;
  acceptApplication: (applicationId: string) => void;
  rejectApplication: (applicationId: string) => void;

  // Project Tracking
  projects: ProjectContract[];
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  updateProjectStage: (projectId: string, stage: ProjectStage, deliverableNote?: string, deliverableUrl?: string) => void;
  completeAndReleaseProject: (projectId: string) => void;

  // Messaging
  messages: Message[];
  activeConversationUserId: string | null;
  setActiveConversationUserId: (userId: string | null) => void;
  sendMessage: (receiverId: string, text: string) => void;
  markConversationAsRead: (otherUserId: string) => void;

  // Reviews
  reviews: Review[];
  submitReview: (projectId: string, toUserId: string, rating: number, comment: string) => void;

  // Saved / Favorites
  savedJobIds: string[];
  favoriteFreelancerIds: string[];
  toggleSaveJob: (jobId: string) => void;
  toggleFavoriteFreelancer: (freelancerId: string) => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (userId: string, title: string, message: string, type: Notification['type'], linkTab?: string) => void;

  // Reports
  reports: Report[];
  submitReport: (targetType: 'job' | 'user', targetId: string, targetTitle: string, reason: string, details: string) => void;
  resolveReport: (reportId: string, action: 'resolved' | 'dismissed') => void;

  // Monetization Settings
  monetizationSettings: PlatformMonetizationSettings;
  updateMonetizationSettings: (settings: Partial<PlatformMonetizationSettings>) => void;

  // Navigation & Modals
  currentView: string;
  setCurrentView: (view: string) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'switch';
  setAuthModalMode: (mode: 'login' | 'register' | 'switch') => void;
  applyModalOpen: boolean;
  setApplyModalOpen: (open: boolean) => void;
  reportModalData: { targetType: 'job' | 'user'; targetId: string; targetTitle: string } | null;
  setReportModalData: (data: { targetType: 'job' | 'user'; targetId: string; targetTitle: string } | null) => void;
  reviewModalProject: ProjectContract | null;
  setReviewModalProject: (project: ProjectContract | null) => void;
  supabaseModalOpen: boolean;
  setSupabaseModalOpen: (open: boolean) => void;

  // Quick reset
  resetAllData: () => void;
  isSupabaseLive: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'gig_connect_current_user_id',
  USERS: 'gig_connect_users_v1',
  JOBS: 'gig_connect_jobs_v1',
  APPLICATIONS: 'gig_connect_applications_v1',
  PROJECTS: 'gig_connect_projects_v1',
  MESSAGES: 'gig_connect_messages_v1',
  REVIEWS: 'gig_connect_reviews_v1',
  NOTIFICATIONS: 'gig_connect_notifications_v1',
  REPORTS: 'gig_connect_reports_v1',
  SETTINGS: 'gig_connect_settings_v1',
  SAVED_JOBS: 'gig_connect_saved_jobs_v1',
  FAV_FREELANCERS: 'gig_connect_fav_freelancers_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or fall back to mock data
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      const allUsers = users.length ? users : INITIAL_USERS;
      if (savedId) {
        const found = allUsers.find((u) => u.id === savedId);
        if (found) return found;
      }
      // Default to demo client (David Ssekandi) or Brian Kato
      return allUsers.find((u) => u.id === 'user-client-1') || allUsers[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
      return saved ? JSON.parse(saved) : INITIAL_JOBS;
    } catch {
      return INITIAL_JOBS;
    }
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  const [projects, setProjects] = useState<ProjectContract[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [reports, setReports] = useState<Report[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return saved ? JSON.parse(saved) : INITIAL_REPORTS;
    } catch {
      return INITIAL_REPORTS;
    }
  });

  const [monetizationSettings, setMonetizationSettings] = useState<PlatformMonetizationSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
      return saved ? JSON.parse(saved) : ['job-1', 'job-2'];
    } catch {
      return ['job-1', 'job-2'];
    }
  });

  const [favoriteFreelancerIds, setFavoriteFreelancerIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAV_FREELANCERS);
      return saved ? JSON.parse(saved) : ['user-free-1'];
    } catch {
      return ['user-free-1'];
    }
  });

  // UI state
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedFreelancerId, setSelectedFreelancerId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeConversationUserId, setActiveConversationUserId] = useState<string | null>(null);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'switch'>('switch');
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [reportModalData, setReportModalData] = useState<{ targetType: 'job' | 'user'; targetId: string; targetTitle: string } | null>(null);
  const [reviewModalProject, setReviewModalProject] = useState<ProjectContract | null>(null);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);

  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(() => isSupabaseConnected());

  // Keep localStorage updated
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUser.id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(monetizationSettings));
  }, [monetizationSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAV_FREELANCERS, JSON.stringify(favoriteFreelancerIds));
  }, [favoriteFreelancerIds]);

  // Auth methods
  const loginAs = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setAuthModalOpen(false);
    }
  };

  const signUp = (userData: Partial<User>) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email || 'user@example.ug',
      full_name: userData.full_name || 'New User',
      role: userData.role || 'freelancer',
      avatar_url:
        userData.avatar_url ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      phone: userData.phone || '+256 700 000 000',
      location: userData.location || 'Kampala, Uganda',
      title: userData.title || (userData.role === 'client' ? 'Business Owner' : 'Independent Specialist'),
      bio: userData.bio || 'Excited to connect, work, and collaborate on Gig Connect UG!',
      hourly_rate_ugx: userData.hourly_rate_ugx || 45000,
      skills: userData.skills || ['Communication', 'Project Management'],
      rating: 5.0,
      total_reviews: 0,
      completed_jobs_count: 0,
      earnings_ugx: 0,
      spent_ugx: 0,
      is_verified: false,
      is_featured: false,
      is_premium: false,
      portfolio: [],
      created_at: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setAuthModalOpen(false);

    // Welcome notification
    addNotification(
      newUser.id,
      'Welcome to Gig Connect UG! 🇺🇬',
      'Your profile is set up. Browse jobs or discover top Ugandan talent right away.',
      'system',
      newUser.role === 'client' ? 'client-dashboard' : 'freelancer-dashboard'
    );
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  const updateCurrentUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  const toggleVerifyUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_verified: !u.is_verified } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, is_verified: !prev.is_verified } : null));
    }
  };

  const toggleFeatureFreelancer = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_featured: !u.is_featured } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, is_featured: !prev.is_featured } : null));
    }
  };

  const togglePremiumFreelancer = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_premium: !u.is_premium } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, is_premium: !prev.is_premium } : null));
    }
  };

  // Job Actions
  const postJob = (jobData: Omit<Job, 'id' | 'client_id' | 'client_name' | 'client_avatar' | 'client_rating' | 'created_at' | 'applications_count'>): Job => {
    const client = currentUser || users.find((u) => u.role === 'client') || users[0];
    const newJob: Job = {
      id: `job-${Date.now()}`,
      client_id: client.id,
      client_name: client.full_name,
      client_avatar: client.avatar_url,
      client_company: client.title,
      client_rating: client.rating,
      title: jobData.title,
      description: jobData.description,
      category: jobData.category,
      skills_required: jobData.skills_required,
      budget_ugx: jobData.budget_ugx,
      budget_type: jobData.budget_type,
      duration: jobData.duration,
      experience_level: jobData.experience_level,
      location: jobData.location,
      is_remote: jobData.is_remote,
      is_featured: jobData.is_featured,
      status: 'open',
      deadline: jobData.deadline || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      applications_count: 0,
    };

    setJobs((prev) => [newJob, ...prev]);

    // Notification
    addNotification(
      client.id,
      'Job Posted Successfully!',
      `Your listing "${newJob.title}" is now live across Uganda.`,
      'system',
      'client-dashboard'
    );

    return newJob;
  };

  const toggleFeatureJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, is_featured: !j.is_featured } : j))
    );
  };

  const deleteJob = (jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  const updateJobStatus = (jobId: string, status: Job['status']) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status } : j))
    );
  };

  // Applications
  const applyToJob = ({
    jobId,
    proposedBudget,
    days,
    coverLetter,
  }: {
    jobId: string;
    proposedBudget: number;
    days: number;
    coverLetter: string;
  }): boolean => {
    if (!currentUser) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return false;
    }

    const targetJob = jobs.find((j) => j.id === jobId);
    if (!targetJob) return false;

    // Check if already applied
    const existing = applications.find(
      (a) => a.job_id === jobId && a.freelancer_id === currentUser.id
    );
    if (existing) {
      return false;
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      job_id: jobId,
      job_title: targetJob.title,
      client_id: targetJob.client_id,
      freelancer_id: currentUser.id,
      freelancer_name: currentUser.full_name,
      freelancer_avatar: currentUser.avatar_url,
      freelancer_title: currentUser.title,
      freelancer_rating: currentUser.rating,
      freelancer_location: currentUser.location,
      proposed_budget_ugx: proposedBudget,
      estimated_days: days,
      cover_letter: coverLetter,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    setApplications((prev) => [newApp, ...prev]);

    // Increment application count on job
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, applications_count: j.applications_count + 1 } : j
      )
    );

    // Notify client
    addNotification(
      targetJob.client_id,
      'New Proposal Received',
      `${currentUser.full_name} submitted a proposal for "${targetJob.title}".`,
      'application',
      'client-dashboard'
    );

    // Notify freelancer
    addNotification(
      currentUser.id,
      'Proposal Submitted',
      `You successfully applied to "${targetJob.title}".`,
      'system',
      'freelancer-dashboard'
    );

    return true;
  };

  // Accept Application -> Create Contract in Hired stage
  const acceptApplication = (applicationId: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;

    const targetJob = jobs.find((j) => j.id === app.job_id);
    if (!targetJob) return;

    // Calculate platform fee
    const commissionPercent = monetizationSettings.commission_rate_percent || 10;
    const agreedAmount = app.proposed_budget_ugx;
    const platformFee = (agreedAmount * commissionPercent) / 100;
    const freelancerPayout = agreedAmount - platformFee;

    // Create Project Contract
    const newContract: ProjectContract = {
      id: `proj-${Date.now()}`,
      job_id: app.job_id,
      job_title: app.job_title,
      client_id: app.client_id,
      client_name: targetJob.client_name,
      client_avatar: targetJob.client_avatar,
      freelancer_id: app.freelancer_id,
      freelancer_name: app.freelancer_name,
      freelancer_avatar: app.freelancer_avatar,
      agreed_amount_ugx: agreedAmount,
      platform_fee_ugx: platformFee,
      freelancer_payout_ugx: freelancerPayout,
      stage: 'hired',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_paid: false,
    };

    setProjects((prev) => [newContract, ...prev]);

    // Update application status
    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: 'accepted' } : a))
    );

    // Update job status
    setJobs((prev) =>
      prev.map((j) =>
        j.id === app.job_id
          ? { ...j, status: 'in_progress', hired_freelancer_id: app.freelancer_id }
          : j
      )
    );

    // Notify freelancer
    addNotification(
      app.freelancer_id,
      'Congratulations! You are Hired 🎉',
      `${targetJob.client_name} accepted your proposal for "${targetJob.title}".`,
      'hire',
      'projects'
    );

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const rejectApplication = (applicationId: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status: 'rejected' } : a))
    );
  };

  // Project Stage Tracking: Posted -> Applied -> Hired -> In Progress -> Completed
  const updateProjectStage = (
    projectId: string,
    stage: ProjectStage,
    deliverableNote?: string,
    deliverableUrl?: string
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            stage,
            deliverable_note: deliverableNote ?? p.deliverable_note,
            deliverable_url: deliverableUrl ?? p.deliverable_url,
            updated_at: new Date().toISOString(),
          };
        }
        return p;
      })
    );

    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    if (stage === 'in_progress') {
      addNotification(
        project.client_id,
        'Project Milestone Update',
        `${project.freelancer_name} has started active development on "${project.job_title}".`,
        'system',
        'projects'
      );
    }
  };

  // Complete and release escrow payment
  const completeAndReleaseProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const completedAt = new Date().toISOString();

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              stage: 'completed',
              is_paid: true,
              completed_at: completedAt,
              updated_at: completedAt,
            }
          : p
      )
    );

    // Mark job as completed
    setJobs((prev) =>
      prev.map((j) => (j.id === project.job_id ? { ...j, status: 'completed' } : j))
    );

    // Update Freelancer earnings and completed job count
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === project.freelancer_id) {
          return {
            ...u,
            completed_jobs_count: u.completed_jobs_count + 1,
            earnings_ugx: u.earnings_ugx + project.freelancer_payout_ugx,
          };
        }
        if (u.id === project.client_id) {
          return {
            ...u,
            completed_jobs_count: u.completed_jobs_count + 1,
            spent_ugx: u.spent_ugx + project.agreed_amount_ugx,
          };
        }
        return u;
      })
    );

    // If current user is one of them, refresh
    if (currentUser?.id === project.freelancer_id) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              completed_jobs_count: prev.completed_jobs_count + 1,
              earnings_ugx: prev.earnings_ugx + project.freelancer_payout_ugx,
            }
          : null
      );
    } else if (currentUser?.id === project.client_id) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              completed_jobs_count: prev.completed_jobs_count + 1,
              spent_ugx: prev.spent_ugx + project.agreed_amount_ugx,
            }
          : null
      );
    }

    // Notify Freelancer
    addNotification(
      project.freelancer_id,
      'Project Completed & Funds Released! 💰',
      `${project.client_name} approved the deliverables. UGX ${project.freelancer_payout_ugx.toLocaleString()} has been added to your balance.`,
      'payment',
      'freelancer-dashboard'
    );

    // Open review modal for client
    setReviewModalProject(project);

    // Confetti celebration
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore
    }
  };

  // Messaging
  const sendMessage = (receiverId: string, text: string) => {
    if (!currentUser || !text.trim()) return;

    const conversationId = [currentUser.id, receiverId].sort().join('--');

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: currentUser.id,
      sender_name: currentUser.full_name,
      sender_avatar: currentUser.avatar_url,
      receiver_id: receiverId,
      text: text.trim(),
      created_at: new Date().toISOString(),
      is_read: false,
    };

    setMessages((prev) => [...prev, newMsg]);

    // Send notification to receiver
    addNotification(
      receiverId,
      `New message from ${currentUser.full_name}`,
      text.slice(0, 80) + (text.length > 80 ? '...' : ''),
      'message',
      'messages'
    );
  };

  const markConversationAsRead = (otherUserId: string) => {
    if (!currentUser) return;
    setMessages((prev) =>
      prev.map((m) =>
        m.sender_id === otherUserId && m.receiver_id === currentUser.id
          ? { ...m, is_read: true }
          : m
      )
    );
  };

  // Reviews
  const submitReview = (projectId: string, toUserId: string, rating: number, comment: string) => {
    if (!currentUser) return;

    const project = projects.find((p) => p.id === projectId);
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      project_id: projectId,
      project_title: project ? project.job_title : 'Freelance Contract',
      from_user_id: currentUser.id,
      from_user_name: currentUser.full_name,
      from_user_avatar: currentUser.avatar_url,
      to_user_id: toUserId,
      rating,
      comment: comment.trim(),
      created_at: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);

    // Recalculate recipient rating
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === toUserId) {
          const userReviews = [...reviews.filter((r) => r.to_user_id === toUserId), newReview];
          const avg = userReviews.reduce((acc, r) => acc + r.rating, 0) / userReviews.length;
          return {
            ...u,
            rating: Number(avg.toFixed(2)),
            total_reviews: userReviews.length,
          };
        }
        return u;
      })
    );

    // Notify user
    addNotification(
      toUserId,
      'New 5-Star Review Received! ⭐',
      `${currentUser.full_name} gave you a ${rating}-star review: "${comment.slice(0, 60)}..."`,
      'review',
      'freelancer-dashboard'
    );

    setReviewModalProject(null);
  };

  // Bookmarking
  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const toggleFavoriteFreelancer = (freelancerId: string) => {
    setFavoriteFreelancerIds((prev) =>
      prev.includes(freelancerId)
        ? prev.filter((id) => id !== freelancerId)
        : [...prev, freelancerId]
    );
  };

  // Notifications
  const addNotification = (
    userId: string,
    title: string,
    message: string,
    type: Notification['type'],
    linkTab?: string
  ) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      user_id: userId,
      title,
      message,
      type,
      link_tab: linkTab,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications((prev) =>
      prev.map((n) => (n.user_id === currentUser.id ? { ...n, is_read: true } : n))
    );
  };

  // Reports
  const submitReport = (
    targetType: 'job' | 'user',
    targetId: string,
    targetTitle: string,
    reason: string,
    details: string
  ) => {
    const reporter = currentUser || users[0];
    const newReport: Report = {
      id: `rep-${Date.now()}`,
      reporter_id: reporter.id,
      reporter_name: reporter.full_name,
      target_type: targetType,
      target_id: targetId,
      target_name_or_title: targetTitle,
      reason,
      details,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    setReports((prev) => [newReport, ...prev]);
    setReportModalData(null);

    // Notify admins
    const admins = users.filter((u) => u.role === 'admin');
    admins.forEach((admin) => {
      addNotification(
        admin.id,
        'New Moderation Report Filed',
        `Report against ${targetType} "${targetTitle}": ${reason}`,
        'system',
        'admin-dashboard'
      );
    });
  };

  const resolveReport = (reportId: string, action: 'resolved' | 'dismissed') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action } : r))
    );
  };

  const updateMonetizationSettings = (settings: Partial<PlatformMonetizationSettings>) => {
    setMonetizationSettings((prev) => ({ ...prev, ...settings }));
  };

  const resetAllData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setJobs(INITIAL_JOBS);
    setApplications(INITIAL_APPLICATIONS);
    setProjects(INITIAL_PROJECTS);
    setMessages(INITIAL_MESSAGES);
    setReviews(INITIAL_REVIEWS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setReports(INITIAL_REPORTS);
    setMonetizationSettings(INITIAL_SETTINGS);
    setSavedJobIds(['job-1', 'job-2']);
    setFavoriteFreelancerIds(['user-free-1']);
    setIsSupabaseLive(isSupabaseConnected());
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        setCurrentUser,
        loginAs,
        signUp,
        logout,
        updateCurrentUserProfile,
        toggleVerifyUser,
        toggleFeatureFreelancer,
        togglePremiumFreelancer,

        jobs,
        selectedJobId,
        setSelectedJobId,
        postJob,
        toggleFeatureJob,
        deleteJob,
        updateJobStatus,

        selectedFreelancerId,
        setSelectedFreelancerId,

        applications,
        applyToJob,
        acceptApplication,
        rejectApplication,

        projects,
        selectedProjectId,
        setSelectedProjectId,
        updateProjectStage,
        completeAndReleaseProject,

        messages,
        activeConversationUserId,
        setActiveConversationUserId,
        sendMessage,
        markConversationAsRead,

        reviews,
        submitReview,

        savedJobIds,
        favoriteFreelancerIds,
        toggleSaveJob,
        toggleFavoriteFreelancer,

        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,

        reports,
        submitReport,
        resolveReport,

        monetizationSettings,
        updateMonetizationSettings,

        currentView,
        setCurrentView,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        applyModalOpen,
        setApplyModalOpen,
        reportModalData,
        setReportModalData,
        reviewModalProject,
        setReviewModalProject,
        supabaseModalOpen,
        setSupabaseModalOpen,

        resetAllData,
        isSupabaseLive,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
