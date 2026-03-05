'use client';

import { useEffect } from 'react';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';

export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  // Initialiser l'authentification Firebase
  useFirebaseAuth();

  useEffect(() => {
    console.log('🔥 Firebase Provider initialisé');
  }, []);

  return <>{children}</>;
}
