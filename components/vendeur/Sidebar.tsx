'use client';

import { useEffect, useState } from 'react';
import { LayoutDashboard, Megaphone, Package, Settings } from 'lucide-react';
import { getVendorProfile } from '@/lib/firebase/firestore';
import { getCurrentUserId } from '@/lib/firebase/auth';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [vendorStatus, setVendorStatus] = useState<string>('pending');

  useEffect(() => {
    checkVendorStatus();
  }, []);

  const checkVendorStatus = async () => {
    const userId = getCurrentUserId();
    if (userId) {
      const result = await getVendorProfile(userId);
      if (result.success && result.vendor) {
        setVendorStatus(result.vendor.status);
      }
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', requiresActive: false },
    { id: 'campaigns', icon: Megaphone, label: 'Mes Campagnes', requiresActive: true },
    { id: 'orders', icon: Package, label: 'Commandes', requiresActive: true },
    { id: 'settings', icon: Settings, label: 'Paramètres', requiresActive: false },
  ];

  const handleNavigation = (item: typeof menuItems[0]) => {
    if (item.requiresActive && vendorStatus !== 'active') {
      alert('Votre compte doit être validé par un administrateur avant d\'accéder à cette fonctionnalité.');
      return;
    }
    onNavigate(item.id);
  };

  return (
    <aside className="w-[260px] bg-[#151515] border-r border-[#333] p-6 fixed h-screen overflow-y-auto">
      <div className="text-xl font-bold text-orange mb-2">🔥 Flash Deals</div>
      <div className="text-[11px] text-gray-dark mb-8">Business</div>

      {vendorStatus === 'pending' && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500 rounded-lg">
          <div className="text-xs text-yellow-500 font-semibold mb-1">⏳ En attente</div>
          <div className="text-xs text-gray-medium">
            Votre compte est en cours de validation
          </div>
        </div>
      )}

      {vendorStatus === 'rejected' && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg">
          <div className="text-xs text-red-500 font-semibold mb-1">❌ Rejeté</div>
          <div className="text-xs text-gray-medium">
            Contactez le support
          </div>
        </div>
      )}

      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isDisabled = item.requiresActive && vendorStatus !== 'active';
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              disabled={isDisabled}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                currentPage === item.id
                  ? 'bg-orange text-white'
                  : isDisabled
                  ? 'text-gray-dark cursor-not-allowed opacity-50'
                  : 'text-gray-medium hover:bg-bg-medium hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm">{item.label}</span>
              {isDisabled && <span className="ml-auto text-xs">🔒</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
