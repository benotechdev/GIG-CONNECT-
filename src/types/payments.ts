export type PaymentGateway = 'flutterwave' | 'pesapal' | 'direct_momo';

export type PaymentMethod = 'mtn_momo' | 'airtel_money' | 'card' | 'bank_transfer';

export type TransactionType = 'escrow_deposit' | 'platform_commission' | 'freelancer_payout' | 'featured_fee' | 'refund';

export type TransactionStatus = 'pending' | 'escrow_locked' | 'released' | 'refunded' | 'failed';

export interface PaymentTransaction {
  id: string;
  project_id?: string;
  job_id?: string;
  job_title?: string;
  client_id: string;
  client_name: string;
  freelancer_id?: string;
  freelancer_name?: string;
  type: TransactionType;
  amount_ugx: number;
  platform_fee_ugx: number;
  freelancer_net_ugx: number;
  currency: 'UGX';
  payment_method: PaymentMethod;
  payment_gateway: PaymentGateway;
  gateway_reference: string;
  phone_number?: string;
  status: TransactionStatus;
  notes?: string;
  created_at: string;
  released_at?: string;
}

export interface PayoutRequest {
  id: string;
  freelancer_id: string;
  freelancer_name: string;
  amount_ugx: number;
  fee_ugx: number; // e.g. telecom withdrawal tax / network fee ~UGX 1,500
  net_payout_ugx: number;
  payment_method: 'mtn_momo' | 'airtel_money';
  account_phone: string;
  account_name: string;
  gateway_reference?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  processed_at?: string;
}

export interface GatewayProviderConfig {
  id: PaymentGateway;
  name: string;
  description: string;
  supportedMethods: PaymentMethod[];
  currency: string;
  settlementTime: string;
  feeStructure: string;
  escrowSupport: 'Native Automated' | 'Manual / Milestone' | 'Simulated Webhooks';
  status: 'Active' | 'Sandbox' | 'Configured';
  features: string[];
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  actor_role: string;
  action: string;
  resource_type: 'job' | 'user' | 'project' | 'payment' | 'role' | 'setting';
  resource_id: string;
  details: string;
  timestamp: string;
}
