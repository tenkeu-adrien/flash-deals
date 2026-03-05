# 🧪 Guide de Test Complet - Flash Deals

## 📋 Prérequis

Avant de commencer les tests, assurez-vous que:

- [x] Fichier `.env.local` existe avec les bonnes clés
- [x] Firebase Authentication activée (Email/Password)
- [x] Firestore Database créée
- [x] Storage activé
- [x] Règles Firestore publiées
- [x] Règles Storage publiées
- [x] Serveur Next.js démarré (`npm run dev`)

## 🎯 Tests à Effectuer

### Test 1: Vérification de l'Initialisation Firebase

**Objectif**: Vérifier que Firebase est correctement initialisé

**Étapes**:
1. Ouvrez `http://localhost:3000`
2. Appuyez sur F12 pour ouvrir la console
3. Vérifiez les messages

**Résultat attendu**:
```
✅ Firebase initialisé
```

**Résultat à éviter**:
```
❌ Firebase: Error (auth/api-key-not-valid)
❌ Firebase: Error (auth/configuration-not-found)
```

---

### Test 2: Inscription Vendeur

**Objectif**: Créer un compte vendeur complet

**Étapes**:

#### Étape 1: Informations Personnelles
1. Allez sur `http://localhost:3000/vendeur`
2. Cliquez sur "Devenir Partenaire"
3. Remplissez:
   - Nom complet: `Jean Kamga`
   - Email: `jean.kamga@test.cm`
   - Téléphone: `6 77 88 99 00`
   - Mot de passe: `Test1234!`
4. Cliquez sur "Continuer"

#### Étape 2: Informations Entreprise
1. Remplissez:
   - Nom entreprise: `TechStore Douala`
   - Type: `Boutique`
   - Ville: `Douala`
   - Adresse: `Akwa, Rue de la Joie`
   - Description: `Vente de produits électroniques`
2. Cliquez sur "Continuer"

#### Étape 3: Documents
1. Uploadez une image pour la CNI (obligatoire)
2. Uploadez une image pour le Registre (optionnel)
3. Cliquez sur "Terminer"

**Résultat attendu**:
- ✅ Message "Inscription réussie!"
- ✅ Compte créé dans Firebase Authentication
- ✅ Profil vendeur créé dans Firestore (`vendors` collection)
- ✅ Documents uploadés dans Storage (`vendor-documents`)

**Vérification dans Firebase**:
1. Authentication > Users: Nouveau utilisateur visible
2. Firestore > vendors: Document avec `status: 'pending'`
3. Storage > vendor-documents: Images uploadées

---

### Test 3: Validation Admin - Vendeur

**Objectif**: Valider un vendeur en attente

**Étapes**:
1. Allez sur `http://localhost:3000/admin`
2. Connectez-vous avec un compte admin
3. Allez dans "Gestion des Commerçants"
4. Cliquez sur "Voir détails" pour le vendeur en attente
5. Vérifiez les documents (CNI, Registre)
6. Cliquez sur "Valider le vendeur"

**Résultat attendu**:
- ✅ Message "Vendeur validé avec succès!"
- ✅ Statut passe à `active` dans Firestore
- ✅ Vendeur disparaît de la liste "en attente"

**Vérification dans Firebase**:
- Firestore > vendors > {vendorId}: `status: 'active'`

---

### Test 4: Connexion Vendeur

**Objectif**: Se connecter avec le compte vendeur validé

**Étapes**:
1. Allez sur `http://localhost:3000/vendeur`
2. Cliquez sur "Se connecter"
3. Entrez:
   - Email: `jean.kamga@test.cm`
   - Mot de passe: `Test1234!`
4. Cliquez sur "Connexion"

**Résultat attendu**:
- ✅ Connexion réussie
- ✅ Redirection vers le dashboard vendeur
- ✅ Nom du vendeur affiché

---

### Test 5: Création de Campagne

**Objectif**: Créer une campagne complète avec images

**Étapes**:

#### Étape 1: Informations de Base
1. Cliquez sur "Créer une campagne"
2. Remplissez:
   - Titre: `iPhone 15 Pro Max 256GB`
   - Description: `Neuf, sous garantie, livraison gratuite`
   - Catégorie: `Électronique`
   - Localisation: `Douala, Cameroun`
3. Cliquez sur "Continuer"

#### Étape 2: Images
1. Uploadez 3-5 images du produit
2. Vérifiez les previews
3. Cliquez sur "Continuer"

#### Étape 3: Prix et Stock
1. Remplissez:
   - Prix original: `500000`
   - Réduction: `30`
   - Stock: `50`
   - Livraison: `Livraison gratuite à Douala`
2. Sélectionnez la durée: `48h`
3. Vérifiez le prix final: `350000 FCFA`
4. Cliquez sur "Créer la campagne"

**Résultat attendu**:
- ✅ Barre de progression d'upload visible
- ✅ Message "Campagne créée!"
- ✅ Campagne créée dans Firestore avec `status: 'pending'`
- ✅ Images compressées et uploadées dans Storage
- ✅ Taille des images réduite (compression)

**Vérification dans Firebase**:
1. Firestore > campaigns: Document avec `status: 'pending'`
2. Storage > campaigns: Images uploadées et compressées
3. Console: Logs de compression (avant/après)

---

### Test 6: Validation Admin - Campagne

**Objectif**: Valider une campagne en attente

**Étapes**:
1. Allez sur `http://localhost:3000/admin`
2. Allez dans "Gestion des Campagnes"
3. Cliquez sur "Détails" pour la campagne en attente
4. Vérifiez:
   - Images (galerie)
   - Informations produit
   - Prix et stock
5. Cliquez sur "Valider la campagne"

**Résultat attendu**:
- ✅ Message "Campagne validée avec succès!"
- ✅ Statut passe à `active` dans Firestore
- ✅ Campagne disparaît de la liste "en attente"

**Vérification dans Firebase**:
- Firestore > campaigns > {campaignId}: `status: 'active'`

---

### Test 7: Affichage Client

**Objectif**: Vérifier que la campagne validée est visible pour les clients

**Étapes**:
1. Allez sur `http://localhost:3000/client`
2. Vérifiez la liste des campagnes actives
3. Cliquez sur la campagne créée
4. Vérifiez les détails:
   - Images
   - Prix
   - Réduction
   - Stock
   - Bouton "Acheter"

**Résultat attendu**:
- ✅ Campagne visible dans la liste
- ✅ Images affichées correctement
- ✅ Prix et réduction corrects
- ✅ Possibilité d'ajouter au panier

---

### Test 8: Ajout au Panier

**Objectif**: Ajouter un produit au panier

**Étapes**:
1. Sur la page de la campagne, cliquez sur "Ajouter au panier"
2. Allez dans le panier (icône en haut)
3. Vérifiez le contenu

**Résultat attendu**:
- ✅ Produit ajouté au panier
- ✅ Quantité et prix corrects
- ✅ Total calculé correctement

**Vérification dans Firebase**:
- Firestore > cart: Document créé avec les infos du produit

---

### Test 9: Création de Commande

**Objectif**: Passer une commande

**Étapes**:
1. Dans le panier, cliquez sur "Commander"
2. Remplissez l'adresse de livraison
3. Confirmez la commande

**Résultat attendu**:
- ✅ Commande créée
- ✅ Stock de la campagne décrémenté
- ✅ Panier vidé

**Vérification dans Firebase**:
1. Firestore > orders: Document créé avec `status: 'pending'`
2. Firestore > campaigns: `sold` incrémenté, `stock` décrémenté
3. Firestore > cart: Panier vidé

---

### Test 10: Gestion des Commandes (Vendeur)

**Objectif**: Voir et gérer les commandes

**Étapes**:
1. Connectez-vous en tant que vendeur
2. Allez dans "Mes commandes"
3. Vérifiez la liste des commandes
4. Changez le statut d'une commande

**Résultat attendu**:
- ✅ Liste des commandes visible
- ✅ Détails de chaque commande
- ✅ Possibilité de changer le statut

---

### Test 11: Compression d'Images

**Objectif**: Vérifier que les images sont bien compressées

**Étapes**:
1. Uploadez une image de 3MB
2. Vérifiez les logs de la console

**Résultat attendu**:
```
✅ Image compressée: 3072KB → 850KB
```

**Vérification**:
- Taille réduite d'au moins 50%
- Qualité visuelle acceptable
- Dimensions max 1920px

---

### Test 12: Rejet de Vendeur

**Objectif**: Rejeter un vendeur

**Étapes**:
1. Créez un nouveau compte vendeur
2. En tant qu'admin, allez dans "Gestion des Commerçants"
3. Cliquez sur "Rejeter"
4. Entrez une raison: `Documents non conformes`

**Résultat attendu**:
- ✅ Statut passe à `rejected`
- ✅ Raison enregistrée dans Firestore

---

### Test 13: Rejet de Campagne

**Objectif**: Rejeter une campagne

**Étapes**:
1. Créez une nouvelle campagne
2. En tant qu'admin, allez dans "Gestion des Campagnes"
3. Cliquez sur "Rejeter"
4. Entrez une raison: `Images de mauvaise qualité`

**Résultat attendu**:
- ✅ Statut passe à `cancelled`
- ✅ Raison enregistrée dans Firestore

---

## 📊 Résumé des Tests

| Test | Fonctionnalité | Statut |
|------|----------------|--------|
| 1 | Initialisation Firebase | [ ] |
| 2 | Inscription Vendeur | [ ] |
| 3 | Validation Vendeur | [ ] |
| 4 | Connexion Vendeur | [ ] |
| 5 | Création Campagne | [ ] |
| 6 | Validation Campagne | [ ] |
| 7 | Affichage Client | [ ] |
| 8 | Ajout au Panier | [ ] |
| 9 | Création Commande | [ ] |
| 10 | Gestion Commandes | [ ] |
| 11 | Compression Images | [ ] |
| 12 | Rejet Vendeur | [ ] |
| 13 | Rejet Campagne | [ ] |

## 🐛 Problèmes Courants

### Erreur: "api-key-not-valid"
**Solution**: Vérifiez `.env.local` et redémarrez le serveur

### Erreur: "configuration-not-found"
**Solution**: Activez Authentication dans Firebase Console

### Erreur: "permission-denied"
**Solution**: Vérifiez les règles Firestore et Storage

### Images ne s'uploadent pas
**Solution**: Vérifiez Storage activé et règles publiées

### Campagne ne s'affiche pas
**Solution**: Vérifiez que le statut est `active`

## ✅ Validation Finale

Tous les tests doivent passer pour considérer le système comme fonctionnel.

Si un test échoue:
1. Vérifiez les logs de la console (F12)
2. Vérifiez les données dans Firebase Console
3. Consultez la documentation correspondante

## 🎉 Système Validé!

Si tous les tests passent, votre système est 100% fonctionnel et prêt pour la production!

---

**Durée estimée des tests**: 30-45 minutes
**Prérequis**: Firebase configuré, serveur démarré
