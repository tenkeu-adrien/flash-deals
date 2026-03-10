// ============================================
// SEED DATA - PEUPLER FIREBASE AVEC DES DONNÉES DE TEST
// ============================================

import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getFirebaseDb, Collections } from './config';

/**
 * Créer des campagnes de test
 */
export async function seedCampaigns() {
  const campaigns = [
    {
      vendorId: 'vendor_demo_1',
      title: 'Samsung Galaxy A54 - Noir 128GB',
      description: 'Smartphone Samsung Galaxy A54 5G avec écran Super AMOLED 6.4", processeur Exynos 1380, 6GB RAM, 128GB stockage, triple caméra 50MP + 12MP + 5MP, batterie 5000mAh.',
      images: [
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'
      ],
      originalPrice: 245000,
      currentPrice: 145000,
      discount: 41,
      stock: 50,
      sold: 27,
      category: 'Électronique',
      status: 'active' as const,
      startDate: Timestamp.now(),
      endDate: Timestamp.fromDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)), // +2 jours
      delivery: '2 000 XAF',
      location: 'Douala & Yaoundé',
      views: 1234,
      interested: 234,
      interestedUsers: [],
      averageRating: 4.8,
      reviewCount: 127,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      vendorId: 'vendor_demo_1',
      title: 'iPhone 13 Pro - 256GB Graphite',
      description: 'Apple iPhone 13 Pro avec écran Super Retina XDR 6.1", puce A15 Bionic, système photo Pro triple 12MP, ProRes, ProRAW, autonomie exceptionnelle.',
      images: [
        'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800',
        'https://images.unsplash.com/photo-1632633728024-e1fd4bef561a?w=800'
      ],
      originalPrice: 850000,
      currentPrice: 595000,
      discount: 30,
      stock: 30,
      sold: 18,
      category: 'Électronique',
      status: 'active' as const,
      startDate: Timestamp.now(),
      endDate: Timestamp.fromDate(new Date(Date.now() + 1.5 * 24 * 60 * 60 * 1000)),
      delivery: '3 000 XAF',
      location: 'Douala, Yaoundé, Bafoussam',
      views: 2456,
      interested: 456,
      interestedUsers: [],
      averageRating: 4.9,
      reviewCount: 89,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      vendorId: 'vendor_demo_2',
      title: 'MacBook Air M2 - 13" 256GB',
      description: 'MacBook Air avec puce M2, écran Liquid Retina 13.6", 8GB RAM unifiée, SSD 256GB, autonomie 18h, design ultra-fin.',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800'
      ],
      originalPrice: 1200000,
      currentPrice: 840000,
      discount: 30,
      stock: 15,
      sold: 8,
      category: 'Informatique',
      status: 'active' as const,
      startDate: Timestamp.now(),
      endDate: Timestamp.fromDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)),
      delivery: '5 000 XAF',
      location: 'Douala & Yaoundé',
      views: 3421,
      interested: 567,
      interestedUsers: [],
      averageRating: 5.0,
      reviewCount: 45,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      vendorId: 'vendor_demo_2',
      title: 'Sony WH-1000XM5 - Casque Bluetooth',
      description: 'Casque sans fil à réduction de bruit Sony WH-1000XM5, audio haute résolution, autonomie 30h, charge rapide, confort premium.',
      images: [
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800'
      ],
      originalPrice: 180000,
      currentPrice: 126000,
      discount: 30,
      stock: 40,
      sold: 22,
      category: 'Audio',
      status: 'active' as const,
      startDate: Timestamp.now(),
      endDate: Timestamp.fromDate(new Date(Date.now() + 2.5 * 24 * 60 * 60 * 1000)),
      delivery: '1 500 XAF',
      location: 'Toutes les villes',
      views: 1876,
      interested: 298,
      interestedUsers: [],
      averageRating: 4.7,
      reviewCount: 156,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      vendorId: 'vendor_demo_3',
      title: 'Samsung 55" QLED 4K Smart TV',
      description: 'Téléviseur Samsung QLED 55" 4K UHD, Quantum Processor 4K, HDR10+, Smart TV Tizen, son Dolby Atmos, design ultra-fin.',
      images: [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
        'https://images.unsplash.com/photo-1593359863503-f598b8f5f4d3?w=800'
      ],
      originalPrice: 650000,
      currentPrice: 455000,
      discount: 30,
      stock: 20,
      sold: 11,
      category: 'TV & Vidéo',
      status: 'active' as const,
      startDate: Timestamp.now(),
      endDate: Timestamp.fromDate(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)),
      delivery: '10 000 XAF',
      location: 'Douala & Yaoundé',
      views: 2134,
      interested: 389,
      interestedUsers: [],
      averageRating: 4.6,
      reviewCount: 78,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      vendorId: 'vendor_demo_3',
      title: 'PlayStation 5 - Console + 2 Manettes',
      description: 'Console PlayStation 5 avec lecteur Blu-ray, SSD 825GB ultra-rapide, 2 manettes DualSense, câble HDMI 2.1, support vertical.',
      images: [
        'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800',
        'https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=800'
      ],
      originalPrice: 450000,
      currentPrice: 315000,
      discount: 30,
      stock: 25,
      sold: 19,
      category: 'Gaming',
      status: 'active' as const,
      startDate: Timestamp.now(),
      endDate: Timestamp.fromDate(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)),
      delivery: '5 000 XAF',
      location: 'Douala, Yaoundé, Bafoussam',
      views: 4567,
      interested: 789,
      interestedUsers: [],
      averageRating: 4.9,
      reviewCount: 234,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
  ];

  console.log('🌱 Création des campagnes...');
  const db = getFirebaseDb();
  
  for (const campaign of campaigns) {
    try {
      const docRef = await addDoc(collection(db, Collections.CAMPAIGNS), campaign);
      console.log(`✅ Campagne créée: ${campaign.title} (${docRef.id})`);
    } catch (error) {
      console.error(`❌ Erreur création campagne ${campaign.title}:`, error);
    }
  }

  console.log('✅ Toutes les campagnes ont été créées!');
}

/**
 * Créer des utilisateurs de test
 */
export async function seedUsers() {
  const users = [
    {
      uid: 'user_demo_1',
      email: 'marie.ngo@example.com',
      displayName: 'Marie Ngo',
      photoURL: 'https://i.pravatar.cc/150?img=1',
      role: 'client',
      status: 'active',
      emailVerified: true,
      preferences: ['Électronique', 'Mode', 'Maison'],
      address: {
        street: 'Akwa',
        city: 'Douala',
        region: 'Littoral',
        phone: '+237 6 XX XX XX XX'
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      uid: 'user_demo_2',
      email: 'jean.kamga@example.com',
      displayName: 'Jean Kamga',
      photoURL: 'https://i.pravatar.cc/150?img=2',
      role: 'client',
      status: 'active',
      emailVerified: true,
      preferences: ['Électronique', 'Gaming', 'Sport'],
      address: {
        street: 'Bastos',
        city: 'Yaoundé',
        region: 'Centre',
        phone: '+237 6 XX XX XX XX'
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      uid: 'user_demo_3',
      email: 'fatima.b@example.com',
      displayName: 'Fatima B.',
      photoURL: 'https://i.pravatar.cc/150?img=3',
      role: 'client',
      status: 'active',
      emailVerified: true,
      preferences: ['Mode', 'Beauté', 'Maison'],
      address: {
        street: 'Bonanjo',
        city: 'Douala',
        region: 'Littoral',
        phone: '+237 6 XX XX XX XX'
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
  ];

  console.log('🌱 Création des utilisateurs...');
  const db = getFirebaseDb();
  
  for (const user of users) {
    try {
      await addDoc(collection(db, Collections.USERS), user);
      console.log(`✅ Utilisateur créé: ${user.displayName}`);
    } catch (error) {
      console.error(`❌ Erreur création utilisateur ${user.displayName}:`, error);
    }
  }

  console.log('✅ Tous les utilisateurs ont été créés!');
}

/**
 * Créer des avis de test
 */
export async function seedReviews() {
  const reviews = [
    {
      campaignId: 'campaign_1', // À remplacer par un vrai ID
      userId: 'user_demo_1',
      rating: 5,
      comment: "J'ai économisé 120 000 XAF sur mon smartphone ! Service rapide et fiable.",
      createdAt: serverTimestamp()
    },
    {
      campaignId: 'campaign_1',
      userId: 'user_demo_2',
      rating: 5,
      comment: 'Les deals sont vraiment incroyables. J\'ai acheté 3 produits la semaine dernière.',
      createdAt: serverTimestamp()
    },
    {
      campaignId: 'campaign_1',
      userId: 'user_demo_3',
      rating: 5,
      comment: 'Livraison ultra rapide et produits authentiques. Je recommande à 100%!',
      createdAt: serverTimestamp()
    }
  ];

  console.log('🌱 Création des avis...');
  const db = getFirebaseDb();
  
  for (const review of reviews) {
    try {
      await addDoc(collection(db, Collections.REVIEWS), review);
      console.log(`✅ Avis créé`);
    } catch (error) {
      console.error(`❌ Erreur création avis:`, error);
    }
  }

  console.log('✅ Tous les avis ont été créés!');
}

/**
 * Peupler toute la base de données
 */
export async function seedDatabase() {
  console.log('🌱 DÉBUT DU PEUPLEMENT DE LA BASE DE DONNÉES');
  console.log('='.repeat(50));
  
  try {
    await seedCampaigns();
    console.log('');
    await seedUsers();
    console.log('');
    // await seedReviews(); // Décommenter après avoir les IDs des campagnes
    
    console.log('='.repeat(50));
    console.log('✅ BASE DE DONNÉES PEUPLÉE AVEC SUCCÈS!');
    console.log('');
    console.log('Vous pouvez maintenant:');
    console.log('1. Voir les campagnes sur /client');
    console.log('2. Tester l\'inscription/connexion');
    console.log('3. Ajouter des produits au panier');
  } catch (error) {
    console.error('❌ ERREUR LORS DU PEUPLEMENT:', error);
  }
}
