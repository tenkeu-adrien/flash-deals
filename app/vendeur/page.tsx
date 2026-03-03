'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVendorStore } from '@/lib/stores/vendorStore';
import LandingPage from '@/components/vendeur/pages/LandingPage';
import SignupPage from '@/components/vendeur/pages/SignupPage';
import LoginPage from '@/components/vendeur/pages/LoginPage';
import DashboardPage from '@/components/vendeur/pages/DashboardPage';
import CreateCampaignPage from '@/components/vendeur/pages/CreateCampaignPage';
import CampaignsPage from '@/components/vendeur/pages/CampaignsPage';

export default function VendorApp() {
  const { currentPage, setCurrentPage } = useVendorStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'signup':
        return <SignupPage onNavigate={setCurrentPage} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'create-campaign':
        return <CreateCampaignPage onNavigate={setCurrentPage} />;
      case 'campaigns':
        return <CampaignsPage onNavigate={setCurrentPage} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto bg-black min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
