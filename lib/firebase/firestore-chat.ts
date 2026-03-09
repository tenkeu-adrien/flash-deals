// ============================================
// SYSTÈME DE CHAT PAR CAMPAGNE
// ============================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from './config';
import { getCurrentUserId } from './auth';

// ============================================
// TYPES
// ============================================

export interface ChatConversation {
  id?: string;
  campaignId: string;
  userId: string;
  campaignTitle: string;
  campaignImage?: string;
  lastMessage?: string;
  lastMessageAt: any;
  unreadByClient: number;
  unreadByAdmin: number;
  createdAt: any;
  updatedAt: any;
}

export interface ChatMessageData {
  id?: string;
  conversationId: string;
  senderId: string;
  senderRole: 'admin' | 'manager' | 'client';
  senderName: string;
  message: string;
  createdAt: any;
}

// ============================================
// GESTION DES CONVERSATIONS
// ============================================

/**
 * Créer ou récupérer une conversation pour une campagne
 */
export async function getOrCreateConversation(
  campaignId: string,
  campaignTitle: string,
  campaignImage?: string
): Promise<{ success: boolean; conversationId?: string; error?: string }> {
  try {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('Utilisateur non connecté');

    const conversationId = `${campaignId}_${userId}`;
    const conversationRef = doc(db, 'chats', conversationId);
    const conversationSnap = await getDoc(conversationRef);

    if (!conversationSnap.exists()) {
      // Créer la conversation
      await setDoc(conversationRef, {
        campaignId,
        userId,
        campaignTitle,
        campaignImage: campaignImage || '',
        lastMessage: '',
        lastMessageAt: serverTimestamp(),
        unreadByClient: 0,
        unreadByAdmin: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    return { success: true, conversationId };
  } catch (error: any) {
    console.error('❌ Erreur création conversation:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoyer un message dans une conversation
 */
export async function sendChatMessage(
  conversationId: string,
  message: string,
  senderRole: 'admin' | 'manager' | 'client',
  senderName: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const senderId = getCurrentUserId();
    if (!senderId) throw new Error('Utilisateur non connecté');

    // Ajouter le message
    const messageData: Omit<ChatMessageData, 'id'> = {
      conversationId,
      senderId,
      senderRole,
      senderName,
      message: message.trim(),
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(
      collection(db, 'chats', conversationId, 'messages'),
      messageData
    );

    // Mettre à jour la conversation
    const updateData: any = {
      lastMessage: message.trim(),
      lastMessageAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Incrémenter le compteur de non-lus
    if (senderRole === 'client') {
      updateData.unreadByAdmin = increment(1);
    } else {
      updateData.unreadByClient = increment(1);
    }

    await updateDoc(doc(db, 'chats', conversationId), updateData);

    console.log('✅ Message envoyé');
    return { success: true, messageId: docRef.id };
  } catch (error: any) {
    console.error('❌ Erreur envoi message:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir les messages d'une conversation
 */
export async function getChatMessages(
  conversationId: string
): Promise<{ success: boolean; messages?: ChatMessageData[]; error?: string }> {
  try {
    const q = query(
      collection(db, 'chats', conversationId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const snapshot = await getDocs(q);
    const messages: ChatMessageData[] = [];

    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as ChatMessageData);
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
export async function markChatAsRead(
  conversationId: string,
  role: 'client' | 'admin'
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData = role === 'client' 
      ? { unreadByClient: 0 }
      : { unreadByAdmin: 0 };

    await updateDoc(doc(db, 'chats', conversationId), updateData);

    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir les conversations d'un client
 */
export async function getUserConversations(
  userId?: string
): Promise<{ success: boolean; conversations?: ChatConversation[]; error?: string }> {
  try {
    const uid = userId || getCurrentUserId();
    if (!uid) throw new Error('Utilisateur non connecté');

    const q = query(
      collection(db, 'chats'),
      where('userId', '==', uid),
      orderBy('lastMessageAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const conversations: ChatConversation[] = [];

    snapshot.forEach((doc) => {
      conversations.push({ id: doc.id, ...doc.data() } as ChatConversation);
    });

    return { success: true, conversations };
  } catch (error: any) {
    console.error('❌ Erreur récupération conversations:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir toutes les conversations (pour admin/manager)
 */
export async function getAllConversations(): Promise<{ 
  success: boolean; 
  conversations?: ChatConversation[]; 
  error?: string 
}> {
  try {
    const q = query(
      collection(db, 'chats'),
      orderBy('lastMessageAt', 'desc'),
      limit(100)
    );

    const snapshot = await getDocs(q);
    const conversations: ChatConversation[] = [];

    snapshot.forEach((doc) => {
      conversations.push({ id: doc.id, ...doc.data() } as ChatConversation);
    });

    return { success: true, conversations };
  } catch (error: any) {
    console.error('❌ Erreur récupération conversations:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Écouter les messages en temps réel
 */
export function onChatMessagesChange(
  conversationId: string,
  callback: (messages: ChatMessageData[]) => void
) {
  const q = query(
    collection(db, 'chats', conversationId, 'messages'),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages: ChatMessageData[] = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as ChatMessageData);
    });
    callback(messages);
  });
}

/**
 * Écouter les conversations en temps réel
 */
export function onConversationsChange(
  userId: string,
  callback: (conversations: ChatConversation[]) => void
) {
  const q = query(
    collection(db, 'chats'),
    where('userId', '==', userId),
    orderBy('lastMessageAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const conversations: ChatConversation[] = [];
    snapshot.forEach((doc) => {
      conversations.push({ id: doc.id, ...doc.data() } as ChatConversation);
    });
    callback(conversations);
  });
}
