'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

interface HeaderProps {
  onNavigate: (page: string) => void;
}

export default function VendorHeader({ onNavigate }: HeaderProps) {
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
        <Button variant="secondary" size="medium" onClick={() => onNavigate('login')}>
          Connexion Vendeur
        </Button>
        <Button variant="primary" size="medium" onClick={() => onNavigate('signup')}>
          DEVENIR PARTENAIRE
        </Button>
      </div>
    </motion.header>
  );
}
