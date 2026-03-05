'use client';

import { useEffect } from 'react';
import { useClientStore } from '@/lib/stores/clientStore';
import { onAuthStateChange, getCurrentUser } from '@/lib/firebase/auth';
import { onCartChange } from '@/lib/firebase/firestore';

/**
 * Hook pour gérer l'authentification Firebase
 */
export function useFirebaseAuth() {
  const { setUser, setAuthenticated, setCart } = useClientStore();

  useEffect(() => {
    // Vérifier que nous sommes côté client
    if (typeof window === 'undefined') return;

    // Écouter les changements d'authentification
    const unsubscribeAuth = onAuthStateChange((user) => {
      setUser(user);
      setAuthenticated(!!user);

      if (user) {
        console.log('✅ Utilisateur connecté:', user.uid);

        // Écouter les changements du panier
        const unsubscribeCart = onCartChange((cart) => {
          setCart(cart);
        });

        return () => {
          unsubscribeCart();
        };
      } else {
        console.log('❌ Utilisateur déconnecté');
        setCart([]);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, [setUser, setAuthenticated, setCart]);

  return {
    user: typeof window !== 'undefined' ? getCurrentUser() : null
  };
}
