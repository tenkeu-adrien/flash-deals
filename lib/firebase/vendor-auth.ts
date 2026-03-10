// ============================================
// AUTHENTIFICATION VENDEUR SPÉCIFIQUE
// ============================================

import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
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
    } else {
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
        // Email existe déjà, essayer de se connecter
        console.log('⚠️ Email existe, tentative de connexion...');
        
        const loginResult = await loginWithEmail(data.email, data.password);
        
        if (loginResult.success && loginResult.user) {
          userId = loginResult.user.uid;
          console.log('✅ Connexion réussie:', userId);
        } else {
          throw new Error('Email déjà utilisé avec un autre mot de passe. Veuillez vous connecter d\'abord.');
        }
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
