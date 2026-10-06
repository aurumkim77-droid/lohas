import React, { useState } from 'react';
import { SiteProvider, useSiteContext } from './context/SiteContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { AdminLoginModal } from './components/common/AdminLoginModal';
import { Hero } from './components/home/Hero';
import { BusinessAreasSection } from './components/home/BusinessAreasSection';
import { PortfolioPreview } from './components/home/PortfolioPreview';
import { LocationSection } from './components/home/LocationSection';

import { CompanyPage } from './components/pages/CompanyPage';
import { BusinessAreasPage } from './components/pages/BusinessAreasPage';
import { PortfolioPage } from './components/pages/PortfolioPage';
import { NoticesPage } from './components/pages/NoticesPage';
import { CustomPage } from './components/pages/CustomPage';

import { AdminDashboard } from './components/admin/AdminDashboard';
import { useRouteSeo } from './utils/seoUtils';

function MainLayout() {
  const { currentPage, isAdminModeActive } = useSiteContext();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Dynamically update meta description, page title, canonical URL, OpenGraph and Twitter cards per route
  useRouteSeo();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, isAdminModeActive]);

  // If Admin Dashboard mode is activated, show full Admin Panel
  if (isAdminModeActive) {
    return <AdminDashboard />;
  }

  const renderPage = () => {
    if (currentPage === '/') {
      return (
        <main className="animate-fadeIn">
          <Hero />
          <BusinessAreasSection />
          <PortfolioPreview />
          <LocationSection />
        </main>
      );
    }

    if (currentPage === '/company') {
      return <CompanyPage />;
    }

    if (currentPage === '/business') {
      return <BusinessAreasPage />;
    }

    if (currentPage === '/portfolio') {
      return <PortfolioPage />;
    }

    if (currentPage === '/notices') {
      return <NoticesPage />;
    }

    if (currentPage.startsWith('/custom/')) {
      const customId = currentPage.replace('/custom/', '');
      return <CustomPage pageId={customId} />;
    }

    // Default Fallback
    return (
      <main className="animate-fadeIn">
        <Hero />
        <BusinessAreasSection />
        <PortfolioPreview />
      </main>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-[#f5ea1d] selection:text-[#001528]">
      <Header onOpenLoginModal={() => setLoginModalOpen(true)} />
      
      <div className="flex-1">
        {renderPage()}
      </div>

      <Footer onOpenLoginModal={() => setLoginModalOpen(true)} />

      <AdminLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <SiteProvider>
      <MainLayout />
    </SiteProvider>
  );
}
