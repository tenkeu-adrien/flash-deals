// ============================================
// FIREBASE FIRESTORE OPERATIONS
// ============================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp
} from 'firebase/firestore';
import { getFirebaseDb, Collections } from './config';
import { getCurrentUserId } from './auth';

// ============================================
// TYPES
// ============================================

export interface Campaign {
  id?: string;
  vendorId: string;
  title: string;
  description: string;
  images: string[];
  originalPrice: number;
  currentPrice: number;
  discount: number;
  stock: number;
  sold: number;
  category: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  startDate: Timestamp | Date;
  endDate: Timestamp | Date;
  delivery: string;
  location: string;
  views: number;
  interested: number;
  interestedUsers?: string[];
  averageRating?: number;
  reviewCount?: number;
  createdAt: any;
  updatedAt: any;
}

export interface Order {
  id?: string;
  userId: string;
  campaignId: string;
  vendorId: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  deliveryAddress: {
    street: string;
    city: string;
    region: string;
    postalCode?: string;
    phone: string;
  };
  createdAt: any;
  updatedAt: any;
}

export interface OrderItem {
  id?: string;
  orderId: string;
  campaignId: string;
  vendorId: string;
  title: string;
  image?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  createdAt: any;
}

export interface CartItem {
  id?: string;
  userId: string;
  campaignId: string;
  quantity: number;
  price: number;
  addedAt: any;
}

export interface Review {
  id?: string;
  campaignId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: any;
}

// ============================================
// AVIS / REVIEWS
// ============================================

/**
 * Ajouter ou mettre à jour un avis pour une campagne (1 avis par utilisateur et par campagne)
 */
export async function addReview(
  campaignId: string,
  rating: number,
  comment: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseDb();
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Utilisateur non connecté');
    if (!campaignId) throw new Error('Campagne invalide');
    if (!rating || rating < 1 || rating > 5) throw new Error('Note invalide (1 à 5)');

    const trimmedComment = comment.trim();
    if (!trimmedComment) throw new Error('Le commentaire est obligatoire');

    // 1) Enregistrer / mettre à jour l'avis (id stable: campaignId_userId)
    const reviewId = `${campaignId}_${userId}`;
    await setDoc(
      doc(db, Collections.REVIEWS, reviewId),
      {
        campaignId,
        userId,
        rating,
        comment: trimmedComment,
        createdAt: serverTimestamp()
      },
      { merge: true }
    );

    // 2) Recalculer la moyenne et le nombre d'avis pour la campagne
    const q = query(
      collection(db, Collections.REVIEWS),
      where('campaignId', '==', campaignId),
      limit(200)
    );

    const snapshot = await getDocs(q);
    let totalRating = 0;
    let count = 0;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Review;
      if (typeof data.rating === 'number') {
        totalRating += data.rating;
        count += 1;
      }
    });

    if (count > 0) {
      const averageRating = totalRating / count;
      await updateDoc(doc(db, Collections.CAMPAIGNS, campaignId), {
        averageRating,
        reviewCount: count,
        updatedAt: serverTimestamp()
      });
    }

    console.log('✅ Avis enregistré');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur ajout avis:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir les avis d'une campagne
 */
export async function getCampaignReviews(
  campaignId: string,
  limitCount = 20
): Promise<{ success: boolean; reviews?: Review[]; error?: string }> {
  try {
    const db = getFirebaseDb();
    if (!campaignId) throw new Error('Campagne invalide');

    const q = query(
      collection(db, Collections.REVIEWS),
      where('campaignId', '==', campaignId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const reviews: Review[] = [];

    snapshot.forEach((docSnap) => {
      reviews.push({ id: docSnap.id, ...docSnap.data() } as Review);
    });

    return { success: true, reviews };
  } catch (error: any) {
    console.error('❌ Erreur récupération avis:', error);

    // Fallback sans orderBy (si index manquant)
    try {
      const db = getFirebaseDb();
      const q = query(
        collection(db, Collections.REVIEWS),
        where('campaignId', '==', campaignId),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      const reviews: Review[] = [];

      snapshot.forEach((docSnap) => {
        reviews.push({ id: docSnap.id, ...docSnap.data() } as Review);
      });

      console.warn('⚠️ getCampaignReviews: fallback sans orderBy (index manquant?)');
      return { success: true, reviews };
    } catch (fallbackError: any) {
      return { success: false, error: fallbackError.message || error.message };
    }
  }
}

// ============================================
// CAMPAGNES
// ============================================

/**
 * Créer une campagne
 */
export async function createCampaign(campaignData: Omit<Campaign, 'id' | 'views' | 'interested' | 'sold' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; campaignId?: string; error?: string }> {
  try {
    const db = getFirebaseDb();
    const vendorId = getCurrentUserId();
    if (!vendorId) throw new Error('Vendeur non connecté');

    const docRef = await addDoc(collection(db, Collections.CAMPAIGNS), {
      ...campaignData,
      vendorId,
      status: 'pending',
      views: 0,
      interested: 0,
      sold: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Campagne créée:', docRef.id);
    return { success: true, campaignId: docRef.id };
  } catch (error: any) {
    console.error('❌ Erreur création campagne:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir toutes les campagnes actives (non expirées)
 */
export async function getActiveCampaigns(limitCount = 20): Promise<{ success: boolean; campaigns?: Campaign[]; error?: string }> {
  try {
    const db = getFirebaseDb();
    let q = query(
      collection(db, Collections.CAMPAIGNS),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    let snapshot = await getDocs(q);
    
    // Si aucune campagne active, récupérer toutes les campagnes
    if (snapshot.empty) {
      console.log('⚠️ Aucune campagne active trouvée, récupération de toutes les campagnes...');
      q = query(
        collection(db, Collections.CAMPAIGNS),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      snapshot = await getDocs(q);
    }

    const campaigns: Campaign[] = [];
    const now = new Date();

    snapshot.forEach((doc) => {
      const campaign = { id: doc.id, ...doc.data() } as Campaign;
      
      // Filtrer les campagnes expirées
      const endDate = campaign.endDate instanceof Timestamp 
        ? campaign.endDate.toDate() 
        : new Date(campaign.endDate);
      
      // N'ajouter que les campagnes non expirées
      if (endDate > now) {
        campaigns.push(campaign);
      }
    });

    console.log(`✅ ${campaigns.length} campagne(s) active(s) et non expirée(s) récupérée(s)`);
    return { success: true, campaigns };
  } catch (error: any) {
    console.error('❌ Erreur récupération campagnes:', error);
    
    // En cas d'erreur d'index, essayer sans orderBy
    try {
      console.log('⚠️ Tentative sans orderBy...');
      const db = getFirebaseDb();
      const q = query(
        collection(db, Collections.CAMPAIGNS),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      const campaigns: Campaign[] = [];
      const now = new Date();
      
      snapshot.forEach((doc) => {
        const campaign = { id: doc.id, ...doc.data() } as Campaign;
        
        // Filtrer les campagnes expirées
        const endDate = campaign.endDate instanceof Timestamp 
          ? campaign.endDate.toDate() 
          : new Date(campaign.endDate);
        
        // N'ajouter que les campagnes actives et non expirées
        if (campaign.status === 'active' && endDate > now) {
          campaigns.push(campaign);
        }
      });
      
      console.log(`✅ ${campaigns.length} campagne(s) récupérée(s) (sans tri)`);
      return { success: true, campaigns };
    } catch (fallbackError: any) {
      console.error('❌ Erreur finale:', fallbackError);
      return { success: false, error: fallbackError.message };
    }
  }
}

/**
 * Obtenir une campagne par ID
 */
export async function getCampaign(campaignId: string): Promise<{ success: boolean; campaign?: Campaign; error?: string }> {
  try {
    const db = getFirebaseDb();
    const docSnap = await getDoc(doc(db, Collections.CAMPAIGNS, campaignId));

    if (docSnap.exists()) {
      // Incrémenter les vues
      await updateDoc(doc(db, Collections.CAMPAIGNS, campaignId), {
        views: increment(1)
      });

      return { success: true, campaign: { id: docSnap.id, ...docSnap.data() } as Campaign };
    } else {
      return { success: false, error: 'Campagne non trouvée' };
    }
  } catch (error: any) {
    console.error('❌ Erreur récupération campagne:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Mettre à jour une campagne
 */
export async function updateCampaign(campaignId: string, data: Partial<Campaign>): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseDb();
    await updateDoc(doc(db, Collections.CAMPAIGNS, campaignId), {
      ...data,
      updatedAt: serverTimestamp()
    });

    console.log('✅ Campagne mise à jour');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur mise à jour campagne:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Marquer comme intéressé
 */
export async function markAsInterested(campaignId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseDb();
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Utilisateur non connecté');

    await updateDoc(doc(db, Collections.CAMPAIGNS, campaignId), {
      interested: increment(1),
      interestedUsers: arrayUnion(userId)
    });

    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// COMMANDES
// ============================================

/**
 * Créer une commande (écrit dans `orders`)
 *
 * IMPORTANT:
 * - On n'essaie PAS de modifier `campaigns` ici (stock/sold) car les règles Firestore interdisent
 *   normalement aux clients de faire `update` sur `campaigns`. La mise à jour du stock doit être
 *   gérée côté admin/vendor ou via une Cloud Function.
 */
export async function createOrder(orderData: Omit<Order, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const db = getFirebaseDb();
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Utilisateur non connecté');

    const docRef = await addDoc(collection(db, Collections.ORDERS), {
      ...orderData,
      userId,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Commande créée:', docRef.id);
    return { success: true, orderId: docRef.id };
  } catch (error: any) {
    console.error('❌ Erreur création commande:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Créer une commande + 1 item (écrit dans `orders` et `orders/{orderId}/items/{itemId}`)
 * Utile pour avoir des "order items" visibles dans Firestore.
 */
export async function createOrderWithItem(params: {
  campaign: Pick<Campaign, 'id' | 'vendorId' | 'title' | 'images' | 'currentPrice'>;
  quantity: number;
  deliveryAddress: Order['deliveryAddress'];
  paymentMethod?: string;
}): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const db = getFirebaseDb();
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Utilisateur non connecté');
    if (!params.campaign?.id) throw new Error('Campagne invalide');
    if (!params.campaign.vendorId) throw new Error('vendorId manquant sur la campagne');
    if (!params.quantity || params.quantity < 1) throw new Error('Quantité invalide');

    const totalPrice = (params.campaign.currentPrice || 0) * params.quantity;

    // 1) Créer la commande (sans champs `undefined`)
    const orderPayload: any = {
      campaignId: params.campaign.id,
      vendorId: params.campaign.vendorId,
      quantity: params.quantity,
      totalPrice,
      deliveryAddress: params.deliveryAddress,
      userId,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    if (params.paymentMethod) {
      orderPayload.paymentMethod = params.paymentMethod;
    }

    const orderDocRef = await addDoc(collection(db, Collections.ORDERS), orderPayload);
    const orderId = orderDocRef.id;

    // 2) Créer l'item (subcollection)
    const itemPayload: any = {
      orderId,
      campaignId: params.campaign.id,
      vendorId: params.campaign.vendorId,
      title: params.campaign.title || 'Produit',
      unitPrice: params.campaign.currentPrice || 0,
      quantity: params.quantity,
      totalPrice,
      createdAt: serverTimestamp()
    };

    const firstImage = params.campaign.images?.[0];
    if (firstImage) {
      itemPayload.image = firstImage;
    }

    // itemId stable par campagne (1 commande = 1 item dans notre design)
    await setDoc(doc(db, Collections.ORDERS, orderId, 'items', params.campaign.id), itemPayload, { merge: true });

    return { success: true, orderId };
  } catch (error: any) {
    console.error('❌ Erreur création commande + item:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir les commandes d'un utilisateur
 */
export async function getUserOrders(userId?: string): Promise<{ success: boolean; orders?: Order[]; error?: string }> {
  try {
    const db = getFirebaseDb();
    const uid = userId || getCurrentUserId();
    if (!uid) throw new Error('Utilisateur non connecté');

    const q = query(
      collection(db, Collections.ORDERS),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const orders: Order[] = [];

    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });

    return { success: true, orders };
  } catch (error: any) {
    console.error('❌ Erreur récupération commandes:', error);
    // Fallback (souvent nécessaire si l'index composite n'existe pas encore)
    try {
      const db = getFirebaseDb();
      const uid = userId || getCurrentUserId();
      if (!uid) throw new Error('Utilisateur non connecté');

      const q = query(
        collection(db, Collections.ORDERS),
        where('userId', '==', uid),
        limit(100)
      );

      const snapshot = await getDocs(q);
      const orders: Order[] = [];
      snapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });

      console.warn('⚠️ getUserOrders: fallback sans orderBy (index manquant?)');
      return { success: true, orders };
    } catch (fallbackError: any) {
      return { success: false, error: fallbackError.message || error.message };
    }
  }
}

/**
 * Mettre à jour le statut d'une commande
 */
export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseDb();
    await updateDoc(doc(db, Collections.ORDERS, orderId), {
      status,
      updatedAt: serverTimestamp()
    });

    console.log('✅ Statut commande mis à jour');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur mise à jour statut:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// PANIER
// ============================================

/**
 * Ajouter au panier
 */
export async function addToCart(campaignId: string, quantity = 1): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseDb();
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Utilisateur non connecté');

    // Obtenir les détails de la campagne
    const campaignDoc = await getDoc(doc(db, Collections.CAMPAIGNS, campaignId));
    if (!campaignDoc.exists()) throw new Error('Campagne non trouvée');

    const campaign = campaignDoc.data() as Campaign;

    // Vérifier le stock
    if (campaign.stock < quantity) {
      throw new Error('Stock insuffisant');
    }

    // Ajouter au panier
    const cartItemId = `${userId}_${campaignId}`;
    await setDoc(doc(db, Collections.CART, cartItemId), {
      userId,
      campaignId,
      quantity,
      price: campaign.currentPrice,
      addedAt: serverTimestamp()
    }, { merge: true });

    console.log('✅ Ajouté au panier');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur ajout panier:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir le panier
 */
export async function getCart(): Promise<{ success: boolean; cart?: any[]; error?: string }> {
  try {
    const db = getFirebaseDb();
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Utilisateur non connecté');

    const q = query(
      collection(db, Collections.CART),
      where('userId', '==', userId)
    );

    const snapshot = await getDocs(q);
    const cart: any[] = [];

    for (const docSnap of snapshot.docs) {
      const item = docSnap.data();

      // Obtenir les détails de la campagne
      const campaignDoc = await getDoc(doc(db, Collections.CAMPAIGNS, item.campaignId));
      if (campaignDoc.exists()) {
        cart.push({
          id: docSnap.id,
          ...item,
          campaign: { id: campaignDoc.id, ...campaignDoc.data() }
        });
      }
    }

    return { success: true, cart };
  } catch (error: any) {
    console.error('❌ Erreur récupération panier:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Supprimer du panier
 */
export async function removeFromCart(cartItemId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseDb();
    await deleteDoc(doc(db, Collections.CART, cartItemId));
    console.log('✅ Retiré du panier');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur suppression panier:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Vider le panier
 */
export async function clearCart(): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseDb();
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Utilisateur non connecté');

    const q = query(
      collection(db, Collections.CART),
      where('userId', '==', userId)
    );

    const snapshot = await getDocs(q);

    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    console.log('✅ Panier vidé');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur vidage panier:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// REAL-TIME LISTENERS
// ============================================

/**
 * Écouter les changements de campagnes
 */
export function onCampaignsChange(callback: (campaigns: Campaign[]) => void) {
  const db = getFirebaseDb();
  const q = query(
    collection(db, Collections.CAMPAIGNS),
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const campaigns: Campaign[] = [];
    snapshot.forEach((doc) => {
      campaigns.push({ id: doc.id, ...doc.data() } as Campaign);
    });
    callback(campaigns);
  });
}

/**
 * Écouter les changements du panier
 */
export function onCartChange(callback: (cart: any[]) => void) {
  const db = getFirebaseDb();
  const userId = getCurrentUserId();
  if (!userId) return () => {};

  const q = query(
    collection(db, Collections.CART),
    where('userId', '==', userId)
  );

  return onSnapshot(q, async (snapshot) => {
    const cart: any[] = [];

    for (const docSnap of snapshot.docs) {
      const item = docSnap.data();
      const campaignDoc = await getDoc(doc(db, Collections.CAMPAIGNS, item.campaignId));
      if (campaignDoc.exists()) {
        cart.push({
          id: docSnap.id,
          ...item,
          campaign: { id: campaignDoc.id, ...campaignDoc.data() }
        });
      }
    }

    callback(cart);
  });
}


// ============================================
// VENDOR MANAGEMENT
// ============================================

/**
 * Créer un profil vendeur
 */
export async function createVendorProfile(vendorData: {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  description?: string;
  logo?: string;
}): Promise<{ success: boolean; vendorId?: string; error?: string }> {
  try {
    const db = getFirebaseDb();
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Utilisateur non connecté');

    await setDoc(doc(db, Collections.VENDORS, userId), {
      ...vendorData,
      userId,
      status: 'pending', // En attente de validation admin
      totalSales: 0,
      totalRevenue: 0,
      rating: 0,
      reviewCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Profil vendeur créé');
    return { success: true, vendorId: userId };
  } catch (error: any) {
    console.error('❌ Erreur création profil vendeur:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir le profil vendeur
 */
export async function getVendorProfile(vendorId?: string): Promise<{ success: boolean; vendor?: any; error?: string }> {
  try {
    const db = getFirebaseDb();
    const uid = vendorId || getCurrentUserId();
    if (!uid) throw new Error('ID vendeur requis');

    const docSnap = await getDoc(doc(db, Collections.VENDORS, uid));

    if (docSnap.exists()) {
      return { success: true, vendor: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Profil vendeur non trouvé' };
    }
  } catch (error: any) {
    console.error('❌ Erreur récupération profil vendeur:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Mettre à jour le profil vendeur
 */
export async function updateVendorProfile(data: any): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseDb();
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Utilisateur non connecté');

    await updateDoc(doc(db, Collections.VENDORS, userId), {
      ...data,
      updatedAt: serverTimestamp()
    });

    console.log('✅ Profil vendeur mis à jour');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur mise à jour profil vendeur:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir les campagnes d'un vendeur
 */
export async function getVendorCampaigns(vendorId?: string): Promise<{ success: boolean; campaigns?: Campaign[]; error?: string }> {
  try {
    const db = getFirebaseDb();
    const uid = vendorId || getCurrentUserId();
    if (!uid) throw new Error('ID vendeur requis');

    const q = query(
      collection(db, Collections.CAMPAIGNS),
      where('vendorId', '==', uid),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const campaigns: Campaign[] = [];

    snapshot.forEach((doc) => {
      campaigns.push({ id: doc.id, ...doc.data() } as Campaign);
    });

    return { success: true, campaigns };
  } catch (error: any) {
    console.error('❌ Erreur récupération campagnes vendeur:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir les commandes d'un vendeur
 */
export async function getVendorOrders(vendorId?: string): Promise<{ success: boolean; orders?: Order[]; error?: string }> {
  try {
    const db = getFirebaseDb();
    const uid = vendorId || getCurrentUserId();
    if (!uid) throw new Error('ID vendeur requis');

    const q = query(
      collection(db, Collections.ORDERS),
      where('vendorId', '==', uid),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const orders: Order[] = [];

    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });

    return { success: true, orders };
  } catch (error: any) {
    console.error('❌ Erreur récupération commandes vendeur:', error);
    // Fallback (souvent nécessaire si l'index composite n'existe pas encore)
    try {
      const db = getFirebaseDb();
      const uid = vendorId || getCurrentUserId();
      if (!uid) throw new Error('ID vendeur requis');

      const q = query(
        collection(db, Collections.ORDERS),
        where('vendorId', '==', uid),
        limit(100)
      );

      const snapshot = await getDocs(q);
      const orders: Order[] = [];

      snapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });

      console.warn('⚠️ getVendorOrders: fallback sans orderBy (index manquant?)');
      return { success: true, orders };
    } catch (fallbackError: any) {
      return { success: false, error: fallbackError.message || error.message };
    }
  }
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

/**
 * Obtenir toutes les campagnes en attente de validation
 */
export async function getPendingCampaigns(): Promise<{ success: boolean; campaigns?: Campaign[]; error?: string }> {
  try {
    const db = getFirebaseDb();
    const q = query(
      collection(db, Collections.CAMPAIGNS),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const campaigns: Campaign[] = [];

    snapshot.forEach((doc) => {
      campaigns.push({ id: doc.id, ...doc.data() } as Campaign);
    });

    return { success: true, campaigns };
  } catch (error: any) {
    console.error('❌ Erreur récupération campagnes en attente:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Valider une campagne (admin)
 */
export async function approveCampaign(campaignId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseDb();
    await updateDoc(doc(db, Collections.CAMPAIGNS, campaignId), {
      status: 'active',
      updatedAt: serverTimestamp()
    });

    console.log('✅ Campagne validée');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur validation campagne:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Rejeter une campagne (admin)
 */
export async function rejectCampaign(campaignId: string, reason?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseDb();
    await updateDoc(doc(db, Collections.CAMPAIGNS, campaignId), {
      status: 'cancelled',
      rejectionReason: reason || 'Non conforme',
      updatedAt: serverTimestamp()
    });

    console.log('✅ Campagne rejetée');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur rejet campagne:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir tous les vendeurs en attente de validation
 */
export async function getPendingVendors(): Promise<{ success: boolean; vendors?: any[]; error?: string }> {
  try {
    const db = getFirebaseDb();
    const q = query(
      collection(db, Collections.VENDORS),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const vendors: any[] = [];

    snapshot.forEach((doc) => {
      vendors.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, vendors };
  } catch (error: any) {
    console.error('❌ Erreur récupération vendeurs en attente:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Valider un vendeur (admin)
 */
export async function approveVendor(vendorId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseDb();
    await updateDoc(doc(db, Collections.VENDORS, vendorId), {
      status: 'active',
      approvedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // IMPORTANT: mettre à jour le rôle dans `users` pour que les règles (isVendor) fonctionnent
    await updateDoc(doc(db, Collections.USERS, vendorId), {
      role: 'vendor',
      updatedAt: serverTimestamp()
    });

    console.log('✅ Vendeur validé');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur validation vendeur:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Rejeter un vendeur (admin)
 */
export async function rejectVendor(vendorId: string, reason?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseDb();
    await updateDoc(doc(db, Collections.VENDORS, vendorId), {
      status: 'rejected',
      rejectionReason: reason || 'Non conforme',
      updatedAt: serverTimestamp()
    });

    console.log('✅ Vendeur rejeté');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur rejet vendeur:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir toutes les commandes (admin)
 */
export async function getAllOrders(): Promise<{ success: boolean; orders?: Order[]; error?: string }> {
  try {
    const db = getFirebaseDb();
    const q = query(
      collection(db, Collections.ORDERS),
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    const snapshot = await getDocs(q);
    const orders: Order[] = [];

    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });

    return { success: true, orders };
  } catch (error: any) {
    console.error('❌ Erreur récupération toutes les commandes:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir tous les utilisateurs (admin)
 */
export async function getAllUsers(): Promise<{ success: boolean; users?: any[]; error?: string }> {
  try {
    const db = getFirebaseDb();
    const q = query(
      collection(db, Collections.USERS),
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    const snapshot = await getDocs(q);
    const users: any[] = [];

    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, users };
  } catch (error: any) {
    console.error('❌ Erreur récupération utilisateurs:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir les statistiques globales (admin)
 */
export async function getGlobalStats(): Promise<{ success: boolean; stats?: any; error?: string }> {
  try {
    const db = getFirebaseDb();
    const [campaignsSnap, ordersSnap, usersSnap, vendorsSnap] = await Promise.all([
      getDocs(collection(db, Collections.CAMPAIGNS)),
      getDocs(collection(db, Collections.ORDERS)),
      getDocs(collection(db, Collections.USERS)),
      getDocs(collection(db, Collections.VENDORS))
    ]);

    const stats = {
      totalCampaigns: campaignsSnap.size,
      activeCampaigns: campaignsSnap.docs.filter(doc => doc.data().status === 'active').length,
      pendingCampaigns: campaignsSnap.docs.filter(doc => doc.data().status === 'pending').length,
      totalOrders: ordersSnap.size,
      totalRevenue: ordersSnap.docs.reduce((sum, doc) => sum + (doc.data().totalPrice || 0), 0),
      totalUsers: usersSnap.size,
      totalVendors: vendorsSnap.size,
      activeVendors: vendorsSnap.docs.filter(doc => doc.data().status === 'active').length,
      pendingVendors: vendorsSnap.docs.filter(doc => doc.data().status === 'pending').length
    };

    return { success: true, stats };
  } catch (error: any) {
    console.error('❌ Erreur récupération statistiques:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// HEALTH CHECK FIREBASE / BACKEND
// ============================================

/**
 * Vérifie rapidement que Firestore répond correctement.
 * Utilisé côté admin pour rassurer que le backend est OK.
 */
export async function checkFirebaseHealth(): Promise<{
  success: boolean;
  details?: {
    campaignsReachable: boolean;
    ordersReachable: boolean;
  };
  error?: string;
}> {
  try {
    const db = getFirebaseDb();
    // Essayer de lire une campagne et une commande (sans forcer qu'il y en ait)
    await getDocs(query(collection(db, Collections.CAMPAIGNS), limit(1)));
    await getDocs(query(collection(db, Collections.ORDERS), limit(1)));

    return {
      success: true,
      details: {
        campaignsReachable: true,
        ordersReachable: true
      }
    };
  } catch (error: any) {
    console.error('❌ Firebase health check error:', error);
    return { success: false, error: error.message || 'Erreur inconnue' };
  }
}
