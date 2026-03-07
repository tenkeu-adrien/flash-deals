'use client';

import { useEffect, useRef } from 'react';
import { useClientStore } from '@/lib/stores/clientStore';
import { onAuthStateChange, getCurrentUser } from '@/lib/firebase/auth';
import { onCartChange } from '@/lib/firebase/firestore';

/**
 * Hook pour gérer l'authentification Firebase
 */
export function useFirebaseAuth() {
  const store = useClientStore();
  const initialized = useRef(false);

  useEffect(() => {
    // Vérifier que nous sommes côté client et pas déjà initialisé
    if (typeof window === 'undefined' || initialized.current) return;
    
    initialized.current = true;
    let unsubscribeCart: (() => void) | null = null;

    // Écouter les changements d'authentification
    const unsubscribeAuth = onAuthStateChange((user) => {
      store.setUser(user);
      store.setAuthenticated(!!user);

      if (user) {
        console.log('✅ Utilisateur connecté:', user.uid);

        // Écouter les changements du panier
        unsubscribeCart = onCartChange((cart) => {
          store.setCart(cart);
        });
      } else {
        console.log('❌ Utilisateur déconnecté');
        store.setCart([]);
        if (unsubscribeCart) {
          unsubscribeCart();
          unsubscribeCart = null;
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeCart) {
        unsubscribeCart();
      }
    };
  }, []); // Pas de dépendances pour éviter les re-renders

  return {
    user: typeof window !== 'undefined' ? getCurrentUser() : null
  };
}
