// ============================================
// ADMIN FUNCTIONS - EXTENDED
// ============================================

import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { getFirebaseDb, Collections } from './config';

/**
 * Obtenir tous les vendeurs (admin)
 */
export async function getAllVendors(): Promise<{ success: boolean; vendors?: any[]; error?: string }> {
  try {
    const db = getFirebaseDb();
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
    const db = getFirebaseDb();
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
    const db = getFirebaseDb();
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
    const db = getFirebaseDb();
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
    const db = getFirebaseDb();
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
    const db = getFirebaseDb();
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

// ============================================
// STATISTIQUES GLOBALES (ADMIN DASHBOARD)
// ============================================

/**
 * Obtenir toutes les commandes (admin)
 */
export async function getAllOrders(limitCount = 200): Promise<{ success: boolean; orders?: any[]; error?: string }> {
  try {
    const db = getFirebaseDb();
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const orders: any[] = [];

    snapshot.forEach((docSnap) => {
      orders.push({ id: docSnap.id, ...docSnap.data() });
    });

    return { success: true, orders };
  } catch (error: any) {
    // Fallback sans orderBy si index manquant
    try {
      const db = getFirebaseDb();
      const snapshot = await getDocs(query(collection(db, 'orders'), limit(limitCount)));
      const orders: any[] = [];
      snapshot.forEach((docSnap) => {
        orders.push({ id: docSnap.id, ...docSnap.data() });
      });
      return { success: true, orders };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
}

/**
 * Obtenir les statistiques globales de la plateforme
 */
export async function getGlobalStats(): Promise<{ success: boolean; stats?: any; error?: string }> {
  try {
    const db = getFirebaseDb();

    // Récupérer en parallèle
    const [campaignsSnap, vendorsSnap, ordersSnap, usersSnap] = await Promise.all([
      getDocs(collection(db, 'campaigns')),
      getDocs(collection(db, 'vendors')),
      getDocs(collection(db, 'orders')),
      getDocs(collection(db, 'users')),
    ]);

    let totalRevenue = 0;
    let deliveredOrders = 0;
    let pendingOrders = 0;
    let activeCampaigns = 0;
    let pendingCampaigns = 0;
    let activeVendors = 0;
    let pendingVendors = 0;

    ordersSnap.forEach((d) => {
      const o = d.data();
      totalRevenue += o.totalPrice || 0;
      if (o.status === 'delivered') deliveredOrders++;
      if (o.status === 'pending' || o.status === 'pending_validation') pendingOrders++;
    });

    campaignsSnap.forEach((d) => {
      const c = d.data();
      if (c.status === 'active') activeCampaigns++;
      if (c.status === 'pending') pendingCampaigns++;
    });

    vendorsSnap.forEach((d) => {
      const v = d.data();
      if (v.status === 'active') activeVendors++;
      if (v.status === 'pending') pendingVendors++;
    });

    const stats = {
      totalUsers: usersSnap.size,
      totalVendors: vendorsSnap.size,
      activeVendors,
      pendingVendors,
      totalCampaigns: campaignsSnap.size,
      activeCampaigns,
      pendingCampaigns,
      totalOrders: ordersSnap.size,
      deliveredOrders,
      pendingOrders,
      totalRevenue,
    };

    return { success: true, stats };
  } catch (error: any) {
    console.error('Erreur getGlobalStats:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Vérifier la santé de la connexion Firebase
 */
export async function checkFirebaseHealth(): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const db = getFirebaseDb();
    // Lecture d'un document léger pour tester la connexion
    await getDoc(doc(db, 'settings', 'health'));
    return { success: true, message: 'Firebase connecté et opérationnel' };
  } catch (error: any) {
    // Une erreur "not-found" signifie quand même que Firebase répond
    if (error.code === 'not-found' || error.message?.includes('No document')) {
      return { success: true, message: 'Firebase connecté et opérationnel' };
    }
    return { success: false, error: error.message };
  }
}
