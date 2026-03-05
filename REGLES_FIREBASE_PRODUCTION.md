# 🔒 Règles Firebase pour Production

## ⚠️ Important

Les règles ci-dessous sont pour le **développement**. Pour la production, utilisez des règles plus strictes.

## 📊 Règles Firestore (Production)

Copiez ces règles dans **Firestore Database > Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Fonction helper pour vérifier l'authentification
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Fonction helper pour vérifier si l'utilisateur est admin
    function isAdmin() {
      return isSignedIn() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Fonction helper pour vérifier si l'utilisateur est vendeur
    function isVendor() {
      return isSignedIn() && 
             exists(/databases/$(database)/documents/vendors/$(request.auth.uid));
    }
    
    // Fonction helper pour vérifier si c'est le propriétaire
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // ============================================
    // USERS
    // ============================================
    match /users/{userId} {
      // Lecture: utilisateur lui-même ou admin
      allow read: if isOwner(userId) || isAdmin();
      
      // Création: n'importe qui peut créer son profil
      allow create: if isSignedIn() && isOwner(userId);
      
      // Mise à jour: utilisateur lui-même ou admin
      allow update: if isOwner(userId) || isAdmin();
      
      // Suppression: admin seulement
      allow delete: if isAdmin();
    }
    
    // ============================================
    // VENDORS
    // ============================================
    match /vendors/{vendorId} {
      // Lecture: tout le monde (pour afficher les infos vendeur)
      allow read: if true;
      
      // Création: utilisateur authentifié pour son propre profil
      allow create: if isSignedIn() && isOwner(vendorId);
      
      // Mise à jour: vendeur lui-même ou admin
      allow update: if isOwner(vendorId) || isAdmin();
      
      // Suppression: admin seulement
      allow delete: if isAdmin();
    }
    
    // ============================================
    // CAMPAIGNS
    // ============================================
    match /campaigns/{campaignId} {
      // Lecture: tout le monde (pour afficher les campagnes)
      allow read: if true;
      
      // Création: vendeurs authentifiés seulement
      allow create: if isSignedIn() && isVendor();
      
      // Mise à jour: vendeur propriétaire ou admin
      allow update: if isSignedIn() && 
                      (request.auth.uid == resource.data.vendorId || isAdmin());
      
      // Suppression: vendeur propriétaire ou admin
      allow delete: if isSignedIn() && 
                      (request.auth.uid == resource.data.vendorId || isAdmin());
    }
    
    // ============================================
    // ORDERS
    // ============================================
    match /orders/{orderId} {
      // Lecture: client, vendeur concerné, ou admin
      allow read: if isSignedIn() && 
                    (request.auth.uid == resource.data.userId || 
                     request.auth.uid == resource.data.vendorId || 
                     isAdmin());
      
      // Création: client authentifié
      allow create: if isSignedIn();
      
      // Mise à jour: vendeur concerné ou admin
      allow update: if isSignedIn() && 
                      (request.auth.uid == resource.data.vendorId || isAdmin());
      
      // Suppression: admin seulement
      allow delete: if isAdmin();
    }
    
    // ============================================
    // CART
    // ============================================
    match /cart/{cartItemId} {
      // Lecture: utilisateur propriétaire
      allow read: if isSignedIn() && isOwner(resource.data.userId);
      
      // Création: utilisateur authentifié pour son panier
      allow create: if isSignedIn() && isOwner(request.resource.data.userId);
      
      // Mise à jour: utilisateur propriétaire
      allow update: if isSignedIn() && isOwner(resource.data.userId);
      
      // Suppression: utilisateur propriétaire
      allow delete: if isSignedIn() && isOwner(resource.data.userId);
    }
    
    // ============================================
    // REVIEWS
    // ============================================
    match /reviews/{reviewId} {
      // Lecture: tout le monde
      allow read: if true;
      
      // Création: utilisateur authentifié
      allow create: if isSignedIn();
      
      // Mise à jour: auteur de l'avis ou admin
      allow update: if isSignedIn() && 
                      (request.auth.uid == resource.data.userId || isAdmin());
      
      // Suppression: auteur de l'avis ou admin
      allow delete: if isSignedIn() && 
                      (request.auth.uid == resource.data.userId || isAdmin());
    }
    
    // ============================================
    // NOTIFICATIONS
    // ============================================
    match /notifications/{notificationId} {
      // Lecture: destinataire ou admin
      allow read: if isSignedIn() && 
                    (request.auth.uid == resource.data.userId || isAdmin());
      
      // Création: système ou admin
      allow create: if isAdmin();
      
      // Mise à jour: destinataire (pour marquer comme lu) ou admin
      allow update: if isSignedIn() && 
                      (request.auth.uid == resource.data.userId || isAdmin());
      
      // Suppression: destinataire ou admin
      allow delete: if isSignedIn() && 
                      (request.auth.uid == resource.data.userId || isAdmin());
    }
    
    // ============================================
    // ANALYTICS
    // ============================================
    match /analytics/{document=**} {
      // Lecture: admin seulement
      allow read: if isAdmin();
      
      // Écriture: admin seulement
      allow write: if isAdmin();
    }
  }
}
```

## 📦 Règles Storage (Production)

Copiez ces règles dans **Storage > Rules**:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Fonction helper pour vérifier l'authentification
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Fonction helper pour vérifier si c'est le propriétaire
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // Fonction helper pour vérifier la taille du fichier (max 5MB)
    function isValidSize() {
      return request.resource.size < 5 * 1024 * 1024;
    }
    
    // Fonction helper pour vérifier le type de fichier (images seulement)
    function isImage() {
      return request.resource.contentType.matches('image/.*');
    }
    
    // ============================================
    // IMAGES DE CAMPAGNES
    // ============================================
    match /campaigns/{userId}/{filename} {
      // Lecture: tout le monde (pour afficher les images)
      allow read: if true;
      
      // Écriture: vendeur propriétaire seulement
      allow write: if isOwner(userId) && isImage() && isValidSize();
      
      // Suppression: vendeur propriétaire seulement
      allow delete: if isOwner(userId);
    }
    
    // ============================================
    // DOCUMENTS VENDEURS (CNI, Registre)
    // ============================================
    match /vendor-documents/{userId}/{filename} {
      // Lecture: vendeur propriétaire ou admin
      allow read: if isOwner(userId) || 
                    (isSignedIn() && 
                     firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin');
      
      // Écriture: vendeur propriétaire seulement
      allow write: if isOwner(userId) && isImage() && isValidSize();
      
      // Suppression: vendeur propriétaire seulement
      allow delete: if isOwner(userId);
    }
    
    // ============================================
    // AVATARS UTILISATEURS
    // ============================================
    match /avatars/{userId}/{filename} {
      // Lecture: tout le monde
      allow read: if true;
      
      // Écriture: utilisateur propriétaire seulement
      allow write: if isOwner(userId) && isImage() && isValidSize();
      
      // Suppression: utilisateur propriétaire seulement
      allow delete: if isOwner(userId);
    }
    
    // ============================================
    // LOGOS VENDEURS
    // ============================================
    match /logos/{userId}/{filename} {
      // Lecture: tout le monde
      allow read: if true;
      
      // Écriture: vendeur propriétaire seulement
      allow write: if isOwner(userId) && isImage() && isValidSize();
      
      // Suppression: vendeur propriétaire seulement
      allow delete: if isOwner(userId);
    }
  }
}
```

## 🔧 Règles de Développement (Temporaires)

Pour le développement, vous pouvez utiliser des règles plus permissives:

### Firestore (Développement)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Storage (Développement)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **ATTENTION**: Ces règles permettent à tout le monde de lire et écrire. À utiliser UNIQUEMENT en développement!

## 📋 Checklist de Sécurité

Avant de passer en production:

- [ ] Règles Firestore de production déployées
- [ ] Règles Storage de production déployées
- [ ] Rôle admin configuré dans la collection `users`
- [ ] Validation des données côté serveur
- [ ] Limites de taille de fichiers configurées
- [ ] Types de fichiers autorisés configurés
- [ ] Tests de sécurité effectués

## 🧪 Tester les Règles

Firebase fournit un simulateur de règles:

1. Allez dans **Firestore Database > Rules**
2. Cliquez sur **"Rules Playground"**
3. Testez différents scénarios:
   - Utilisateur non authentifié
   - Utilisateur authentifié
   - Admin
   - Vendeur

## 🎯 Bonnes Pratiques

1. **Toujours valider côté serveur**: Les règles Firebase sont une couche de sécurité, pas la seule
2. **Principe du moindre privilège**: Donnez le minimum de droits nécessaires
3. **Tester régulièrement**: Vérifiez que les règles fonctionnent comme prévu
4. **Surveiller les logs**: Activez les logs d'audit Firebase
5. **Mettre à jour régulièrement**: Adaptez les règles selon l'évolution de l'app

## 📞 Support

Pour plus d'informations:
- [Documentation Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Best Practices](https://firebase.google.com/docs/rules/rules-and-auth)
- [Testing Rules](https://firebase.google.com/docs/rules/unit-tests)

---

**Important**: Passez aux règles de production avant de déployer votre application!
