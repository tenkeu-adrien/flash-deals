// ============================================
// FIREBASE CONFIGURATION
// ============================================

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Configuration Firebase (à remplacer par vos vraies clés)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDEMO_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "flash-deals-cameroun.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "flash-deals-cameroun",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "flash-deals-cameroun.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-ABCDEF"
};

// Initialiser Firebase (une seule fois)
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;
let analytics: Analytics | null = null;

// Fonction d'initialisation
function initializeFirebase() {
  if (typeof window === 'undefined') return;

  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Activer la persistance offline
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('⚠️ Persistance: Plusieurs onglets ouverts');
    } else if (err.code === 'unimplemented') {
      console.warn('⚠️ Persistance non supportée par ce navigateur');
    }
  });

  // Analytics (optionnel)
  if (process.env.NODE_ENV === 'production') {
    try {
      analytics = getAnalytics(app);
    } catch (error) {
      console.warn('Analytics non disponible');
    }
  }

  console.log('✅ Firebase initialisé');
}

// Initialiser côté client
if (typeof window !== 'undefined') {
  initializeFirebase();
}

// Collections Firestore
export const Collections = {
  USERS: 'users',
  VENDORS: 'vendors',
  CAMPAIGNS: 'campaigns',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  CART: 'cart',
  REVIEWS: 'reviews',
  NOTIFICATIONS: 'notifications',
  ANALYTICS: 'analytics'
} as const;

// Getters sécurisés
export function getFirebaseAuth(): Auth {
  if (!auth) {
    throw new Error('Firebase Auth not initialized. Make sure you are on the client side.');
  }
  return auth;
}

export function getFirebaseDb(): Firestore {
  if (!db) {
    throw new Error('Firebase Firestore not initialized. Make sure you are on the client side.');
  }
  return db;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    throw new Error('Firebase Storage not initialized. Make sure you are on the client side.');
  }
  return storage;
}

export { app, auth, db, storage, analytics };
