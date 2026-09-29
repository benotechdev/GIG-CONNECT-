import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Homepage Components (exact order: Featured Events → Upcoming Events → Popular Categories → Trending Events → Weekend Events → Top Organizers → Call to Action)
import { HeroSection } from './components/HeroSection';
import { FeaturedEvents } from './components/FeaturedEvents';
import { UpcomingEvents } from './components/UpcomingEvents';
import { PopularCategories } from './components/PopularCategories';
import { TrendingEvents } from './components/TrendingEvents';
import { WeekendEvents } from './components/WeekendEvents';
import { TopOrganizers } from './components/TopOrganizers';
import { CallToAction } from './components/CallToAction';

// Event Pages
import { BrowseEventsPage } from './pages/BrowseEventsPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { BrowseOrganizersPage } from './pages/BrowseOrganizersPage';
import { OrganizerProfilePage } from './pages/OrganizerProfilePage';
import { OrganizerDashboardPage } from './pages/OrganizerDashboardPage';
import { MyTicketsPage } from './pages/MyTicketsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { MessagesPage } from './pages/MessagesPage';
import { SavedPage } from './pages/SavedPage';
import { NewsPage } from './pages/NewsPage';

// Modals
import { AuthModal } from './components/AuthModal';
import { TicketBookingModal } from './components/TicketBookingModal';
import { ShareModal } from './components/ShareModal';
import { ReportModal } from './components/ReportModal';
import { ReviewModal } from './components/ReviewModal';
import { SupabaseModal } from './components/SupabaseModal';
import { RoleRestrictedModal } from './components/RoleRestrictedModal';
import { RolesExplorerModal } from './components/RolesExplorerModal';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { EscrowDepositModal } from './components/EscrowDepositModal';
import { PayoutModal } from './components/PayoutModal';

function AppContent() {
  const { currentView, setCurrentView, setSelectedEventId } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState('');
  const [activeKeywordFilter, setActiveKeywordFilter] = useState('');

  const handleHeroSearch = (keyword: string, category: string, location: string) => {
    setActiveKeywordFilter(keyword);
    setActiveCategoryFilter(category);
    setCurrentView('events');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (categoryName: string) => {
    setActiveCategoryFilter(categoryName);
    setActiveKeywordFilter('');
    setCurrentView('events');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentView('event-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <HeroSection onSearch={handleHeroSearch} />

            {/* Requested Homepage Sequence:
                Featured Events → Upcoming Events → Popular Categories → Trending Events → Weekend Events → Top Organizers → Call to Action */}
            <FeaturedEvents />
            <UpcomingEvents />
            <PopularCategories onSelectCategory={handleCategorySelect} />
            <TrendingEvents />
            <WeekendEvents />
            <TopOrganizers />
            <CallToAction />
          </>
        )}

        {(currentView === 'events' || currentView === 'jobs') && (
          <BrowseEventsPage
            initialCategory={activeCategoryFilter}
            initialKeyword={activeKeywordFilter}
          />
        )}

        {currentView === 'event-detail' && <EventDetailsPage />}

        {(currentView === 'create-event' || currentView === 'post-job') && <CreateEventPage />}

        {(currentView === 'organizers' || currentView === 'freelancers') && <BrowseOrganizersPage />}

        {(currentView === 'organizer-detail' || currentView === 'freelancer-detail') && <OrganizerProfilePage />}

        {(currentView === 'my-tickets' || currentView === 'projects') && <MyTicketsPage />}

        {currentView === 'organizer-dashboard' && <OrganizerDashboardPage />}

        {currentView === 'client-dashboard' && <OrganizerDashboardPage />}

        {currentView === 'freelancer-dashboard' && <MyTicketsPage />}

        {currentView === 'admin-dashboard' && <AdminDashboardPage />}

        {currentView === 'messages' && <MessagesPage />}

        {currentView === 'saved' && <SavedPage />}

        {currentView === 'news' && <NewsPage />}
      </main>

      <Footer />

      {/* Global Modals */}
      <AuthModal />
      <TicketBookingModal />
      <ShareModal />
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
