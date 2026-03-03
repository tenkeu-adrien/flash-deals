'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface ProfileSetupPageProps {
  onNavigate: (page: string) => void;
}

export default function ProfileSetupPage({ onNavigate }: ProfileSetupPageProps) {
  const [preferences, setPreferences] = useState<string[]>([]);

  const categories = [
    { id: 'tech', icon: '📱', label: 'High-Tech' },
    { id: 'fashion', icon: '👗', label: 'Mode' },
    { id: 'home', icon: '🏠', label: 'Maison' },
    { id: 'beauty', icon: '💄', label: 'Beauté' },
    { id: 'sports', icon: '⚽', label: 'Sports' },
    { id: 'food', icon: '🍔', label: 'Alimentation' },
  ];

  const togglePreference = (id: string) => {
    setPreferences(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="px-6 py-6 min-h-screen flex flex-col justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-6xl text-center mb-6">⚙️</div>
        <h1 className="text-2xl font-bold mb-2 text-center">Configurez votre profil</h1>
        <p className="text-sm text-gray-medium mb-8 text-center">
          Personnalisez votre expérience
        </p>

        <Input label="Ville" type="text" placeholder="Ex: Douala" />

        <div className="mb-6">
          <label className="block mb-3 text-sm font-semibold">
            Catégories préférées (optionnel)
          </label>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => togglePreference(cat.id)}
                className={`bg-bg-medium border-2 rounded-[12px] p-4 text-center cursor-pointer transition-all ${
                  preferences.includes(cat.id)
                    ? 'border-orange bg-orange/10'
                    : 'border-[#333] hover:border-orange hover:bg-[#222]'
                }`}
              >
                <div className="text-[40px] mb-2">{cat.icon}</div>
                <div className="text-sm font-semibold">{cat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <Button variant="primary" size="block" onClick={() => onNavigate('tutorial')}>
          Continuer →
        </Button>

        <button
          onClick={() => onNavigate('tutorial')}
          className="w-full text-center text-sm text-gray-medium mt-4"
        >
          Passer cette étape
        </button>
      </motion.div>
    </div>
  );
}
