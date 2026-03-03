'use client';

import { motion } from 'framer-motion';
import { useClientStore } from '@/lib/stores/clientStore';
import { User, MapPin, Bell, CreditCard, Package, Heart, Settings, LogOut } from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { setAuthenticated, setCurrentPage } = useClientStore();

  const handleLogout = () => {
    setAuthenticated(false);
    setCurrentPage('home');
    onNavigate('home');
  };

  const menuItems = [
    { icon: Package, label: 'Mes commandes', badge: '3' },
    { icon: Heart, label: 'Mes favoris', badge: '12' },
    { icon: MapPin, label: 'Adresses de livraison' },
    { icon: CreditCard, label: 'Moyens de paiement' },
    { icon: Bell, label: 'Notifications' },
    { icon: Settings, label: 'Paramètres' },
  ];

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-orange to-red p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mx-auto mb-4 flex items-center justify-center text-4xl"
        >
          <User size={48} />
        </motion.div>
        <h1 className="text-2xl font-bold mb-1">Marie Ngo</h1>
        <p className="text-sm opacity-90">+237 6 XX XX XX XX</p>
      </div>

      <div className="px-4 py-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-bg-medium border border-[#333] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange mb-1">12</div>
            <div className="text-xs text-gray-medium">Commandes</div>
          </div>
          <div className="bg-bg-medium border border-[#333] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange mb-1">450K</div>
            <div className="text-xs text-gray-medium">Économisé</div>
          </div>
          <div className="bg-bg-medium border border-[#333] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange mb-1">⭐ 4.9</div>
            <div className="text-xs text-gray-medium">Note</div>
          </div>
        </div>

        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-bg-medium border border-[#333] rounded-lg p-4 flex items-center gap-4 hover:border-orange transition-colors"
              >
                <Icon size={20} className="text-orange" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="bg-orange text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
                <span className="text-gray-medium">→</span>
              </motion.button>
            );
          })}

          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: menuItems.length * 0.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full bg-bg-medium border border-red rounded-lg p-4 flex items-center gap-4 text-red hover:bg-red/10 transition-colors mt-6"
          >
            <LogOut size={20} />
            <span className="flex-1 text-left">Déconnexion</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
