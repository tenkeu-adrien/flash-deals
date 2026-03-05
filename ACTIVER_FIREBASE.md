# 🔥 Activer Firebase - Guide Complet

## ❌ Erreur Actuelle

```
Firebase: Error (auth/configuration-not-found)
```

**Cause**: Firebase Authentication n'est pas activée dans votre projet Firebase.

## ✅ Solution: Activer Firebase Authentication

### Étape 1: Aller sur la Console Firebase

1. Ouvrez: https://console.firebase.google.com
2. Sélectionnez votre projet: **wego-97624**

### Étape 2: Activer Authentication

1. Dans le menu de gauche, cliquez sur **"Authentication"** (🔐)
2. Cliquez sur **"Get started"** ou **"Commencer"**
3. Allez dans l'onglet **"Sign-in method"** ou **"Méthode de connexion"**
4. Cliquez sur **"Email/Password"**
5. **Activez** le premier bouton (Email/Password)
6. Cliquez sur **"Save"** ou **"Enregistrer"**

### Étape 3: Activer Firestore Database

1. Dans le menu de gauche, cliquez sur **"Firestore Database"** (📊)
2. Cliquez sur **"Create database"** ou **"Créer une base de données"**
3. Choisissez **"Start in test mode"** (pour le développement)
4. Sélectionnez une région proche: **europe-west** (Belgique/Pays-Bas)
5. Cliquez sur **"Enable"** ou **"Activer"**

### Étape 4: Activer Storage

1. Dans le menu de gauche, cliquez sur **"Storage"** (📦)
2. Cliquez sur **"Get started"** ou **"Commencer"**
3. Choisissez **"Start in test mode"** (pour le développement)
4. Cliquez sur **"Next"** puis **"Done"**

### Étape 5: Configurer les Règles Firestore

1. Dans **Firestore Database**, allez dans l'onglet **"Rules"** ou **"Règles"**
2. Remplacez le contenu par:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permettre lecture/écriture pour le développement
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Cliquez sur **"Publish"** ou **"Publier"**

⚠️ **Note**: Ces règles sont pour le développement. En production, utilisez des règles plus strictes.

### Étape 6: Configurer les Règles Storage

1. Dans **Storage**, allez dans l'onglet **"Rules"** ou **"Règles"**
2. Remplacez le contenu par:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permettre lecture/écriture pour le développement
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

3. Cliquez sur **"Publish"** ou **"Publier"**

## 📋 Checklist de Vérification

Après avoir suivi toutes les étapes, vérifiez:

- [ ] Authentication activée avec Email/Password
- [ ] Firestore Database créée
- [ ] Storage activé
- [ ] Règles Firestore publiées
- [ ] Règles Storage publiées

## 🚀 Redémarrer l'Application

Après avoir activé tout dans Firebase:

1. **Arrêtez le serveur** (Ctrl+C)
2. **Nettoyez le cache**:
   ```bash
   rmdir /s /q .next
   ```
3. **Redémarrez**:
   ```bash
   npm run dev
   ```

## 🧪 Tester

1. Ouvrez `http://localhost:3000/vendeur`
2. Cliquez sur "Devenir Partenaire"
3. Remplissez le formulaire
4. Essayez de créer un compte

**Résultat attendu**: Compte créé avec succès! ✅

## 📸 Captures d'Écran des Étapes

### Authentication
```
Console Firebase > Authentication > Get started > Sign-in method
> Email/Password > Enable > Save
```

### Firestore
```
Console Firebase > Firestore Database > Create database
> Test mode > Select location > Enable
```

### Storage
```
Console Firebase > Storage > Get started
> Test mode > Done
```

## ⚠️ Problèmes Courants

### "Project not found"
- Vérifiez que vous êtes sur le bon projet: **wego-97624**
- Vérifiez que votre compte a accès au projet

### "Insufficient permissions"
- Vous devez être propriétaire ou éditeur du projet
- Demandez les droits à l'administrateur du projet

### "Quota exceeded"
- Plan gratuit Firebase a des limites
- Attendez 24h ou passez au plan Blaze

## 🎯 Après Activation

Une fois tout activé, vous pourrez:

✅ Créer des comptes utilisateurs
✅ S'authentifier
✅ Créer des profils vendeurs
✅ Uploader des images
✅ Créer des campagnes
✅ Valider des vendeurs (admin)
✅ Valider des campagnes (admin)
✅ Gérer toute l'application

## 📞 Besoin d'Aide?

Si vous rencontrez des problèmes:
1. Vérifiez que vous êtes connecté au bon compte Google
2. Vérifiez que le projet **wego-97624** existe
3. Vérifiez que vous avez les droits d'administration
4. Consultez la documentation Firebase: https://firebase.google.com/docs

---

**Important**: Ces configurations sont pour le développement. En production, configurez des règles de sécurité appropriées!
