'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface SignupPageProps {
  onNavigate: (page: string) => void;
}

export default function SignupPage({ onNavigate }: SignupPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    acceptTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('otp');
  };

  return (
    <div className="px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-2 text-center">Créer un compte</h1>
        <p className="text-sm text-gray-medium mb-6 text-center">
          Rejoignez des milliers de Camerounais qui économisent chaque jour
        </p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Nom complet"
            type="text"
            placeholder="Ex: Marie Ngo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Numéro de téléphone</label>
            <div className="flex gap-2">
              <select className="w-20 flex-shrink-0 px-3.5 py-3.5 rounded-[12px] border-2 border-[#333] bg-bg-medium text-white text-base">
                <option>+237</option>
              </select>
              <input
                type="tel"
                placeholder="6 XX XX XX XX"
                className="flex-1 px-3.5 py-3.5 rounded-[12px] border-2 border-[#333] bg-bg-medium text-white text-base focus:outline-none focus:border-orange focus:shadow-[0_0_0_3px_rgba(255,102,0,0.1)]"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <Input
            label="Email (optionnel)"
            type="email"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Input
            label="Mot de passe"
            type="password"
            placeholder="Minimum 6 caractères"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <div className="flex items-start gap-2 my-4">
            <input
              type="checkbox"
              className="mt-1 w-[18px] h-[18px] cursor-pointer"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              required
            />
            <label className="text-[13px] text-gray-medium leading-snug">
              J'accepte les <a href="#" className="text-orange">conditions d'utilisation</a> et la{' '}
              <a href="#" className="text-orange">politique de confidentialité</a>
            </label>
          </div>

          <Button type="submit" variant="primary" size="block">
            Continuer →
          </Button>
        </form>

        <div className="relative text-center my-6">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-[#333]" />
          <span className="relative bg-black px-4 text-sm text-gray-medium">OU</span>
        </div>

        <button className="w-full px-3.5 py-3.5 rounded-[12px] border-2 border-[#333] bg-bg-medium text-white text-[15px] font-semibold cursor-pointer transition-all duration-300 mb-3 flex items-center justify-center gap-3 hover:border-orange hover:bg-[#222]">
          📱 Continuer avec Mobile Money
        </button>

        <button className="w-full px-3.5 py-3.5 rounded-[12px] border-2 border-[#333] bg-bg-medium text-white text-[15px] font-semibold cursor-pointer transition-all duration-300 mb-3 flex items-center justify-center gap-3 hover:border-orange hover:bg-[#222]">
          🔵 Continuer avec Facebook
        </button>

        <p className="text-center text-sm text-gray-medium mt-6">
          Vous avez déjà un compte ?{' '}
          <button onClick={() => onNavigate('login')} className="text-orange font-semibold">
            Se connecter
          </button>
        </p>
      </motion.div>
    </div>
  );
}
