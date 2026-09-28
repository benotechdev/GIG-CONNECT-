import React from 'react';
import {
  Coins,
  ShieldCheck,
  Smartphone,
  Users2,
  Percent,
  Headphones,
} from 'lucide-react';

export const WhyGigConnectUG: React.FC = () => {
  const reasons = [
    {
      icon: <Coins className="w-6 h-6 text-amber-500" />,
      title: 'Native UGX Currency',
      description: 'Zero dollar conversion losses, no foreign exchange volatility, and no expensive overseas wire fees. Trade purely in Ugandan Shillings.',
    },
    {
      icon: <Smartphone className="w-6 h-6 text-yellow-500" />,
      title: 'MTN MoMo & Airtel Money',
      description: 'Deposit funds or receive earnings straight to your registered mobile money phone numbers within minutes.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
      title: '100% Escrow Protection',
      description: 'Clients deposit milestone funds into escrow before work begins. Freelancers work with peace of mind knowing payment is locked.',
    },
    {
      icon: <Users2 className="w-6 h-6 text-indigo-600" />,
      title: 'Verified Ugandan Talent',
      description: 'All featured specialists have proven skills, verified portfolios, and phone/ID verification across Kampala, Entebbe, Jinja, and beyond.',
    },
    {
      icon: <Percent className="w-6 h-6 text-emerald-600" />,
      title: 'Lowest 10% Platform Fee',
      description: 'Global platforms take 20% or more. Gig Connect UG keeps commissions fair so freelancers keep more of what they earn.',
    },
    {
      icon: <Headphones className="w-6 h-6 text-purple-600" />,
      title: 'Local Kampala Support',
      description: 'Prompt customer assistance and localized mediation based right here in Uganda. Call or chat with our team anytime.',
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
            <span>THE LOCAL ADVANTAGE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Choose Gig Connect UG?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            We solved the payment delays, high FX fees, and communication gaps of international marketplaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-xs">
                {reason.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{reason.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
