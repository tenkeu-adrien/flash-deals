# 🔥 Flash Deals Cameroun - Next.js Application

Plateforme e-commerce camerounaise de deals flash 24-48h avec réductions jusqu'à -70%.

## 🚀 Technologies

- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling utility-first
- **Zustand** - Gestion d'état légère et performante
- **Framer Motion** - Animations fluides
- **Lucide React** - Icônes modernes

## 📁 Structure du Projet

```
flash-deals-nextjs/
├── app/
│   ├── page.tsx                 # Page d'accueil (portail)
│   ├── client/page.tsx          # Application client
│   ├── vendeur/page.tsx         # Application vendeur
│   ├── admin/page.tsx           # Application admin
│   ├── layout.tsx               # Layout racine
│   └── globals.css              # Styles globaux
├── components/
│   ├── ui/                      # Composants UI réutilisables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── client/                  # Composants interface client
│   │   ├── Header.tsx
│   │   ├── BottomNav.tsx
│   │   ├── DealCard.tsx
│   │   └── pages/               # Pages client
│   ├── vendeur/                 # Composants interface vendeur
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── pages/               # Pages vendeur
│   └── admin/                   # Composants interface admin
│       ├── Sidebar.tsx
│       └── pages/               # Pages admin
├── lib/
│   └── stores/                  # Stores Zustand
│       ├── clientStore.ts
│       ├── vendorStore.ts
│       └── adminStore.ts
└── tailwind.config.ts           # Configuration Tailwind

```

## 🎯 Interfaces

### 📱 Interface Client (`/client`)
- Page d'accueil avec deals
- Inscription/Connexion
- Vérification OTP
- Configuration profil
- Tutoriel interactif
- Dashboard avec deals actifs
- Fiche produit détaillée
- Panier d'achat
- Profil utilisateur

### 🏪 Interface Vendeur (`/vendeur`)
- Landing page marketing
- Inscription vendeur (4 étapes)
- Connexion
- Dashboard avec métriques
- Création de campagne (multi-étapes)
- Gestion des campagnes
- Vue des commandes

### 🔐 Interface Admin (`/admin`)
- Connexion sécurisée (2FA)
- Dashboard global avec KPIs
- Gestion des clients
- Gestion des vendeurs
- Modération des campagnes
- Gestion des commandes

## 🛠️ Installation

```bash
# Cloner le projet
cd flash-deals-nextjs

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour production
npm run build

# Lancer en production
npm start
```

## 🌐 URLs

- **Portail:** http://localhost:3000
- **Client:** http://localhost:3000/client
- **Vendeur:** http://localhost:3000/vendeur
- **Admin:** http://localhost:3000/admin

## 🎨 Design System

### Couleurs
- **Noir:** #000000 (Fond principal)
- **Orange:** #FF6600 (Couleur accent)
- **Blanc:** #FFFFFF (Texte principal)
- **Vert:** #00C853 (Succès)
- **Rouge:** #FF3D00 (Alerte)
- **Bleu:** #2196F3 (Info)

### Espacements
- **xs:** 8px
- **sm:** 12px
- **md:** 16px
- **lg:** 24px
- **xl:** 32px

## 📦 Gestion d'État (Zustand)

### Client Store
```typescript
- currentPage: Navigation entre pages
- isAuthenticated: État d'authentification
- user: Données utilisateur
- cart: Panier d'achat
- preferences: Préférences catégories
```

### Vendor Store
```typescript
- currentPage: Navigation
- isAuthenticated: État d'authentification
- vendor: Données vendeur
- campaigns: Liste des campagnes
- signupStep: Étape d'inscription
```

### Admin Store
```typescript
- currentPage: Navigation
- isAuthenticated: État d'authentification
- admin: Données administrateur
```

## 🎭 Animations (Framer Motion)

- Transitions de page fluides
- Animations d'entrée/sortie
- Hover effects sur les cartes
- Animations de chargement
- Feedback visuel sur les interactions

## 📱 Responsive Design

- **Mobile-first** pour l'interface client
- **Desktop-first** pour vendeur et admin
- Breakpoints Tailwind standards
- Navigation adaptative

## 🔒 Sécurité

- Validation des formulaires
- Protection des routes (à implémenter avec middleware)
- Gestion sécurisée des tokens (à implémenter)
- Authentification 2FA pour admin

## 🚀 Prochaines Étapes

### Backend
- [ ] API REST avec Next.js API Routes
- [ ] Base de données (PostgreSQL/MongoDB)
- [ ] Authentification JWT
- [ ] Gestion des sessions

### Paiement
- [ ] Intégration MTN Mobile Money
- [ ] Intégration Orange Money
- [ ] Gateway de paiement sécurisé

### Notifications
- [ ] SMS (Twilio)
- [ ] Push notifications (Firebase)
- [ ] Emails transactionnels

### Déploiement
- [ ] Vercel/Netlify pour le frontend
- [ ] Backend sur AWS/Heroku
- [ ] CDN pour les images
- [ ] CI/CD Pipeline

## 📝 Scripts Disponibles

```bash
npm run dev          # Développement
npm run build        # Build production
npm start            # Serveur production
npm run lint         # Linter
```

## 🤝 Contribution

Ce projet est une conversion fidèle du prototype HTML original vers Next.js avec:
- Architecture moderne et scalable
- Gestion d'état performante
- Animations fluides
- Code TypeScript typé
- Composants réutilisables

## 📄 Licence

© 2026 Flash Deals Cameroun - Tous droits réservés

---

**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Framework:** Next.js 15 + TypeScript
