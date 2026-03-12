// ============================================
// AUTHENTIFICATION VENDEUR SPÉCIFIQUE
// ============================================

import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { getFirebaseDb, getFirebaseAuth, Collections } from './config';
import { signupWithEmail, loginWithEmail, getCurrentUser } from './auth';

export interface VendorRegistrationData {
  // Informations personnelles
  fullName: string;
  email: string;
  phone: string;
  password: string;
  
  // Informations business
  businessName: string;
  businessType: string;
  businessAddress: string;
  businessCity: string;
  businessRegion: string;
  
  // Documents
  idType: 'cni' | 'passport';
  idNumber: string;
  idDocument?: string; // URL du document uploadé
  
  // Autres
  acceptedTerms: boolean;
}

/**
 * Inscription vendeur complète
 * Gère le cas où l'email existe déjà
 */
export async function registerVendor(
  data: VendorRegistrationData
): Promise<{ success: boolean; vendorId?: string; error?: string }> {
  try {
    let userId: string;
    let isNewAccount = false;

    // Vérifier si l'utilisateur est déjà connecté
    const currentUser = getCurrentUser();
    
    if (currentUser) {
      // Utilisateur déjà connecté, utiliser son compte
      userId = currentUser.uid;
      console.log('✅ Utilisation du compte existant:', userId);
      
      // Vérifier que l'email correspond
      if (currentUser.email !== data.email) {
        throw new Error('L\'email saisi ne correspond pas à votre compte connecté. Veuillez vous déconnecter et réessayer.');
      }
    } else {
      // Vérifier d'abord si l'utilisateur existe déjà dans Firestore
      const db = getFirebaseDb();
      const usersQuery = await getDocs(
        query(collection(db, Collections.USERS), where('email', '==', data.email))
      );
      
      if (!usersQuery.empty) {
        // L'utilisateur existe déjà dans Firestore
        throw new Error('Un compte avec cet email existe déjà. Veuillez vous connecter d\'abord, puis compléter votre inscription vendeur.');
      }
      
      // Essayer de créer un nouveau compte
      const signupResult = await signupWithEmail(data.email, data.password, {
        displayName: data.fullName,
        phoneNumber: data.phone,
        role: 'vendor'
      });

      if (signupResult.success && signupResult.user) {
        userId = signupResult.user.uid;
        isNewAccount = true;
        console.log('✅ Nouveau compte créé:', userId);
      } else if (signupResult.error?.includes('email-already-in-use')) {
        // Email existe déjà dans Firebase Auth mais pas dans Firestore
        // C'est le problème que vous rencontrez
        throw new Error('Un compte avec cet email existe déjà dans le système. Veuillez vous connecter d\'abord avec votre mot de passe, puis compléter votre inscription vendeur.');
      } else {
        throw new Error(signupResult.error || 'Erreur lors de la création du compte');
      }
    }

    // Créer le profil vendeur dans Firestore
    const vendorData = {
      // Informations utilisateur
      userId,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      
      // Informations business
      businessName: data.businessName,
      businessType: data.businessType,
      businessAddress: data.businessAddress,
      businessCity: data.businessCity,
      businessRegion: data.businessRegion,
      
      // Documents
      idType: data.idType,
      idNumber: data.idNumber,
      idDocument: data.idDocument || '',
      
      // Statut
      status: 'pending', // En attente de validation admin
      role: 'vendor',
      
      // Statistiques
      totalSales: 0,
      totalRevenue: 0,
      rating: 0,
      reviewCount: 0,
      
      // Abonnement
      subscription: 'basic',
      subscriptionExpiry: null,
      
      // Dates
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      acceptedTermsAt: serverTimestamp()
    };

    const db = getFirebaseDb();
    await setDoc(doc(db, Collections.VENDORS, userId), vendorData);

    // Mettre à jour le rôle dans la collection users
    await setDoc(doc(db, Collections.USERS, userId), {
      uid: userId,
      email: data.email,
      displayName: data.fullName,
      phoneNumber: data.phone,
      role: 'vendor',
      status: 'pending',
      createdAt: isNewAccount ? serverTimestamp() : undefined,
      updatedAt: serverTimestamp()
    }, { merge: true });

    console.log('✅ Profil vendeur créé:', userId);
    return { success: true, vendorId: userId };
  } catch (error: any) {
    console.error('❌ Erreur inscription vendeur:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Vérifier si un utilisateur est déjà vendeur
 */
export async function isUserVendor(userId: string): Promise<boolean> {
  try {
    const db = getFirebaseDb();
    const vendorDoc = await getDoc(doc(db, Collections.VENDORS, userId));
    return vendorDoc.exists();
  } catch (error) {
    console.error('❌ Erreur vérification vendeur:', error);
    return false;
  }
}

/**
 * Obtenir le statut de la demande vendeur
 */
export async function getVendorApplicationStatus(userId: string): Promise<{
  success: boolean;
  status?: 'pending' | 'active' | 'rejected';
  error?: string;
}> {
  try {
    const db = getFirebaseDb();
    const vendorDoc = await getDoc(doc(db, Collections.VENDORS, userId));
    
    if (vendorDoc.exists()) {
      const data = vendorDoc.data();
      return { success: true, status: data.status };
    } else {
      return { success: false, error: 'Demande non trouvée' };
    }
  } catch (error: any) {
    console.error('❌ Erreur:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Transformer un compte client existant en compte vendeur
 * À utiliser quand un client connecté veut devenir vendeur
 */
export async function upgradeClientToVendor(
  vendorData: Omit<VendorRegistrationData, 'email' | 'password'> & { email: string }
): Promise<{ success: boolean; vendorId?: string; error?: string }> {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Vous devez être connecté pour devenir vendeur');
    }

    // Vérifier que l'email correspond
    if (currentUser.email !== vendorData.email) {
      throw new Error('L\'email saisi ne correspond pas à votre compte connecté');
    }

    const userId = currentUser.uid;
    const db = getFirebaseDb();

    // Vérifier si l'utilisateur est déjà vendeur
    const vendorDoc = await getDoc(doc(db, Collections.VENDORS, userId));
    if (vendorDoc.exists()) {
      throw new Error('Vous êtes déjà inscrit en tant que vendeur');
    }

    // Créer le profil vendeur
    const vendorProfile = {
      // Informations utilisateur
      userId,
      email: vendorData.email,
      fullName: vendorData.fullName,
      phone: vendorData.phone,
      
      // Informations business
      businessName: vendorData.businessName,
      businessType: vendorData.businessType,
      businessAddress: vendorData.businessAddress,
      businessCity: vendorData.businessCity,
      businessRegion: vendorData.businessRegion,
      
      // Documents
      idType: vendorData.idType,
      idNumber: vendorData.idNumber,
      idDocument: vendorData.idDocument || '',
      
      // Statut
      status: 'pending', // En attente de validation admin
      role: 'vendor',
      
      // Statistiques
      totalSales: 0,
      totalRevenue: 0,
      rating: 0,
      reviewCount: 0,
      
      // Abonnement
      subscription: 'basic',
      subscriptionExpiry: null,
      
      // Dates
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      acceptedTermsAt: serverTimestamp()
    };

    await setDoc(doc(db, Collections.VENDORS, userId), vendorProfile);

    // Mettre à jour le rôle dans la collection users
    await setDoc(doc(db, Collections.USERS, userId), {
      role: 'vendor',
      updatedAt: serverTimestamp()
    }, { merge: true });

    console.log('✅ Compte client transformé en vendeur:', userId);
    return { success: true, vendorId: userId };
  } catch (error: any) {
    console.error('❌ Erreur transformation en vendeur:', error);
    return { success: false, error: error.message };
  }
}