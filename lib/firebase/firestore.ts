// Firebase Firestore Operations
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  onSnapshot,
  Timestamp,
  addDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';
import { getCurrentUserId } from './auth';

// ============================================
// TYPES
// ============================================

export interface Campaign {
  id?: string;
  vendorId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: number;
  stock: number;
  sold: number;
  images: string[];
  startDate: Timestamp;
  endDate: Timestamp;
  status: 'pending' | 'active' | 'completed' | 'rejected';
  views: number;
  interested: number;
  interestedUsers: string[];
  delivery: string;
  location: string;
  createdAt: any;
  updatedAt: any;
}

export interface Order {
  id?: string;
  userId: string;
  vendorId: string;
  campaignId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  deliveryAddress: any;
  createdAt: any;
  updatedAt: any;
}

export interface OrderItem {
  campaignId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
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
// CAMPAGNES
// ============================================

export async function createCampaign(campaignData: Omit<Campaign, 'id'>): Promise<{ success: boolean; campaignId?: string; error?: string }> {
  try {
    const vendorId = getCurrentUserId();
    if (!vendorId) throw new Error('Vendor not logged in');

    const docRef = await addDoc(collection(db, 'campaigns'), {
      ...campaignData,
      vendorId,
      status: 'pending',
      views: 0,
      interested: 0,
      interestedUsers: [],
      sold: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log('✅ Campaign created:', docRef.id);
    return { success: true, campaignId: docRef.id };
  } catch (error: any) {
    console.error('❌ Create campaign error:', error);
    return { success: false, error: error.message };
  }
}

export async function getActiveCampaigns(limitCount = 20): Promise<{ success: boolean; campaigns?: Campaign[]; error?: string }> {
  try {
    const q = query(
      collection(db, 'campaigns'),
      where('status', '==', 'active'),
      where('endDate', '>', Timestamp.now()),
      orderBy('endDate', 'asc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const campaigns: Campaign[] = [];

    snapshot.forEach((doc) => {
      campaigns.push({ id: doc.id, ...doc.data() } as Campaign);
    });

    return { success: true, campaigns };
  } catch (error: any) {
    console.error('❌ Get campaigns error:', error);
    return { success: false, error: error.message };
  }
}

export async function getCampaign(campaignId: string): Promise<{ success: boolean; campaign?: Campaign; error?: string }> {
  try {
    const docSnap = await getDoc(doc(db, 'campaigns', campaignId));

    if (docSnap.exists()) {
      // Increment views
      await updateDoc(doc(db, 'campaigns', campaignId), {
        views: increment(1),
      });

      return { success: true, campaign: { id: docSnap.id, ...docSnap.data() } as Campaign };
    } else {
      return { success: false, error: 'Campaign not found' };
    }
  } catch (error: any) {
    console.error('❌ Get campaign error:', error);
    return { success: false, error: error.message };
  }
}

export async function getVendorCampaigns(vendorId?: string): Promise<{ success: boolean; campaigns?: Campaign[]; error?: string }> {
  try {
    const uid = vendorId || getCurrentUserId();
    if (!uid) throw new Error('Vendor ID required');

    const q = query(
      collection(db, 'campaigns'),
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
    console.error('❌ Get vendor campaigns error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateCampaign(campaignId: string, data: Partial<Campaign>): Promise<{ success: boolean; error?: string }> {
  try {
    await updateDoc(doc(db, 'campaigns', campaignId), {
      ...data,
      updatedAt: serverTimestamp(),
    });

    console.log('✅ Campaign updated');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Update campaign error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteCampaign(campaignId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteDoc(doc(db, 'campaigns', campaignId));
    console.log('✅ Campaign deleted');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Delete campaign error:', error);
    return { success: false, error: error.message };
  }
}

export async function markAsInterested(campaignId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not logged in');

    await updateDoc(doc(db, 'campaigns', campaignId), {
      interested: increment(1),
      interestedUsers: arrayUnion(userId),
    });

    return { success: true };
  } catch (error: any) {
    console.error('❌ Mark interested error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// COMMANDES
// ============================================

export async function createOrder(orderData: Omit<Order, 'id'>): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not logged in');

    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      userId,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Update campaign stock
    if (orderData.campaignId) {
      const totalQuantity = orderData.items.reduce((sum, item) => sum + item.quantity, 0);
      await updateDoc(doc(db, 'campaigns', orderData.campaignId), {
        sold: increment(totalQuantity),
        stock: increment(-totalQuantity),
      });
    }

    console.log('✅ Order created:', docRef.id);
    return { success: true, orderId: docRef.id };
  } catch (error: any) {
    console.error('❌ Create order error:', error);
    return { success: false, error: error.message };
  }
}

export async function getUserOrders(userId?: string): Promise<{ success: boolean; orders?: Order[]; error?: string }> {
  try {
    const uid = userId || getCurrentUserId();
    if (!uid) throw new Error('User not logged in');

    const q = query(
      collection(db, 'orders'),
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
    console.error('❌ Get orders error:', error);
    return { success: false, error: error.message };
  }
}

export async function getVendorOrders(vendorId?: string): Promise<{ success: boolean; orders?: Order[]; error?: string }> {
  try {
    const uid = vendorId || getCurrentUserId();
    if (!uid) throw new Error('Vendor not logged in');

    const q = query(
      collection(db, 'orders'),
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
    console.error('❌ Get vendor orders error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<{ success: boolean; error?: string }> {
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      status,
      updatedAt: serverTimestamp(),
    });

    console.log('✅ Order status updated');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Update order status error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// PANIER
// ============================================

export async function addToCart(campaignId: string, quantity = 1): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not logged in');

    // Get campaign details
    const campaignDoc = await getDoc(doc(db, 'campaigns', campaignId));
    if (!campaignDoc.exists()) throw new Error('Campaign not found');

    const campaign = campaignDoc.data() as Campaign;

    // Check stock
    if (campaign.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    // Add to cart
    await setDoc(
      doc(db, 'cart', `${userId}_${campaignId}`),
      {
        userId,
        campaignId,
        quantity,
        price: campaign.price,
        addedAt: serverTimestamp(),
      },
      { merge: true }
    );

    console.log('✅ Added to cart');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Add to cart error:', error);
    return { success: false, error: error.message };
  }
}

export async function getCart(): Promise<{ success: boolean; cart?: any[]; error?: string }> {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not logged in');

    const q = query(collection(db, 'cart'), where('userId', '==', userId));
    const snapshot = await getDocs(q);

    const cart: any[] = [];

    for (const docSnap of snapshot.docs) {
      const item = docSnap.data();

      // Get campaign details
      const campaignDoc = await getDoc(doc(db, 'campaigns', item.campaignId));
      if (campaignDoc.exists()) {
        cart.push({
          id: docSnap.id,
          ...item,
          campaign: campaignDoc.data(),
        });
      }
    }

    return { success: true, cart };
  } catch (error: any) {
    console.error('❌ Get cart error:', error);
    return { success: false, error: error.message };
  }
}

export async function removeFromCart(cartItemId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteDoc(doc(db, 'cart', cartItemId));
    console.log('✅ Removed from cart');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Remove from cart error:', error);
    return { success: false, error: error.message };
  }
}

export async function clearCart(): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not logged in');

    const q = query(collection(db, 'cart'), where('userId', '==', userId));
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log('✅ Cart cleared');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Clear cart error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// REAL-TIME LISTENERS
// ============================================

export function onCampaignsChange(callback: (campaigns: Campaign[]) => void) {
  const q = query(
    collection(db, 'campaigns'),
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

export function onCartChange(callback: (cart: any[]) => void) {
  const userId = getCurrentUserId();
  if (!userId) return () => {};

  const q = query(collection(db, 'cart'), where('userId', '==', userId));

  return onSnapshot(q, async (snapshot) => {
    const cart: any[] = [];

    for (const docSnap of snapshot.docs) {
      const item = docSnap.data();
      const campaignDoc = await getDoc(doc(db, 'campaigns', item.campaignId));
      if (campaignDoc.exists()) {
        cart.push({
          id: docSnap.id,
          ...item,
          campaign: campaignDoc.data(),
        });
      }
    }

    callback(cart);
  });
}

export function onNotificationsChange(callback: (notifications: Notification[]) => void) {
  const userId = getCurrentUserId();
  if (!userId) return () => {};

  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    where('read', '==', false)
  );

  return onSnapshot(q, (snapshot) => {
    const notifications: Notification[] = [];
    snapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() } as Notification);
    });
    callback(notifications);
  });
}
