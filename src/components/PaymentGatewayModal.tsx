import React, { useState } from 'react';
import {
  Coins,
  X,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Building,
  ArrowRight,
  Code,
  Copy,
  Check,
  Lock,
  Layers,
  FileText,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GATEWAY_CONFIGS } from '../data/mockData';
import { formatUGX } from '../utils/formatters';

export const PaymentGatewayModal: React.FC = () => {
  const { paymentDocsModalOpen, setPaymentDocsModalOpen, monetizationSettings } = useApp();
  const [activeTab, setActiveTab] = useState<'recommendation' | 'comparison' | 'steps' | 'code' | 'schema'>('recommendation');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  if (!paymentDocsModalOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(label);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const sampleDepositCode = `// 1. Initiate Mobile Money Escrow Deposit (Uganda)
// POST https://api.flutterwave.com/v3/charges?type=mobile_money_uganda
import axios from 'axios';

export async function initiateMoMoEscrowDeposit({
  clientPhone,     // e.g. "256772123456"
  clientEmail,
  clientName,
  amountUgx,       // e.g. 2500000 (UGX)
  projectId,
  networkProvider, // "MTN" or "AIRTEL"
}) {
  const response = await axios.post(
    'https://api.flutterwave.com/v3/charges?type=mobile_money_uganda',
    {
      tx_ref: \`ESCROW-\${projectId}-\${Date.now()}\`,
      amount: amountUgx,
      currency: 'UGX',
      voucher: networkProvider === 'VODAFONE' ? '' : undefined,
      network: networkProvider, // 'MTN' or 'AIRTEL'
      email: clientEmail,
      phone_number: clientPhone,
      fullname: clientName,
      redirect_url: 'https://gigconnect.ug/payments/callback',
      meta: {
        project_id: projectId,
        type: 'escrow_deposit',
        platform: 'Gig Connect UG',
      },
    },
    {
      headers: {
        Authorization: \`Bearer \${process.env.FLUTTERWAVE_SECRET_KEY}\`,
        'Content-Type': 'application/json',
      },
    }
  );

  // Client receives immediate USSD prompt on their phone to enter PIN:
  // "Approve payment of UGX 2,500,000 to Gig Connect UG Escrow? Enter MM PIN:"
  return response.data;
}`;

  const sampleDisbursementCode = `// 2. Automated Freelancer Payout with Platform Commission Deduction
// Triggered when client approves deliverables
export async function releaseEscrowAndDisbursePayout({
  contractAmountUgx, // e.g. UGX 2,500,000
  freelancerPhone,   // e.g. "256701987654"
  freelancerName,
  network,           // "MTN" or "AIRTEL"
  projectId,
}) {
  // 10% Platform Commission
  const COMMISSION_PERCENT = 10;
  const platformFeeUgx = (contractAmountUgx * COMMISSION_PERCENT) / 100; // 250,000 UGX
  const freelancerPayoutUgx = contractAmountUgx - platformFeeUgx;      // 2,250,000 UGX

  // Disburse Net Amount directly to Freelancer's Mobile Money wallet
  const transferResponse = await axios.post(
    'https://api.flutterwave.com/v3/transfers',
    {
      account_bank: network === 'MTN' ? 'MPS' : 'AIRTEL', // Uganda Mobile Money Bank Codes
      account_number: freelancerPhone,
      amount: freelancerPayoutUgx,
      currency: 'UGX',
      narration: \`Gig Connect UG - Milestone Payout for Project #\${projectId}\`,
      reference: \`PAYOUT-\${projectId}-\${Date.now()}\`,
      meta: {
        projectId,
        platformFeeUgx,
        contractTotalUgx: contractAmountUgx,
      },
    },
    {
      headers: {
        Authorization: \`Bearer \${process.env.FLUTTERWAVE_SECRET_KEY}\`,
        'Content-Type': 'application/json',
      },
    }
  );

  return {
    transfer: transferResponse.data,
    platformFeeUgx,
    freelancerPayoutUgx,
  };
}`;

  const sampleWebhookCode = `// 3. Webhook Handler with Cryptographic Signature Check
app.post('/api/webhooks/payment', express.json(), async (req, res) => {
  const signature = req.headers['verif-hash'];
  if (!signature || signature !== process.env.FLUTTERWAVE_WEBHOOK_HASH) {
    return res.status(401).send('Invalid signature');
  }

  const { event, data } = req.body;
  if (event === 'charge.completed' && data.status === 'successful') {
    const { tx_ref, amount, currency } = data;
    const projectId = data.meta.project_id;

    // Update Supabase payment_transactions: status -> 'escrow_locked'
    // Update Supabase projects: stage -> 'in_progress'
    await db.paymentTransactions.update({
      where: { gateway_reference: tx_ref },
      data: { status: 'escrow_locked' },
    });
  }

  res.status(200).send({ received: true });
});`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">UGX Payment Gateway & Escrow Integration</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 font-mono">
                  Bank of Uganda NPS Compliant
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Research report, recommendation, and complete integration blueprint for Ugandan freelance transactions
              </p>
            </div>
          </div>
          <button
            onClick={() => setPaymentDocsModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 pt-4 border-b border-slate-200 bg-slate-50 text-xs">
          <div className="flex space-x-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('recommendation')}
              className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'recommendation'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              1. Gateway Recommendation
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'comparison'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              2. Provider Comparison Matrix
            </button>
            <button
              onClick={() => setActiveTab('steps')}
              className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'steps'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              3. Escrow & Commission Steps
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 whitespace-nowrap font-mono ${
                activeTab === 'code'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              4. Node/TS Code Snippets
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`pb-3 font-bold cursor-pointer transition-colors border-b-2 whitespace-nowrap font-mono ${
                activeTab === 'schema'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              5. SQL Schema Changes
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: RECOMMENDATION */}
          {activeTab === 'recommendation' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 border border-amber-200 p-6 rounded-3xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-xs">
                    Primary Recommendation
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Flutterwave (Uganda) + Direct MTN MoMo / Airtel Open API Fallback
                  </h3>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  For a freelance marketplace operating natively in Uganda, payment reliability is paramount. Over <strong>85% of domestic transactions in Uganda happen via Mobile Money</strong> (MTN MoMo and Airtel Money), while international clients hiring Ugandan talent require credit/debit card checkout.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
                    <span className="font-bold text-slate-900 block">1. Native Escrow Subaccounts</span>
                    <span className="text-[11px] text-slate-600">Built-in Split Payment API to hold escrow and deduct platform commission automatically.</span>
                  </div>
                  <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
                    <span className="font-bold text-slate-900 block">2. Dual MoMo STK Push</span>
                    <span className="text-[11px] text-slate-600">Direct prompt to MTN (*165#) and Airtel (*185#) numbers with &gt;99% prompt delivery rate.</span>
                  </div>
                  <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
                    <span className="font-bold text-slate-900 block">3. Instant Bulk Payouts</span>
                    <span className="text-[11px] text-slate-600">API transfers funds into freelancer phone numbers within 5-15 seconds of milestone approval.</span>
                  </div>
                </div>
              </div>

              {/* Market Context */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Uganda Payment Landscape & Regulatory Requirements
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <Smartphone className="w-4 h-4 text-amber-600" />
                      <span>Mobile Money Dominance</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      MTN Mobile Money holds ~62% market share, while Airtel Money holds ~35%. Gig Connect UG must support both operators seamlessly without requiring users to hold bank accounts.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Bank of Uganda Compliance (NPS Act 2020)</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Escrow funds must be held in segregated trust accounts in a commercial bank regulated by the Bank of Uganda to ensure full solvency and client fund protection.
                    </p>
                  </div>
                </div>
              </div>

              {/* Commission & Monetization Model */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <h4 className="font-bold text-slate-900">How Platform Commission is Deducted in UGX</h4>
                <p className="text-slate-600">
                  On Gig Connect UG, the platform charges a default <strong>{monetizationSettings.commission_rate_percent}% platform commission</strong> on completed job milestones. Here is the exact calculation flow:
                </p>
                <div className="bg-white p-4 rounded-xl border border-slate-200 font-mono text-[11px] space-y-1.5">
                  <div className="flex justify-between text-slate-700">
                    <span>Client Job Budget (Escrow Deposit):</span>
                    <span className="font-bold">UGX 1,500,000</span>
                  </div>
                  <div className="flex justify-between text-purple-700 font-semibold">
                    <span>Less: Platform Commission (10%):</span>
                    <span>- UGX 150,000</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold border-t border-slate-200 pt-1.5">
                    <span>Net Disbursed to Freelancer:</span>
                    <span>UGX 1,350,000</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>Telecom Cashout Tariff (Standard):</span>
                    <span>~ UGX 1,500 (Covered by recipient or platform)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPARISON */}
          {activeTab === 'comparison' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Gateways Evaluated for Uganda Freelance Marketplace
              </h4>

              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                      <tr>
                        <th className="p-3.5">Provider</th>
                        <th className="p-3.5">MTN & Airtel MoMo</th>
                        <th className="p-3.5">Cards (Visa/MC)</th>
                        <th className="p-3.5">Escrow / Split Support</th>
                        <th className="p-3.5">Settlement Time</th>
                        <th className="p-3.5">Fees</th>
                        <th className="p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {GATEWAY_CONFIGS.map((g) => (
                        <tr key={g.id} className="hover:bg-slate-50/50">
                          <td className="p-3.5">
                            <span className="font-bold text-slate-900 block">{g.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{g.currency}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Both Active
                            </span>
                          </td>
                          <td className="p-3.5">
                            {g.supportedMethods.includes('card') ? (
                              <span className="text-emerald-700 font-medium">Supported</span>
                            ) : (
                              <span className="text-slate-400">Mobile Only</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-purple-100 text-purple-800">
                              {g.escrowSupport}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-[11px]">{g.settlementTime}</td>
                          <td className="p-3.5 text-slate-600 text-[11px] max-w-xs">{g.feeStructure}</td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              g.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : g.status === 'Configured'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {g.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STEPS */}
          {activeTab === 'steps' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                End-to-End Escrow & Payment Lifecycle on Gig Connect UG
              </h4>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Client Job Funding (Escrow Deposit)</h5>
                    <p className="text-[11px] text-slate-600 mt-1">
                      When client accepts a proposal or creates milestone contract, client enters their MTN or Airtel phone number. Platform sends a <strong>USSD STK Push prompt</strong> to their phone. Upon entering PIN, funds are locked in Gig Connect UG Escrow.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Webhook Confirmation & Contract Activation</h5>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Flutterwave dispatches signed webhook <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700">charge.completed</code>. Platform marks transaction status to <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-mono">escrow_locked</code> and notifies freelancer that it is safe to begin work.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Deliverable Submission & Client Review</h5>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Freelancer delivers files, code repos, or test links via the Project Tracker. Client inspects deliverables and has up to 14 days to request revisions or approve.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    4
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Approval & Automated Commission Split</h5>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Client clicks "Approve & Release Payment". The system deducts the {monetizationSettings.commission_rate_percent}% platform commission and credits the 90% net funds directly to the freelancer's wallet balance.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    5
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Instant Mobile Money Payout (Withdrawal)</h5>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Freelancer requests payout via MTN MoMo or Airtel Money. Backend initiates <code className="bg-slate-100 px-1 py-0.5 rounded text-teal-700">POST /v3/transfers</code>. Funds land directly in freelancer's mobile phone within seconds.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CODE */}
          {activeTab === 'code' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">1. Mobile Money Escrow Deposit (Uganda)</span>
                  <button
                    onClick={() => copyToClipboard(sampleDepositCode, 'deposit')}
                    className="flex items-center gap-1 text-blue-700 hover:text-blue-900 font-medium cursor-pointer"
                  >
                    {copiedSnippet === 'deposit' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet === 'deposit' ? 'Copied' : 'Copy Snippet'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto max-h-64">
{sampleDepositCode}
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">2. Automated Commission Split & Freelancer Transfer</span>
                  <button
                    onClick={() => copyToClipboard(sampleDisbursementCode, 'disburse')}
                    className="flex items-center gap-1 text-blue-700 hover:text-blue-900 font-medium cursor-pointer"
                  >
                    {copiedSnippet === 'disburse' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet === 'disburse' ? 'Copied' : 'Copy Snippet'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto max-h-64">
{sampleDisbursementCode}
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">3. Webhook Verification with Cryptographic Hash</span>
                  <button
                    onClick={() => copyToClipboard(sampleWebhookCode, 'webhook')}
                    className="flex items-center gap-1 text-blue-700 hover:text-blue-900 font-medium cursor-pointer"
                  >
                    {copiedSnippet === 'webhook' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet === 'webhook' ? 'Copied' : 'Copy Snippet'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto max-h-64">
{sampleWebhookCode}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 5: SCHEMA */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700">
                <p className="font-semibold text-slate-900">Database Schema Additions in `supabase-schema.sql`</p>
                <p className="mt-1">
                  Three dedicated tables support this financial infrastructure: <code className="text-purple-700 font-mono">payment_transactions</code>, <code className="text-purple-700 font-mono">payout_requests</code>, and <code className="text-purple-700 font-mono">escrow_ledger</code>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 text-xs font-mono space-y-3 overflow-x-auto">
                <p className="text-emerald-400">-- 1. Payment Transactions Table</p>
                <p className="text-slate-300">
{`CREATE TABLE public.payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id),
  client_id UUID REFERENCES public.profiles(id),
  freelancer_id UUID REFERENCES public.profiles(id),
  type TEXT NOT NULL CHECK (type IN ('escrow_deposit', 'platform_commission', 'freelancer_payout', 'featured_fee')),
  amount_ugx NUMERIC NOT NULL CHECK (amount_ugx >= 0),
  platform_fee_ugx NUMERIC NOT NULL DEFAULT 0,
  freelancer_net_ugx NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'UGX',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('mtn_momo', 'airtel_money', 'card')),
  payment_gateway TEXT NOT NULL CHECK (payment_gateway IN ('flutterwave', 'pesapal', 'direct_momo')),
  gateway_reference TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'escrow_locked', 'released', 'refunded', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  released_at TIMESTAMPTZ
);`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
