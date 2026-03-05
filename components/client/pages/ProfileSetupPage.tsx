'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { updateUserProfile } from '@/lib/firebase/auth';
import { useClientStore } from '@/lib/stores/clientStore';

interface ProfileSetupPageProps {
  onNavigate: (page: string) => void;
}

export default function ProfileSetupPage({ onNavigate }: ProfileSetupPageProps) {
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setCurrentPage } = useClientStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await updateUserProfile({
      displayName,
      phoneNumber: phone,
      address: {
        city,
        region
      }
    });

    if (result.success) {
      setCurrentPage('tutorial');
      onNavigate('tutorial');
    } else {
      setError(result.error || 'Erreur lors de la mise à jour du profil');
    }

    setLoading(false);
  };

  const handleSkip = () => {
    setCurrentPage('tutorial');
    onNavigate('tutorial');
  };

  return (
    <div>
      <header className="header">
        <div></div>
        <div className="header-logo">🔥 Flash Deals</div>
        <button 
          onClick={handleSkip}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-orange)',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Passer
        </button>
      </header>

      <div className="form-section">
        <h1 className="form-title">👤 Complétez votre profil</h1>
        <p className="form-subtitle">Aidez-nous à personnaliser votre expérience</p>

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(255, 61, 0, 0.1)',
            border: '1px solid var(--color-red)',
            borderRadius: '8px',
            color: 'var(--color-red)',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Nom complet"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Jean Dupont"
            required
          />

          <Input
            label="Numéro de téléphone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+237 6XX XXX XXX"
            required
          />

          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: '14px',
              fontWeight: 600
            }}>
              Ville
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 'var(--border-radius)',
                border: '2px solid #333',
                backgroundColor: '#1a1a1a',
                color: 'var(--color-white)',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              <option value="">Sélectionnez votre ville</option>
              <option value="Douala">Douala</option>
              <option value="Yaoundé">Yaoundé</option>
              <option value="Bafoussam">Bafoussam</option>
              <option value="Garoua">Garoua</option>
              <option value="Bamenda">Bamenda</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: '14px',
              fontWeight: 600
            }}>
              Région
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 'var(--border-radius)',
                border: '2px solid #333',
                backgroundColor: '#1a1a1a',
                color: 'var(--color-white)',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              <option value="">Sélectionnez votre région</option>
              <option value="Littoral">Littoral</option>
              <option value="Centre">Centre</option>
              <option value="Ouest">Ouest</option>
              <option value="Nord">Nord</option>
              <option value="Nord-Ouest">Nord-Ouest</option>
              <option value="Sud">Sud</option>
              <option value="Est">Est</option>
              <option value="Adamaoua">Adamaoua</option>
              <option value="Sud-Ouest">Sud-Ouest</option>
              <option value="Extrême-Nord">Extrême-Nord</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="block"
            disabled={loading}
          >
            {loading ? '⏳ Enregistrement...' : 'Continuer'}
          </Button>
        </form>

        <p style={{
          textAlign: 'center',
          color: 'var(--color-gray-medium)',
          marginTop: '16px',
          fontSize: '13px'
        }}>
          Vous pourrez modifier ces informations plus tard dans votre profil
        </p>
      </div>
    </div>
  );
}
