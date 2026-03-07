'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useVendorStore } from '@/lib/stores/vendorStore';
import { getVendorProfile } from '@/lib/firebase/firestore';
import { getCurrentUserId } from '@/lib/firebase/auth';

interface HeaderProps {
  onNavigate: (page: string) => void;
}

export default function VendorHeader({ onNavigate }: HeaderProps) {
  const { vendor, isAuthenticated } = useVendorStore();
  const [vendorStatus, setVendorStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!hasChecked) {
      checkVendorStatus();
    }
  }, [hasChecked]);

  const checkVendorStatus = async () => {
    const userId = getCurrentUserId();
    if (userId) {
      const result = await getVendorProfile(userId);
      if (result.success && result.vendor) {
        setVendorStatus(result.vendor.status);
      }
    }
    setLoading(false);
    setHasChecked(true);
  };

  const getButtonText = () => {
    if (vendorStatus === 'pending') return 'Demande en cours...';
    if (vendorStatus === 'active') return 'Accéder au Dashboard';
    if (vendorStatus === 'rejected') return 'Demande rejetée';
    return 'DEVENIR PARTENAIRE';
  };

  const handleButtonClick = () => {
    if (vendorStatus === 'active') {
      onNavigate('dashboard');
    } else if (vendorStatus === 'pending') {
      alert('⏳ Votre demande est en cours de validation par l\'administrateur.\n\nVous recevrez un email dès que votre compte sera validé.');
    } else if (vendorStatus === 'rejected') {
      alert('❌ Votre demande a été rejetée.\n\nContactez le support à support@flashdeals.cm pour plus d\'informations.');
    } else {
      onNavigate('signup');
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-bg-dark px-6 py-4 flex justify-between items-center border-b border-[#333]"
    >
      <div>
        <div className="text-2xl font-bold text-orange flex items-center gap-2">
          🔥 Flash Deals <span className="text-xs text-gray-dark font-normal">Business</span>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        {!isAuthenticated ? (
          <>
            <Button variant="secondary" size="medium" onClick={() => onNavigate('login')}>
              Connexion Vendeur
            </Button>
            <Button 
              variant="primary" 
              size="medium" 
              onClick={handleButtonClick}
              disabled={loading || vendorStatus === 'pending' || vendorStatus === 'rejected'}
            >
              {loading ? 'Chargement...' : getButtonText()}
            </Button>
          </>
        ) : (
          <Button variant="secondary" size="medium" onClick={() => onNavigate('dashboard')}>
            Dashboard
          </Button>
        )}
      </div>
    </motion.header>
  );
}
