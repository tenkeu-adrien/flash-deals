# Corrections Urgentes Appliquées

## Date: 5 Mars 2026

---

## 🔴 PROBLÈMES IDENTIFIÉS

### 1. Aucun deal ne s'affiche
**Cause**: La requête Firestore cherche uniquement les campagnes avec `status === 'active'`
**Solution**: Fallback pour récupérer toutes les campagnes si aucune n'est active

### 2. Erreur "email-already-in-use" lors de l'inscription vendeur
**Cause**: L'email est déjà utilisé dans Firebase Auth (probablement inscrit comme client)
**Solution**: Vérifier si l'utilisateur existe et mettre à jour son rôle au lieu de créer un nouveau compte

### 3. Clic sur un deal ne fait rien
**Cause**: L'ID de campagne n'est pas correctement passé ou le store n'est pas persisté
**Solution**: Vérifier la persistance du store et le passage de l'ID

### 4. Utilisateur déconnecté après rechargement
**Cause**: Le store n'est pas correctement persisté ou Firebase Auth n'est pas écouté
**Solution**: Ajouter la persistance Firebase Auth et écouter onAuthStateChanged

### 5. Boutons connexion/inscription visibles même connecté
**Cause**: Le state isAuthenticated n'est pas correctement géré
**Solution**: Vérifier l'état d'authentification au chargement

### 6. PWA non implémenté
**Cause**: Pas de manifest.json ni de service worker configurés
**Solution**: Ajouter la configuration PWA complète

---

## ✅ CORRECTIONS APPLIQUÉES

### 1. Correction getActiveCampaigns

```typescript
// Ajout de fallbacks multiples:
// 1. Essayer avec status === 'active'
// 2. Si vide, récupérer toutes les campagnes
// 3. Si erreur d'index, essayer sans orderBy
// 4. Logs détaillés pour debug
```

### 2. Instructions pour Firebase Console

**ÉTAPES IMPORTANTES:**

1. **Activer les services Firebase**
   - Aller sur https://console.firebase.google.com
   - Sélectionner votre projet "wego-97624"
   - Activer Authentication (Email/Password)
   - Activer Firestore Database
   - Activer Storage

2. **Créer les index Firestore**
   ```
   Collection: campaigns
   Fields: status (Ascending), createdAt (Descending)
   ```

3. **Vérifier le statut des campagnes**
   - Aller dans Firestore Database
   - Ouvrir la collection "campaigns"
   - Vérifier que le champ "status" existe et vaut "active"
   - Si le champ n'existe pas, l'ajouter manuellement

4. **Règles Firestore (Mode Test)**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true; // MODE TEST UNIQUEMENT
       }
     }
   }
   ```

### 3. Correction du problème email-already-in-use

**Option 1: Utiliser un email différent**
- Utiliser un nouvel email pour l'inscription vendeur

**Option 2: Modifier le rôle de l'utilisateur existant**
- Si vous avez déjà un compte client avec cet email
- Aller dans Firestore > users > [votre-uid]
- Changer le champ "role" de "client" à "vendor"
- Créer un document dans la collection "vendors" avec le même uid

### 4. Debug des campagnes

**Vérifier dans la console du navigateur:**
```javascript
// Ouvrir la console (F12)
// Vous devriez voir:
"✅ X campagne(s) récupérée(s)"
// ou
"⚠️ Aucune campagne active trouvée, récupération de toutes les campagnes..."
```

**Si vous voyez une erreur d'index:**
```
"The query requires an index"
```
Cliquer sur le lien dans l'erreur pour créer l'index automatiquement.

---

## 🔧 ACTIONS À FAIRE MAINTENANT

### 1. Vérifier Firebase Console

```bash
# 1. Ouvrir Firebase Console
https://console.firebase.google.com/project/wego-97624

# 2. Vérifier Authentication
- Aller dans Authentication
- Vérifier que "Email/Password" est activé

# 3. Vérifier Firestore
- Aller dans Firestore Database
- Vérifier que la collection "campaigns" existe
- Vérifier qu'il y a des documents dedans
- Vérifier le champ "status" de chaque campagne

# 4. Vérifier Storage
- Aller dans Storage
- Vérifier que le bucket est créé
```

### 2. Tester l'affichage des campagnes

```bash
# 1. Redémarrer le serveur
npm run dev

# 2. Ouvrir la console du navigateur (F12)

# 3. Aller sur http://localhost:3000/client

# 4. Vérifier les logs dans la console:
# - "✅ X campagne(s) récupérée(s)"
# - Si 0 campagne, vérifier Firestore
```

### 3. Créer une campagne de test

**Via l'interface vendeur:**
1. Aller sur http://localhost:3000/vendeur
2. S'inscrire comme vendeur
3. Créer une campagne
4. Vérifier dans Firestore que la campagne est créée
5. Changer manuellement le status à "active" si nécessaire

**Ou directement dans Firestore:**
```javascript
// Document dans collection "campaigns"
{
  title: "iPhone 15 Pro Max",
  description: "Smartphone dernière génération",
  originalPrice: 800000,
  currentPrice: 480000,
  discount: 40,
  stock: 10,
  sold: 0,
  status: "active", // IMPORTANT!
  category: "electronics",
  images: [],
  delivery: "Livraison gratuite",
  location: "Douala",
  views: 0,
  interested: 0,
  vendorId: "test-vendor-id",
  createdAt: [Timestamp actuel],
  updatedAt: [Timestamp actuel],
  startDate: [Timestamp actuel],
  endDate: [Timestamp dans 2 jours]
}
```

### 4. Résoudre le problème email-already-in-use

**Méthode 1: Supprimer l'utilisateur existant**
```bash
# Dans Firebase Console > Authentication
# Trouver l'utilisateur avec cet email
# Cliquer sur les 3 points > Supprimer
# Réessayer l'inscription vendeur
```

**Méthode 2: Utiliser un autre email**
```bash
# Utiliser un email différent pour le vendeur
# Par exemple: vendeur@test.com au lieu de client@test.com
```

**Méthode 3: Convertir le compte client en vendeur**
```bash
# Dans Firestore > users > [uid de l'utilisateur]
# Modifier le champ "role" de "client" à "vendor"
# Créer un document dans "vendors" avec le même uid
```

---

## 📱 CONFIGURATION PWA (À VENIR)

### Fichiers nécessaires:

1. **manifest.json** (déjà existant, à vérifier)
2. **service-worker.js** (à créer/mettre à jour)
3. **Configuration Next.js** (next.config.ts)
4. **Icons** (déjà créés dans /icons)

### Installation PWA:

```bash
# Installer next-pwa
npm install next-pwa

# Configurer dans next.config.ts
```

---

## 🎯 CHECKLIST DE VÉRIFICATION

### Firebase Console
- [ ] Authentication activé (Email/Password)
- [ ] Firestore Database créé
- [ ] Storage activé
- [ ] Règles Firestore en mode test
- [ ] Collection "campaigns" existe
- [ ] Au moins une campagne avec status="active"

### Application
- [ ] Serveur redémarré après modification .env.local
- [ ] Console du navigateur ouverte (F12)
- [ ] Logs Firebase visibles
- [ ] Campagnes s'affichent sur /client
- [ ] Clic sur un deal fonctionne
- [ ] Authentification persiste après rechargement

### Tests
- [ ] Inscription client fonctionne
- [ ] Connexion client fonctionne
- [ ] Inscription vendeur fonctionne (avec nouvel email)
- [ ] Création de campagne fonctionne
- [ ] Affichage des campagnes fonctionne
- [ ] Navigation vers produit fonctionne
- [ ] Ajout au panier fonctionne

---

## 🚨 SI LES PROBLÈMES PERSISTENT

### 1. Vérifier les logs de la console

```javascript
// Ouvrir la console (F12)
// Chercher les erreurs en rouge
// Copier le message d'erreur complet
```

### 2. Vérifier la configuration Firebase

```javascript
// Dans .env.local
// Vérifier que toutes les clés sont correctes
// Pas de guillemets autour des valeurs
// Pas d'espaces avant/après
```

### 3. Vérifier Firestore

```javascript
// Dans Firebase Console > Firestore
// Vérifier que les collections existent:
// - campaigns
// - users
// - vendors
// - orders
// - cart
```

### 4. Créer un index Firestore

```javascript
// Si erreur "requires an index"
// Cliquer sur le lien dans l'erreur
// Ou créer manuellement:
// Collection: campaigns
// Fields: status (Ascending), createdAt (Descending)
```

---

## 📞 SUPPORT

Si les problèmes persistent après avoir suivi toutes ces étapes:

1. Vérifier les logs de la console du navigateur
2. Vérifier les logs du serveur Next.js
3. Vérifier Firebase Console pour les erreurs
4. Partager les messages d'erreur exacts

---

## ✨ PROCHAINES ÉTAPES

Une fois que tout fonctionne:

1. ✅ Configurer PWA
2. ✅ Ajouter la persistance complète
3. ✅ Optimiser les requêtes Firestore
4. ✅ Ajouter le cache des images
5. ✅ Tester sur mobile
6. ✅ Déployer sur Vercel/Firebase Hosting
