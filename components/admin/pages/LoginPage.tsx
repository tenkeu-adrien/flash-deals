'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAdminStore } from '@/lib/stores/adminStore';
import { loginWithEmail } from '@/lib/firebase/auth';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const { setAuthenticated, setAdmin } = useAdminStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Connexion Firebase
      const result = await loginWithEmail(email, password);
      
      if (!result.success || !result.user) {
        throw new Error(result.error || 'Erreur de connexion');
      }

      // Vérifier si l'utilisateur est admin dans Firestore
      const { doc, getDoc } = await import('firebase/firestore');
      const { getFirebaseDb, Collections } = await import('@/lib/firebase/config');
      const db = getFirebaseDb();
      
      // Vérifier d'abord dans la collection admins
      let adminDoc = await getDoc(doc(db, Collections.ADMINS, result.user.uid));
      
      // Si pas dans admins, vérifier dans users avec role='admin'
      if (!adminDoc.exists()) {
        const userDoc = await getDoc(doc(db, Collections.USERS, result.user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          adminDoc = userDoc;
        }
      }
      
      if (!adminDoc.exists()) {
        // Pas un admin
        setError('❌ Accès refusé: Vous n\'êtes pas administrateur.\n\nCette interface est réservée aux administrateurs Flash Deals.');
        
        // Déconnecter l'utilisateur
        const { logout } = await import('@/lib/firebase/auth');
        await logout();
        
        setLoading(false);
        return;
      }

      // C'est un admin, on peut continuer
      const adminData = adminDoc.data();
      
      setAdmin({
        uid: result.user.uid,
        name: adminData.name || result.user.displayName || 'Admin',
        email: result.user.email || '',
        role: adminData.role || 'admin'
      });
      
      setAuthenticated(true);
      onNavigate('dashboard');
      
    } catch (err: any) {
      console.error('Erreur connexion admin:', err);
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-dark to-[#1a0a00] px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-bg-medium p-8 rounded-lg border border-[#333] w-full max-w-[400px] shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <div className="text-xl font-bold text-orange mb-1">Flash Deals</div>
          <div className="text-[11px] text-gray-dark mb-4">Administration</div>
          <h1 className="text-2xl font-bold mb-2">ESPACE ADMINISTRATION</h1>
          <p className="text-sm text-gray-medium">Connexion sécurisée</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm whitespace-pre-line">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input 
            label="Email administrateur" 
            type="email" 
            placeholder="admin@flashdeals.cm" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <Input 
            label="Mot de passe" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />

          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-[18px] h-[18px]" />
              <span className="text-[13px]">Rester connecté (7 jours)</span>
            </label>
          </div>

          <Button type="submit" variant="primary" size="block" disabled={loading}>
            {loading ? 'Connexion...' : 'SE CONNECTER'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <a href="#" className="text-orange text-[13px]">Mot de passe oublié?</a>
        </div>

        <div className="mt-6 text-center text-xs text-gray-medium space-y-1">
          <p>🔒 Connexion sécurisée SSL</p>
          <p>⚠️ Accès réservé aux administrateurs</p>
        </div>
      </motion.div>
    </div>
  );
}
