'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useClientStore } from '@/lib/stores/clientStore';

interface TutorialPageProps {
  onNavigate: (page: string) => void;
}

export default function TutorialPage({ onNavigate }: TutorialPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setAuthenticated } = useClientStore();

  const slides = [
    {
      icon: '🔥',
      title: 'Bienvenue sur Flash Deals',
      text: 'Découvrez des deals exceptionnels avec des réductions jusqu\'à -70% pendant 24-48h seulement.',
    },
    {
      icon: '⏰',
      title: 'Soyez rapide !',
      text: 'Les stocks sont limités et les deals disparaissent vite. Activez les notifications pour ne rien manquer.',
    },
    {
      icon: '🚚',
      title: 'Livraison rapide',
      text: 'Recevez vos commandes sous 24-48h à Douala et Yaoundé. Paiement sécurisé par Mobile Money.',
    },
  ];

  const handleFinish = () => {
    setAuthenticated(true);
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between px-6 py-8 text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="flex-1 flex flex-col justify-center"
        >
          <div className="w-[200px] h-[200px] mx-auto my-8 bg-gradient-to-br from-orange to-red rounded-full flex items-center justify-center text-[80px]">
            {slides[currentSlide].icon}
          </div>
          <h1 className="text-2xl font-bold mb-4">{slides[currentSlide].title}</h1>
          <p className="text-base text-gray-medium leading-relaxed mb-8">
            {slides[currentSlide].text}
          </p>
        </motion.div>
      </AnimatePresence>

      <div>
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded transition-all ${
                index === currentSlide
                  ? 'w-6 bg-orange'
                  : 'w-2 bg-[#333]'
              }`}
            />
          ))}
        </div>

        {currentSlide < slides.length - 1 ? (
          <>
            <Button
              variant="primary"
              size="block"
              onClick={() => setCurrentSlide(currentSlide + 1)}
            >
              Suivant
            </Button>
            <button
              onClick={handleFinish}
              className="w-full text-center text-sm text-gray-medium mt-4"
            >
              Passer
            </button>
          </>
        ) : (
          <Button variant="primary" size="block" onClick={handleFinish}>
            Commencer 🚀
          </Button>
        )}
      </div>
    </div>
  );
}
