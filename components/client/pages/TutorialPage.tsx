'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { useClientStore } from '@/lib/stores/clientStore';

interface TutorialPageProps {
  onNavigate: (page: string) => void;
}

export default function TutorialPage({ onNavigate }: TutorialPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setCurrentPage, setPreferences } = useClientStore();

  const slides = [
    {
      icon: '🔥',
      title: 'Bienvenue sur Flash Deals!',
      description: 'Découvrez des offres flash exclusives avec des réductions jusqu\'à -70% sur vos produits préférés'
    },
    {
      icon: '⏰',
      title: 'Deals limités dans le temps',
      description: 'Chaque deal est disponible pendant 24-48h seulement. Soyez rapide pour ne rien manquer!'
    },
    {
      icon: '🛒',
      title: 'Commandez en toute sécurité',
      description: 'Ajoutez au panier, payez en ligne ou à la livraison. Livraison rapide à Douala et Yaoundé'
    },
    {
      icon: '🎯',
      title: 'Choisissez vos préférences',
      description: 'Sélectionnez les catégories qui vous intéressent pour recevoir des notifications personnalisées'
    }
  ];

  const preferences = [
    { id: 'electronics', icon: '📱', label: 'Électronique' },
    { id: 'fashion', icon: '👕', label: 'Mode' },
    { id: 'home', icon: '🏠', label: 'Maison' },
    { id: 'beauty', icon: '💄', label: 'Beauté' },
    { id: 'sports', icon: '⚽', label: 'Sport' },
    { id: 'food', icon: '🍔', label: 'Alimentation' }
  ];

  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    setPreferences(selectedPreferences);
    setCurrentPage('dashboard');
    onNavigate('dashboard');
  };

  const togglePreference = (id: string) => {
    setSelectedPreferences(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '100vh',
      padding: 'var(--spacing-xl) var(--spacing-lg)',
      textAlign: 'center'
    }}>
      <div>
        <div style={{
          width: '200px',
          height: '200px',
          margin: 'var(--spacing-xl) auto',
          background: 'linear-gradient(135deg, var(--color-orange), var(--color-red))',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '80px'
        }}>
          {slides[currentSlide].icon}
        </div>

        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: 'var(--spacing-md)'
        }}>
          {slides[currentSlide].title}
        </h1>

        <p style={{
          fontSize: '16px',
          color: 'var(--color-gray-medium)',
          lineHeight: '1.6',
          marginBottom: 'var(--spacing-xl)'
        }}>
          {slides[currentSlide].description}
        </p>

        {currentSlide === slides.length - 1 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'var(--spacing-md)',
            margin: 'var(--spacing-lg) 0'
          }}>
            {preferences.map((pref) => (
              <div
                key={pref.id}
                onClick={() => togglePreference(pref.id)}
                style={{
                  backgroundColor: selectedPreferences.includes(pref.id)
                    ? 'rgba(255, 102, 0, 0.1)'
                    : '#1a1a1a',
                  border: `2px solid ${
                    selectedPreferences.includes(pref.id) ? 'var(--color-orange)' : '#333'
                  }`,
                  borderRadius: 'var(--border-radius)',
                  padding: 'var(--spacing-md)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: 'var(--spacing-xs)' }}>
                  {pref.icon}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>
                  {pref.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          margin: 'var(--spacing-lg) 0'
        }}>
          {slides.map((_, index) => (
            <div
              key={index}
              style={{
                width: index === currentSlide ? '24px' : '8px',
                height: '8px',
                borderRadius: index === currentSlide ? '4px' : '50%',
                backgroundColor: index === currentSlide ? 'var(--color-orange)' : '#333',
                transition: 'var(--transition)'
              }}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          variant="primary"
          size="block"
        >
          {currentSlide === slides.length - 1 ? 'Commencer' : 'Suivant'}
        </Button>

        {currentSlide < slides.length - 1 && (
          <button
            onClick={handleSkip}
            style={{
              width: '100%',
              padding: '16px',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-gray-medium)',
              fontSize: '14px',
              cursor: 'pointer',
              marginTop: 'var(--spacing-sm)'
            }}
          >
            Passer
          </button>
        )}
      </div>
    </div>
  );
}
