// ============================================
// SEED TEST DATA FOR FIREBASE
// ============================================

import { collection, addDoc, setDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getFirebaseDb, Collections } from './config';

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
    const db = getFirebaseDb();
    
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
    const db = getFirebaseDb();
    
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
    const db = getFirebaseDb();
    
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

/**
 * Créer 20 nouvelles campagnes actives avec durée de 5 jours
 */
export async function seedFreshDeals() {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const deals = [
    {
      title: 'iPhone 15 Pro Max 256GB - Titane Naturel',
      description: 'Dernier flagship Apple, puce A17 Pro, caméra 48MP, USB-C, état neuf sous blister.',
      images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800'],
      originalPrice: 950000, currentPrice: 665000, discount: 30,
      stock: 10, sold: 3, category: 'Électronique',
      endDate: Timestamp.fromDate(new Date(now + 5 * day)),
      delivery: 'Livraison gratuite', location: 'Douala', views: 512, interested: 87,
    },
    {
      title: 'Samsung Galaxy S24 Ultra 512GB',
      description: 'Stylet S-Pen intégré, écran Dynamic AMOLED 6.8", 200MP, 12GB RAM.',
      images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800'],
      originalPrice: 850000, currentPrice: 595000, discount: 30,
      stock: 15, sold: 6, category: 'Electronique',
      endDate: Timestamp.fromDate(new Date(now + 5 * day)),
      delivery: 'Livraison gratuite', location: 'Yaounde', views: 389, interested: 62,
    },
    {
      title: 'MacBook Air M3 15" 512GB',
      description: 'Puce Apple M3, 16GB RAM, ecran Liquid Retina 15.3", autonomie 18h.',
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
      originalPrice: 1350000, currentPrice: 945000, discount: 30,
      stock: 8, sold: 2, category: 'Electronique',
      endDate: Timestamp.fromDate(new Date(now + 5 * day)),
      delivery: 'Livraison securisee', location: 'Douala', views: 278, interested: 41,
    },
    {
      title: 'AirPods Pro 2eme generation USB-C',
      description: 'Reduction de bruit active, audio spatial, boitier USB-C, autonomie 30h.',
      images: ['https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800'],
      originalPrice: 95000, currentPrice: 66500, discount: 30,
      stock: 25, sold: 11, category: 'Electronique',
      endDate: Timestamp.fromDate(new Date(now + 5 * day)),
      delivery: 'Livraison express', location: 'Douala', views: 445, interested: 73,
    },
    {
      title: 'PlayStation 5 Slim + 2 Manettes',
      description: 'Console PS5 Slim avec lecteur disque, 2 manettes DualSense et 2 jeux.',
      images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800'],
      originalPrice: 480000, currentPrice: 336000, discount: 30,
      stock: 10, sold: 4, category: 'Gaming',
      endDate: Timestamp.fromDate(new Date(now + 5 * day)),
      delivery: 'Livraison gratuite', location: 'Yaounde', views: 321, interested: 55,
    },
    {
      title: 'Samsung Smart TV 55" QLED 4K',
      description: 'Dalle QLED 4K, HDR10+, Tizen OS, assistant vocal, 4 ports HDMI.',
      images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800'],
      originalPrice: 420000, currentPrice: 294000, discount: 30,
      stock: 7, sold: 3, category: 'Electronique',
      endDate: Timestamp.fromDate(new Date(now + 5 * day)),
      delivery: 'Installation incluse', location: 'Douala', views: 198, interested: 34,
    },
    {
      title: 'iPad Pro 12.9" M2 256GB WiFi',
      description: 'Ecran Liquid Retina XDR, puce M2, compatible Apple Pencil 2, USB-C.',
      images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'],
      originalPrice: 780000, currentPrice: 546000, discount: 30,
      stock: 12, sold: 5, category: 'Electronique',
      endDate: Timestamp.fromDate(new Date(now + 5 * day)),
      delivery: 'Livraison gratuite', location: 'Douala', views: 267, interested: 48,
    },
    {
      title: 'DJI Mini 4 Pro Drone 4K',
      description: 'Drone compact 4K HDR, obstacle avoidance, autonomie 34min, portee 20km.',
      images: ['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800'],
      originalPrice: 650000, currentPrice: 455000, discount: 30,
      stock: 6, sold: 2, category: 'Electronique',
      endDate: Timestamp.fromDate(new Date(now + 5 * day)),
      delivery: 'Livraison securisee', location: 'Yaounde', views: 189, interested: 29,
    },
    {
      title: 'Sony WH-1000XM5 Casque Bluetooth',
      description: 'Meilleure reduction de bruit du marche, 30h autonomie, charge rapide.',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
      originalPrice: 185000, currentPrice: 129500, discount: 30,
      stock: 20, sold: 9, category: 'Electronique',
      endDate: Timestamp.fromDate(new Date(now + 5 * day)),
      delivery: 'Livraison express', location: 'Douala', views: 356, interested: 61,
    },
    {
      title: 'GoPro Hero 12 Black',
      description: 'Camera action 5.3K, stabilisation HyperSmooth 6.0, waterproof 10m.',
      images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'],
      originalPrice: 280000, currentPrice: 196000, discount: 30,
      stock: 15, sold: 7, category: 'Electronique',
      endDate: Timestamp.fromDate(new Date(now + 5 * day)),
      delivery: 'Livraison gratuite', location: 'Douala', views: 234, interested: 42,
    },
    {
      title: 'Apple Watch Series 9 45mm',
      description: 'Montre connectee avec puce S9, double tap, GPS, suivi sante avance.',
      images: ['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800'],
      originalPrice: 320000, currentPrice: 224000, discount: 30,
      stock: 18, sold: 8, category: 'Electronique',
      endDate: Timestamp.fromDate(new Date(now + 5 * day)),
      delivery: 'Livraison express', location: 'Yaounde', views: 412, interested: 68,
    },
    {
      title: 'Xiaomi 14 Ultra 512GB',
      description: 'Camera Leica 1", Snapdragon 8 Gen 3, charge 90W, ecran AMOLED 6.73".',
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'],
      originalPrice: 720000, currentPrice: 504000, discount: 30,
      stock: 14, sold: 6, category: 'Electronique',
      endDate: Timestamp.fromDate(new Date(now + 5 * day)),
      delivery: 'Livraison gratuite', location: 'Douala', views: 298, interested: 51,
    },
    {
      title: 'Nintendo Switch OLED + 5 Jeux',
      description: 'Console hybride ecran OLED 7", 64GB, dock inclus + 5 jeux populaires.',
      images: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800'],
      originalPrice: 250000, currentPrice: 175000, discount: 30,
      stock: 20, sold: 10, category: 'Gaming',
      endDate: Timestamp.fromDate(new Date(now + 5 * day)),
      delivery: 'Livraison gratuite', location: 'Douala', views: 378, interested: 64,
    },
    {
      title: 'Bose SoundLink Max Enceinte',
      description: 'Enceinte portable premium, son 360, IP67, autonomie 20h, Bluetooth 5.3.',
      images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800'],
      originalPrice: 145000, currentPrice: 101500, discount: 30,
      stock: 22, sold: 9, category: 'Electronique',
      endDate: Timestamp.fromDate(new Date(now + 5 * day)),
      delivery: 'Livraison express', location: 'Yaounde', views: 167, interested: 28,
    },
    {
      title: 'Dell XPS 15 Core i9 RTX 4070',
      description: 'Laptop premium 15.6" OLED, Intel i9-13900H, 32GB RAM, 1TB SSD.',
      images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800'],
      originalPrice: 1800000, currentPrice: 1260000, discount: 30,
      stock: 5, sold: 2, category: 'Electronique',
      endDate: Timestamp.fromDate(new Date(now + 5 * day)),
      delivery: 'Livraison securisee', location: 'Douala', views: 145, interested: 23,
    },
    {
      title: 'Canon EOS R6 Mark II + 24-105mm',
      description: 'Hybride plein format 40MP, video 6K RAW, IBIS 8 stops, avec objectif L.',
      images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'],
      originalPrice: 2200000, currentPrice: 1540000, discount: 30,
      stock: 4, sold: 1, category: 'Photo/Video',
      endDate: Timestamp.fromDate(new Date(now + 5 * day)),
      delivery: 'Livraison securisee', location: 'Yaounde', views: 112, interested: 19,
    },
    {
      title: 'Anker PowerBank 26800mAh 140W',
      description: 'Batterie externe 26800mAh, charge 140W, compatible MacBook, 3 ports USB-C.',
      images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800'],
      originalPrice: 65000, currentPrice: 45500, discount: 30,
      stock: 35, sold: 15, category: 'Accessoires',
      endDate: Timestamp.fromDate(new Date(now + 5 * day)),
      delivery: 'Livraison express', location: 'Douala', views: 523, interested: 89,
    },
    {
      title: 'LG UltraWide 34" Curved 144Hz',
      description: 'Moniteur gaming 34" WQHD, dalle IPS, 144Hz, 1ms, HDR400, USB-C 96W.',
      images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800'],
      originalPrice: 480000, currentPrice: 336000, discount: 30,
      stock: 9, sold: 3, category: 'Electronique',
      endDate: Timestamp.fromDate(new Date(now + 5 * day)),
      delivery: 'Installation incluse', location: 'Douala', views: 201, interested: 36,
    },
    {
      title: 'Logitech MX Master 3S + Clavier',
      description: 'Combo souris MX Master 3S + clavier MX Keys S, Bluetooth multi-device.',
      images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800'],
      originalPrice: 120000, currentPrice: 84000, discount: 30,
      stock: 28, sold: 12, category: 'Accessoires',
      endDate: Timestamp.fromDate(new Date(now + 5 * day)),
      delivery: 'Livraison express', location: 'Yaounde', views: 289, interested: 47,
    },
  ];

  try {
    console.log('Creation de 20 nouveaux deals...');
    const db = getFirebaseDb();
    const baseData = {
      vendorId: 'test-vendor-1',
      status: 'active',
      startDate: Timestamp.now(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    for (const deal of deals) {
      await addDoc(collection(db, Collections.CAMPAIGNS), { ...baseData, ...deal });
      console.log('Deal cree: ' + deal.title);
    }

    console.log(deals.length + ' deals crees avec succes!');
    return { success: true, count: deals.length };
  } catch (error: any) {
    console.error('Erreur creation deals:', error);
    return { success: false, error: error.message };
  }
}
