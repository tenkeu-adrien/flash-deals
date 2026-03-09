// ============================================
// SYSTÈME DE PAIEMENT ET GESTION DES COMMANDES
// ============================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  arrayUnion
} from 'firebase/firestore';
import { db, Collections } from './config';
import { getCurrentUserId } from './auth';

// ============================================
// TYPES
// ============================================

export interface PaymentMethod {
  type: 'orange_money' | 'mobile_money';
  merchantCode: string;
}

export interface PaymentSettings {
  id?: string;
  orangeMoneyCode: string;
  mobileMoneyCode: string;
  updatedAt: any;
  updatedBy: string;
}

export interface OrderWithPayment {
  id?: string;
  userId: string;
  campaignId: string;
  vendorId: string;
  quantity: number;
  totalPrice: number;
  
  // Statuts de commande
  status: 'pending_validation' | 'payment_confirmed' | 'in_delivery' | 'delivered' | 'cancelled';
  
  // Informations de paiement
  paymentMethod: 'orange_money' | 'mobile_money' | 'cash_on_delivery';
  merchantCode?: string; // Seulement pour orange_money et mobile_money
  paymentProof?: string;
  
  // Livraison
  deliveryAddress: {
    street: string;
    city: string;
    region: string;
    postalCode?: string;
    phone: string;
  };
  deliveryNotes?: string;
  
  // Timestamps
  createdAt: any;
  validatedAt?: any;
  paymentConfirmedAt?: any;
  deliveredAt?: any;
  updatedAt: any;
}

export interface ChatMessage {
  id?: string;
  orderId: string;
  senderId: string;
  senderRole: 'admin' | 'manager' | 'client';
  senderName: string;
  message: string;
  read: boolean;
  readBy: string[]; // IDs des utilisateurs qui ont lu
  createdAt: any;
}

export interface VendorSalesReport {
  vendorId: string;
  vendorName: string;
  totalOrders: number;
  totalSales: number;
  orders: OrderWithPayment[];
}

export interface SavedAddress {
  id?: string;
  userId: string;
  label: string; // "Maison", "Bureau", etc.
  street: string;
  city: string;
  region: string;
  postalCode?: string;
  phone: string;
  isDefault: boolean;
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

// ============================================
// PARAMÈTRES DE PAIEMENT (ADMIN)
// ============================================

/**
 * Définir ou mettre à jour les codes marchands
 */
export async function setPaymentSettings(
  orangeMoneyCode: string,
  mobileMoneyCode: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const adminId = getCurrentUserId();
    if (!adminId) throw new Error('Admin non connecté');

    await updateDoc(doc(db, 'settings', 'payment'), {
      orangeMoneyCode,
      mobileMoneyCode,
      updatedAt: serverTimestamp(),
      updatedBy: adminId
    });

    console.log('✅ Codes marchands mis à jour');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur mise à jour codes marchands:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir les codes marchands
 */
export async function getPaymentSettings(): Promise<{ 
  success: boolean; 
  settings?: PaymentSettings; 
  error?: string 
}> {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'payment'));
    
    if (docSnap.exists()) {
      return { 
        success: true, 
        settings: { id: docSnap.id, ...docSnap.data() } as PaymentSettings 
      };
    } else {
      // Valeurs par défaut
      return { 
        success: true, 
        settings: {
          orangeMoneyCode: 'OM-MERCHANT-001',
          mobileMoneyCode: 'MM-MERCHANT-001',
          updatedAt: null,
          updatedBy: ''
        }
      };
    }
  } catch (error: any) {
    console.error('❌ Erreur récupération codes marchands:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// CRÉATION DE COMMANDE AVEC PAIEMENT
// ============================================

/**
 * Créer une commande avec choix du moyen de paiement
 */
export async function createOrderWithPayment(params: {
  campaignId: string;
  vendorId: string;
  quantity: number;
  totalPrice: number;
  paymentMethod: 'orange_money' | 'mobile_money' | 'cash_on_delivery';
  deliveryAddress: OrderWithPayment['deliveryAddress'];
  deliveryNotes?: string;
}): Promise<{ 
  success: boolean; 
  orderId?: string; 
  merchantCode?: string;
  error?: string 
}> {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Utilisateur non connecté');

    let merchantCode: string | undefined;
    let initialStatus: OrderWithPayment['status'];

    // Déterminer le statut initial et le code marchand
    if (params.paymentMethod === 'cash_on_delivery') {
      // Paiement à la livraison : commande en attente directement
      initialStatus = 'payment_confirmed';
      merchantCode = undefined;
    } else {
      // Orange Money ou Mobile Money : validation requise
      initialStatus = 'pending_validation';
      
      // Récupérer le code marchand approprié
      const paymentSettings = await getPaymentSettings();
      if (!paymentSettings.success || !paymentSettings.settings) {
        throw new Error('Impossible de récupérer les codes marchands');
      }

      merchantCode = params.paymentMethod === 'orange_money' 
        ? paymentSettings.settings.orangeMoneyCode
        : paymentSettings.settings.mobileMoneyCode;
    }

    // Créer la commande
    const orderData: any = {
      userId,
      campaignId: params.campaignId,
      vendorId: params.vendorId,
      quantity: params.quantity,
      totalPrice: params.totalPrice,
      status: initialStatus,
      paymentMethod: params.paymentMethod,
      deliveryAddress: params.deliveryAddress,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Ajouter le code marchand seulement si nécessaire
    if (merchantCode) {
      orderData.merchantCode = merchantCode;
    }

    // Ajouter les notes de livraison si présentes
    if (params.deliveryNotes) {
      orderData.deliveryNotes = params.deliveryNotes;
    }

    // Si paiement à la livraison, marquer comme confirmé
    if (params.paymentMethod === 'cash_on_delivery') {
      orderData.paymentConfirmedAt = serverTimestamp();
    }

    const docRef = await addDoc(collection(db, Collections.ORDERS), orderData);

    console.log('✅ Commande créée:', docRef.id);
    return { 
      success: true, 
      orderId: docRef.id,
      merchantCode 
    };
  } catch (error: any) {
    console.error('❌ Erreur création commande:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// VALIDATION ET GESTION DES COMMANDES (ADMIN)
// ============================================

/**
 * Valider une commande (admin confirme qu'il a reçu le paiement)
 */
export async function validateOrderPayment(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const adminId = getCurrentUserId();
    if (!adminId) throw new Error('Admin non connecté');

    await updateDoc(doc(db, Collections.ORDERS, orderId), {
      status: 'payment_confirmed',
      paymentConfirmedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Paiement validé pour commande:', orderId);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur validation paiement:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Marquer une commande comme en livraison
 */
export async function markOrderInDelivery(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateDoc(doc(db, Collections.ORDERS, orderId), {
      status: 'in_delivery',
      updatedAt: serverTimestamp()
    });

    console.log('✅ Commande en livraison:', orderId);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Marquer une commande comme livrée
 */
export async function markOrderDelivered(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateDoc(doc(db, Collections.ORDERS, orderId), {
      status: 'delivered',
      deliveredAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Commande livrée:', orderId);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir les commandes en attente de validation
 */
export async function getPendingValidationOrders(): Promise<{ 
  success: boolean; 
  orders?: OrderWithPayment[]; 
  error?: string 
}> {
  try {
    const q = query(
      collection(db, Collections.ORDERS),
      where('status', '==', 'pending_validation'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const orders: OrderWithPayment[] = [];

    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as OrderWithPayment);
    });

    return { success: true, orders };
  } catch (error: any) {
    console.error('❌ Erreur:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir les commandes par statut
 */
export async function getOrdersByStatus(
  status: OrderWithPayment['status']
): Promise<{ success: boolean; orders?: OrderWithPayment[]; error?: string }> {
  try {
    const q = query(
      collection(db, Collections.ORDERS),
      where('status', '==', status),
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    const snapshot = await getDocs(q);
    const orders: OrderWithPayment[] = [];

    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as OrderWithPayment);
    });

    return { success: true, orders };
  } catch (error: any) {
    console.error('❌ Erreur:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// CHAT ADMIN-CLIENT
// ============================================

/**
 * Envoyer un message dans le chat d'une commande
 */
export async function sendOrderMessage(
  orderId: string,
  message: string,
  senderRole: 'admin' | 'manager' | 'client',
  senderName: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const senderId = getCurrentUserId();
    if (!senderId) throw new Error('Utilisateur non connecté');

    const messageData: Omit<ChatMessage, 'id'> = {
      orderId,
      senderId,
      senderRole,
      senderName,
      message: message.trim(),
      read: false,
      readBy: [senderId], // L'expéditeur a déjà "lu" son propre message
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(
      collection(db, Collections.ORDERS, orderId, 'messages'),
      messageData
    );

    console.log('✅ Message envoyé');
    return { success: true, messageId: docRef.id };
  } catch (error: any) {
    console.error('❌ Erreur envoi message:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir les messages d'une commande
 */
export async function getOrderMessages(
  orderId: string
): Promise<{ success: boolean; messages?: ChatMessage[]; error?: string }> {
  try {
    const q = query(
      collection(db, Collections.ORDERS, orderId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const snapshot = await getDocs(q);
    const messages: ChatMessage[] = [];

    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as ChatMessage);
    });

    return { success: true, messages };
  } catch (error: any) {
    console.error('❌ Erreur récupération messages:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Marquer les messages comme lus
 */
export async function markMessagesAsRead(
  orderId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const messagesQuery = query(
      collection(db, Collections.ORDERS, orderId, 'messages')
    );
    
    const snapshot = await getDocs(messagesQuery);
    
    const promises = snapshot.docs.map(async (docSnap) => {
      const message = docSnap.data() as ChatMessage;
      
      // Ne marquer que si l'utilisateur n'a pas déjà lu
      if (!message.readBy?.includes(userId)) {
        await updateDoc(docSnap.ref, {
          readBy: arrayUnion(userId),
          read: true
        });
      }
    });

    await Promise.all(promises);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir tous les chats (pour l'admin)
 */
export async function getAllOrderChats(): Promise<{ 
  success: boolean; 
  chats?: Array<{
    orderId: string;
    lastMessage?: ChatMessage;
    unreadCount: number;
  }>; 
  error?: string 
}> {
  try {
    const ordersSnapshot = await getDocs(collection(db, Collections.ORDERS));
    const chats = [];

    for (const orderDoc of ordersSnapshot.docs) {
      const messagesQuery = query(
        collection(db, Collections.ORDERS, orderDoc.id, 'messages'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );

      const messagesSnapshot = await getDocs(messagesQuery);
      const lastMessage = messagesSnapshot.docs[0]?.data() as ChatMessage | undefined;

      // Compter les messages non lus par l'admin
      const allMessagesSnapshot = await getDocs(
        collection(db, Collections.ORDERS, orderDoc.id, 'messages')
      );
      
      const adminId = getCurrentUserId();
      const unreadCount = allMessagesSnapshot.docs.filter(doc => {
        const msg = doc.data() as ChatMessage;
        return !msg.readBy?.includes(adminId || '');
      }).length;

      chats.push({
        orderId: orderDoc.id,
        lastMessage,
        unreadCount
      });
    }

    return { success: true, chats };
  } catch (error: any) {
    console.error('❌ Erreur:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// GESTION DES ADRESSES DE LIVRAISON
// ============================================

/**
 * Enregistrer une adresse de livraison
 */
export async function saveDeliveryAddress(
  addressData: Omit<SavedAddress, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; addressId?: string; error?: string }> {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Utilisateur non connecté');

    // Si c'est l'adresse par défaut, retirer le flag des autres
    if (addressData.isDefault) {
      const existingAddresses = await getDocs(
        query(
          collection(db, 'addresses'),
          where('userId', '==', userId),
          where('isDefault', '==', true)
        )
      );

      const updatePromises = existingAddresses.docs.map(doc =>
        updateDoc(doc.ref, { isDefault: false })
      );

      await Promise.all(updatePromises);
    }

    const docRef = await addDoc(collection(db, 'addresses'), {
      ...addressData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    console.log('✅ Adresse enregistrée');
    return { success: true, addressId: docRef.id };
  } catch (error: any) {
    console.error('❌ Erreur enregistrement adresse:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir les adresses d'un utilisateur
 */
export async function getUserAddresses(userId?: string): Promise<{ 
  success: boolean; 
  addresses?: SavedAddress[]; 
  error?: string 
}> {
  try {
    const uid = userId || getCurrentUserId();
    if (!uid) throw new Error('Utilisateur non connecté');

    const q = query(
      collection(db, 'addresses'),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const addresses: SavedAddress[] = [];

    snapshot.forEach((doc) => {
      addresses.push({ id: doc.id, ...doc.data() } as SavedAddress);
    });

    return { success: true, addresses };
  } catch (error: any) {
    console.error('❌ Erreur récupération adresses:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Mettre à jour une adresse
 */
export async function updateDeliveryAddress(
  addressId: string,
  updates: Partial<Omit<SavedAddress, 'id' | 'userId' | 'createdAt'>>
): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Utilisateur non connecté');

    // Si on définit comme adresse par défaut, retirer le flag des autres
    if (updates.isDefault) {
      const existingAddresses = await getDocs(
        query(
          collection(db, 'addresses'),
          where('userId', '==', userId),
          where('isDefault', '==', true)
        )
      );

      const updatePromises = existingAddresses.docs
        .filter(doc => doc.id !== addressId)
        .map(doc => updateDoc(doc.ref, { isDefault: false }));

      await Promise.all(updatePromises);
    }

    await updateDoc(doc(db, 'addresses', addressId), {
      ...updates,
      updatedAt: serverTimestamp()
    });

    console.log('✅ Adresse mise à jour');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur mise à jour adresse:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Supprimer une adresse
 */
export async function deleteDeliveryAddress(addressId: string): Promise<{ 
  success: boolean; 
  error?: string 
}> {
  try {
    await deleteDoc(doc(db, 'addresses', addressId));
    console.log('✅ Adresse supprimée');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur suppression adresse:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// RAPPORTS DE VENTES PAR VENDEUR
// ============================================

/**
 * Obtenir le rapport de ventes pour un vendeur (sans commission)
 */
export async function getVendorSalesReport(
  vendorId: string,
  startDate?: Date,
  endDate?: Date
): Promise<{ success: boolean; report?: VendorSalesReport; error?: string }> {
  try {
    // Récupérer toutes les commandes livrées du vendeur
    let q = query(
      collection(db, Collections.ORDERS),
      where('vendorId', '==', vendorId),
      where('status', '==', 'delivered')
    );

    const snapshot = await getDocs(q);
    let orders: OrderWithPayment[] = [];

    snapshot.forEach((doc) => {
      const order = { id: doc.id, ...doc.data() } as OrderWithPayment;
      
      // Filtrer par date si spécifié
      if (startDate || endDate) {
        const orderDate = order.deliveredAt?.toDate();
        if (orderDate) {
          if (startDate && orderDate < startDate) return;
          if (endDate && orderDate > endDate) return;
        }
      }
      
      orders.push(order);
    });

    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Récupérer le nom du vendeur
    const vendorDoc = await getDoc(doc(db, 'vendors', vendorId));
    const vendorName = vendorDoc.exists() 
      ? vendorDoc.data().businessName || 'Vendeur'
      : 'Vendeur';

    const report: VendorSalesReport = {
      vendorId,
      vendorName,
      totalOrders,
      totalSales,
      orders
    };

    return { success: true, report };
  } catch (error: any) {
    console.error('❌ Erreur rapport vendeur:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir les rapports de tous les vendeurs
 */
export async function getAllVendorsSalesReports(
  startDate?: Date,
  endDate?: Date
): Promise<{ success: boolean; reports?: VendorSalesReport[]; error?: string }> {
  try {
    // Récupérer tous les vendeurs actifs
    const vendorsSnapshot = await getDocs(
      query(collection(db, 'vendors'), where('status', '==', 'active'))
    );

    const reports: VendorSalesReport[] = [];

    for (const vendorDoc of vendorsSnapshot.docs) {
      const result = await getVendorSalesReport(
        vendorDoc.id,
        startDate,
        endDate
      );
      
      if (result.success && result.report) {
        reports.push(result.report);
      }
    }

    // Trier par total des ventes (décroissant)
    reports.sort((a, b) => b.totalSales - a.totalSales);

    return { success: true, reports };
  } catch (error: any) {
    console.error('❌ Erreur rapports vendeurs:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir le nombre de commandes par vendeur
 */
export async function getOrdersCountByVendor(): Promise<{ 
  success: boolean; 
  counts?: Record<string, number>; 
  error?: string 
}> {
  try {
    const snapshot = await getDocs(collection(db, Collections.ORDERS));
    const counts: Record<string, number> = {};

    snapshot.forEach((doc) => {
      const order = doc.data() as OrderWithPayment;
      if (order.vendorId) {
        counts[order.vendorId] = (counts[order.vendorId] || 0) + 1;
      }
    });

    return { success: true, counts };
  } catch (error: any) {
    console.error('❌ Erreur:', error);
    return { success: false, error: error.message };
  }
}
