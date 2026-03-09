// ============================================
// GESTION DE L'ADRESSE DE LIVRAISON UNIQUE
// ============================================

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import { getCurrentUserId } from './auth';

// ============================================
// TYPES
// ============================================

export interface UserAddress {
  userId: string;
  street: string;
  city: string;
  region: string;
  postalCode?: string;
  phone: string;
  createdAt: any;
  updatedAt: any;
}

// Régions du Cameroun
export const CAMEROON_REGIONS = [
  'Adamaoua',
  'Centre',
  'Est',
  'Extrême-Nord',
  'Littoral',
  'Nord',
  'Nord-Ouest',
  'Ouest',
  'Sud',
  'Sud-Ouest'
] as const;

// Villes principales du Cameroun (pour suggestions)
export const CAMEROON_CITIES = [
  'Yaoundé',
  'Douala',
  'Garoua',
  'Bafoussam',
  'Bamenda',
  'Maroua',
  'Ngaoundéré',
  'Bertoua',
  'Ebolowa',
  'Kribi',
  'Limbé',
  'Buéa',
  'Kumba',
  'Nkongsamba',
  'Edéa',
  'Loum',
  'Foumban',
  'Dschang',
  'Mbouda',
  'Kumbo',
  'Mbalmayo',
  'Sangmélima',
  'Batouri',
  'Yokadouma'
];

// ============================================
// GESTION DE L'ADRESSE
// ============================================

/**
 * Obtenir l'adresse de l'utilisateur
 */
export async function getUserAddress(userId?: string): Promise<{ 
  success: boolean; 
  address?: UserAddress; 
  error?: string 
}> {
  try {
    const uid = userId || getCurrentUserId();
    if (!uid) throw new Error('Utilisateur non connecté');

    const docSnap = await getDoc(doc(db, 'userAddresses', uid));

    if (docSnap.exists()) {
      return { 
        success: true, 
        address: docSnap.data() as UserAddress 
      };
    } else {
      return { success: true, address: undefined };
    }
  } catch (error: any) {
    console.error('❌ Erreur récupération adresse:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Enregistrer ou mettre à jour l'adresse de l'utilisateur
 */
export async function saveUserAddress(
  addressData: Omit<UserAddress, 'userId' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Utilisateur non connecté');

    // Vérifier si l'adresse existe déjà
    const existingAddress = await getUserAddress(userId);
    
    const data: any = {
      ...addressData,
      userId,
      updatedAt: serverTimestamp()
    };

    // Ajouter createdAt seulement si c'est une nouvelle adresse
    if (!existingAddress.address) {
      data.createdAt = serverTimestamp();
    }

    await setDoc(doc(db, 'userAddresses', userId), data, { merge: true });

    console.log('✅ Adresse enregistrée');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur enregistrement adresse:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Vérifier si une région est valide
 */
export function isValidRegion(region: string): boolean {
  return CAMEROON_REGIONS.includes(region as any);
}
