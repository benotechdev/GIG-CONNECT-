import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  UserRole,
  Permission,
  roleHasPermission,
  EventItem,
  TicketTier,
  TicketBooking,
  Message,
  Review,
  Notification,
  Report,
  PlatformMonetizationSettings,
  PaymentTransaction,
  PayoutRequest,
  AuditLog,
  PaymentMethod,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_EVENTS,
  INITIAL_BOOKINGS,
  INITIAL_MESSAGES,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS,
  INITIAL_SETTINGS,
  INITIAL_TRANSACTIONS,
  INITIAL_PAYOUTS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';
import { isSupabaseConnected } from '../lib/supabase';

interface AppContextType {
  // Auth & User & Scalable RBAC
  currentUser: User | null;
  users: User[];
  setCurrentUser: (user: User | null) => void;
  loginAs: (userId: string) => void;
  signUp: (userData: Partial<User>) => void;
  logout: () => void;
  updateCurrentUserProfile: (updates: Partial<User>) => void;
  toggleVerifyUser: (userId: string) => void;
  toggleFeatureOrganizer: (userId: string) => void;
  togglePremiumOrganizer: (userId: string) => void;
  changeUserRole: (userId: string, newRole: UserRole) => void;
  can: (permission: Permission) => boolean;

  // Events
  events: EventItem[];
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
  publishEvent: (eventData: Partial<EventItem>) => EventItem;
  toggleFeatureEvent: (eventId: string) => void;
  toggleTrendingEvent: (eventId: string) => void;
  deleteEvent: (eventId: string) => void;
  updateEventStatus: (eventId: string, status: EventItem['status']) => void;

  // Organizers
  selectedOrganizerId: string | null;
  setSelectedOrganizerId: (id: string | null) => void;

  // Ticket Bookings & RSVPs
  ticketBookings: TicketBooking[];
  bookTicket: (data: {
    eventId: string;
    tierId: string;
    quantity: number;
    attendeeName: string;
    attendeePhone: string;
    attendeeEmail: string;
    paymentMethod: 'mtn_momo' | 'airtel_money' | 'card' | 'free';
  }) => TicketBooking | null;
  cancelTicketBooking: (bookingId: string) => void;

  // Financials & Withdrawals
  transactions: PaymentTransaction[];
  payoutRequests: PayoutRequest[];
  auditLogs: AuditLog[];
  requestPayout: (data: {
    amountUgx: number;
    paymentMethod: 'mtn_momo' | 'airtel_money';
    accountPhone: string;
    accountName: string;
  }) => PayoutRequest;
  approvePayout: (payoutId: string) => void;
  addAuditLog: (action: string, resourceType: AuditLog['resource_type'], resourceId: string, details: string) => void;

  // Messaging
  messages: Message[];
  activeConversationUserId: string | null;
  setActiveConversationUserId: (userId: string | null) => void;
  sendMessage: (receiverId: string, text: string) => void;
  markConversationAsRead: (otherUserId: string) => void;

  // Reviews
  reviews: Review[];
  submitReview: (eventId: string, toOrganizerId: string, rating: number, comment: string) => void;

  // Saved / Favorites
  savedEventIds: string[];
  favoriteOrganizerIds: string[];
  toggleSaveEvent: (eventId: string) => void;
  toggleFavoriteOrganizer: (organizerId: string) => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (userId: string, title: string, message: string, type: Notification['type'], linkTab?: string) => void;

  // Reports
  reports: Report[];
  submitReport: (targetType: 'event' | 'user' | 'job', targetId: string, targetTitle: string, reason: string, details: string) => void;
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
  ticketBookingModalEvent: EventItem | null;
  setTicketBookingModalEvent: (event: EventItem | null) => void;
  shareModalEvent: EventItem | null;
  setShareModalEvent: (event: EventItem | null) => void;
  reportModalData: { targetType: 'event' | 'user' | 'job'; targetId: string; targetTitle: string } | null;
  setReportModalData: (data: { targetType: 'event' | 'user' | 'job'; targetId: string; targetTitle: string } | null) => void;
  supabaseModalOpen: boolean;
  setSupabaseModalOpen: (open: boolean) => void;
  rolesModalOpen: boolean;
  setRolesModalOpen: (open: boolean) => void;
  paymentDocsModalOpen: boolean;
  setPaymentDocsModalOpen: (open: boolean) => void;
  payoutModalOpen: boolean;
  setPayoutModalOpen: (open: boolean) => void;
  roleRestrictedNotice: { action: string; requiredRole: string; reason: string } | null;
  setRoleRestrictedNotice: (notice: { action: string; requiredRole: string; reason: string } | null) => void;

  // Compatibility aliases
  jobs: EventItem[];
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
  postJob: (data: any) => any;
  toggleFeatureJob: (id: string) => void;
  deleteJob: (id: string) => void;
  updateJobStatus: (id: string, status: any) => void;
  selectedFreelancerId: string | null;
  setSelectedFreelancerId: (id: string | null) => void;
  applications: TicketBooking[];
  applyToJob: (data: any) => boolean;
  acceptApplication: (id: string) => void;
  rejectApplication: (id: string) => void;
  projects: TicketBooking[];
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  updateProjectStage: (id: string, stage: any) => void;
  completeAndReleaseProject: (id: string) => void;
  savedJobIds: string[];
  favoriteFreelancerIds: string[];
  toggleSaveJob: (id: string) => void;
  toggleFavoriteFreelancer: (id: string) => void;
  applyModalOpen: boolean;
  setApplyModalOpen: (open: boolean) => void;
  reviewModalProject: any;
  setReviewModalProject: (project: any) => void;
  escrowDepositModalProject: any;
  setEscrowDepositModalProject: (project: any) => void;
  initiateEscrowDeposit: (data: any) => any;
  toggleFeatureFreelancer: (id: string) => void;
  togglePremiumFreelancer: (id: string) => void;

  resetAllData: () => void;
  isSupabaseLive: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'gig_connect_current_user_id',
  USERS: 'gig_connect_events_users_v2',
  EVENTS: 'gig_connect_events_v2',
  BOOKINGS: 'gig_connect_bookings_v2',
  MESSAGES: 'gig_connect_events_messages_v2',
  REVIEWS: 'gig_connect_events_reviews_v2',
  NOTIFICATIONS: 'gig_connect_events_notifications_v2',
  REPORTS: 'gig_connect_events_reports_v2',
  SETTINGS: 'gig_connect_events_settings_v2',
  SAVED_EVENTS: 'gig_connect_saved_events_v2',
  FAV_ORGANIZERS: 'gig_connect_fav_organizers_v2',
  TRANSACTIONS: 'gig_connect_events_transactions_v2',
  PAYOUTS: 'gig_connect_events_payouts_v2',
  AUDIT_LOGS: 'gig_connect_events_audit_logs_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage fallbacks
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (savedId) {
      const found = users.find((u) => u.id === savedId);
      if (found) return found;
    }
    // Default to organizer Talent Africa Group
    return INITIAL_USERS[0];
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [ticketBookings, setTicketBookings] = useState<TicketBooking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [monetizationSettings, setMonetizationSettings] = useState<PlatformMonetizationSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [savedEventIds, setSavedEventIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_EVENTS);
    return saved ? JSON.parse(saved) : ['event-1', 'event-2'];
  });

  const [favoriteOrganizerIds, setFavoriteOrganizerIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAV_ORGANIZERS);
    return saved ? JSON.parse(saved) : ['user-org-1'];
  });

  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYOUTS);
    return saved ? JSON.parse(saved) : INITIAL_PAYOUTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Navigation and active UI selections
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedEventId, setSelectedEventId] = useState<string | null>('event-1');
  const [selectedOrganizerId, setSelectedOrganizerId] = useState<string | null>(null);
  const [activeConversationUserId, setActiveConversationUserId] = useState<string | null>(null);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'switch'>('login');
  const [ticketBookingModalEvent, setTicketBookingModalEvent] = useState<EventItem | null>(null);
  const [shareModalEvent, setShareModalEvent] = useState<EventItem | null>(null);
  const [reportModalData, setReportModalData] = useState<{ targetType: 'event' | 'user' | 'job'; targetId: string; targetTitle: string } | null>(null);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [rolesModalOpen, setRolesModalOpen] = useState(false);
  const [paymentDocsModalOpen, setPaymentDocsModalOpen] = useState(false);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [roleRestrictedNotice, setRoleRestrictedNotice] = useState<{ action: string; requiredRole: string; reason: string } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUser.id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(ticketBookings));
  }, [ticketBookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(monetizationSettings));
  }, [monetizationSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED_EVENTS, JSON.stringify(savedEventIds));
  }, [savedEventIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYOUTS, JSON.stringify(payoutRequests));
  }, [payoutRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // RBAC Permission Checker
  const can = (permission: Permission): boolean => {
    return roleHasPermission(currentUser?.role, permission);
  };

  const changeUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
    addAuditLog('role:changed', 'user', userId, `Changed role to ${newRole}`);
  };

  const addAuditLog = (action: string, resourceType: AuditLog['resource_type'], resourceId: string, details: string) => {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor_id: currentUser?.id || 'system',
      actor_name: currentUser?.full_name || 'System',
      actor_role: currentUser?.role || 'admin',
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

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
      role: userData.role || 'attendee',
      avatar_url:
        userData.avatar_url ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      phone: userData.phone || '+256 700 000 000',
      location: userData.location || 'Kampala, Uganda',
      title: userData.title || (userData.role === 'organizer' ? 'Event Organizer' : 'Event Goer & Fan'),
      bio: userData.bio || 'Excited to discover and host events on Gig Connect UG!',
      rating: 5.0,
      total_reviews: 0,
      earnings_ugx: 0,
      spent_ugx: 0,
      is_verified: false,
      is_featured: false,
      is_premium: false,
      created_at: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setAuthModalOpen(false);

    addNotification(
      newUser.id,
      'Welcome to Gig Connect UG! 🇺🇬',
      'Discover thrilling concerts, trips, festivals, and weekend parties across Uganda.',
      'system',
      'events'
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

  const toggleFeatureOrganizer = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_featured: !u.is_featured } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, is_featured: !prev.is_featured } : null));
    }
  };

  const togglePremiumOrganizer = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_premium: !u.is_premium } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, is_premium: !prev.is_premium } : null));
    }
  };

  // Event Management
  const publishEvent = (eventData: Partial<EventItem>): EventItem => {
    const lowestTierPrice =
      eventData.ticket_tiers && eventData.ticket_tiers.length > 0
        ? Math.min(...eventData.ticket_tiers.map((t) => t.price_ugx))
        : 0;

    const newEvent: EventItem = {
      id: `event-${Date.now()}`,
      title: eventData.title || 'Untitled Event',
      tagline: eventData.tagline || 'Exciting experience in Uganda',
      description: eventData.description || '',
      category: eventData.category || 'Concerts',
      poster_url:
        eventData.poster_url ||
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
      gallery_images: eventData.gallery_images || [],
      organizer_id: currentUser?.id || 'user-org-1',
      organizer_name: currentUser?.full_name || 'Event Organizer',
      organizer_avatar:
        currentUser?.avatar_url ||
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
      organizer_verified: currentUser?.is_verified ?? true,
      date: eventData.date || new Date().toISOString().split('T')[0],
      end_date: eventData.end_date || eventData.date,
      time: eventData.time || '6:00 PM - Late',
      venue: eventData.venue || 'Lugogo Cricket Oval',
      location: eventData.location || 'Kampala, Uganda',
      city: eventData.city || 'Kampala',
      ticket_tiers:
        eventData.ticket_tiers && eventData.ticket_tiers.length > 0
          ? eventData.ticket_tiers
          : [
              {
                id: `tier-${Date.now()}-1`,
                name: 'Regular Admission',
                price_ugx: 30000,
                capacity: 500,
                sold_count: 0,
                perks: ['General Admission', 'Live Stage Access'],
              },
            ],
      starting_price_ugx: lowestTierPrice,
      activities: eventData.activities || ['Live Performances', 'Food & Drinks', 'Music'],
      lineup: eventData.lineup || [],
      is_featured: eventData.is_featured || false,
      is_trending: false,
      is_weekend: true,
      is_sponsored: false,
      status: 'published',
      views_count: 1,
      attendees_count: 0,
      created_at: new Date().toISOString(),
      // Legacy Job fields
      budget_ugx: lowestTierPrice,
      client_id: currentUser?.id || 'user-org-1',
      client_name: currentUser?.full_name || 'Event Organizer',
      client_avatar: currentUser?.avatar_url || '',
    };

    setEvents((prev) => [newEvent, ...prev]);

    // Update organizer event count
    if (currentUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === currentUser.id
            ? { ...u, events_count: (u.events_count || 0) + 1 }
            : u
        )
      );
    }

    addNotification(
      newEvent.organizer_id,
      'Event Published Successfully! 🚀',
      `"${newEvent.title}" is now live on Gig Connect UG. Tickets are ready for booking in UGX.`,
      'event',
      'events'
    );

    addAuditLog('event:create', 'job', newEvent.id, `Created event ${newEvent.title}`);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    return newEvent;
  };

  const toggleFeatureEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, is_featured: !e.is_featured } : e))
    );
  };

  const toggleTrendingEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, is_trending: !e.is_trending } : e))
    );
  };

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    addAuditLog('event:delete', 'job', eventId, 'Deleted event listing');
  };

  const updateEventStatus = (eventId: string, status: EventItem['status']) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status } : e))
    );
  };

  // Ticket Booking Flow
  const bookTicket = (data: {
    eventId: string;
    tierId: string;
    quantity: number;
    attendeeName: string;
    attendeePhone: string;
    attendeeEmail: string;
    paymentMethod: 'mtn_momo' | 'airtel_money' | 'card' | 'free';
  }): TicketBooking | null => {
    const targetEvent = events.find((e) => e.id === data.eventId);
    if (!targetEvent) return null;

    const tier = targetEvent.ticket_tiers.find((t) => t.id === data.tierId);
    const unitPrice = tier ? tier.price_ugx : 0;
    const totalAmount = unitPrice * data.quantity;
    const platformFee = Math.round(totalAmount * (monetizationSettings.commission_rate_percent / 100));
    const organizerPayout = totalAmount - platformFee;

    const newBooking: TicketBooking = {
      id: `tkt-${Date.now()}`,
      event_id: targetEvent.id,
      event_title: targetEvent.title,
      event_poster: targetEvent.poster_url,
      event_date: targetEvent.date,
      event_time: targetEvent.time,
      event_venue: targetEvent.venue,
      event_location: targetEvent.location,
      attendee_id: currentUser?.id || `user-guest-${Date.now()}`,
      attendee_name: data.attendeeName,
      attendee_email: data.attendeeEmail,
      attendee_phone: data.attendeePhone,
      tier_id: data.tierId,
      tier_name: tier?.name || 'Standard Pass',
      quantity: data.quantity,
      unit_price_ugx: unitPrice,
      total_amount_ugx: totalAmount,
      platform_fee_ugx: platformFee,
      organizer_payout_ugx: organizerPayout,
      payment_method: data.paymentMethod,
      payment_status: 'paid',
      qr_code_ref: `GCUG-TKT-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`,
      created_at: new Date().toISOString(),
      // Legacy compatibility
      job_id: targetEvent.id,
      job_title: targetEvent.title,
      freelancer_id: currentUser?.id || 'guest',
      freelancer_name: data.attendeeName,
      status: 'accepted',
    };

    // Update tickets
    setTicketBookings((prev) => [newBooking, ...prev]);

    // Update event attendee count & tier sold count
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== targetEvent.id) return e;
        const updatedTiers = e.ticket_tiers.map((t) =>
          t.id === data.tierId ? { ...t, sold_count: (t.sold_count || 0) + data.quantity } : t
        );
        return {
          ...e,
          attendees_count: (e.attendees_count || 0) + data.quantity,
          ticket_tiers: updatedTiers,
        };
      })
    );

    // Record Payment Transaction
    if (totalAmount > 0) {
      const newTx: PaymentTransaction = {
        id: `tx-${Date.now()}`,
        job_id: targetEvent.id,
        job_title: targetEvent.title,
        client_id: newBooking.attendee_id,
        client_name: newBooking.attendee_name,
        freelancer_id: targetEvent.organizer_id,
        freelancer_name: targetEvent.organizer_name,
        type: 'escrow_deposit',
        amount_ugx: totalAmount,
        platform_fee_ugx: platformFee,
        freelancer_net_ugx: organizerPayout,
        currency: 'UGX',
        payment_method: (data.paymentMethod === 'free' ? 'mtn_momo' : data.paymentMethod) as PaymentMethod,
        payment_gateway: data.paymentMethod === 'airtel_money' ? 'pesapal' : 'flutterwave',
        gateway_reference: `GCUG-MOMO-${Date.now().toString().slice(-7)}`,
        phone_number: data.attendeePhone,
        status: 'released',
        notes: `${data.quantity}x ${tier?.name || 'Tickets'} for ${targetEvent.title}`,
        created_at: new Date().toISOString(),
        released_at: new Date().toISOString(),
      };
      setTransactions((prev) => [newTx, ...prev]);
    }

    // Update organizer revenue & user spent
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === targetEvent.organizer_id) {
          return { ...u, earnings_ugx: (u.earnings_ugx || 0) + organizerPayout };
        }
        if (currentUser && u.id === currentUser.id) {
          return { ...u, spent_ugx: (u.spent_ugx || 0) + totalAmount };
        }
        return u;
      })
    );

    // Notify Attendee
    addNotification(
      newBooking.attendee_id,
      'E-Ticket Ready for Download! 🎟️',
      `Your booking for "${targetEvent.title}" is confirmed. Tap to view your QR ticket.`,
      'ticket',
      'my-tickets'
    );

    // Notify Organizer
    addNotification(
      targetEvent.organizer_id,
      'Ticket Booked! 💰',
      `${data.attendeeName} booked ${data.quantity}x ${tier?.name || 'ticket'} (UGX ${totalAmount.toLocaleString()}) via ${data.paymentMethod.toUpperCase()}.`,
      'payment',
      'organizer-dashboard'
    );

    addAuditLog('ticket:book', 'job', newBooking.id, `Booked ${data.quantity} tickets for ${targetEvent.title}`);
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.55 } });

    return newBooking;
  };

  const cancelTicketBooking = (bookingId: string) => {
    setTicketBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, payment_status: 'refunded' } : b))
    );
  };

  // Financial Payouts for Organizers
  const requestPayout = (data: {
    amountUgx: number;
    paymentMethod: 'mtn_momo' | 'airtel_money';
    accountPhone: string;
    accountName: string;
  }): PayoutRequest => {
    const feeUgx = 1500; // Telecom withdrawal fee
    const netPayout = Math.max(0, data.amountUgx - feeUgx);

    const newPayout: PayoutRequest = {
      id: `payout-${Date.now()}`,
      freelancer_id: currentUser?.id || 'organizer',
      freelancer_name: currentUser?.full_name || 'Organizer',
      amount_ugx: data.amountUgx,
      fee_ugx: feeUgx,
      net_payout_ugx: netPayout,
      payment_method: data.paymentMethod,
      account_phone: data.accountPhone,
      account_name: data.accountName,
      gateway_reference: `DISB-${data.paymentMethod.toUpperCase()}-${Date.now().toString().slice(-6)}`,
      status: 'completed', // Simulated instant payout to MoMo
      created_at: new Date().toISOString(),
      processed_at: new Date().toISOString(),
    };

    setPayoutRequests((prev) => [newPayout, ...prev]);

    // Deduct from organizer balance
    if (currentUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === currentUser.id
            ? { ...u, earnings_ugx: Math.max(0, (u.earnings_ugx || 0) - data.amountUgx) }
            : u
        )
      );
      setCurrentUser((prev) =>
        prev ? { ...prev, earnings_ugx: Math.max(0, (prev.earnings_ugx || 0) - data.amountUgx) } : null
      );
    }

    addNotification(
      newPayout.freelancer_id,
      'Payout Sent to Mobile Money! ⚡',
      `UGX ${netPayout.toLocaleString()} has been transferred to ${data.accountPhone} (${data.accountName}) via ${data.paymentMethod === 'mtn_momo' ? 'MTN MoMo' : 'Airtel Money'}.`,
      'payment',
      'organizer-dashboard'
    );

    addAuditLog('payout:processed', 'payment', newPayout.id, `Disbursed UGX ${data.amountUgx} to ${data.accountPhone}`);
    return newPayout;
  };

  const approvePayout = (payoutId: string) => {
    setPayoutRequests((prev) =>
      prev.map((p) => (p.id === payoutId ? { ...p, status: 'completed', processed_at: new Date().toISOString() } : p))
    );
  };

  // Messaging
  const sendMessage = (receiverId: string, text: string) => {
    if (!currentUser || !text.trim()) return;

    const convId = [currentUser.id, receiverId].sort().join('_');
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: convId,
      sender_id: currentUser.id,
      sender_name: currentUser.full_name,
      sender_avatar: currentUser.avatar_url,
      receiver_id: receiverId,
      text: text.trim(),
      created_at: new Date().toISOString(),
      is_read: false,
    };

    setMessages((prev) => [...prev, newMsg]);

    addNotification(
      receiverId,
      `New Message from ${currentUser.full_name}`,
      text.slice(0, 80),
      'message',
      'messages'
    );
  };

  const markConversationAsRead = (otherUserId: string) => {
    if (!currentUser) return;
    const convId = [currentUser.id, otherUserId].sort().join('_');
    setMessages((prev) =>
      prev.map((m) =>
        m.conversation_id === convId && m.receiver_id === currentUser.id
          ? { ...m, is_read: true }
          : m
      )
    );
  };

  // Reviews
  const submitReview = (eventId: string, toOrganizerId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    const event = events.find((e) => e.id === eventId);
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      project_id: eventId,
      project_title: event?.title || 'Event',
      from_user_id: currentUser.id,
      from_user_name: currentUser.full_name,
      from_user_avatar: currentUser.avatar_url,
      to_user_id: toOrganizerId,
      rating,
      comment,
      created_at: new Date().toISOString(),
    };

    setReviews((prev) => [newRev, ...prev]);

    // Recalculate organizer rating
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== toOrganizerId) return u;
        const currentCount = u.total_reviews || 0;
        const newRating = Number((((u.rating || 5) * currentCount + rating) / (currentCount + 1)).toFixed(2));
        return {
          ...u,
          rating: newRating,
          total_reviews: currentCount + 1,
        };
      })
    );

    addNotification(
      toOrganizerId,
      'New 5-Star Event Review! ⭐',
      `${currentUser.full_name} left a review on your event.`,
      'review',
      'organizer-dashboard'
    );
  };

  // Saved / Favorites
  const toggleSaveEvent = (eventId: string) => {
    setSavedEventIds((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const toggleFavoriteOrganizer = (organizerId: string) => {
    setFavoriteOrganizerIds((prev) =>
      prev.includes(organizerId) ? prev.filter((id) => id !== organizerId) : [...prev, organizerId]
    );
  };

  // Notifications
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

  const addNotification = (
    userId: string,
    title: string,
    message: string,
    type: Notification['type'],
    linkTab?: string
  ) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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

  // Reports
  const submitReport = (
    targetType: 'event' | 'user' | 'job',
    targetId: string,
    targetTitle: string,
    reason: string,
    details: string
  ) => {
    const newRep: Report = {
      id: `rep-${Date.now()}`,
      reporter_id: currentUser?.id || 'guest',
      reporter_name: currentUser?.full_name || 'Guest User',
      target_type: targetType,
      target_id: targetId,
      target_name_or_title: targetTitle,
      reason,
      details,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    setReports((prev) => [newRep, ...prev]);
    addAuditLog('report:submit', 'job', targetId, `Reported ${targetType} for ${reason}`);
  };

  const resolveReport = (reportId: string, action: 'resolved' | 'dismissed') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action } : r))
    );
  };

  const updateMonetizationSettings = (settings: Partial<PlatformMonetizationSettings>) => {
    setMonetizationSettings((prev) => ({ ...prev, ...settings }));
    addAuditLog('settings:update', 'setting', 'monetization', 'Updated platform commission and fees');
  };

  const resetAllData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setEvents(INITIAL_EVENTS);
    setTicketBookings(INITIAL_BOOKINGS);
    setMessages(INITIAL_MESSAGES);
    setReviews(INITIAL_REVIEWS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setReports(INITIAL_REPORTS);
    setMonetizationSettings(INITIAL_SETTINGS);
    setSavedEventIds(['event-1', 'event-2']);
    setFavoriteOrganizerIds(['user-org-1']);
    setTransactions(INITIAL_TRANSACTIONS);
    setPayoutRequests(INITIAL_PAYOUTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentView('home');
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
        toggleFeatureOrganizer,
        togglePremiumOrganizer,
        changeUserRole,
        can,

        // Events
        events,
        selectedEventId,
        setSelectedEventId,
        publishEvent,
        toggleFeatureEvent,
        toggleTrendingEvent,
        deleteEvent,
        updateEventStatus,

        // Organizers
        selectedOrganizerId,
        setSelectedOrganizerId,

        // Bookings
        ticketBookings,
        bookTicket,
        cancelTicketBooking,

        // Financials
        transactions,
        payoutRequests,
        auditLogs,
        requestPayout,
        approvePayout,
        addAuditLog,

        // Messaging
        messages,
        activeConversationUserId,
        setActiveConversationUserId,
        sendMessage,
        markConversationAsRead,

        // Reviews
        reviews,
        submitReview,

        // Saved / Favorites
        savedEventIds,
        favoriteOrganizerIds,
        toggleSaveEvent,
        toggleFavoriteOrganizer,

        // Notifications
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,

        // Reports
        reports,
        submitReport,
        resolveReport,

        // Settings
        monetizationSettings,
        updateMonetizationSettings,

        // Navigation & Modals
        currentView,
        setCurrentView,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        ticketBookingModalEvent,
        setTicketBookingModalEvent,
        shareModalEvent,
        setShareModalEvent,
        reportModalData,
        setReportModalData,
        supabaseModalOpen,
        setSupabaseModalOpen,
        rolesModalOpen,
        setRolesModalOpen,
        paymentDocsModalOpen,
        setPaymentDocsModalOpen,
        payoutModalOpen,
        setPayoutModalOpen,
        roleRestrictedNotice,
        setRoleRestrictedNotice,

        // Compatibility Aliases
        jobs: events,
        selectedJobId: selectedEventId,
        setSelectedJobId: setSelectedEventId,
        postJob: publishEvent as any,
        toggleFeatureJob: toggleFeatureEvent,
        deleteJob: deleteEvent,
        updateJobStatus: updateEventStatus as any,
        selectedFreelancerId: selectedOrganizerId,
        setSelectedFreelancerId: setSelectedOrganizerId,
        applications: ticketBookings as any,
        applyToJob: ((data: any) => {
          bookTicket({
            eventId: data.jobId,
            tierId: 'tier-1',
            quantity: 1,
            attendeeName: currentUser?.full_name || 'Attendee',
            attendeePhone: '+256 772 123 456',
            attendeeEmail: currentUser?.email || 'user@example.ug',
            paymentMethod: 'mtn_momo',
          });
          return true;
        }) as any,
        acceptApplication: () => {},
        rejectApplication: () => {},
        projects: ticketBookings as any,
        selectedProjectId: selectedEventId,
        setSelectedProjectId: setSelectedEventId,
        updateProjectStage: () => {},
        completeAndReleaseProject: () => {},
        savedJobIds: savedEventIds,
        favoriteFreelancerIds: favoriteOrganizerIds,
        toggleSaveJob: toggleSaveEvent,
        toggleFavoriteFreelancer: toggleFavoriteOrganizer,
        applyModalOpen: ticketBookingModalEvent !== null,
        setApplyModalOpen: (open) => {
          if (!open) setTicketBookingModalEvent(null);
        },
        reviewModalProject: null,
        setReviewModalProject: () => {},
        escrowDepositModalProject: null,
        setEscrowDepositModalProject: () => {},
        initiateEscrowDeposit: () => ({} as any),
        toggleFeatureFreelancer: toggleFeatureOrganizer,
        togglePremiumFreelancer: togglePremiumOrganizer,

        resetAllData,
        isSupabaseLive: isSupabaseConnected(),
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
