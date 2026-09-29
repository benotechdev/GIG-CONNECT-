import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { PopularCategories } from './components/PopularCategories';
import { FeaturedFreelancers } from './components/FeaturedFreelancers';
import { LatestJobs } from './components/LatestJobs';
import { HowItWorks } from './components/HowItWorks';
import { WhyGigConnectUG } from './components/WhyGigConnectUG';
import { CallToAction } from './components/CallToAction';

// Modals
import { AuthModal } from './components/AuthModal';
import { ApplyModal } from './components/ApplyModal';
import { ReportModal } from './components/ReportModal';
import { ReviewModal } from './components/ReviewModal';
import { SupabaseModal } from './components/SupabaseModal';
import { RoleRestrictedModal } from './components/RoleRestrictedModal';
import { RolesExplorerModal } from './components/RolesExplorerModal';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { EscrowDepositModal } from './components/EscrowDepositModal';
import { PayoutModal } from './components/PayoutModal';

// Pages
import { BrowseJobsPage } from './pages/BrowseJobsPage';
import { PostJobPage } from './pages/PostJobPage';
import { BrowseFreelancersPage } from './pages/BrowseFreelancersPage';
import { FreelancerProfilePage } from './pages/FreelancerProfilePage';
import { ProjectTrackingPage } from './pages/ProjectTrackingPage';
import { MessagesPage } from './pages/MessagesPage';
import { ClientDashboardPage } from './pages/ClientDashboardPage';
import { FreelancerDashboardPage } from './pages/FreelancerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { SavedPage } from './pages/SavedPage';

function AppContent() {
  const { currentView, setCurrentView, setSelectedJobId } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState('');
  const [activeKeywordFilter, setActiveKeywordFilter] = useState('');

  const handleHeroSearch = (keyword: string, category: string, location: string) => {
    setActiveKeywordFilter(keyword);
    setActiveCategoryFilter(category);
  };

  const handleCategorySelect = (categoryName: string) => {
    setActiveCategoryFilter(categoryName);
    setActiveKeywordFilter('');
  };

  const handleJobSelectFromHome = (jobId: string) => {
    setSelectedJobId(jobId);
    setCurrentView('jobs');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection onSearch={handleHeroSearch} />
            <PopularCategories onSelectCategory={handleCategorySelect} />
            <FeaturedFreelancers />
            <LatestJobs onSelectJob={handleJobSelectFromHome} />
            <HowItWorks />
            <WhyGigConnectUG />
            <CallToAction />
          </>
        )}

        {currentView === 'jobs' && (
          <BrowseJobsPage
            initialCategory={activeCategoryFilter}
            initialKeyword={activeKeywordFilter}
          />
        )}

        {currentView === 'post-job' && <PostJobPage />}

        {currentView === 'freelancers' && <BrowseFreelancersPage />}

        {currentView === 'freelancer-detail' && <FreelancerProfilePage />}

        {currentView === 'projects' && <ProjectTrackingPage />}

        {currentView === 'messages' && <MessagesPage />}

        {currentView === 'client-dashboard' && <ClientDashboardPage />}

        {currentView === 'freelancer-dashboard' && <FreelancerDashboardPage />}

        {currentView === 'admin-dashboard' && <AdminDashboardPage />}

        {currentView === 'saved' && <SavedPage />}
      </main>

      <Footer />

      {/* Global Modals */}
      <AuthModal />
      <ApplyModal />
      <ReportModal />
      <ReviewModal />
      <SupabaseModal />
      <RoleRestrictedModal />
      <RolesExplorerModal />
      <PaymentGatewayModal />
      <EscrowDepositModal />
      <PayoutModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
