'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminStore } from '@/lib/stores/adminStore';
import LoginPage from '@/components/admin/pages/LoginPage';
import DashboardPage from '@/components/admin/pages/DashboardPage';
import ClientsPage from '@/components/admin/pages/ClientsPage';
import VendorsPage from '@/components/admin/pages/VendorsPage';
import CampaignsPage from '@/components/admin/pages/CampaignsPage';
import OrdersPage from '@/components/admin/pages/OrdersPage';
import FinancesPage from '@/components/admin/pages/FinancesPage';
import AnalyticsPage from '@/components/admin/pages/AnalyticsPage';
import SettingsPage from '@/components/admin/pages/SettingsPage';

export default function AdminApp() {
  const { currentPage, setCurrentPage, isAuthenticated } = useAdminStore();

  const renderPage = () => {
    if (!isAuthenticated) {
      return <LoginPage onNavigate={setCurrentPage} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'clients':
        return <ClientsPage onNavigate={setCurrentPage} />;
      case 'vendors':
        return <VendorsPage onNavigate={setCurrentPage} />;
      case 'campaigns':
        return <CampaignsPage onNavigate={setCurrentPage} />;
      case 'orders':
        return <OrdersPage onNavigate={setCurrentPage} />;
      case 'finances':
        return <FinancesPage onNavigate={setCurrentPage} />;
      case 'analytics':
        return <AnalyticsPage onNavigate={setCurrentPage} />;
      case 'settings':
        return <SettingsPage onNavigate={setCurrentPage} />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark">
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
