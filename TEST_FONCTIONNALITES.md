# ✅ TEST DES FONCTIONNALITÉS - Flash Deals Cameroun

## 🎯 OBJECTIF

Vérifier que toutes les fonctionnalités fonctionnent correctement avant le déploiement.

---

## 📋 CHECKLIST COMPLÈTE

### 1. AUTHENTIFICATION CLIENT ✅

#### Test 1.1: Inscription Email
- [ ] Aller sur `/client`
- [ ] Cliquer sur "S'inscrire"
- [ ] Remplir le formulaire:
  - Email: test@example.com
  - Mot de passe: Test123456!
  - Nom: Test User
- [ ] Soumettre
- [ ] Vérifier: Email de vérification reçu
- [ ] Vérifier: Profil créé dans Firestore (`users` collection)
- [ ] Vérifier: Rôle = `client`

#### Test 1.2: Connexion Email
- [ ] Aller sur `/client`
- [ ] Cliquer sur "Se connecter"
- [ ] Entrer email et mot de passe
- [ ] Vérifier: Redirection vers dashboard
- [ ] Vérifier: Nom affiché dans le header

#### Test 1.3: Connexion Google
- [ ] Cliquer sur "Continuer avec Google"
- [ ] Sélectionner un compte Google
- [ ] Vérifier: Profil créé automatiquement
- [ ] Vérifier: Rôle = `client`

#### Test 1.4: Déconnexion
- [ ] Cliquer sur "Déconnexion"
- [ ] Vérifier: Redirection vers page d'accueil
- [ ] Vérifier: Header affiche "Se connecter"

---

### 2. AUTHENTIFICATION VENDEUR ✅

#### Test 2.1: Inscription Vendeur
- [ ] Aller sur `/vendeur`
- [ ] Cliquer sur "Devenir vendeur"
- [ ] Étape 1: Informations personnelles
  - Nom: Jean Dupont
  - Email: vendeur@example.com
  - Téléphone: +237 6 XX XX XX XX
- [ ] Étape 2: Informations business
  - Nom commercial: Ma Boutique
  - Type: Commerce de détail
  - SIRET: 123456789
- [ ] Étape 3: Documents (optionnel)
- [ ] Étape 4: Confirmation
- [ ] Vérifier: Profil créé avec rôle = `vendor`

#### Test 2.2: Connexion Vendeur
- [ ] Se connecter avec les identifiants vendeur
- [ ] Vérifier: Accès au dashboard vendeur
- [ ] Vérifier: Menu "Créer une campagne" visible

---

### 3. GESTION DES CAMPAGNES ✅

#### Test 3.1: Créer une Campagne
- [ ] Se connecter comme vendeur
- [ ] Aller sur "Créer une campagne"
- [ ] Remplir le formulaire:
  - Titre: "Samsung Galaxy A54"
  - Description: "Smartphone dernière génération"
  - Catégorie: "Électronique"
  - Prix original: 245000 XAF
  - Prix promo: 145000 XAF
  - Stock: 50
  - Date début: Aujourd'hui
  - Date fin: Dans 2 jours
- [ ] Upload 3 images
- [ ] Soumettre
- [ ] Vérifier: Campagne créée dans Firestore
- [ ] Vérifier: Status = `pending`
- [ ] Vérifier: Images uploadées dans Storage

#### Test 3.2: Voir Mes Campagnes
- [ ] Aller sur "Mes campagnes"
- [ ] Vérifier: La campagne créée est visible
- [ ] Vérifier: Statistiques affichées (vues, intéressés)

#### Test 3.3: Modifier une Campagne
- [ ] Cliquer sur "Modifier"
- [ ] Changer le prix: 140000 XAF
- [ ] Sauvegarder
- [ ] Vérifier: Prix mis à jour dans Firestore

#### Test 3.4: Supprimer une Campagne
- [ ] Cliquer sur "Supprimer"
- [ ] Confirmer
- [ ] Vérifier: Campagne supprimée de Firestore
- [ ] Vérifier: Images supprimées de Storage

---

### 4. NAVIGATION CLIENT ✅

#### Test 4.1: Voir les Campagnes Actives
- [ ] Se connecter comme client
- [ ] Aller sur le dashboard
- [ ] Vérifier: Campagnes actives affichées
- [ ] Vérifier: Timer de fin visible
- [ ] Vérifier: Stock affiché

#### Test 4.2: Voir Détails d'une Campagne
- [ ] Cliquer sur une campagne
- [ ] Vérifier: Toutes les infos affichées
- [ ] Vérifier: Images en carousel
- [ ] Vérifier: Bouton "Ajouter au panier"
- [ ] Vérifier: Compteur de vues incrémenté

#### Test 4.3: Marquer comme Intéressé
- [ ] Cliquer sur "♥️ Je suis intéressé"
- [ ] Vérifier: Compteur incrémenté
- [ ] Vérifier: User ID ajouté dans `interestedUsers`

---

### 5. PANIER ✅

#### Test 5.1: Ajouter au Panier
- [ ] Sur une campagne, cliquer "Ajouter au panier"
- [ ] Vérifier: Badge panier incrémenté
- [ ] Vérifier: Item ajouté dans Firestore (`cart` collection)

#### Test 5.2: Voir le Panier
- [ ] Cliquer sur l'icône panier
- [ ] Vérifier: Tous les items affichés
- [ ] Vérifier: Prix total calculé
- [ ] Vérifier: Économies affichées

#### Test 5.3: Modifier la Quantité
- [ ] Cliquer sur "+"
- [ ] Vérifier: Quantité incrémentée
- [ ] Vérifier: Prix total mis à jour
- [ ] Cliquer sur "-"
- [ ] Vérifier: Quantité décrémentée

#### Test 5.4: Retirer du Panier
- [ ] Cliquer sur "Supprimer"
- [ ] Vérifier: Item retiré
- [ ] Vérifier: Prix total recalculé

#### Test 5.5: Vider le Panier
- [ ] Cliquer sur "Vider le panier"
- [ ] Confirmer
- [ ] Vérifier: Panier vide
- [ ] Vérifier: Collection `cart` vide dans Firestore

---

### 6. COMMANDES ✅

#### Test 6.1: Passer une Commande
- [ ] Ajouter des items au panier
- [ ] Cliquer sur "Commander"
- [ ] Remplir l'adresse de livraison
- [ ] Choisir le mode de paiement
- [ ] Confirmer
- [ ] Vérifier: Commande créée dans Firestore (`orders`)
- [ ] Vérifier: Stock de la campagne décrémenté
- [ ] Vérifier: Panier vidé

#### Test 6.2: Voir Mes Commandes (Client)
- [ ] Aller sur "Mes commandes"
- [ ] Vérifier: Toutes les commandes affichées
- [ ] Vérifier: Statuts corrects
- [ ] Vérifier: Détails complets

#### Test 6.3: Voir Commandes Reçues (Vendeur)
- [ ] Se connecter comme vendeur
- [ ] Aller sur "Commandes reçues"
- [ ] Vérifier: Commandes de ses campagnes
- [ ] Vérifier: Infos client visibles

#### Test 6.4: Mettre à Jour le Statut
- [ ] Cliquer sur une commande
- [ ] Changer le statut: "En préparation"
- [ ] Sauvegarder
- [ ] Vérifier: Statut mis à jour
- [ ] Vérifier: Client notifié (optionnel)

---

### 7. ADMINISTRATION ✅

#### Test 7.1: Connexion Admin
- [ ] Aller sur `/admin`
- [ ] Se connecter avec compte admin
- [ ] Vérifier: Accès au dashboard admin

#### Test 7.2: Voir Toutes les Campagnes
- [ ] Aller sur "Campagnes"
- [ ] Vérifier: Toutes les campagnes visibles
- [ ] Vérifier: Filtres fonctionnent (pending, active, completed)

#### Test 7.3: Approuver une Campagne
- [ ] Sélectionner une campagne `pending`
- [ ] Cliquer sur "Approuver"
- [ ] Vérifier: Status changé en `active`
- [ ] Vérifier: Campagne visible pour les clients

#### Test 7.4: Rejeter une Campagne
- [ ] Sélectionner une campagne `pending`
- [ ] Cliquer sur "Rejeter"
- [ ] Entrer une raison
- [ ] Vérifier: Status changé en `rejected`
- [ ] Vérifier: Vendeur notifié

#### Test 7.5: Gérer les Utilisateurs
- [ ] Aller sur "Utilisateurs"
- [ ] Vérifier: Liste de tous les users
- [ ] Filtrer par rôle (client, vendor, admin)
- [ ] Suspendre un utilisateur
- [ ] Vérifier: Status changé en `suspended`

#### Test 7.6: Voir les Statistiques
- [ ] Aller sur "Dashboard"
- [ ] Vérifier: Métriques affichées
  - Nombre total d'utilisateurs
  - Nombre de campagnes actives
  - Nombre de commandes
  - Chiffre d'affaires

---

### 8. UPLOAD D'IMAGES ✅

#### Test 8.1: Upload Simple
- [ ] Créer une campagne
- [ ] Cliquer sur "Ajouter une image"
- [ ] Sélectionner une image (< 5MB)
- [ ] Vérifier: Upload réussi
- [ ] Vérifier: Image visible dans Storage
- [ ] Vérifier: URL stockée dans Firestore

#### Test 8.2: Upload Multiple
- [ ] Sélectionner 3 images
- [ ] Vérifier: Toutes uploadées
- [ ] Vérifier: Ordre préservé

#### Test 8.3: Validation
- [ ] Essayer d'uploader un fichier > 5MB
- [ ] Vérifier: Erreur affichée
- [ ] Essayer d'uploader un PDF
- [ ] Vérifier: Erreur "Type non autorisé"

#### Test 8.4: Compression
- [ ] Uploader une image > 2MB
- [ ] Vérifier: Image compressée automatiquement
- [ ] Vérifier: Taille réduite dans Storage

#### Test 8.5: Suppression
- [ ] Supprimer une image
- [ ] Vérifier: Image retirée de Storage
- [ ] Vérifier: URL retirée de Firestore

---

### 9. TEMPS RÉEL ✅

#### Test 9.1: Panier Temps Réel
- [ ] Ouvrir 2 onglets avec le même compte
- [ ] Ajouter un item dans l'onglet 1
- [ ] Vérifier: Panier mis à jour dans l'onglet 2

#### Test 9.2: Stock Temps Réel
- [ ] Ouvrir 2 onglets
- [ ] Commander dans l'onglet 1
- [ ] Vérifier: Stock mis à jour dans l'onglet 2

#### Test 9.3: Notifications Temps Réel
- [ ] Créer une notification
- [ ] Vérifier: Badge mis à jour instantanément

---

### 10. SÉCURITÉ ✅

#### Test 10.1: Règles Firestore
- [ ] Se déconnecter
- [ ] Essayer d'accéder à `/users` collection
- [ ] Vérifier: Permission denied
- [ ] Se connecter comme client
- [ ] Essayer de modifier une campagne
- [ ] Vérifier: Permission denied

#### Test 10.2: Règles Storage
- [ ] Se déconnecter
- [ ] Essayer d'uploader une image
- [ ] Vérifier: Permission denied
- [ ] Se connecter
- [ ] Essayer d'uploader dans le dossier d'un autre user
- [ ] Vérifier: Permission denied

#### Test 10.3: Protection des Routes
- [ ] Se déconnecter
- [ ] Essayer d'accéder à `/admin`
- [ ] Vérifier: Redirection vers login
- [ ] Se connecter comme client
- [ ] Essayer d'accéder à `/admin`
- [ ] Vérifier: Accès refusé

---

## 📊 RÉSULTATS

### Fonctionnalités Testées: __/50
### Bugs Trouvés: __
### Bugs Critiques: __

---

## 🐛 BUGS IDENTIFIÉS

| # | Description | Sévérité | Status |
|---|-------------|----------|--------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

---

## ✅ VALIDATION FINALE

- [ ] Tous les tests passés
- [ ] Aucun bug critique
- [ ] Performance acceptable
- [ ] Sécurité vérifiée
- [ ] Prêt pour le déploiement

---

## 📝 NOTES

_Ajoutez vos observations ici_

