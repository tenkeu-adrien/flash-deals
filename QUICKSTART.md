# 🚀 Guide de Démarrage Rapide - Flash Deals

## Installation en 3 étapes

### 1. Installer les dépendances

```bash
npm install
```

### 2. Lancer le serveur de développement

```bash
npm run dev
```

### 3. Ouvrir dans le navigateur

- **Portail:** http://localhost:3000
- **Client:** http://localhost:3000/client
- **Vendeur:** http://localhost:3000/vendeur
- **Admin:** http://localhost:3000/admin

## 🎯 Navigation Rapide

### Interface Client
1. Ouvrir http://localhost:3000/client
2. Cliquer sur "S'inscrire"
3. Remplir le formulaire
4. Entrer le code OTP (n'importe quel code)
5. Configurer le profil
6. Suivre le tutoriel
7. Explorer le dashboard

### Interface Vendeur
1. Ouvrir http://localhost:3000/vendeur
2. Cliquer sur "DEVENIR PARTENAIRE"
3. Compléter les 4 étapes d'inscription
4. Se connecter
5. Créer une campagne
6. Voir le dashboard

### Interface Admin
1. Ouvrir http://localhost:3000/admin
2. Se connecter (n'importe quel email/mot de passe)
3. Explorer le dashboard
4. Naviguer dans les sections

## 📦 Scripts Disponibles

```bash
npm run dev      # Développement (http://localhost:3000)
npm run build    # Build production
npm start        # Serveur production
npm run lint     # Linter
```

## 🎨 Personnalisation

### Modifier les couleurs

Éditer `tailwind.config.ts`:

```typescript
colors: {
  orange: '#FF6600',  // Votre couleur
  // ...
}
```

### Modifier les données de démo

Éditer les fichiers dans `components/*/pages/`:
- Deals dans `DashboardPage.tsx`
- Métriques dans les dashboards
- Listes d'utilisateurs

## 🔧 Développement

### Structure des fichiers

```
app/
  ├── page.tsx              # Portail
  ├── client/page.tsx       # App client
  ├── vendeur/page.tsx      # App vendeur
  └── admin/page.tsx        # App admin

components/
  ├── ui/                   # Composants réutilisables
  ├── client/               # Composants client
  ├── vendeur/              # Composants vendeur
  └── admin/                # Composants admin

lib/stores/                 # Stores Zustand
```

### Ajouter une nouvelle page

1. Créer le composant dans `components/[interface]/pages/`
2. Ajouter le case dans le switch de `app/[interface]/page.tsx`
3. Ajouter la navigation dans le store

### Modifier un store

Éditer `lib/stores/[storeName].ts`:

```typescript
export const useClientStore = create<ClientState>((set) => ({
  // État initial
  myNewState: '',
  
  // Actions
  setMyNewState: (value) => set({ myNewState: value }),
}));
```

## 🐛 Dépannage

### Port 3000 déjà utilisé

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou utiliser un autre port
npm run dev -- -p 3001
```

### Erreur de build

```bash
# Nettoyer et réinstaller
rm -rf .next node_modules
npm install
npm run build
```

### Erreur TypeScript

```bash
# Vérifier les types
npx tsc --noEmit
```

## 📚 Documentation Complète

- **README.md** - Vue d'ensemble complète
- **DEPLOYMENT.md** - Guide de déploiement
- **CHANGELOG.md** - Historique des changements

## 🎓 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## ✅ Checklist de Développement

- [ ] Serveur de dev lancé
- [ ] Toutes les interfaces testées
- [ ] Navigation fonctionnelle
- [ ] Formulaires interactifs
- [ ] Animations fluides
- [ ] Responsive vérifié
- [ ] Build production réussi

## 🚀 Prochaines Étapes

1. **Backend**
   - Créer les API routes dans `app/api/`
   - Connecter une base de données
   - Implémenter l'authentification

2. **Features**
   - Upload d'images
   - Paiement Mobile Money
   - Notifications en temps réel
   - Email/SMS

3. **Déploiement**
   - Configurer Vercel
   - Ajouter les variables d'environnement
   - Tester en production

---

**Besoin d'aide ?** Consultez la documentation complète dans README.md
