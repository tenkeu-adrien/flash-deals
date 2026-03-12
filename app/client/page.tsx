'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useClientStore } from '@/lib/stores/clientStore';
import { getCart } from '@/lib/firebase/firestore';
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
import SimpleCheckoutPage from '@/components/client/pages/SimpleCheckoutPage';
import NewCheckoutPage from '@/components/client/pages/NewCheckoutPage';
import ChatPage from '@/components/client/pages/ChatPage';

export default function ClientApp() {
  const { currentPage, setCurrentPage, isAuthenticated, user, setCart } = useClientStore();

  // Synchroniser le panier Firebase avec le panier local au démarrage
  useEffect(() => {
    const syncCart = async () => {
      if (isAuthenticated && user) {
        const result = await getCart();
        if (result.success && result.cart) {
          // Convertir le format Firebase vers le format Zustand
          const cartItems = result.cart.map((item: any) => ({
            id: item.id,
            campaignId: item.campaignId,
            quantity: item.quantity,
            price: item.price,
            campaign: item.campaign
          }));
          setCart(cartItems);
          console.log('✅ Panier synchronisé:', cartItems.length, 'articles');
        }
      }
    };

    syncCart();
  }, [isAuthenticated, user]);

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
      case 'checkout':
        return <SimpleCheckoutPage />;
      case 'new-checkout':
        return <NewCheckoutPage onNavigate={setCurrentPage} />;
      case 'profile':
        return <ProfilePage onNavigate={setCurrentPage} />;
      case 'notifications':
        return <NotificationsPage onNavigate={setCurrentPage} />;
      case 'chat':
        return <ChatPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="max-w-[480px] mx-auto bg-[#000000] min-h-screen relative overflow-x-hidden">
      {currentPage !== 'otp' && currentPage !== 'profile-setup' && currentPage !== 'tutorial' && currentPage !== 'checkout' && (
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

      {isAuthenticated && ['dashboard', 'search', 'cart', 'profile', 'notifications', 'chat'].includes(currentPage) && (
        <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
      )}
    </div>
  );
}
