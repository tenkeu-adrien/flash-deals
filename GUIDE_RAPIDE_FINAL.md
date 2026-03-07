# Guide Rapide - Démarrage

## 🚀 Lancer l'application

```bash
cd flash-deals-nextjs
npm run dev
```

L'application sera accessible sur: http://localhost:3000

---

## 📱 Accès aux différentes interfaces

- **Client:** http://localhost:3000/client
- **Vendeur:** http://localhost:3000/vendeur
- **Admin:** http://localhost:3000/admin

---

## ✅ Vérifications avant de commencer

### 1. Firebase configuré
Vérifier que `.env.local` existe avec vos clés Firebase:
```bash
type .env.local
```

### 2. Dépendances installées
```bash
npm install
```

### 3. Firebase Console
- Firestore activé
- Authentication activé (Email/Password)
- Storage activé

---

## 🧪 Scénario de test complet

### Étape 1: Créer un compte vendeur

1. Aller sur http://localhost:3000/vendeur
2. Cliquer sur "DEVENIR PARTENAIRE"
3. Remplir le formulaire (4 étapes):
   - Informations personnelles
   - Informations entreprise
   - Upload CNI (obligatoire)
   - Confirmation
4. ✅ Le bouton devient "Demande en cours..."

### Étape 2: Valider le vendeur (Admin)

1. Aller sur http://localhost:3000/admin
2. Se connecter avec un compte admin
3. Aller dans "Vendeurs"
4. Trouver le vendeur en attente
5. Cliquer sur "Approuver"
6. ✅ Le vendeur passe en statut "active"

### Étape 3: Créer une campagne (Vendeur)

1. Retourner sur http://localhost:3000/vendeur
2. Recharger la page (F5)
3. ✅ Le bouton devient "Accéder au Dashboard"
4. Cliquer dessus
5. Aller dans "Mes Campagnes"
6. Cliquer sur "Nouvelle Campagne"
7. Remplir le formulaire (4 étapes)
8. ✅ La campagne est créée avec statut "pending"

### Étape 4: Valider la campagne (Admin)

1. Aller sur http://localhost:3000/admin
2. Aller dans "Campagnes"
3. Trouver la campagne en attente
4. Cliquer sur "Approuver"
5. ✅ La campagne passe en statut "active"

### Étape 5: Voir la campagne (Client)

1. Aller sur http://localhost:3000/client
2. ✅ La campagne doit apparaître dans la liste
3. Cliquer dessus pour voir les détails
4. Ajouter au panier
5. Passer commande

---

## 🔍 Vérifier que tout fonctionne

### Persistance
1. Se connecter (admin, vendeur ou client)
2. Recharger la page (F5)
3. ✅ Doit rester connecté

### Statut vendeur
1. S'inscrire comme vendeur
2. ✅ Bouton "Demande en cours..." désactivé
3. Essayer de créer une campagne
4. ✅ Message: "Votre compte doit être validé..."

### Toggle mot de passe
1. Aller sur n'importe quel formulaire
2. Taper un mot de passe
3. Cliquer sur l'icône œil
4. ✅ Le mot de passe devient visible

### PWA (en production)
1. Builder l'app: `npm run build`
2. Lancer: `npm start`
3. Ouvrir sur mobile
4. ✅ Proposition d'installation

---

## 🐛 Résolution de problèmes

### Les campagnes ne s'affichent pas
1. Ouvrir la console (F12)
2. Vérifier les logs de récupération
3. Aller dans Firebase Console > Firestore > campaigns
4. Vérifier qu'il y a des documents
5. Vérifier le champ "status"

### Erreur "email-already-in-use"
- Si vous êtes déjà connecté, l'inscription vendeur doit fonctionner
- Si l'erreur persiste, se connecter d'abord puis devenir vendeur

### Admin redirige vers accueil
- Vérifier que vous êtes bien connecté
- Vérifier localStorage: `localStorage.getItem('admin-storage')`
- Si vide, se reconnecter

### Bouton "Devenir partenaire" ne change pas
- Recharger la page (F5)
- Vérifier Firebase Console > vendors > votre userId
- Vérifier le champ "status"

---

## 📊 Données de test

### Créer un admin
Dans Firebase Console > Authentication:
1. Créer un utilisateur avec email/password
2. Noter son UID
3. Dans Firestore, créer une collection "admins"
4. Créer un document avec l'UID comme ID
5. Ajouter les champs:
   ```json
   {
     "email": "admin@flashdeals.cm",
     "name": "Admin",
     "role": "super_admin",
     "createdAt": [timestamp]
   }
   ```

### Créer des campagnes de test
Utiliser la page seed: http://localhost:3000/seed

---

## 🎯 Checklist finale

- [ ] Firebase configuré (.env.local)
- [ ] Dépendances installées (npm install)
- [ ] Serveur lancé (npm run dev)
- [ ] Compte admin créé
- [ ] Compte vendeur créé et validé
- [ ] Campagne créée et validée
- [ ] Campagne visible côté client
- [ ] Persistance testée (F5)
- [ ] Toggle mot de passe testé
- [ ] PWA testée (en production)

---

## 💡 Commandes utiles

```bash
# Lancer en développement
npm run dev

# Builder pour production
npm run build

# Lancer en production
npm start

# Nettoyer le cache
rm -rf .next
npm run dev

# Vérifier la config Firebase
type .env.local

# Voir les logs en temps réel
# (Ouvrir la console du navigateur F12)
```

---

## 📞 Support

Si vous rencontrez des problèmes:
1. Vérifier la console du navigateur (F12)
2. Vérifier Firebase Console
3. Vérifier que toutes les règles Firestore sont correctes
4. Vérifier que Authentication est activé
5. Vérifier que Storage est activé

---

## ✨ Fonctionnalités implémentées

✅ Authentification persistante (admin, vendeur, client)
✅ Système de validation vendeur (pending → active)
✅ Système de validation campagne (pending → active)
✅ Blocage des fonctionnalités si statut pending
✅ Gestion des utilisateurs existants
✅ Toggle visibilité mot de passe
✅ PWA complète (installable)
✅ Fallbacks pour affichage campagnes
✅ Upload et compression d'images
✅ Panier et commandes
✅ Notifications
✅ Recherche et filtres

Tout est prêt pour les tests et le déploiement! 🚀
