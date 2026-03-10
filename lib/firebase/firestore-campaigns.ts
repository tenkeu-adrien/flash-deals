// ============================================
// GESTION DES CAMPAGNES EXPIRÉES ET RELANCE
// ============================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { getFirebaseDb, Collections } from './config';
import { getCurrentUserId } from './auth';
import { Campaign } from './firestore';

// ============================================
// TYPES
// ============================================

export interface CampaignWithExpiry extends Campaign {
  isExpired: boolean;
  canRelaunch: boolean;
}

// ============================================
// GESTION DES CAMPAGNES EXPIRÉES
// ============================================

/**
 * Vérifier si une campagne est expirée
 */
export function isCampaignExpired(campaign: Campaign): boolean {
  if (!campaign.endDate) return false;
  
  const endDate = campaign.endDate instanceof Timestamp 
    ? campaign.endDate.toDate() 
    : new Date(campaign.endDate);
  
  return endDate < new Date();
}

/**
 * Obtenir les campagnes actives (non expirées)
 */
export async function getActiveCampaignsOnly(): Promise<{ 
  success: boolean; 
  campaigns?: CampaignWithExpiry[]; 
  error?: string 
}> {
  try {
    const db = getFirebaseDb();
    const q = query(
      collection(db, Collections.CAMPAIGNS),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const campaigns: CampaignWithExpiry[] = [];

    snapshot.forEach((doc) => {
      const campaign = { id: doc.id, ...doc.data() } as Campaign;
      const isExpired = isCampaignExpired(campaign);
      
      if (!isExpired) {
        campaigns.push({
          ...campaign,
          isExpired: false,
          canRelaunch: false
        });
      }
    });

    return { success: true, campaigns };
  } catch (error: any) {
    console.error('❌ Erreur récupération campagnes actives:', error);
    return { success: false, error: error.message };
  }
}
/**
 * Obtenir les campagnes expirées d'un vendeur
 */
export async function getExpiredCampaigns(vendorId?: string): Promise<{ 
  success: boolean; 
  campaigns?: CampaignWithExpiry[]; 
  error?: string 
}> {
  try {
    const db = getFirebaseDb();
    const uid = vendorId || getCurrentUserId();
    if (!uid) throw new Error('Vendeur non connecté');

    const q = query(
      collection(db, Collections.CAMPAIGNS),
      where('vendorId', '==', uid),
      orderBy('endDate', 'desc')
    );

    const snapshot = await getDocs(q);
    const campaigns: CampaignWithExpiry[] = [];

    snapshot.forEach((doc) => {
      const campaign = { id: doc.id, ...doc.data() } as Campaign;
      const isExpired = isCampaignExpired(campaign);
      
      if (isExpired) {
        campaigns.push({
          ...campaign,
          isExpired: true,
          canRelaunch: true
        });
      }
    });

    return { success: true, campaigns };
  } catch (error: any) {
    console.error('❌ Erreur récupération campagnes expirées:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Marquer automatiquement les campagnes expirées comme "completed"
 */
export async function markExpiredCampaignsAsCompleted(): Promise<{ 
  success: boolean; 
  updatedCount?: number; 
  error?: string 
}> {
  try {
    const db = getFirebaseDb();
    const q = query(
      collection(db, Collections.CAMPAIGNS),
      where('status', '==', 'active')
    );

    const snapshot = await getDocs(q);
    let updatedCount = 0;

    const updatePromises = snapshot.docs.map(async (docSnap) => {
      const campaign = docSnap.data() as Campaign;
      
      if (isCampaignExpired(campaign)) {
        await updateDoc(doc(db, Collections.CAMPAIGNS, docSnap.id), {
          status: 'completed',
          updatedAt: serverTimestamp()
        });
        updatedCount++;
      }
    });

    await Promise.all(updatePromises);

    console.log(`✅ ${updatedCount} campagne(s) expirée(s) marquée(s) comme terminée(s)`);
    return { success: true, updatedCount };
  } catch (error: any) {
    console.error('❌ Erreur:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Relancer une campagne expirée
 */
export async function relaunchCampaign(
  campaignId: string,
  newEndDate: Date,
  newStock?: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseDb();
    const vendorId = getCurrentUserId();
    if (!vendorId) throw new Error('Vendeur non connecté');

    const campaignDoc = await getDoc(doc(db, Collections.CAMPAIGNS, campaignId));
    if (!campaignDoc.exists()) {
      throw new Error('Campagne non trouvée');
    }

    const campaign = campaignDoc.data() as Campaign;
    if (campaign.vendorId !== vendorId) {
      throw new Error('Vous n\'êtes pas autorisé à relancer cette campagne');
    }

    if (!isCampaignExpired(campaign)) {
      throw new Error('Cette campagne n\'est pas encore expirée');
    }

    const updateData: any = {
      status: 'pending',
      startDate: Timestamp.now(),
      endDate: Timestamp.fromDate(newEndDate),
      updatedAt: serverTimestamp()
    };

    if (newStock !== undefined) {
      updateData.stock = newStock;
    }

    await updateDoc(doc(db, Collections.CAMPAIGNS, campaignId), updateData);

    console.log('✅ Campagne relancée (en attente de validation)');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur relance campagne:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Vérifier si un vendeur peut relancer une campagne
 */
export async function canVendorRelaunchCampaign(
  vendorId?: string
): Promise<{ success: boolean; canRelaunch?: boolean; reason?: string; error?: string }> {
  try {
    const db = getFirebaseDb();
    const uid = vendorId || getCurrentUserId();
    if (!uid) throw new Error('Vendeur non connecté');

    const vendorDoc = await getDoc(doc(db, 'vendors', uid));
    if (!vendorDoc.exists()) {
      throw new Error('Profil vendeur non trouvé');
    }

    const vendor = vendorDoc.data();
    
    if (vendor.status !== 'active') {
      return { 
        success: true, 
        canRelaunch: false, 
        reason: 'Votre compte vendeur n\'est pas actif' 
      };
    }

    const subscription = vendor.subscription || 'basic';
    
    const activeCampaignsQuery = query(
      collection(db, Collections.CAMPAIGNS),
      where('vendorId', '==', uid),
      where('status', 'in', ['active', 'pending'])
    );
    
    const activeCampaignsSnapshot = await getDocs(activeCampaignsQuery);
    const activeCampaignsCount = activeCampaignsSnapshot.size;

    const limits: Record<string, number> = {
      basic: 2,
      premium: 10,
      enterprise: 999
    };

    const limit = limits[subscription] || 2;

    if (activeCampaignsCount >= limit) {
      return {
        success: true,
        canRelaunch: false,
        reason: `Vous avez atteint la limite de ${limit} campagne(s) active(s) pour votre abonnement ${subscription}`
      };
    }

    return { success: true, canRelaunch: true };
  } catch (error: any) {
    console.error('❌ Erreur:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir les statistiques d'une campagne terminée
 */
export async function getCampaignStats(campaignId: string): Promise<{ 
  success: boolean; 
  stats?: {
    totalViews: number;
    totalInterested: number;
    totalSold: number;
    totalRevenue: number;
    conversionRate: number;
  }; 
  error?: string 
}> {
  try {
    const db = getFirebaseDb();
    const campaignDoc = await getDoc(doc(db, Collections.CAMPAIGNS, campaignId));
    if (!campaignDoc.exists()) {
      throw new Error('Campagne non trouvée');
    }

    const campaign = campaignDoc.data() as Campaign;

    const totalViews = campaign.views || 0;
    const totalInterested = campaign.interested || 0;
    const totalSold = campaign.sold || 0;
    const totalRevenue = totalSold * campaign.currentPrice;
    const conversionRate = totalViews > 0 ? (totalSold / totalViews) * 100 : 0;

    return {
      success: true,
      stats: {
        totalViews,
        totalInterested,
        totalSold,
        totalRevenue,
        conversionRate
      }
    };
  } catch (error: any) {
    console.error('❌ Erreur:', error);
    return { success: false, error: error.message };
  }
}