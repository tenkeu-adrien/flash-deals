// ============================================
// SYSTÈME DE GESTION DES MANAGERS
// ============================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { getFirebaseDb } from './config';
import { getCurrentUserId } from './auth';

// ============================================
// TYPES
// ============================================

export interface Manager {
  id?: string;
  email: string;
  name: string;
  phone?: string;
  role: 'manager';
  permissions: {
    viewOrders: boolean;
    manageOrders: boolean;
    viewClients: boolean;
    chatWithClients: boolean;
    viewVendors: boolean;
    viewCampaigns: boolean;
    viewFinances: boolean;
    viewAnalytics: boolean;
  };
  status: 'active' | 'inactive';
  createdAt: any;
  createdBy: string;
  updatedAt: any;
}

// ============================================
// GESTION DES MANAGERS (ADMIN UNIQUEMENT)
// ============================================

/**
 * Créer un compte manager
 */
export async function createManager(managerData: {
  email: string;
  name: string;
  phone?: string;
  permissions?: Partial<Manager['permissions']>;
}): Promise<{ success: boolean; managerId?: string; error?: string }> {
  try {
    const db = getFirebaseDb();
    const adminId = getCurrentUserId();
    if (!adminId) throw new Error('Admin non connecté');

    const defaultPermissions: Manager['permissions'] = {
      viewOrders: true,
      manageOrders: true,
      viewClients: true,
      chatWithClients: true,
      viewVendors: true,
      viewCampaigns: true,
      viewFinances: false,
      viewAnalytics: false
    };

    const manager: Omit<Manager, 'id'> = {
      email: managerData.email,
      name: managerData.name,
      phone: managerData.phone,
      role: 'manager',
      permissions: {
        ...defaultPermissions,
        ...managerData.permissions
      },
      status: 'active',
      createdAt: serverTimestamp(),
      createdBy: adminId,
      updatedAt: serverTimestamp()
    };

    const managerId = managerData.email.replace(/[@.]/g, '_');
    await setDoc(doc(db, 'managers', managerId), manager);

    console.log('✅ Manager créé:', managerId);
    return { success: true, managerId };
  } catch (error: any) {
    console.error('❌ Erreur création manager:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir tous les managers
 */
export async function getAllManagers(): Promise<{ 
  success: boolean; 
  managers?: Manager[]; 
  error?: string 
}> {
  try {
    const db = getFirebaseDb();
    const snapshot = await getDocs(collection(db, 'managers'));
    const managers: Manager[] = [];

    snapshot.forEach((docSnap) => {
      managers.push({ id: docSnap.id, ...docSnap.data() } as Manager);
    });

    return { success: true, managers };
  } catch (error: any) {
    console.error('❌ Erreur récupération managers:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir un manager par ID
 */
export async function getManager(managerId: string): Promise<{ 
  success: boolean; 
  manager?: Manager; 
  error?: string 
}> {
  try {
    const db = getFirebaseDb();
    const docSnap = await getDoc(doc(db, 'managers', managerId));

    if (docSnap.exists()) {
      return { 
        success: true, 
        manager: { id: docSnap.id, ...docSnap.data() } as Manager 
      };
    } else {
      return { success: false, error: 'Manager non trouvé' };
    }
  } catch (error: any) {
    console.error('❌ Erreur récupération manager:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Mettre à jour les permissions d'un manager
 */
export async function updateManagerPermissions(
  managerId: string,
  permissions: Partial<Manager['permissions']>
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseDb();
    const adminId = getCurrentUserId();
    if (!adminId) throw new Error('Admin non connecté');

    await updateDoc(doc(db, 'managers', managerId), {
      permissions,
      updatedAt: serverTimestamp()
    });

    console.log('✅ Permissions manager mises à jour');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur mise à jour permissions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Désactiver un manager
 */
export async function deactivateManager(managerId: string): Promise<{ 
  success: boolean; 
  error?: string 
}> {
  try {
    const db = getFirebaseDb();
    await updateDoc(doc(db, 'managers', managerId), {
      status: 'inactive',
      updatedAt: serverTimestamp()
    });

    console.log('✅ Manager désactivé');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur désactivation manager:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Activer un manager
 */
export async function activateManager(managerId: string): Promise<{ 
  success: boolean; 
  error?: string 
}> {
  try {
    const db = getFirebaseDb();
    await updateDoc(doc(db, 'managers', managerId), {
      status: 'active',
      updatedAt: serverTimestamp()
    });

    console.log('✅ Manager activé');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur activation manager:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Supprimer un manager
 */
export async function deleteManager(managerId: string): Promise<{ 
  success: boolean; 
  error?: string 
}> {
  try {
    const db = getFirebaseDb();
    await deleteDoc(doc(db, 'managers', managerId));

    console.log('✅ Manager supprimé');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur suppression manager:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Vérifier si un utilisateur est un manager actif
 */
export async function isActiveManager(userId: string): Promise<boolean> {
  try {
    const db = getFirebaseDb();
    const docSnap = await getDoc(doc(db, 'managers', userId));
    
    if (docSnap.exists()) {
      const manager = docSnap.data() as Manager;
      return manager.status === 'active';
    }
    
    return false;
  } catch (error) {
    console.error('❌ Erreur vérification manager:', error);
    return false;
  }
}

/**
 * Vérifier si un manager a une permission spécifique
 */
export async function hasManagerPermission(
  managerId: string,
  permission: keyof Manager['permissions']
): Promise<boolean> {
  try {
    const result = await getManager(managerId);
    
    if (result.success && result.manager) {
      return result.manager.permissions[permission] === true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Erreur vérification permission:', error);
    return false;
  }
}
