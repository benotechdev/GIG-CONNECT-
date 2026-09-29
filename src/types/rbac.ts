export type UserRole =
  | 'organizer'
  | 'attendee'
  | 'admin'
  | 'moderator'
  | 'sponsor'
  | 'client'
  | 'freelancer'
  | 'agency';

export type Permission =
  // Event permissions
  | 'events:create'
  | 'events:edit_own'
  | 'events:delete_own'
  | 'events:feature'
  | 'events:moderate'
  | 'events:view_attendees'
  // Ticket permissions
  | 'tickets:book'
  | 'tickets:view_own'
  | 'tickets:refund'
  | 'tickets:scan'
  // Organizer permissions
  | 'organizer:verify'
  | 'organizer:feature'
  | 'profile:manage_own'
  | 'portfolio:edit'
  // Payment permissions
  | 'payments:ticket_payout'
  | 'payments:view_transactions'
  | 'payments:manage_gateways'
  | 'payments:initiate_escrow'
  | 'payments:request_payout'
  // Admin permissions
  | 'admin:view_dashboard'
  | 'admin:manage_users'
  | 'admin:manage_events'
  | 'admin:manage_monetization'
  | 'admin:moderate_reports'
  | 'admin:audit_logs'
  | 'admin:manage_roles'
  | 'admin:finance_overview'
  // Legacy aliases for backward compatibility
  | 'jobs:create'
  | 'jobs:edit_own'
  | 'jobs:delete_own'
  | 'jobs:feature'
  | 'jobs:moderate'
  | 'jobs:view_proposals'
  | 'applications:submit'
  | 'applications:view_own'
  | 'applications:accept'
  | 'applications:reject'
  | 'projects:create_contract'
  | 'projects:submit_deliverables'
  | 'projects:approve_deliverables'
  | 'projects:release_payment'
  | 'projects:dispute'
  | 'freelancer:badge_verify'
  | 'freelancer:feature';

export interface RoleDefinition {
  id: UserRole;
  name: string;
  tagline: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  isSystemRole: boolean;
  permissions: Permission[];
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  organizer: {
    id: 'organizer',
    name: 'Event Organizer',
    tagline: 'Hosting concerts, trips & entertainment',
    description: 'Can create and publish events, configure ticket tiers in UGX, view attendee lists, and withdraw ticket sales revenue via MTN/Airtel MoMo.',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    borderColor: 'border-amber-300',
    isSystemRole: true,
    permissions: [
      'events:create',
      'events:edit_own',
      'events:delete_own',
      'events:feature',
      'events:view_attendees',
      'tickets:scan',
      'profile:manage_own',
      'payments:ticket_payout',
      'payments:request_payout',
      'payments:view_transactions',
      // Legacy compatibility
      'jobs:create',
      'jobs:edit_own',
      'jobs:delete_own',
      'jobs:feature',
      'jobs:view_proposals',
      'applications:accept',
      'applications:reject',
      'projects:create_contract',
      'projects:approve_deliverables',
      'projects:release_payment',
    ],
  },
  attendee: {
    id: 'attendee',
    name: 'Event Goer / Attendee',
    tagline: 'Discovering experiences in Uganda',
    description: 'Can browse events, buy tickets in UGX via MTN MoMo / Airtel Money, save favorites, download e-tickets, and leave reviews.',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
    borderColor: 'border-blue-300',
    isSystemRole: true,
    permissions: [
      'tickets:book',
      'tickets:view_own',
      'profile:manage_own',
      'payments:view_transactions',
      // Legacy compatibility
      'applications:submit',
      'applications:view_own',
    ],
  },
  admin: {
    id: 'admin',
    name: 'Super Administrator',
    tagline: 'Platform Governance & Safety',
    description: 'Full platform administrative access: event approvals, organizer verification badges, fee configuration, and financial payouts.',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-800',
    borderColor: 'border-purple-300',
    isSystemRole: true,
    permissions: [
      'events:create',
      'events:edit_own',
      'events:delete_own',
      'events:feature',
      'events:moderate',
      'events:view_attendees',
      'tickets:book',
      'tickets:view_own',
      'tickets:refund',
      'tickets:scan',
      'organizer:verify',
      'organizer:feature',
      'profile:manage_own',
      'portfolio:edit',
      'payments:ticket_payout',
      'payments:view_transactions',
      'payments:manage_gateways',
      'payments:initiate_escrow',
      'payments:request_payout',
      'admin:view_dashboard',
      'admin:manage_users',
      'admin:manage_events',
      'admin:manage_monetization',
      'admin:moderate_reports',
      'admin:audit_logs',
      'admin:manage_roles',
      'admin:finance_overview',
      // Legacy compatibility
      'jobs:create',
      'jobs:edit_own',
      'jobs:delete_own',
      'jobs:feature',
      'jobs:moderate',
      'jobs:view_proposals',
      'applications:submit',
      'applications:view_own',
      'applications:accept',
      'applications:reject',
      'projects:create_contract',
      'projects:submit_deliverables',
      'projects:approve_deliverables',
      'projects:release_payment',
      'projects:dispute',
      'freelancer:badge_verify',
      'freelancer:feature',
    ],
  },
  moderator: {
    id: 'moderator',
    name: 'Community Moderator',
    tagline: 'Trust, Safety & Quality',
    description: 'Reviews reported events, inspects ticket authenticity, and flags duplicate or misleading promotions.',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-800',
    borderColor: 'border-teal-300',
    isSystemRole: false,
    permissions: [
      'events:moderate',
      'tickets:view_own',
      'profile:manage_own',
      'admin:view_dashboard',
      'admin:moderate_reports',
      'jobs:moderate',
    ],
  },
  sponsor: {
    id: 'sponsor',
    name: 'Brand Sponsor / Advertiser',
    tagline: 'Promoting brands at major events',
    description: 'Can book featured banners, sponsor event stages, and access event attendee demographic reports.',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    borderColor: 'border-emerald-300',
    isSystemRole: false,
    permissions: [
      'events:feature',
      'profile:manage_own',
      'payments:view_transactions',
      'tickets:view_own',
    ],
  },
  client: {
    id: 'client',
    name: 'Event Organizer (Client)',
    tagline: 'Hosting concerts, trips & entertainment',
    description: 'Can create and publish events, configure ticket tiers in UGX, view attendee lists, and withdraw ticket sales revenue.',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    borderColor: 'border-amber-300',
    isSystemRole: true,
    permissions: [
      'events:create',
      'events:edit_own',
      'events:delete_own',
      'events:feature',
      'events:view_attendees',
      'profile:manage_own',
      'payments:ticket_payout',
      'payments:request_payout',
      'payments:view_transactions',
      'jobs:create',
      'jobs:edit_own',
      'jobs:delete_own',
      'jobs:feature',
      'jobs:view_proposals',
      'applications:accept',
      'applications:reject',
      'projects:create_contract',
      'projects:approve_deliverables',
      'projects:release_payment',
      'projects:dispute',
      'payments:initiate_escrow',
    ],
  },
  freelancer: {
    id: 'freelancer',
    name: 'Event Goer / Attendee',
    tagline: 'Discovering experiences in Uganda',
    description: 'Can browse events, buy tickets in UGX via MTN MoMo / Airtel Money, save favorites, and download e-tickets.',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
    borderColor: 'border-blue-300',
    isSystemRole: true,
    permissions: [
      'tickets:book',
      'tickets:view_own',
      'profile:manage_own',
      'portfolio:edit',
      'payments:view_transactions',
      'payments:request_payout',
      'applications:submit',
      'applications:view_own',
      'projects:submit_deliverables',
      'projects:dispute',
    ],
  },
  agency: {
    id: 'agency',
    name: 'Event Production Agency',
    tagline: 'Full-scale event production',
    description: 'Organizes large multi-day festivals, stage lighting, sound engineering, and high-volume ticket sales.',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-800',
    borderColor: 'border-indigo-300',
    isSystemRole: false,
    permissions: [
      'events:create',
      'events:edit_own',
      'events:delete_own',
      'events:feature',
      'events:view_attendees',
      'tickets:scan',
      'profile:manage_own',
      'portfolio:edit',
      'payments:ticket_payout',
      'payments:request_payout',
      'payments:view_transactions',
      'jobs:create',
      'jobs:edit_own',
      'jobs:delete_own',
      'jobs:feature',
      'jobs:view_proposals',
      'applications:submit',
      'applications:view_own',
    ],
  },
};

export interface PermissionItem {
  key: Permission;
  label: string;
  description: string;
}

export interface PermissionGroup {
  category: string;
  permissions: PermissionItem[];
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    category: 'Events & Entertainment',
    permissions: [
      {
        key: 'events:create',
        label: 'Create & Publish Events',
        description: 'Publish concerts, festivals, trips, parties, sports and comedy shows with ticket tiers.',
      },
      {
        key: 'events:edit_own',
        label: 'Edit Own Events',
        description: 'Update dates, venues, lineup, ticket tiers, and poster artwork.',
      },
      {
        key: 'events:delete_own',
        label: 'Cancel or Archive Events',
        description: 'Cancel, reschedule, or remove posted entertainment events.',
      },
      {
        key: 'events:feature',
        label: 'Promote & Feature Events',
        description: 'Submit events for front-page spotlight, trending badge, and banner placement.',
      },
      {
        key: 'events:moderate',
        label: 'Review & Moderate Events',
        description: 'Approve or flag community events for safety and authenticity.',
      },
      {
        key: 'events:view_attendees',
        label: 'Access Attendee Roster',
        description: 'View guest list, ticket tier breakdown, and scanned entries.',
      },
    ],
  },
  {
    category: 'Tickets & Booking',
    permissions: [
      {
        key: 'tickets:book',
        label: 'Purchase Event Tickets',
        description: 'Buy tickets in UGX via MTN MoMo, Airtel Money, or Card.',
      },
      {
        key: 'tickets:view_own',
        label: 'My E-Tickets & Passes',
        description: 'View, download QR codes, and present passes at gate entry.',
      },
      {
        key: 'tickets:refund',
        label: 'Process Ticket Refunds',
        description: 'Issue refunds for cancelled or rescheduled events.',
      },
      {
        key: 'tickets:scan',
        label: 'Scan & Validate Entry Tickets',
        description: 'Scan and verify attendee QR codes at event entry gates.',
      },
    ],
  },
  {
    category: 'Organizers & Profiles',
    permissions: [
      {
        key: 'organizer:verify',
        label: 'Verify Organizer Profile',
        description: 'Grant official verified shield to vetted entertainment organizers.',
      },
      {
        key: 'organizer:feature',
        label: 'Feature Organizer Spotlight',
        description: 'Pin organizer profile on the homepage top organizers row.',
      },
      {
        key: 'profile:manage_own',
        label: 'Manage Creator Profile',
        description: 'Update organizer brand, social links, bio, and contact numbers.',
      },
      {
        key: 'portfolio:edit',
        label: 'Past Event Showcase & Media',
        description: 'Upload photos, recaps, and video highlights from past events.',
      },
    ],
  },
  {
    category: 'Payments & Mobile Money',
    permissions: [
      {
        key: 'payments:ticket_payout',
        label: 'Disburse Ticket Revenues',
        description: 'Transfer net ticket proceeds to organizer MTN/Airtel accounts.',
      },
      {
        key: 'payments:view_transactions',
        label: 'Transaction & Sales History',
        description: 'View detailed real-time event booking and payout receipts in UGX.',
      },
      {
        key: 'payments:manage_gateways',
        label: 'Gateway Configurations',
        description: 'Manage Uganda MTN Mobile Money & Airtel Money API integrations.',
      },
      {
        key: 'payments:initiate_escrow',
        label: 'Secure Ticket Escrow Holding',
        description: 'Hold attendee funds until event occurs with buyer protection.',
      },
      {
        key: 'payments:request_payout',
        label: 'Request Fund Withdrawal',
        description: 'Submit payout request to withdraw accrued ticket sales to MoMo.',
      },
    ],
  },
  {
    category: 'Platform Administration',
    permissions: [
      {
        key: 'admin:view_dashboard',
        label: 'Admin Analytics Dashboard',
        description: 'Access high-level metrics on ticket volume, active events, and revenue.',
      },
      {
        key: 'admin:manage_users',
        label: 'Manage Users & Organizers',
        description: 'Suspend accounts, assign roles, and handle verification requests.',
      },
      {
        key: 'admin:manage_events',
        label: 'Full Event Moderation',
        description: 'Promote, edit, or remove any event across the entire platform.',
      },
      {
        key: 'admin:manage_monetization',
        label: 'Monetization & Commission',
        description: 'Configure ticket booking fee %, featured placement fees in UGX.',
      },
      {
        key: 'admin:moderate_reports',
        label: 'Reports & Disputes Resolution',
        description: 'Review community flags, scam warnings, and chargeback queries.',
      },
      {
        key: 'admin:audit_logs',
        label: 'Security & Audit Trail',
        description: 'Inspect privileged administrative events, payouts, and logins.',
      },
      {
        key: 'admin:manage_roles',
        label: 'RBAC Role Management',
        description: 'Assign and adjust permissions for organizers, staff, and moderators.',
      },
      {
        key: 'admin:finance_overview',
        label: 'Financial Reconciliation',
        description: 'Audit total UGX inflows, pending escrow holdings, and MoMo fees.',
      },
    ],
  },
];

export const roleHasPermission = (role: UserRole | undefined, permission: Permission): boolean => {
  if (!role) return false;
  const def = ROLE_DEFINITIONS[role];
  if (!def) return false;
  return def.permissions.includes(permission);
};
