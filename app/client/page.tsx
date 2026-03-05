'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClientStore } from '@/lib/stores/clientStore';
import Header from '@/components/client/Header';
import BottomNav from '@/components/client/BottomNav';
import HomePage from '@/components/client/pages/HomePage';
import SignupPage from '@/components/client/pages/SignupPage';
import LoginPage from '@/components/client/pages/LoginPage';
import OTPPage from '@/components/client/pages/OTPPage';
import ProfileSetupPage from '@/components/client/pages/ProfileSetupPage';
import TutorialPage from '@/components/client/pages/TutorialPage';
import DashboardPage from '@/components/client/pages/DashboardPage';
import SearchPage from '@/components/client/pages/SearchPage';
import ProductPage from '@/components/client/pages/ProductPage';
import CartPage from '@/components/client/pages/CartPage';
import ProfilePage from '@/components/client/pages/ProfilePage';
import NotificationsPage from '@/components/client/pages/NotificationsPage';

export default function ClientApp() {
  const { currentPage, setCurrentPage, isAuthenticated } = useClientStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'signup':
        return <SignupPage onNavigate={setCurrentPage} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} />;
      case 'otp':
        return <OTPPage onNavigate={setCurrentPage} />;
      case 'profile-setup':
        return <ProfileSetupPage onNavigate={setCurrentPage} />;
      case 'tutorial':
        return <TutorialPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'search':
        return <SearchPage onNavigate={setCurrentPage} />;
      case 'product':
        return <ProductPage onNavigate={setCurrentPage} />;
      case 'cart':
        return <CartPage onNavigate={setCurrentPage} />;
      case 'profile':
        return <ProfilePage onNavigate={setCurrentPage} />;
      case 'notifications':
        return <NotificationsPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="max-w-[480px] mx-auto bg-[#000000] min-h-screen relative overflow-x-hidden">
      {currentPage !== 'otp' && currentPage !== 'profile-setup' && currentPage !== 'tutorial' && (
        <Header onNavigate={setCurrentPage} />
      )}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>

      {isAuthenticated && ['dashboard', 'search', 'cart', 'profile', 'notifications'].includes(currentPage) && (
        <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
      )}
    </div>
  );
}
