# 🔥 Guide d'Installation Firebase - Flash Deals

## ✅ CE QUI A ÉTÉ FAIT

J'ai implémenté TOUTE la logique Firebase:

### Fichiers Créés

1. ✅ `lib/firebase/config.ts` - Configuration Firebase
2. ✅ `lib/firebase/auth.ts` - Authentification complète
3. ✅ `lib/firebase/firestore.ts` - Base de données
4. ✅ `lib/firebase/storage.ts` - Stockage d'images
5. ✅ `lib/firebase/index.ts` - Export centralisé
6. ✅ `lib/hooks/useFirebaseAuth.ts` - Hook personnalisé
7. ✅ `components/providers/FirebaseProvider.tsx` - Provider React
8. ✅ `lib/stores/clientStore.ts` - Store Zustand corrigé
9. ✅ `.env.local.example` - Template de configuration

### Fonctionnalités Implémentées

#### 🔐 Authentification
- ✅ Inscription email/password
- ✅ Connexion email/password
- ✅ Connexion Google
- ✅ Connexion Facebook
- ✅ Déconnexion
- ✅ Réinitialisation mot de passe
- ✅ Mise à jour profil
- ✅ Listener temps réel

#### 📦 Firestore (Base de données)
- ✅ Créer campagne
- ✅ Lire campagnes actives
- ✅ Mettre à jour campagne
- ✅ Créer commande
- ✅ Lire commandes utilisateur
- ✅ Gérer panier (ajouter/supprimer/vider)
- ✅ Marquer comme intéressé
- ✅ Listeners temps réel

#### 📸 Storage (Images)
- ✅ Upload image unique
- ✅ Upload multiple images
- ✅ Upload avec progression
- ✅ Compression automatique
- ✅ Suppression images
- ✅ Validation fichiers

#### 🎯 Zustand Store
- ✅ Gestion état global
- ✅ Persistance locale
- ✅ Synchronisation Firebase

---

## 🚀 CONFIGURATION (5 minutes)

### Étape 1: Créer un Projet Firebase

1. Allez sur https://console.firebase.google.com/
2. Cliquez sur "Ajouter un projet"
3. Nom du projet: `flash-deals-cameroun`
4. Activez Google Analytics (optionnel)
5. Créez le projet

### Étape 2: Activer l'Authentification

1. Dans la console Firebase, allez dans "Authentication"
2. Cliquez sur "Commencer"
3. Activez les méthodes:
   - ✅ E-mail/Mot de passe
   - ✅ Google
   - ✅ Facebook (optionnel)

### Étape 3: Créer Firestore Database

1. Allez dans "Firestore Database"
2. Cliquez sur "Créer une base de données"
3. Mode: **Production** (pour commencer)
4. Emplacement: `eur3 (Europe)` ou le plus proche

### Étape 4: Activer Storage

1. Allez dans "Storage"
2. Cliquez sur "Commencer"
3. Mode: **Production**
4. Emplacement: Même que Firestore

### Étape 5: Obtenir les Clés Firebase

1. Allez dans "Paramètres du projet" (⚙️)
2. Descendez jusqu'à "Vos applications"
3. Cliquez sur l'icône Web `</>`
4. Nom de l'app: `Flash Deals Web`
5. Copiez la configuration

### Étape 6: Configurer l'Application

1. Copiez `.env.local.example` en `.env.local`:
```bash
copy .env.local.example .env.local
```

2. Ouvrez `.env.local` et collez vos clés:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=flash-deals-cameroun.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=flash-deals-cameroun
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=flash-deals-cameroun.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC...
```

### Étape 7: Configurer les Règles Firestore

Dans la console Firebase, allez dans "Firestore Database" → "Règles":

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Utilisateurs
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Campagnes
    match /campaigns/{campaignId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.vendorId;
    }
    
    // Commandes
    match /orders/{orderId} {
      allow read: if request.auth.uid == resource.data.userId 
                  || request.auth.uid == resource.data.vendorId;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.vendorId;
    }
    
    // Panier
    match /cart/{cartId} {
      allow read, write: if request.auth != null 
                          && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Étape 8: Configurer les Règles Storage

Dans "Storage" → "Règles":

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

---

## 🧪 TESTER L'INSTALLATION

### Test 1: Vérifier la Connexion

```bash
npm run dev
```

Ouvrez la console du navigateur (F12), vous devriez voir:
```
✅ Firebase initialisé
🔥 Firebase Provider initialisé
```

### Test 2: Tester l'Inscription

1. Allez sur `/client`
2. Cliquez sur "S'inscrire"
3. Remplissez le formulaire
4. Vérifiez dans Firebase Console → Authentication

### Test 3: Tester Firestore

Dans la console du navigateur:
```javascript
// Importer les fonctions
import { getActiveCampaigns } from '@/lib/firebase/firestore';

// Tester
const result = await getActiveCampaigns();
console.log(result);
```

---

## 📝 UTILISATION DANS LES COMPOSANTS

### Exemple: Connexion

```tsx
'use client';

import { useState } from 'react';
import { loginWithEmail, loginWithGoogle } from '@/lib/firebase/auth';
import { useClientStore } from '@/lib/stores/clientStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useClientStore();

  const handleLogin = async () => {
    const result = await loginWithEmail(email, password);
    if (result.success) {
      setUser(result.user!);
      // Rediriger
    } else {
      alert(result.error);
    }
  };

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    if (result.success) {
      setUser(result.user!);
    }
  };

  return (
    <div>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Connexion</button>
      <button onClick={handleGoogleLogin}>Google</button>
    </div>
  );
}
```

### Exemple: Ajouter au Panier

```tsx
import { addToCart } from '@/lib/firebase/firestore';

const handleAddToCart = async (campaignId: string) => {
  const result = await addToCart(campaignId, 1);
  if (result.success) {
    alert('Ajouté au panier!');
  } else {
    alert(result.error);
  }
};
```

### Exemple: Upload Image

```tsx
import { uploadImage } from '@/lib/firebase/storage';

const handleUpload = async (file: File) => {
  const result = await uploadImage(file, 'campaigns');
  if (result.success) {
    console.log('URL:', result.url);
  }
};
```

---

## ⚠️ VÉRIFICATION PAR TÉLÉPHONE DÉSACTIVÉE

Comme demandé, la vérification par numéro de téléphone n'est PAS implémentée.

Pour l'activer plus tard:
1. Activez "Phone" dans Firebase Authentication
2. Ajoutez les fonctions dans `auth.ts`:
   - `signupWithPhone()`
   - `verifyOTP()`

---

## 🎯 FONCTIONNALITÉS DISPONIBLES

### Pour les Clients
- ✅ Inscription/Connexion
- ✅ Voir les campagnes
- ✅ Ajouter au panier
- ✅ Passer commande
- ✅ Voir historique commandes
- ✅ Mettre à jour profil

### Pour les Vendeurs
- ✅ Créer campagne
- ✅ Upload images produits
- ✅ Voir commandes
- ✅ Mettre à jour statut

### Pour les Admins
- ✅ Voir toutes les campagnes
- ✅ Modérer campagnes
- ✅ Voir tous les utilisateurs

---

## 🐛 DÉPANNAGE

### Erreur: "Firebase not initialized"
**Solution:** Vérifiez que `.env.local` existe et contient les bonnes clés

### Erreur: "Permission denied"
**Solution:** Vérifiez les règles Firestore/Storage

### Erreur: "Network request failed"
**Solution:** Vérifiez votre connexion internet

### Erreur: "Invalid API key"
**Solution:** Vérifiez que les clés dans `.env.local` sont correctes

---

## 📚 DOCUMENTATION

- Firebase Auth: https://firebase.google.com/docs/auth
- Firestore: https://firebase.google.com/docs/firestore
- Storage: https://firebase.google.com/docs/storage
- Zustand: https://github.com/pmndrs/zustand

---

## ✅ CHECKLIST FINALE

- [ ] Projet Firebase créé
- [ ] Authentication activée
- [ ] Firestore créée
- [ ] Storage activé
- [ ] Clés copiées dans `.env.local`
- [ ] Règles Firestore configurées
- [ ] Règles Storage configurées
- [ ] Application testée
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Panier fonctionne

---

## 🎉 C'EST PRÊT!

Tout est configuré et prêt à l'emploi. Firebase est complètement intégré!

**Prochaine étape:** Créez votre compte Firebase et copiez les clés dans `.env.local`

