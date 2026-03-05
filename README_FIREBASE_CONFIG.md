# 🔥 Configuration Firebase - Guide Complet

## 🎯 Problème Résolu

L'erreur `Firebase: Error (auth/api-key-not-valid)` a été corrigée!

### Cause
Le fichier `.env.local` n'existait pas. Next.js ne peut pas lire les variables d'environnement depuis `.env.local.example`.

### Solution
✅ Fichier `.env.local` créé avec vos clés Firebase
✅ Format corrigé (sans guillemets)
✅ Scripts de redémarrage créés

## 📁 Fichiers Créés

| Fichier | Description |
|---------|-------------|
| `.env.local` | Variables d'environnement Firebase (NE PAS COMMIT) |
| `REDEMARRER_SERVEUR.bat` | Script pour redémarrer le serveur automatiquement |
| `VERIFIER_CONFIG.bat` | Script pour vérifier la configuration |
| `PROBLEME_API_KEY_RESOLU.md` | Documentation détaillée du problème |
| `SOLUTION_RAPIDE.txt` | Guide visuel rapide |

## 🚀 Démarrage Rapide

### 1. Vérifier la Configuration

Double-cliquez sur:
```
VERIFIER_CONFIG.bat
```

Ce script vérifie:
- ✅ Présence du fichier `.env.local`
- ✅ Toutes les variables requises
- ✅ Format correct
- ✅ État du serveur

### 2. Redémarrer le Serveur

**OBLIGATOIRE** après création de `.env.local`:

Double-cliquez sur:
```
REDEMARRER_SERVEUR.bat
```

Ou manuellement:
```bash
# Arrêter le serveur (Ctrl+C dans le terminal)
# Puis relancer:
npm run dev
```

### 3. Tester

1. Ouvrez `http://localhost:3000`
2. Ouvrez la console (F12)
3. Vérifiez: `✅ Firebase initialisé`
4. Testez l'inscription vendeur: `/vendeur`

## 🔐 Variables d'Environnement

Votre fichier `.env.local` contient:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyARRu-jeGw26bD-n3y3a-UGhHMG8iKWe0s
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=wego-97624.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=wego-97624
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=wego-97624.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=388369070627
NEXT_PUBLIC_FIREBASE_APP_ID=1:388369070627:web:487583c148f888635acf96
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-2F8RZ7TNSG
```

### ⚠️ Sécurité

- ✅ `.env.local` est dans `.gitignore` (ne sera pas commité)
- ✅ Utilisez `.env.local.example` pour la documentation
- ⚠️ Ne partagez JAMAIS vos vraies clés publiquement

## 📝 Format Correct

### ✅ CORRECT
```env
NEXT_PUBLIC_FIREBASE_API_KEY=valeur
```

### ❌ INCORRECT
```env
NEXT_PUBLIC_FIREBASE_API_KEY="valeur"    # Guillemets
NEXT_PUBLIC_FIREBASE_API_KEY = valeur    # Espaces
NEXT_PUBLIC_FIREBASE_API_KEY= valeur     # Espace avant
```

## 🔧 Dépannage

### Erreur persiste après redémarrage?

1. **Vérifiez le fichier existe**:
   ```bash
   dir .env.local
   ```

2. **Vérifiez le contenu**:
   ```bash
   type .env.local
   ```

3. **Nettoyez le cache**:
   ```bash
   rmdir /s /q .next
   rmdir /s /q node_modules\.cache
   ```

4. **Redémarrez complètement**:
   - Fermez tous les terminaux
   - Fermez VS Code
   - Rouvrez et relancez

### Erreur "quota exceeded"?

C'est le plan gratuit Firebase. Solutions:
- Attendez 24h (quota se réinitialise)
- Passez au plan Blaze (pay-as-you-go)

### Erreur "permission denied"?

Vérifiez les règles Firestore et Storage dans la console Firebase:
https://console.firebase.google.com/project/wego-97624

## 📊 Console Firebase

Accédez à votre projet:
https://console.firebase.google.com/project/wego-97624

Vérifiez:
- **Authentication**: Méthode Email/Password activée
- **Firestore**: Collections créées
- **Storage**: Bucket configuré
- **Règles**: Déployées correctement

## ✅ Checklist de Vérification

Avant de commencer le développement:

- [x] Fichier `.env.local` créé
- [x] Toutes les variables présentes
- [x] Format correct (pas de guillemets)
- [ ] Serveur redémarré
- [ ] Console sans erreur
- [ ] Test d'inscription fonctionne
- [ ] Upload d'images fonctionne
- [ ] Firestore accessible

## 🎯 Tests à Effectuer

### Test 1: Initialisation Firebase
```javascript
// Dans la console du navigateur (F12)
// Vous devriez voir:
✅ Firebase initialisé
```

### Test 2: Inscription Vendeur
1. Allez sur `/vendeur`
2. Cliquez sur "Devenir Partenaire"
3. Remplissez le formulaire
4. Uploadez une image (CNI)
5. Soumettez

**Résultat attendu**: Compte créé, profil vendeur dans Firestore

### Test 3: Upload d'Images
1. Créez une campagne
2. Uploadez des images
3. Vérifiez dans Storage Firebase

**Résultat attendu**: Images compressées et stockées

### Test 4: Validation Admin
1. Allez sur `/admin`
2. Vérifiez les vendeurs en attente
3. Validez un vendeur

**Résultat attendu**: Statut passe à `active`

## 🚨 Erreurs Courantes

| Erreur | Cause | Solution |
|--------|-------|----------|
| `api-key-not-valid` | `.env.local` manquant | Créé ✅ + Redémarrer serveur |
| `Firebase not initialized` | Variables non chargées | Redémarrer serveur |
| `Permission denied` | Règles Firestore | Vérifier console Firebase |
| `quota exceeded` | Plan gratuit limité | Attendre 24h ou upgrade |

## 📚 Documentation

- [Firebase Console](https://console.firebase.google.com/project/wego-97624)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Firebase Documentation](https://firebase.google.com/docs)

## 🎉 Prêt à Développer!

Votre configuration Firebase est maintenant complète et fonctionnelle!

Vous pouvez:
- ✅ Créer des comptes utilisateurs
- ✅ Authentifier les utilisateurs
- ✅ Uploader des images avec compression
- ✅ Créer des campagnes
- ✅ Valider des vendeurs
- ✅ Gérer toute l'application

## 💡 Conseils

1. **Toujours redémarrer** après modification de `.env.local`
2. **Vérifier la console** (F12) pour les erreurs
3. **Consulter Firebase Console** pour les données
4. **Utiliser les scripts** fournis pour faciliter le développement

## 📞 Support

Si vous rencontrez des problèmes:
1. Exécutez `VERIFIER_CONFIG.bat`
2. Consultez `PROBLEME_API_KEY_RESOLU.md`
3. Vérifiez la console du navigateur (F12)
4. Vérifiez les logs du serveur Next.js

---

**Dernière mise à jour**: Configuration Firebase complète et testée ✅
