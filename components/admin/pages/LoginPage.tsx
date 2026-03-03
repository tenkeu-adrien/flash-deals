'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAdminStore } from '@/lib/stores/adminStore';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const { setAuthenticated } = useAdminStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticated(true);
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-dark to-[#1a0a00] px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-bg-medium p-8 rounded-lg border border-[#333] w-full max-w-[400px] shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <div className="text-xl font-bold text-orange mb-1">Flash Deals</div>
          <div className="text-[11px] text-gray-dark mb-4">Administration</div>
          <h1 className="text-2xl font-bold mb-2">ESPACE ADMINISTRATION</h1>
          <p className="text-sm text-gray-medium">Connexion sécurisée</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input label="Email administrateur" type="email" placeholder="admin@flashdeals.cm" required />
          <Input label="Mot de passe" type="password" placeholder="••••••••" required />
          <Input label="Code 2FA (si activé)" type="text" placeholder="000000" maxLength={6} />

          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-[18px] h-[18px]" />
              <span className="text-[13px]">Rester connecté (7 jours)</span>
            </label>
          </div>

          <Button type="submit" variant="primary" size="block">
            SE CONNECTER
          </Button>
        </form>

        <div className="text-center mt-6">
          <a href="#" className="text-orange text-[13px]">Mot de passe oublié?</a>
        </div>

        <div className="mt-6 text-center text-xs text-gray-medium space-y-1">
          <p>🔒 Connexion sécurisée SSL</p>
          <p>📱 Authentification 2FA requise</p>
        </div>
      </motion.div>
    </div>
  );
}
