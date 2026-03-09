// ============================================
// ADMIN FUNCTIONS - EXTENDED
// ============================================

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db, Collections } from './config';

/**
 * Obtenir tous les vendeurs (admin)
 */
export async function getAllVendors(): Promise<{ success: boolean; vendors?: any[]; error?: string }> {
  try {
    const q = query(
      collection(db, Collections.VENDORS),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const vendors: any[] = [];

    snapshot.forEach((doc) => {
      vendors.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, vendors };
  } catch (error: any) {
    console.error('❌ Erreur récupération tous les vendeurs:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Désactiver un vendeur (admin)
 */
export async function deactivateVendor(vendorId: string, reason?: string): Promise<{ success: boolean; error?: string }> {
  try {
    await updateDoc(doc(db, Collections.VENDORS, vendorId), {
      status: 'rejected',
      deactivationReason: reason || 'Désactivé par l\'administrateur',
      deactivatedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Vendeur désactivé');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur désactivation vendeur:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Réactiver un vendeur (admin)
 */
export async function reactivateVendor(vendorId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await updateDoc(doc(db, Collections.VENDORS, vendorId), {
      status: 'active',
      reactivatedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Vendeur réactivé');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur réactivation vendeur:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir toutes les campagnes (admin) - avec filtres
 */
export async function getAllCampaignsAdmin(statusFilter?: string): Promise<{ success: boolean; campaigns?: any[]; error?: string }> {
  try {
    let q;
    
    if (statusFilter && statusFilter !== 'all') {
      q = query(
        collection(db, Collections.CAMPAIGNS),
        where('status', '==', statusFilter),
        orderBy('createdAt', 'desc'),
        limit(100)
      );
    } else {
      q = query(
        collection(db, Collections.CAMPAIGNS),
        orderBy('createdAt', 'desc'),
        limit(100)
      );
    }

    const snapshot = await getDocs(q);
    const campaigns: any[] = [];

    snapshot.forEach((doc) => {
      campaigns.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, campaigns };
  } catch (error: any) {
    console.error('❌ Erreur récupération campagnes admin:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Suspendre une campagne active (admin)
 */
export async function suspendCampaign(campaignId: string, reason?: string): Promise<{ success: boolean; error?: string }> {
  try {
    await updateDoc(doc(db, Collections.CAMPAIGNS, campaignId), {
      status: 'cancelled',
      suspensionReason: reason || 'Suspendue par l\'administrateur',
      suspendedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Campagne suspendue');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur suspension campagne:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Réactiver une campagne suspendue (admin)
 */
export async function reactivateCampaign(campaignId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await updateDoc(doc(db, Collections.CAMPAIGNS, campaignId), {
      status: 'active',
      reactivatedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Campagne réactivée');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur réactivation campagne:', error);
    return { success: false, error: error.message };
  }
}
