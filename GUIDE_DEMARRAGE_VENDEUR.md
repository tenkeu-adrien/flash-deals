# Guide de Démarrage Rapide - Système Vendeur

## 🚀 Démarrage en 5 Minutes

### 1. Configuration Firebase

Créez un fichier `.env.local` à la racine du projet:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=votre_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=votre_app_id
```

### 2. Installation

```bash
cd flash-deals-nextjs
npm install
```

### 3. Lancer le Projet

```bash
npm run dev
```

Le projet sera accessible sur `http://localhost:3000`

## 📱 Tester le Système Vendeur

### Étape 1: Inscription Vendeur

1. Allez sur `/vendeur`
2. Cliquez sur "Devenir Partenaire"
3. Remplissez le formulaire en 4 étapes:
   - **Étape 1**: Informations personnelles
   - **Étape 2**: Informations entreprise
   - **Étape 3**: Upload documents (CNI obligatoire)
   - **Étape 4**: Confirmation

### Étape 2: Validation Admin

1. Allez sur `/admin`
2. Connectez-vous avec un compte admin
3. Allez dans "Gestion des Commerçants"
4. Cliquez sur "Voir détails" pour le nouveau vendeur
5. Vérifiez les documents
6. Cliquez sur "Valider le vendeur"

### Étape 3: Créer une Campagne

1. Retournez sur `/vendeur`
2. Connectez-vous avec le compte vendeur validé
3. Cliquez sur "Créer une campagne"
4. Remplissez le formulaire en 4 étapes:
   - **Étape 1**: Titre, description, catégorie
   - **Étape 2**: Upload images (max 5)
   - **Étape 3**: Prix, réduction, stock, durée
   - **Étape 4**: Confirmation

### Étape 4: Validation Campagne

1. Retournez sur `/admin`
2. Allez dans "Gestion des Campagnes"
3. Cliquez sur "Détails" pour la nouvelle campagne
4. Vérifiez les informations et images
5. Cliquez sur "Valider la campagne"

### Étape 5: Voir la Campagne Publiée

1. Allez sur `/client`
2. La campagne validée apparaît dans la liste
3. Les clients peuvent maintenant l'acheter!

## 🔧 Commandes Utiles

### Développement
```bash
npm run dev          # Lancer en mode développement
npm run build        # Build pour production
npm run start        # Lancer en production
```

### Nettoyage
```bash
# Windows
NETTOYER_CACHE.bat   # Nettoyer le cache Next.js

# Manuel
rm -rf .next
rm -rf node_modules/.cache
```

## 📊 Vérifier Firebase

### Console Firebase
1. Allez sur https://console.firebase.google.com
2. Sélectionnez votre projet
3. Vérifiez:
   - **Firestore**: Collections `vendors` et `campaigns`
   - **Storage**: Dossiers `campaigns` et `vendor-documents`
   - **Authentication**: Utilisateurs créés

### Firestore Collections

Après inscription vendeur, vous devriez voir:
```
vendors/
  └── {userId}/
      ├── businessName: "TechStore Douala"
      ├── email: "tech@store.cm"
      ├── status: "pending"
      └── ...
```

Après création campagne, vous devriez voir:
```
campaigns/
  └── {campaignId}/
      ├── title: "iPhone 15 Pro"
      ├── vendorId: "{userId}"
      ├── status: "pending"
      └── ...
```

### Storage

Après upload d'images:
```
campaigns/
  └── {userId}/
      ├── 1234567890_image1.jpg
      └── 1234567891_image2.jpg

vendor-documents/
  └── {userId}/
      ├── 1234567890_cni.jpg
      └── 1234567891_registre.jpg
```

## ⚠️ Problèmes Courants

### Erreur: "Firebase not initialized"
**Solution**: Vérifiez que `.env.local` existe et contient toutes les variables

### Erreur: "Permission denied"
**Solution**: Vérifiez les règles Firestore et Storage dans la console Firebase

### Images ne s'uploadent pas
**Solution**: 
1. Vérifiez les règles Storage
2. Vérifiez que le bucket existe
3. Vérifiez la taille des images (max 5MB recommandé)

### Campagne ne s'affiche pas après validation
**Solution**: 
1. Vérifiez que le statut est bien `active`
2. Vérifiez les dates de début/fin
3. Rechargez la page client

## 🎯 Checklist de Déploiement

Avant de déployer en production:

- [ ] Variables d'environnement configurées
- [ ] Règles Firestore déployées
- [ ] Règles Storage déployées
- [ ] Indexes Firestore créés
- [ ] Tests d'inscription vendeur
- [ ] Tests de création campagne
- [ ] Tests de validation admin
- [ ] Tests d'affichage client
- [ ] Compression d'images testée
- [ ] Notifications configurées (optionnel)

## 📞 Support

Pour toute question ou problème:
1. Vérifiez la console du navigateur (F12)
2. Vérifiez les logs Firebase
3. Consultez `SYSTEME_VENDEUR_COMPLET.md` pour plus de détails

## 🎉 Félicitations!

Votre système vendeur est maintenant opérationnel! Les vendeurs peuvent:
- ✅ S'inscrire avec documents
- ✅ Créer des campagnes avec images
- ✅ Être validés par les admins
- ✅ Voir leurs campagnes publiées

Les admins peuvent:
- ✅ Valider/rejeter les vendeurs
- ✅ Valider/rejeter les campagnes
- ✅ Voir tous les documents et images
- ✅ Gérer le système complet
