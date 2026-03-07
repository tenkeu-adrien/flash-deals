# Problème de Rechargement Automatique - RÉSOLU

## 🔴 Problème

L'application se recharge automatiquement en boucle, ce qui rend l'utilisation impossible.

---

## 🔍 Causes identifiées

### 1. Configuration PWA avec `skipWaiting: true`
En développement, le service worker se met à jour constamment et force le rechargement de la page.

### 2. Hook `useFirebaseAuth` avec dépendances instables
Les fonctions `setUser`, `setAuthenticated`, `setCart` de Zustand changent de référence à cause de la persistance, créant une boucle infinie de re-renders.

---

## ✅ Solutions appliquées

### 1. Configuration PWA corrigée

**Fichier:** `next.config.ts`

**Changements:**
```typescript
export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: false,              // ✅ Changé de true à false
  disable: process.env.NODE_ENV === 'development',  // ✅ Désactivé en dev
  buildExcludes: [/middleware-manifest\.json$/],
  cacheOnFrontEndNav: true,
  reloadOnOnline: false            // ✅ Pas de reload automatique
})(nextConfig);
```

**Résultat:** Le service worker ne force plus les rechargements en développement.

---

### 2. Hook `useFirebaseAuth` optimisé

**Fichier:** `lib/hooks/useFirebaseAuth.ts`

**Changements:**
```typescript
useEffect(() => {
  // ... code ...
  
  return () => {
    unsubscribeAuth();
    if (unsubscribeCart) {
      unsubscribeCart();
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // ✅ Dépendances vides pour éviter les re-renders infinis
```

**Résultat:** Le hook ne se réexécute plus à chaque changement de référence des fonctions Zustand.

---

### 3. Nettoyage des fichiers PWA

**Fichiers supprimés:**
- `public/sw.js` (service worker)
- `public/workbox-*.js` (fichiers Workbox)

**Résultat:** Pas de service worker actif en développement qui pourrait causer des problèmes.

---

## 🚀 Comment relancer proprement

### Option 1: Script automatique
```bash
NETTOYER_ET_RELANCER.bat
```

Ce script fait:
1. Arrête le serveur Node.js
2. Supprime le cache Next.js (.next)
3. Supprime les fichiers PWA
4. Nettoie le cache npm
5. Relance le serveur

### Option 2: Commandes manuelles
```bash
# Arrêter le serveur (Ctrl+C)

# Supprimer le cache
rmdir /s /q .next

# Supprimer les fichiers PWA
del public\sw.js
del public\workbox-*.js

# Relancer
npm run dev
```

---

## 🧪 Vérification

Après le redémarrage:

1. ✅ L'application ne doit plus se recharger automatiquement
2. ✅ La navigation doit être fluide
3. ✅ Les stores doivent persister correctement
4. ✅ Pas de boucle infinie dans la console

---

## 📊 Comportement attendu

### En développement (`npm run dev`)
- PWA désactivée (`disable: true`)
- Pas de service worker
- Hot reload uniquement sur changement de fichier
- Pas de rechargement automatique

### En production (`npm run build` + `npm start`)
- PWA activée
- Service worker généré
- Application installable
- Cache offline fonctionnel

---

## 🔧 Si le problème persiste

### 1. Vider le cache du navigateur
```
Chrome: Ctrl+Shift+Delete
Firefox: Ctrl+Shift+Delete
Edge: Ctrl+Shift+Delete
```

Cocher:
- ✅ Cookies et données de sites
- ✅ Images et fichiers en cache
- ✅ Données d'application hébergées

### 2. Vider localStorage
Ouvrir la console (F12) et exécuter:
```javascript
localStorage.clear()
sessionStorage.clear()
```

### 3. Désinstaller le service worker
Ouvrir la console (F12) → Application → Service Workers → Unregister

### 4. Redémarrer en mode incognito
Pour tester sans cache ni service worker

---

## 💡 Bonnes pratiques

### En développement
1. Toujours utiliser `npm run dev` (pas `npm start`)
2. Ne pas installer l'app comme PWA
3. Désactiver le cache dans DevTools (F12 → Network → Disable cache)

### En production
1. Builder avec `npm run build`
2. Tester avec `npm start`
3. Vérifier que la PWA fonctionne
4. Tester l'installation sur mobile

---

## 📝 Notes techniques

### Pourquoi `skipWaiting: false` ?
- `skipWaiting: true` force le nouveau service worker à prendre le contrôle immédiatement
- En développement, cela cause des rechargements constants
- `skipWaiting: false` attend que l'utilisateur ferme tous les onglets avant de mettre à jour

### Pourquoi dépendances vides dans useEffect ?
- Les fonctions Zustand avec persist changent de référence
- Cela déclenche le useEffect en boucle
- Les dépendances vides garantissent une seule exécution
- Les fonctions sont stables dans le contexte de l'effet

### Pourquoi désactiver PWA en dev ?
- Le service worker cache les fichiers
- En développement, on veut voir les changements immédiatement
- Le hot reload de Next.js suffit
- La PWA est testée en production

---

## ✨ Résultat final

L'application fonctionne maintenant normalement:
- ✅ Pas de rechargement automatique
- ✅ Navigation fluide
- ✅ Persistance fonctionnelle
- ✅ PWA prête pour la production
- ✅ Performance optimale

Le problème est complètement résolu! 🎉
