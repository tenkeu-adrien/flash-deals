'use client';

import { motion } from 'framer-motion';
import { Home, Search, ShoppingCart, User } from 'lucide-react';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Accueil' },
    { id: 'search', icon: Search, label: 'Recherche' },
    { id: 'cart', icon: ShoppingCart, label: 'Panier' },
    { id: 'profile', icon: User, label: 'Profil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-dark border-t border-[#333] flex justify-around py-3 z-[1000] max-w-[480px] mx-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        
        return (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 flex-1 transition-colors duration-300 ${
              isActive ? 'text-orange' : 'text-gray-medium'
            }`}
          >
            <Icon size={24} />
            <span className="text-xs">{item.label}</span>
          </motion.button>
        );
      })}
    </nav>
  );
}
