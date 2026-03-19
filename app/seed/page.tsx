'use client';

import { useState } from 'react';
import { seedAllTestData, seedTestCampaigns, seedTestVendors, seedTestUsers, seedFreshDeals } from '@/lib/firebase/seedTestData';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSeedAll = async () => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const res = await seedAllTestData();
      setResults(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedCampaigns = async () => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const res = await seedTestCampaigns();
      setResults({ campaigns: res });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedVendors = async () => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const res = await seedTestVendors();
      setResults({ vendors: res });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedUsers = async () => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const res = await seedTestUsers();
      setResults({ users: res });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedFreshDeals = async () => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const res = await seedFreshDeals();
      setResults({ freshDeals: res });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: 'white',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
          🌱 Seeding Firebase
        </h1>
        <p style={{ color: '#999', marginBottom: '32px' }}>
          Créer des données de test dans Firebase pour tester l'application
        </p>

        {error && (
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgb(239, 68, 68)',
            borderRadius: '8px',
            marginBottom: '24px',
            color: 'rgb(239, 68, 68)'
          }}>
            ❌ {error}
          </div>
        )}

        {results && (
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgb(34, 197, 94)',
            borderRadius: '8px',
            marginBottom: '24px',
            color: 'rgb(34, 197, 94)'
          }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>✅ Succès!</h3>
            <pre style={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}

        <div style={{
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'repeat(2, 1fr)',
          marginBottom: '32px'
        }}>
          <button
            onClick={handleSeedAll}
            disabled={loading}
            style={{
              padding: '16px',
              backgroundColor: '#FF3D00',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            {loading ? '⏳ Chargement...' : '🌱 Tout créer'}
          </button>

          <button
            onClick={handleSeedCampaigns}
            disabled={loading}
            style={{
              padding: '16px',
              backgroundColor: '#1a1a1a',
              color: 'white',
              border: '1px solid #333',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            📦 Campagnes
          </button>

          <button
            onClick={handleSeedVendors}
            disabled={loading}
            style={{
              padding: '16px',
              backgroundColor: '#1a1a1a',
              color: 'white',
              border: '1px solid #333',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            🏪 Vendeurs
          </button>

          <button
            onClick={handleSeedUsers}
            disabled={loading}
            style={{
              padding: '16px',
              backgroundColor: '#1a1a1a',
              color: 'white',
              border: '1px solid #333',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            👥 Utilisateurs
          </button>

          <button
            onClick={handleSeedFreshDeals}
            disabled={loading}
            style={{
              padding: '16px',
              backgroundColor: '#1a1a1a',
              color: 'white',
              border: '1px solid #FF3D00',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              gridColumn: 'span 2'
            }}
          >
            🔥 Fresh Deals (20) — 5 jours
          </button>
        </div>

        <div style={{
          padding: '24px',
          backgroundColor: '#1a1a1a',
          borderRadius: '12px',
          border: '1px solid #333'
        }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>ℹ️ Informations</h3>
          <ul style={{ listStyle: 'disc', paddingLeft: '24px', color: '#999', lineHeight: '1.8' }}>
            <li>
              <strong style={{ color: 'white' }}>Tout créer:</strong> Crée 6 campagnes, 4 vendeurs et 2 utilisateurs
            </li>
            <li>
              <strong style={{ color: 'white' }}>Campagnes:</strong> 6 campagnes actives avec images et détails
            </li>
            <li>
              <strong style={{ color: 'white' }}>Vendeurs:</strong> 3 vendeurs actifs + 1 en attente de validation
            </li>
            <li>
              <strong style={{ color: 'white' }}>Utilisateurs:</strong> 2 utilisateurs clients de test
            </li>
          </ul>
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <a
            href="/"
            style={{
              color: '#FF3D00',
              textDecoration: 'underline',
              fontSize: '14px'
            }}
          >
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}
