'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { signupWithEmail, signupWithGoogle, signupWithFacebook } from '@/lib/firebase/auth';
import { useClientStore } from '@/lib/stores/clientStore';

interface SignupPageProps {
  onNavigate: (page: string) => void;
}

export default function SignupPage({ onNavigate }: SignupPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser, setCurrentPage } = useClientStore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!acceptTerms) {
      setError('Vous devez accepter les conditions d\'utilisation');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    const result = await signupWithEmail(email, password, {
      displayName: name
    });

    if (result.success && result.user) {
      setUser(result.user);
      setCurrentPage('profile-setup');
      onNavigate('profile-setup');
    } else {
      setError(result.error || 'Erreur lors de l\'inscription');
    }

    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');

    const result = await signupWithGoogle();

    if (result.success && result.user) {
      setUser(result.user);
      setCurrentPage('profile-setup');
      onNavigate('profile-setup');
    } else {
      setError(result.error || 'Erreur de connexion Google');
    }

    setLoading(false);
  };

  const handleFacebookSignup = async () => {
    setLoading(true);
    setError('');

    const result = await signupWithFacebook();

    if (result.success && result.user) {
      setUser(result.user);
      setCurrentPage('profile-setup');
      onNavigate('profile-setup');
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
        <h1 className="form-title">🎉 Créer un compte</h1>
        <p className="form-subtitle">Rejoignez Flash Deals et économisez jusqu'à 70%</p>

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

        <form onSubmit={handleSignup}>
          <Input
            label="Nom complet"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jean Dupont"
            required
          />

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

          <Input
            label="Confirmer le mot de passe"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            margin: '16px 0'
          }}>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              style={{
                marginTop: '4px',
                width: '18px',
                height: '18px',
                cursor: 'pointer'
              }}
            />
            <label style={{
              fontSize: '13px',
              color: 'var(--color-gray-medium)',
              lineHeight: '1.4'
            }}>
              J'accepte les{' '}
              <a href="#" style={{ color: 'var(--color-orange)', textDecoration: 'none' }}>
                conditions d'utilisation
              </a>
              {' '}et la{' '}
              <a href="#" style={{ color: 'var(--color-orange)', textDecoration: 'none' }}>
                politique de confidentialité
              </a>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="block"
            disabled={loading}
          >
            {loading ? '⏳ Inscription...' : 'Créer mon compte'}
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
          onClick={handleGoogleSignup}
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
          onClick={handleFacebookSignup}
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
          Déjà membre?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('login');
            }}
            style={{ color: 'var(--color-orange)', textDecoration: 'none' }}
          >
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}
