'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useClientStore } from '@/lib/stores/clientStore';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthenticated } = useClientStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticated(true);
    onNavigate('dashboard');
  };

  return (
    <div className="px-6 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-[24px] font-bold mb-2 text-center">👋 Bon retour!</h1>
        <p className="text-[14px] text-[#CCCCCC] mb-6 text-center">
          Connectez-vous à votre compte
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-[14px] font-semibold">Numéro de téléphone</label>
            <div className="flex gap-2">
              <input
                type="text"
                value="+237"
                readOnly
                className="w-20 flex-shrink-0 px-3.5 py-3.5 rounded-[12px] border-2 border-[#333] bg-[#1a1a1a] text-white text-[16px]"
              />
              <input
                type="tel"
                placeholder="6 XX XX XX XX"
                pattern="[0-9]{9}"
                className="flex-1 px-3.5 py-3.5 rounded-[12px] border-2 border-[#333] bg-[#1a1a1a] text-white text-[16px] focus:outline-none focus:border-[#FF6600] focus:shadow-[0_0_0_3px_rgba(255,102,0,0.1)]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="block">
            Recevoir le code
          </Button>
        </form>

        <div className="text-center my-6 relative">
          <span className="relative z-10 bg-[#000000] px-4 text-[#CCCCCC]">OU</span>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-[#333]" style={{ zIndex: 0 }}></div>
        </div>

        <button className="w-full px-3.5 py-3.5 rounded-[12px] border-2 border-[#333] bg-[#1a1a1a] text-white text-[15px] font-semibold cursor-pointer transition-all duration-300 mb-3 flex items-center justify-center gap-3 hover:border-[#FF6600] hover:bg-[#222]">
          <span style={{ color: '#1877F2' }}>📘</span> Continuer avec Facebook
        </button>
        <button className="w-full px-3.5 py-3.5 rounded-[12px] border-2 border-[#333] bg-[#1a1a1a] text-white text-[15px] font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-3 hover:border-[#FF6600] hover:bg-[#222]">
          <span style={{ color: '#DB4437' }}>🔴</span> Continuer avec Google
        </button>

        <p className="text-center text-[#CCCCCC] mt-6">
          Pas encore membre?{' '}
          <button onClick={() => onNavigate('signup')} className="text-[#FF6600] font-normal">
            S'inscrire gratuitement
          </button>
        </p>

        <p className="text-center text-[#CCCCCC] mt-4">
          Besoin d'aide?{' '}
          <a href="#" className="text-[#FF6600]">
            Contactez-nous
          </a>
        </p>
      </motion.div>
    </div>
  );
}
