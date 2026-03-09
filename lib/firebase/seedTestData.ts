// ============================================
// SEED TEST DATA FOR FIREBASE
// ============================================

import { collection, addDoc, setDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db, Collections } from './config';

/**
 * Créer des campagnes de test
 */
export async function seedTestCampaigns() {
  const campaigns = [
    {
      vendorId: 'test-vendor-1',
      title: 'iPhone 15 Pro Max 256GB',
      description: 'Dernier modèle Apple, état neuf, garantie 1 an. Livraison gratuite à Douala et Yaoundé.',
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
        'https://images.unsplash.com/photo-1695048133082-1a20484d2569?w=800'
      ],
      originalPrice: 850000,
      currentPrice: 595000,
      discount: 30,
      stock: 15,
      sold: 8,
      category: 'Électronique',
      status: 'active',
      startDate: Timestamp.now(),
      endDate: Timestamp.fromDate(new Date(Date.now() + 48 * 60 * 60 * 1000)),
      delivery: 'Livraison gratuite à Douala et Yaoundé',
      location: 'Douala, Cameroun',
      views: 245,
      interested: 32,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      vendorId: 'test-vendor-1',
      title: 'Samsung Galaxy S24 Ultra',
      description: 'Flagship Samsung 2024, 12GB RAM, 512GB stockage. Écran Dynamic AMOLED 2X.',
      images: [
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
        'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=800'
      ],
      originalPrice: 750000,
      currentPrice: 525000,
      discount: 30,
      stock: 20,
      sold: 12,
      category: 'Électronique',
      status: 'active',
      startDate: Timestamp.now(),
      endDate: Timestamp.fromDate(new Date(Date.now() + 72 * 60 * 60 * 1000)),
      delivery: 'Livraison gratuite',
      location: 'Yaoundé, Cameroun',
      views: 189,
      interested: 28,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      vendorId: 'test-vendor-2',
      title: 'MacBook Air M2 2024',
      description: 'Ultraportable Apple avec puce M2, 16GB RAM, 512GB SSD. Parfait pour les professionnels.',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800'
      ],
      originalPrice: 1200000,
      currentPrice: 840000,
      discount: 30,
      stock: 8,
      sold: 5,
      category: 'Électronique',
      status: 'active',
      startDate: Timestamp.now(),
      endDate: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
      delivery: 'Livraison sécurisée',
      location: 'Douala, Cameroun',
      views: 156,
      interested: 24,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      vendorId: 'test-vendor-2',
      title: 'AirPods Pro 2ème génération',
      description: 'Écouteurs sans fil Apple avec réduction de bruit active. Boîtier de charge USB-C.',
      images: [
        'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800'
      ],
      originalPrice: 85000,
      currentPrice: 59500,
      discount: 30,
      stock: 30,
      sold: 18,
      category: 'Électronique',
      status: 'active',
      startDate: Timestamp.now(),
      endDate: Timestamp.fromDate(new Date(Date.now() + 48 * 60 * 60 * 1000)),
      delivery: 'Livraison express',
      location: 'Douala, Cameroun',
      views: 312,
      interested: 45,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      vendorId: 'test-vendor-3',
      title: 'PlayStation 5 + 2 Manettes',
      description: 'Console PS5 édition standard avec 2 manettes DualSense et 3 jeux inclus.',
      images: [
        'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800',
        'https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=800'
      ],
      originalPrice: 450000,
      currentPrice: 315000,
      discount: 30,
      stock: 12,
      sold: 7,
      category: 'Électronique',
      status: 'active',
      startDate: Timestamp.now(),
      endDate: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
      delivery: 'Livraison gratuite',
      location: 'Yaoundé, Cameroun',
      views: 278,
      interested: 38,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      vendorId: 'test-vendor-3',
      title: 'Smart TV Samsung 55" 4K',
      description: 'Téléviseur 4K UHD avec HDR, Smart Hub, et assistant vocal intégré.',
      images: [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800'
      ],
      originalPrice: 380000,
      currentPrice: 266000,
      discount: 30,
      stock: 10,
      sold: 4,
      category: 'Électronique',
      status: 'active',
      startDate: Timestamp.now(),
      endDate: Timestamp.fromDate(new Date(Date.now() + 72 * 60 * 60 * 1000)),
      delivery: 'Installation incluse',
      location: 'Douala, Cameroun',
      views: 198,
      interested: 29,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
  ];

  try {
    console.log('🌱 Création des campagnes de test...');
    
    for (const campaign of campaigns) {
      await addDoc(collection(db, Collections.CAMPAIGNS), campaign);
      console.log(`✅ Campagne créée: ${campaign.title}`);
    }
    
    console.log('✅ Toutes les campagnes de test ont été créées!');
    return { success: true, count: campaigns.length };
  } catch (error: any) {
    console.error('❌ Erreur création campagnes:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Créer des vendeurs de test
 */
export async function seedTestVendors() {
  const vendors = [
    {
      userId: 'test-vendor-1',
      businessName: 'TechStore Douala',
      email: 'techstore@example.com',
      phone: '+237 6 XX XX XX XX',
      address: 'Akwa, Douala',
      city: 'Douala',
      businessType: 'Boutique d\'électronique',
      description: 'Spécialiste en produits Apple et Samsung depuis 2015',
      status: 'active',
      totalSales: 156,
      totalRevenue: 45000000,
      rating: 4.8,
      reviewCount: 89,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      userId: 'test-vendor-2',
      businessName: 'Digital World Yaoundé',
      email: 'digitalworld@example.com',
      phone: '+237 6 YY YY YY YY',
      address: 'Bastos, Yaoundé',
      city: 'Yaoundé',
      businessType: 'Grossiste informatique',
      description: 'Importateur officiel de matériel informatique',
      status: 'active',
      totalSales: 234,
      totalRevenue: 78000000,
      rating: 4.9,
      reviewCount: 145,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      userId: 'test-vendor-3',
      businessName: 'Gaming Paradise',
      email: 'gaming@example.com',
      phone: '+237 6 ZZ ZZ ZZ ZZ',
      address: 'Bonanjo, Douala',
      city: 'Douala',
      businessType: 'Boutique gaming',
      description: 'Tout pour les gamers: consoles, jeux, accessoires',
      status: 'active',
      totalSales: 98,
      totalRevenue: 32000000,
      rating: 4.7,
      reviewCount: 67,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      userId: 'test-vendor-4',
      businessName: 'Nouveau Vendeur Test',
      email: 'nouveau@example.com',
      phone: '+237 6 AA AA AA AA',
      address: 'Bépanda, Douala',
      city: 'Douala',
      businessType: 'Boutique',
      description: 'Nouveau vendeur en attente de validation',
      status: 'pending',
      totalSales: 0,
      totalRevenue: 0,
      rating: 0,
      reviewCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
  ];

  try {
    console.log('🌱 Création des vendeurs de test...');
    
    for (const vendor of vendors) {
      await setDoc(doc(db, Collections.VENDORS, vendor.userId), vendor);
      console.log(`✅ Vendeur créé: ${vendor.businessName}`);
    }
    
    console.log('✅ Tous les vendeurs de test ont été créés!');
    return { success: true, count: vendors.length };
  } catch (error: any) {
    console.error('❌ Erreur création vendeurs:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Créer des utilisateurs de test
 */
export async function seedTestUsers() {
  const users = [
    {
      userId: 'test-user-1',
      email: 'client1@example.com',
      displayName: 'Jean Kamga',
      phone: '+237 6 11 11 11 11',
      city: 'Douala',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      userId: 'test-user-2',
      email: 'client2@example.com',
      displayName: 'Marie Ngo',
      phone: '+237 6 22 22 22 22',
      city: 'Yaoundé',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
  ];

  try {
    console.log('🌱 Création des utilisateurs de test...');
    
    for (const user of users) {
      await setDoc(doc(db, Collections.USERS, user.userId), user);
      console.log(`✅ Utilisateur créé: ${user.displayName}`);
    }
    
    console.log('✅ Tous les utilisateurs de test ont été créés!');
    return { success: true, count: users.length };
  } catch (error: any) {
    console.error('❌ Erreur création utilisateurs:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Créer toutes les données de test
 */
export async function seedAllTestData() {
  console.log('🌱 Début du seeding des données de test...');
  
  const results = {
    vendors: await seedTestVendors(),
    campaigns: await seedTestCampaigns(),
    users: await seedTestUsers()
  };
  
  console.log('✅ Seeding terminé!');
  console.log('Résultats:', results);
  
  return results;
}
