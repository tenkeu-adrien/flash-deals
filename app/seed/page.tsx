'use client';

import { useState } from 'react';
import { seedDatabase } from '@/lib/firebase/seedData';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    setLoading(true);
    setMessage('Peuplement en cours...');
    
    try {
      await seedDatabase();
      setMessage('✅ Base de données peuplée avec succès!');
    } catch (error: any) {
      setMessage('❌ Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '50px auto', 
      padding: '40px',
      backgroundColor: '#1a1a1a',
      borderRadius: '12px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
        🌱 Peupler la Base de Données
      </h1>
      
      <p style={{ 
        color: '#CCCCCC', 
        marginBottom: '30px',
        lineHeight: '1.6'
      }}>
        Cliquez sur le bouton ci-dessous pour ajouter des données de test dans Firebase:
      </p>

      <ul style={{ 
        textAlign: 'left', 
        color: '#CCCCCC',
        marginBottom: '30px',
        lineHeight: '2'
      }}>
        <li>✅ 6 campagnes de produits</li>
        <li>✅ 3 utilisateurs de test</li>
        <li>✅ Images depuis Unsplash</li>
        <li>✅ Données réalistes</li>
      </ul>

      <button
        onClick={handleSeed}
        disabled={loading}
        className="btn btn-primary btn-block"
        style={{ 
          fontSize: '18px',
          padding: '16px',
          marginBottom: '20px'
        }}
      >
        {loading ? '⏳ Peuplement en cours...' : '🚀 Peupler la Base de Données'}
      </button>

      {message && (
        <div style={{
          padding: '16px',
          backgroundColor: message.includes('✅') ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 61, 0, 0.1)',
          borderRadius: '8px',
          marginTop: '20px',
          color: message.includes('✅') ? '#00C853' : '#FF3D00'
        }}>
          {message}
        </div>
      )}

      <div style={{ 
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#0a0a0a',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666'
      }}>
        <p>⚠️ Note: Cette opération ajoute des données de test.</p>
        <p>Vous pouvez les supprimer depuis la console Firebase.</p>
      </div>
    </div>
  );
}
