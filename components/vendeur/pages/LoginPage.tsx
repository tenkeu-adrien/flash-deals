'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useVendorStore } from '@/lib/stores/vendorStore';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const { setAuthenticated } = useVendorStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticated(true);
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-[400px] w-full"
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🏪</div>
          <h1 className="text-2xl font-bold mb-2">Espace Vendeur</h1>
          <p className="text-sm text-gray-medium">Connectez-vous à votre compte</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input label="Email" type="email" placeholder="votre@email.com" required />
          <Input label="Mot de passe" type="password" placeholder="••••••••" required />
          
          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-[18px] h-[18px]" />
              <span className="text-[13px]">Se souvenir</span>
            </label>
            <a href="#" className="text-orange text-[13px]">Mot de passe oublié?</a>
          </div>

          <Button type="submit" variant="primary" size="block">
            Se connecter
          </Button>
        </form>

        <p className="text-center text-sm text-gray-medium mt-6">
          Pas encore partenaire ?{' '}
          <button onClick={() => onNavigate('signup')} className="text-orange font-semibold">
            S'inscrire
          </button>
        </p>
      </motion.div>
    </div>
  );
}
