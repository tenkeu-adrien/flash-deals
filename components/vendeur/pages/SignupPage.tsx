'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useVendorStore } from '@/lib/stores/vendorStore';

interface SignupPageProps {
  onNavigate: (page: string) => void;
}

export default function SignupPage({ onNavigate }: SignupPageProps) {
  const { signupStep, nextSignupStep, prevSignupStep } = useVendorStore();

  const steps = ['Informations', 'Entreprise', 'Documents', 'Validation'];

  const renderStep = () => {
    switch (signupStep) {
      case 1:
        return (
          <div>
            <Input label="Nom complet" type="text" placeholder="Ex: Jean Kamga" required />
            <Input label="Email" type="email" placeholder="votre@email.com" required />
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Téléphone</label>
              <div className="flex gap-2">
                <select className="w-20 px-3.5 py-3.5 rounded-[12px] border-2 border-[#333] bg-bg-medium text-white">
                  <option>+237</option>
                </select>
                <input
                  type="tel"
                  placeholder="6 XX XX XX XX"
                  className="flex-1 px-3.5 py-3.5 rounded-[12px] border-2 border-[#333] bg-bg-medium text-white focus:outline-none focus:border-orange"
                  required
                />
              </div>
            </div>
            <Input label="Mot de passe" type="password" placeholder="Minimum 8 caractères" required />
          </div>
        );
      case 2:
        return (
          <div>
            <Input label="Nom de l'entreprise" type="text" placeholder="Ex: TechStore Douala" required />
            <Input label="Type d'entreprise" type="text" placeholder="Ex: Boutique, Grossiste" required />
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Ville</label>
              <select className="w-full px-3.5 py-3.5 rounded-[12px] border-2 border-[#333] bg-bg-medium text-white">
                <option>Douala</option>
                <option>Yaoundé</option>
              </select>
            </div>
            <Input label="Adresse physique" type="text" placeholder="Quartier, rue" required />
          </div>
        );
      case 3:
        return (
          <div>
            <div className="border-2 border-dashed border-[#333] rounded-[12px] p-8 text-center cursor-pointer hover:border-orange transition-colors mb-4">
              <div className="text-5xl mb-4">📄</div>
              <p className="text-sm text-gray-medium">Cliquez pour uploader votre CNI</p>
            </div>
            <div className="border-2 border-dashed border-[#333] rounded-[12px] p-8 text-center cursor-pointer hover:border-orange transition-colors">
              <div className="text-5xl mb-4">🏢</div>
              <p className="text-sm text-gray-medium">Registre de commerce (optionnel)</p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="text-center py-8">
            <div className="text-6xl mb-6">✅</div>
            <h3 className="text-2xl font-bold mb-4">Inscription réussie !</h3>
            <p className="text-gray-medium mb-6">
              Votre compte sera validé sous 24-48h. Vous recevrez un email de confirmation.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-[600px] mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Devenir Partenaire</h1>
        <p className="text-[15px] text-gray-medium mb-8">
          Complétez votre inscription en 4 étapes
        </p>

        {/* Progress */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#333] z-0" />
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${
                  index + 1 <= signupStep
                    ? 'bg-orange border-orange'
                    : index + 1 < signupStep
                    ? 'bg-green border-green'
                    : 'bg-bg-medium border-[#333]'
                }`}
              >
                {index + 1 < signupStep ? '✓' : index + 1}
              </div>
              <span className="text-xs text-gray-medium">{step}</span>
            </div>
          ))}
        </div>

        {renderStep()}

        <div className="flex gap-4 mt-8">
          {signupStep > 1 && signupStep < 4 && (
            <Button variant="secondary" onClick={prevSignupStep} className="flex-1">
              Retour
            </Button>
          )}
          {signupStep < 4 ? (
            <Button variant="primary" onClick={nextSignupStep} className="flex-1">
              Continuer →
            </Button>
          ) : (
            <Button variant="primary" onClick={() => onNavigate('login')} className="w-full">
              Se connecter
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
