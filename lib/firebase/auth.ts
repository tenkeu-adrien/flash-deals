// ============================================
// FIREBASE AUTHENTICATION
// ============================================

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, Collections, getFirebaseAuth, getFirebaseDb } from './config';

// ============================================
// TYPES
// ============================================

export interface UserData {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  role: 'client' | 'vendor' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  phoneVerified?: boolean;
  createdAt: any;
  updatedAt: any;
  lastLoginAt?: any;
  preferences?: string[];
  address?: {
    street?: string;
    city?: string;
    region?: string;
    postalCode?: string;
  };
}

// ============================================
// INSCRIPTION
// ============================================

/**
 * Inscription avec email/password
 */
export async function signupWithEmail(
  email: string,
  password: string,
  additionalData?: Partial<UserData>
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const firebaseAuth = getFirebaseAuth();
    // Créer l'utilisateur
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const user = userCredential.user;

    // Envoyer email de vérification
    await sendEmailVerification(user);

    // Créer le profil utilisateur dans Firestore
    const userData: UserData = {
      uid: user.uid,
      email: email,
      displayName: additionalData?.displayName || email.split('@')[0],
      photoURL: additionalData?.photoURL || undefined,
      role: 'client',
      status: 'active',
      emailVerified: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...additionalData
    };

    await setDoc(doc(getFirebaseDb(), Collections.USERS, user.uid), userData);

    console.log('✅ Inscription réussie:', user.uid);
    return { success: true, user };
  } catch (error: any) {
    console.error('❌ Erreur inscription:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Inscription avec Google
 */
export async function signupWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const firebaseAuth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(firebaseAuth, provider);
    const user = result.user;

    // Vérifier si le profil existe déjà
    const userDoc = await getDoc(doc(getFirebaseDb(), Collections.USERS, user.uid));

    if (!userDoc.exists()) {
      // Créer le profil
      const userData: UserData = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Utilisateur',
        photoURL: user.photoURL || undefined,
        role: 'client',
        status: 'active',
        emailVerified: user.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(getFirebaseDb(), Collections.USERS, user.uid), userData);
    } else {
      // Mettre à jour la dernière connexion
      await updateDoc(doc(getFirebaseDb(), Collections.USERS, user.uid), {
        lastLoginAt: serverTimestamp()
      });
    }

    console.log('✅ Connexion Google réussie:', user.uid);
    return { success: true, user };
  } catch (error: any) {
    console.error('❌ Erreur connexion Google:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Inscription avec Facebook
 */
export async function signupWithFacebook(): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const firebaseAuth = getFirebaseAuth();
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(firebaseAuth, provider);
    const user = result.user;

    // Vérifier si le profil existe déjà
    const userDoc = await getDoc(doc(getFirebaseDb(), Collections.USERS, user.uid));

    if (!userDoc.exists()) {
      // Créer le profil
      const userData: UserData = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Utilisateur',
        photoURL: user.photoURL || undefined,
        role: 'client',
        status: 'active',
        emailVerified: user.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(getFirebaseDb(), Collections.USERS, user.uid), userData);
    } else {
      // Mettre à jour la dernière connexion
      await updateDoc(doc(getFirebaseDb(), Collections.USERS, user.uid), {
        lastLoginAt: serverTimestamp()
      });
    }

    console.log('✅ Connexion Facebook réussie:', user.uid);
    return { success: true, user };
  } catch (error: any) {
    console.error('❌ Erreur connexion Facebook:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// CONNEXION
// ============================================

/**
 * Connexion avec email/password
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const firebaseAuth = getFirebaseAuth();
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const user = userCredential.user;

    // Mettre à jour la dernière connexion
    await updateDoc(doc(getFirebaseDb(), Collections.USERS, user.uid), {
      lastLoginAt: serverTimestamp()
    });

    console.log('✅ Connexion réussie:', user.uid);
    return { success: true, user };
  } catch (error: any) {
    console.error('❌ Erreur connexion:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Connexion avec Google (alias de signupWithGoogle)
 */
export const loginWithGoogle = signupWithGoogle;

/**
 * Connexion avec Facebook (alias de signupWithFacebook)
 */
export const loginWithFacebook = signupWithFacebook;

// ============================================
// DÉCONNEXION
// ============================================

/**
 * Déconnexion
 */
export async function logout(): Promise<{ success: boolean; error?: string }> {
  try {
    const firebaseAuth = getFirebaseAuth();
    await signOut(firebaseAuth);
    console.log('✅ Déconnexion réussie');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur déconnexion:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// MOT DE PASSE
// ============================================

/**
 * Réinitialiser le mot de passe
 */
export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const firebaseAuth = getFirebaseAuth();
    await sendPasswordResetEmail(firebaseAuth, email);
    console.log('✅ Email de réinitialisation envoyé');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur réinitialisation:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Changer le mot de passe
 */
export async function updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non connecté');

    await firebaseUpdatePassword(user, newPassword);
    console.log('✅ Mot de passe changé');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur changement mot de passe:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// PROFIL
// ============================================

/**
 * Obtenir le profil utilisateur
 */
export async function getUserProfile(userId?: string): Promise<{ success: boolean; profile?: UserData; error?: string }> {
  try {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error('Utilisateur non connecté');

    const docSnap = await getDoc(doc(getFirebaseDb(), Collections.USERS, uid));

    if (docSnap.exists()) {
      return { success: true, profile: docSnap.data() as UserData };
    } else {
      return { success: false, error: 'Profil non trouvé' };
    }
  } catch (error: any) {
    console.error('❌ Erreur récupération profil:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Mettre à jour le profil
 */
export async function updateUserProfile(data: Partial<UserData>): Promise<{ success: boolean; error?: string }> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('Utilisateur non connecté');

    await updateDoc(doc(getFirebaseDb(), Collections.USERS, uid), {
      ...data,
      updatedAt: serverTimestamp()
    });

    console.log('✅ Profil mis à jour');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur mise à jour profil:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// LISTENER
// ============================================

/**
 * Écouter les changements d'authentification
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Obtenir l'utilisateur actuel
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined' || !auth) return null;
  return auth.currentUser;
}

/**
 * Obtenir l'ID de l'utilisateur actuel
 */
export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined' || !auth) return null;
  return auth.currentUser?.uid || null;
}

/**
 * Vérifier si l'utilisateur est connecté
 */
export function isUserLoggedIn(): boolean {
  if (typeof window === 'undefined' || !auth) return false;
  return auth.currentUser !== null;
}


