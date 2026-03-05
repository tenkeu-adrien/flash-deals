'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { loginWithEmail, loginWithGoogle, loginWithFacebook } from '@/lib/firebase/auth';
import { useClientStore } from '@/lib/stores/clientStore';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser, setCurrentPage } = useClientStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await loginWithEmail(email, password);

    if (result.success && result.user) {
      setUser(result.user);
      setCurrentPage('dashboard');
      onNavigate('dashboard');
    } else {
      setError(result.error || 'Erreur de connexion');
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    const result = await loginWithGoogle();

    if (result.success && result.user) {
      setUser(result.user);
      setCurrentPage('dashboard');
      onNavigate('dashboard');
    } else {
      setError(result.error || 'Erreur de connexion Google');
    }

    setLoading(false);
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    setError('');

    const result = await loginWithFacebook();

    if (result.success && result.user) {
      setUser(result.user);
      setCurrentPage('dashboard');
      onNavigate('dashboard');
    } else {
      setError(result.error || 'Erreur de connexion Facebook');
    }

    setLoading(false);
  };

  return (
    <div>
      <header className="header">
        <button 
          onClick={() => onNavigate('home')}
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
        <h1 className="form-title">👋 Bon retour!</h1>
        <p className="form-subtitle">Connectez-vous à votre compte</p>

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

        <form onSubmit={handleLogin}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
          />

          <Input
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="block"
            disabled={loading}
          >
            {loading ? '⏳ Connexion...' : 'Se connecter'}
          </Button>
        </form>

        <div style={{
          textAlign: 'center',
          margin: '24px 0',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '1px',
            backgroundColor: '#333'
          }}></div>
          <span style={{
            position: 'relative',
            backgroundColor: 'var(--color-black)',
            padding: '0 16px',
            color: 'var(--color-gray-medium)',
            fontSize: '14px'
          }}>
            OU
          </span>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 'var(--border-radius)',
            border: '2px solid #333',
            backgroundColor: '#1a1a1a',
            color: 'var(--color-white)',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'var(--transition)',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
        >
          <span style={{ color: '#DB4437' }}>🔴</span> Continuer avec Google
        </button>

        <button
          onClick={handleFacebookLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 'var(--border-radius)',
            border: '2px solid #333',
            backgroundColor: '#1a1a1a',
            color: 'var(--color-white)',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'var(--transition)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
        >
          <span style={{ color: '#1877F2' }}>📘</span> Continuer avec Facebook
        </button>

        <p style={{
          textAlign: 'center',
          color: 'var(--color-gray-medium)',
          marginTop: '24px',
          fontSize: '14px'
        }}>
          Pas encore membre?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('signup');
            }}
            style={{ color: 'var(--color-orange)', textDecoration: 'none' }}
          >
            S'inscrire gratuitement
          </a>
        </p>

        <p style={{
          textAlign: 'center',
          color: 'var(--color-gray-medium)',
          marginTop: '16px',
          fontSize: '14px'
        }}>
          Besoin d'aide?{' '}
          <a href="#" style={{ color: 'var(--color-orange)', textDecoration: 'none' }}>
            Contactez-nous
          </a>
        </p>
      </div>
    </div>
  );
}
