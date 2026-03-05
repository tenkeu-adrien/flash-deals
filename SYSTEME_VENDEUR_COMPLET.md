# Système Vendeur Complet - Flash Deals

## ✅ Fonctionnalités Implémentées

### 1. Inscription Vendeur
- **Formulaire en 4 étapes** avec validation
- **Upload de documents** (CNI obligatoire, Registre optionnel)
- **Compression automatique** des images avant upload
- **Création du profil** dans Firebase Firestore
- **Statut initial**: `pending` (en attente de validation admin)

**Fichiers:**
- `components/vendeur/pages/SignupPage.tsx`
- `lib/firebase/firestore.ts` → `createVendorProfile()`

### 2. Création de Campagne
- **Formulaire en 4 étapes**:
  1. Informations de base (titre, description, catégorie)
  2. Upload d'images (max 5, avec compression automatique)
  3. Prix, réduction, stock, durée
  4. Confirmation

- **Compression automatique** des images (1920px max, qualité 80%)
- **Upload progressif** avec barre de progression
- **Validation des données** avant soumission
- **Statut initial**: `pending` (en attente de validation admin)

**Fichiers:**
- `components/vendeur/pages/CreateCampaignPage.tsx`
- `lib/firebase/storage.ts` → `uploadCompressedImage()`
- `lib/firebase/firestore.ts` → `createCampaign()`

### 3. Validation Admin - Vendeurs
- **Liste des vendeurs en attente** de validation
- **Modal de détails** avec toutes les informations
- **Visualisation des documents** (CNI, Registre)
- **Actions**: Valider ou Rejeter (avec raison)
- **Mise à jour du statut** dans Firebase

**Fichiers:**
- `components/admin/pages/VendorsPage.tsx`
- `lib/firebase/firestore.ts` → `getPendingVendors()`, `approveVendor()`, `rejectVendor()`

### 4. Validation Admin - Campagnes
- **Liste des campagnes en attente** de validation
- **Modal de détails** avec images et informations complètes
- **Actions**: Valider ou Rejeter (avec raison)
- **Mise à jour du statut** dans Firebase
- **Publication automatique** après validation

**Fichiers:**
- `components/admin/pages/CampaignsPage.tsx`
- `lib/firebase/firestore.ts` → `getPendingCampaigns()`, `approveCampaign()`, `rejectCampaign()`

## 🗄️ Structure Firebase

### Collections Firestore

#### `vendors`
```javascript
{
  userId: string,
  businessName: string,
  email: string,
  phone: string,
  address: string,
  description: string,
  businessType: string,
  city: string,
  cniUrl: string,
  registreUrl: string,
  status: 'pending' | 'active' | 'rejected',
  totalSales: number,
  totalRevenue: number,
  rating: number,
  reviewCount: number,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  approvedAt: Timestamp (optionnel),
  rejectionReason: string (optionnel)
}
```

#### `campaigns`
```javascript
{
  vendorId: string,
  title: string,
  description: string,
  images: string[],
  originalPrice: number,
  currentPrice: number,
  discount: number,
  stock: number,
  sold: number,
  category: string,
  status: 'pending' | 'active' | 'completed' | 'cancelled',
  startDate: Timestamp,
  endDate: Timestamp,
  delivery: string,
  location: string,
  views: number,
  interested: number,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  rejectionReason: string (optionnel)
}
```

### Storage Firebase

#### Structure des dossiers:
```
/campaigns/{userId}/{timestamp}_{filename}
/vendor-documents/{userId}/{timestamp}_{filename}
```

## 🔧 Fonctions Firebase Disponibles

### Gestion Vendeurs
- `createVendorProfile(vendorData)` - Créer un profil vendeur
- `getVendorProfile(vendorId?)` - Obtenir le profil
- `updateVendorProfile(data)` - Mettre à jour le profil
- `getVendorCampaigns(vendorId?)` - Obtenir les campagnes d'un vendeur
- `getVendorOrders(vendorId?)` - Obtenir les commandes d'un vendeur

### Gestion Campagnes
- `createCampaign(campaignData)` - Créer une campagne
- `getCampaign(campaignId)` - Obtenir une campagne
- `updateCampaign(campaignId, data)` - Mettre à jour
- `getActiveCampaigns(limit)` - Obtenir les campagnes actives

### Admin - Validation
- `getPendingVendors()` - Vendeurs en attente
- `approveVendor(vendorId)` - Valider un vendeur
- `rejectVendor(vendorId, reason)` - Rejeter un vendeur
- `getPendingCampaigns()` - Campagnes en attente
- `approveCampaign(campaignId)` - Valider une campagne
- `rejectCampaign(campaignId, reason)` - Rejeter une campagne
- `getGlobalStats()` - Statistiques globales

### Storage - Images
- `uploadCompressedImage(file, folder, maxWidth, quality)` - Upload avec compression
- `uploadImage(file, folder)` - Upload simple
- `deleteImage(filePath)` - Supprimer une image
- `compressImage(file, maxWidth, quality)` - Compresser une image

## 🚀 Workflow Complet

### Pour un Vendeur:

1. **Inscription**
   - Remplir le formulaire en 4 étapes
   - Upload CNI (obligatoire)
   - Upload Registre de commerce (optionnel)
   - Soumission → Statut: `pending`

2. **Attente de validation**
   - L'admin reçoit la demande
   - Validation sous 24-48h

3. **Création de campagne**
   - Une fois validé, le vendeur peut créer des campagnes
   - Upload des images (compression automatique)
   - Définir prix, stock, durée
   - Soumission → Statut: `pending`

4. **Publication**
   - L'admin valide la campagne
   - Statut passe à `active`
   - La campagne est visible pour les clients

### Pour un Admin:

1. **Validation Vendeurs**
   - Aller sur "Gestion des Commerçants"
   - Voir la liste des vendeurs en attente
   - Cliquer sur "Voir détails"
   - Vérifier les documents (CNI, Registre)
   - Valider ou Rejeter

2. **Validation Campagnes**
   - Aller sur "Gestion des Campagnes"
   - Voir la liste des campagnes en attente
   - Cliquer sur "Détails"
   - Vérifier les images et informations
   - Valider ou Rejeter

## 📝 Configuration Requise

### Firebase Config
Assurez-vous que votre `.env.local` contient:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Vendors - lecture publique, écriture authentifiée
    match /vendors/{vendorId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == vendorId || isAdmin();
    }
    
    // Campaigns - lecture publique, écriture vendeur
    match /campaigns/{campaignId} {
      allow read: if true;
      allow create: if request.auth != null && isVendor();
      allow update: if request.auth.uid == resource.data.vendorId || isAdmin();
    }
    
    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isVendor() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/vendors/$(request.auth.uid));
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Images de campagnes
    match /campaigns/{userId}/{filename} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Documents vendeurs
    match /vendor-documents/{userId}/{filename} {
      allow read: if request.auth != null && 
                    (request.auth.uid == userId || isAdmin());
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return request.auth != null && 
             firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## ✨ Fonctionnalités Clés

### Compression d'Images
- **Automatique** lors de l'upload
- **Redimensionnement** à 1920px max
- **Qualité** ajustable (par défaut 80%)
- **Réduction de taille** jusqu'à 70%

### Validation Multi-Niveaux
- **Vendeur**: Validation admin avant activation
- **Campagne**: Validation admin avant publication
- **Documents**: Vérification CNI obligatoire

### Sécurité
- **Authentication** Firebase requise
- **Règles Firestore** pour contrôle d'accès
- **Règles Storage** pour protection des fichiers
- **Validation côté serveur** des données

## 🎯 Prochaines Étapes

1. **Notifications**
   - Email de confirmation d'inscription
   - Email de validation/rejet
   - Notifications push

2. **Dashboard Vendeur**
   - Statistiques de ventes
   - Gestion des commandes
   - Historique des campagnes

3. **Paiements**
   - Intégration Mobile Money
   - Gestion des commissions
   - Historique des transactions

4. **Analytics**
   - Suivi des performances
   - Rapports de ventes
   - Métriques d'engagement
