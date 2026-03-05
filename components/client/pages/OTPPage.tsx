'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { useClientStore } from '@/lib/stores/clientStore';

interface OTPPageProps {
  onNavigate: (page: string) => void;
}

export default function OTPPage({ onNavigate }: OTPPageProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const { setCurrentPage } = useClientStore();

  // NOTE: La vérification par téléphone est désactivée selon les instructions
  // Cette page est un placeholder pour la cohérence de l'interface

  const handleSkip = () => {
    setCurrentPage('profile-setup');
    onNavigate('profile-setup');
  };

  return (
    <div>
      <header className="header">
        <button 
          onClick={() => onNavigate('signup')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          ← Retour
        </button>
        <div className="header-logo">🔥 Flash Deals</div>
        <div></div>
      </header>

      <div className="form-section">
        <h1 className="form-title">📱 Vérification désactivée</h1>
        <p className="form-subtitle">
          La vérification par SMS est temporairement désactivée
        </p>

        <div style={{
          backgroundColor: '#1a1a1a',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--border-radius)',
          border: '1px solid #333',
          textAlign: 'center',
          margin: 'var(--spacing-xl) 0'
        }}>
          <div style={{ fontSize: '64px', marginBottom: 'var(--spacing-md)' }}>
            ℹ️
          </div>
          <p style={{
            fontSize: '15px',
            color: 'var(--color-gray-medium)',
            lineHeight: '1.6'
          }}>
            La vérification par numéro de téléphone sera disponible prochainement.
            Vous pouvez continuer sans vérification.
          </p>
        </div>

        <Button
          onClick={handleSkip}
          variant="primary"
          size="block"
        >
          Continuer sans vérification
        </Button>

        <p style={{
          textAlign: 'center',
          color: 'var(--color-gray-medium)',
          marginTop: '16px',
          fontSize: '13px'
        }}>
          Vous pourrez ajouter votre numéro de téléphone plus tard dans votre profil
        </p>
      </div>
    </div>
  );
}
