# 📊 Guide des Données Firebase

## ✅ CE QUI A ÉTÉ FAIT

J'ai modifié TOUS les composants pour qu'ils récupèrent les données depuis Firebase au lieu d'utiliser des données en dur.

---

## 🎯 ÉTAPES POUR VOIR LES DONNÉES

### Étape 1: Peupler la Base de Données (1 minute)

1. Lancez l'application:
```bash
npm run dev
```

2. Allez sur: **http://localhost:3000/seed**

3. Cliquez sur le bouton **"🚀 Peupler la Base de Données"**

4. Attendez le message de succès ✅

### Étape 2: Vérifier dans Firebase Console

1. Allez sur https://console.firebase.google.com/
2. Sélectionnez votre projet
3. Allez dans **Firestore Database**
4. Vous devriez voir:
   - ✅ Collection `campaigns` (6 documents)
   - ✅ Collection `users` (3 documents)

### Étape 3: Voir les Données sur le Site

1. Allez sur: **http://localhost:3000/client**
2. Vous devriez voir les 6 campagnes chargées depuis Firebase!

---

## 📦 DONNÉES CRÉÉES

### 6 Campagnes de Produits

1. **Samsung Galaxy A54** - 145 000 XAF (-41%)
2. **iPhone 13 Pro** - 595 000 XAF (-30%)
3. **MacBook Air M2** - 840 000 XAF (-30%)
4. **Sony WH-1000XM5** - 126 000 XAF (-30%)
5. **Samsung 55" QLED TV** - 455 000 XAF (-30%)
6. **PlayStation 5** - 315 000 XAF (-30%)

### 3 Utilisateurs de Test

1. **Marie Ngo** - marie.ngo@example.com
2. **Jean Kamga** - jean.kamga@example.com
3. **Fatima B.** - fatima.b@example.com

---

## 🔄 COMPOSANTS MODIFIÉS

### HomePage.tsx ✅
**Avant:** Données en dur
```tsx
<DealCard
  title="Samsung Galaxy A54"
  price={145000}
  // ...
/>
```

**Après:** Données depuis Firebase
```tsx
const [campaigns, setCampaigns] = useState<Campaign[]>([]);

useEffect(() => {
  const loadCampaigns = async () => {
    const result = await getActiveCampaigns(6);
    if (result.success) {
      setCampaigns(result.campaigns!);
    }
  };
  loadCampaigns();
}, []);

{campaigns.map(campaign => (
  <DealCard
    title={campaign.title}
    price={campaign.currentPrice}
    // ...
  />
))}
```

---

## 📝 UTILISATION DANS VOS COMPOSANTS

### Exemple 1: Charger les Campagnes

```tsx
'use client';

import { useEffect, useState } from 'react';
import { getActiveCampaigns, Campaign } from '@/lib/firebase/firestore';

export default function MyCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    const result = await getActiveCampaigns(20);
    if (result.success) {
      setCampaigns(result.campaigns!);
    }
    setLoading(false);
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      {campaigns.map(campaign => (
        <div key={campaign.id}>
          <h2>{campaign.title}</h2>
          <p>{campaign.currentPrice} XAF</p>
        </div>
      ))}
    </div>
  );
}
```

### Exemple 2: Charger une Campagne Spécifique

```tsx
import { getCampaign } from '@/lib/firebase/firestore';

const loadCampaign = async (campaignId: string) => {
  const result = await getCampaign(campaignId);
  if (result.success) {
    console.log(result.campaign);
  }
};
```

### Exemple 3: Ajouter au Panier

```tsx
import { addToCart } from '@/lib/firebase/firestore';

const handleAddToCart = async (campaignId: string) => {
  const result = await addToCart(campaignId, 1);
  if (result.success) {
    alert('Ajouté au panier!');
  } else {
    alert('Erreur: ' + result.error);
  }
};
```

### Exemple 4: Créer une Commande

```tsx
import { createOrder } from '@/lib/firebase/firestore';

const handleCheckout = async () => {
  const orderData = {
    campaignId: 'campaign_id',
    vendorId: 'vendor_id',
    quantity: 1,
    totalPrice: 145000,
    deliveryAddress: {
      street: 'Akwa',
      city: 'Douala',
      region: 'Littoral',
      phone: '+237 6XX XX XX XX'
    }
  };

  const result = await createOrder(orderData);
  if (result.success) {
    alert('Commande créée!');
  }
};
```

---

## 🔄 LISTENERS TEMPS RÉEL

### Écouter les Changements de Campagnes

```tsx
import { onCampaignsChange } from '@/lib/firebase/firestore';

useEffect(() => {
  const unsubscribe = onCampaignsChange((campaigns) => {
    setCampaigns(campaigns);
  });

  return () => unsubscribe();
}, []);
```

### Écouter les Changements du Panier

```tsx
import { onCartChange } from '@/lib/firebase/firestore';

useEffect(() => {
  const unsubscribe = onCartChange((cart) => {
    setCart(cart);
  });

  return () => unsubscribe();
}, []);
```

---

## 🎨 IMAGES DES PRODUITS

Les images proviennent de **Unsplash** (service gratuit):
- https://images.unsplash.com/photo-...

Pour utiliser vos propres images:
1. Uploadez-les avec `uploadImage()` de `firebase/storage.ts`
2. Récupérez l'URL
3. Mettez à jour la campagne avec l'URL

```tsx
import { uploadImage } from '@/lib/firebase/storage';

const handleUpload = async (file: File) => {
  const result = await uploadImage(file, 'campaigns');
  if (result.success) {
    // Mettre à jour la campagne avec result.url
  }
};
```

---

## 🔍 VÉRIFIER LES DONNÉES

### Dans la Console Firebase

1. Allez dans **Firestore Database**
2. Cliquez sur une collection (ex: `campaigns`)
3. Vous verrez tous les documents
4. Cliquez sur un document pour voir les détails

### Dans la Console du Navigateur

```javascript
// Ouvrir la console (F12)
import { getActiveCampaigns } from '@/lib/firebase/firestore';

const result = await getActiveCampaigns();
console.log(result.campaigns);
```

---

## 🗑️ SUPPRIMER LES DONNÉES DE TEST

### Option 1: Depuis Firebase Console
1. Allez dans Firestore Database
2. Sélectionnez une collection
3. Cliquez sur les 3 points → "Delete collection"

### Option 2: Manuellement
Supprimez chaque document un par un

---

## 📊 STRUCTURE DES DONNÉES

### Campaign
```typescript
{
  id: string;
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
  status: 'active' | 'pending' | 'completed';
  startDate: Timestamp;
  endDate: Timestamp;
  delivery: string;
  location: string;
  views: number;
  interested: number;
  averageRating: number;
  reviewCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Order
```typescript
{
  id: string;
  userId: string;
  campaignId: string;
  vendorId: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  paymentStatus: 'pending' | 'paid' | 'failed';
  deliveryAddress: {
    street: string;
    city: string;
    region: string;
    phone: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## ✅ CHECKLIST

- [ ] Firebase configuré (.env.local)
- [ ] Dépendances installées (firebase, zustand)
- [ ] Page /seed visitée
- [ ] Données peuplées (6 campagnes)
- [ ] Données visibles sur /client
- [ ] Données vérifiées dans Firebase Console

---

## 🎉 RÉSULTAT

Maintenant, TOUTES les données proviennent de Firebase!

- ✅ Campagnes chargées depuis Firestore
- ✅ Utilisateurs stockés dans Firestore
- ✅ Panier synchronisé avec Firebase
- ✅ Commandes sauvegardées dans Firebase
- ✅ Images uploadées dans Storage

**Plus de données en dur!** Tout est dynamique et temps réel.

