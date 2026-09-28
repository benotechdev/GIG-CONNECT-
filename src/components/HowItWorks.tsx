import React, { useState } from 'react';
import {
  FileText,
  Search,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  TrendingUp,
  Award,
  Wallet,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HowItWorks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'clients' | 'freelancers'>('clients');
  const { setCurrentView } = useApp();

  const clientSteps = [
    {
      step: '01',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      title: 'Post a Job in UGX',
      description: 'Detail your scope, required skills, and budget in Ugandan Shillings. Fixed price or hourly.',
    },
    {
      step: '02',
      icon: <Search className="w-6 h-6 text-blue-600" />,
      title: 'Review Proposals & Chat',
      description: 'Receive competitive bids from verified Ugandan pros. Chat directly and inspect portfolios.',
    },
    {
      step: '03',
      icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
      title: 'Fund Safe Escrow',
      description: 'Deposit project funds securely via MTN Mobile Money, Airtel Money, or Card. Funds stay protected.',
    },
    {
      step: '04',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
      title: 'Approve & Release Payment',
      description: 'Review final deliverables. Release payout to the freelancer only when completely satisfied.',
    },
  ];

  const freelancerSteps = [
    {
      step: '01',
      icon: <Award className="w-6 h-6 text-amber-500" />,
      title: 'Create Your Profile',
      description: 'Highlight your expertise, location (Kampala, Jinja, etc.), hourly UGX rate, and real portfolio pieces.',
    },
    {
      step: '02',
      icon: <Search className="w-6 h-6 text-blue-600" />,
      title: 'Search & Submit Proposals',
      description: 'Find jobs matching your skills. Submit tailored proposals, delivery timelines, and budget bids.',
    },
    {
      step: '03',
      icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
      title: 'Collaborate & Deliver',
      description: 'Communicate via in-app messaging, share progress links, and submit milestones cleanly.',
    },
    {
      step: '04',
      icon: <Wallet className="w-6 h-6 text-emerald-600" />,
      title: 'Earn & Withdraw Instantly',
      description: 'Get paid immediately in UGX into your MTN MoMo wallet, Airtel Money, or local bank account.',
    },
  ];

  const steps = activeTab === 'clients' ? clientSteps : freelancerSteps;

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-amber-400 mb-3">
            <span>TRANSPARENT PROCESS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Gig Connect UG Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            A secure, seamless workflow designed specifically for Uganda's growing digital economy.
          </p>

          {/* Toggle pill */}
          <div className="mt-8 inline-flex p-1 rounded-xl bg-slate-800/90 border border-slate-700">
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'clients'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              For Clients & Businesses
            </button>
            <button
              onClick={() => setActiveTab('freelancers')}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'freelancers'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              For Ugandan Freelancers
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => (
            <div
              key={item.step}
              className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-slate-500 transition-all duration-200 flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className="font-mono text-2xl font-black text-slate-700 group-hover:text-slate-500 transition-colors">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action prompt */}
        <div className="mt-12 text-center">
          {activeTab === 'clients' ? (
            <button
              onClick={() => setCurrentView('post-job')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg transition-all cursor-pointer"
            >
              <span>Post Your Job Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('jobs')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg transition-all cursor-pointer"
            >
              <span>Explore Available Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
