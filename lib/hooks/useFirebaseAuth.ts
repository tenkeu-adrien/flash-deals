'use client';

import { useEffect, useRef } from 'react';
import { useClientStore } from '@/lib/stores/clientStore';
import { useAdminStore } from '@/lib/stores/adminStore';
import { useVendorStore } from '@/lib/stores/vendorStore';
import { onAuthStateChange, getCurrentUser, getUserProfile } from '@/lib/firebase/auth';
import { onCartChange } from '@/lib/firebase/firestore';

/**
 * Hook pour gérer l'authentification Firebase
 */
export function useFirebaseAuth() {
  const clientStore = useClientStore();
  const adminStore = useAdminStore();
  const vendorStore = useVendorStore();
  const initialized = useRef(false);

  useEffect(() => {
    // Vérifier que nous sommes côté client et pas déjà initialisé
    if (typeof window === 'undefined' || initialized.current) return;
    
    initialized.current = true;
    let unsubscribeCart: (() => void) | null = null;

    // Écouter les changements d'authentification
    const unsubscribeAuth = onAuthStateChange(async (user) => {
      if (user) {
        console.log('✅ Utilisateur connecté:', user.email);

        // Récupérer le profil utilisateur
        const profileResult = await getUserProfile(user.uid);

        if (profileResult.success && profileResult.profile) {
          const profile = profileResult.profile;

          // Mettre à jour le store approprié selon le rôle
          switch (profile.role) {
            case 'client':
              clientStore.setUser(user);
              clientStore.setAuthenticated(true);
              
              // Écouter les changements du panier
              unsubscribeCart = onCartChange((cart) => {
                clientStore.setCart(cart);
              });
              break;

            case 'admin':
              adminStore.setAdmin({
                uid: user.uid,
                name: profile.displayName || 'Admin',
                email: user.email || '',
                role: 'admin'
              });
              adminStore.setAuthenticated(true);
              break;

            case 'vendor':
              vendorStore.setVendor({
                uid: user.uid,
                name: profile.displayName || 'Vendeur',
                businessName: profile.displayName || 'Business',
                email: user.email || '',
                phone: profile.phoneNumber || '',
                status: profile.status === 'active' ? 'active' : 'pending'
              });
              vendorStore.setAuthenticated(true);
              break;

            default:
              // Par défaut, considérer comme client
              clientStore.setUser(user);
              clientStore.setAuthenticated(true);
          }
        } else {
          // Profil non trouvé, considérer comme client
          clientStore.setUser(user);
          clientStore.setAuthenticated(true);
        }
      } else {
        console.log('❌ Utilisateur déconnecté');
        
        // Réinitialiser tous les stores
        clientStore.setUser(null);
        clientStore.setAuthenticated(false);
        clientStore.setCart([]);
        
        adminStore.setAdmin(null);
        adminStore.setAuthenticated(false);
        
        vendorStore.setVendor(null);
        vendorStore.setAuthenticated(false);
        
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
