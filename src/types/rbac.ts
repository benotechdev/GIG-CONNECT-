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

export const roleHasPermission = (role: UserRole | undefined, permission: Permission): boolean => {
  if (!role) return false;
  const def = ROLE_DEFINITIONS[role];
  if (!def) return false;
  return def.permissions.includes(permission);
};
