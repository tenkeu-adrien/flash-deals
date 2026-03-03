# 🛠️ Commandes Utiles - Flash Deals

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Ou avec pnpm (plus rapide)
pnpm install

# Ou avec yarn
yarn install
```

## 🚀 Développement

```bash
# Lancer le serveur de développement
npm run dev

# Lancer sur un port spécifique
npm run dev -- -p 3001

# Lancer avec Turbopack (plus rapide)
npm run dev --turbo
```

## 🏗️ Build

```bash
# Build pour production
npm run build

# Analyser le bundle
npm run build -- --analyze

# Build avec profiling
npm run build -- --profile
```

## 🌐 Production

```bash
# Lancer en mode production (après build)
npm start

# Lancer sur un port spécifique
npm start -- -p 3000
```

## 🧹 Nettoyage

```bash
# Nettoyer le cache Next.js
rm -rf .next

# Nettoyer node_modules
rm -rf node_modules

# Nettoyer tout et réinstaller
rm -rf .next node_modules package-lock.json
npm install
```

## 🔍 Linting & Formatting

```bash
# Linter (à configurer)
npm run lint

# Fix automatique
npm run lint -- --fix

# Prettier (à configurer)
npx prettier --write .
```

## 🧪 Tests (à implémenter)

```bash
# Tests unitaires
npm test

# Tests en mode watch
npm test -- --watch

# Coverage
npm test -- --coverage

# Tests E2E
npm run test:e2e
```

## 📊 Analyse

```bash
# Analyser le bundle
npm run build
npx @next/bundle-analyzer

# Vérifier les types TypeScript
npx tsc --noEmit

# Vérifier les dépendances obsolètes
npm outdated

# Mettre à jour les dépendances
npm update
```

## 🐛 Debugging

```bash
# Mode debug Node.js
NODE_OPTIONS='--inspect' npm run dev

# Avec breakpoints
node --inspect-brk node_modules/.bin/next dev

# Logs détaillés
DEBUG=* npm run dev
```

## 📱 Mobile Testing

```bash
# Exposer sur le réseau local
npm run dev -- -H 0.0.0.0

# Puis accéder via http://[votre-ip]:3000
```

## 🔐 Variables d'Environnement

```bash
# Copier l'exemple
cp .env.local.example .env.local

# Éditer les variables
nano .env.local  # ou vim, code, etc.

# Vérifier les variables
npm run dev  # Les variables sont chargées automatiquement
```

## 📦 Gestion des Dépendances

```bash
# Ajouter une dépendance
npm install [package]

# Ajouter en dev
npm install -D [package]

# Supprimer une dépendance
npm uninstall [package]

# Lister les dépendances
npm list

# Vérifier les vulnérabilités
npm audit

# Corriger les vulnérabilités
npm audit fix
```

## 🚀 Déploiement

### Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Login
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

### Docker

```bash
# Build l'image
docker build -t flash-deals .

# Run le container
docker run -p 3000:3000 flash-deals

# Avec docker-compose
docker-compose up -d

# Arrêter
docker-compose down

# Voir les logs
docker-compose logs -f
```

### PM2 (VPS)

```bash
# Installer PM2
npm install -g pm2

# Build
npm run build

# Démarrer
pm2 start npm --name "flash-deals" -- start

# Arrêter
pm2 stop flash-deals

# Redémarrer
pm2 restart flash-deals

# Logs
pm2 logs flash-deals

# Monitoring
pm2 monit

# Sauvegarder la config
pm2 save

# Startup script
pm2 startup
```

## 🔄 Git

```bash
# Initialiser
git init

# Ajouter tous les fichiers
git add .

# Commit
git commit -m "Initial commit"

# Ajouter remote
git remote add origin [url]

# Push
git push -u origin main

# Créer une branche
git checkout -b feature/my-feature

# Merge
git checkout main
git merge feature/my-feature
```

## 📊 Performance

```bash
# Lighthouse audit
npx lighthouse http://localhost:3000 --view

# Bundle analyzer
npm run build
npx @next/bundle-analyzer

# Mesurer le temps de build
time npm run build
```

## 🔧 Maintenance

```bash
# Vérifier la santé du projet
npm doctor

# Nettoyer le cache npm
npm cache clean --force

# Vérifier l'intégrité
npm audit

# Mettre à jour Next.js
npm install next@latest react@latest react-dom@latest

# Mettre à jour toutes les dépendances
npx npm-check-updates -u
npm install
```

## 📝 Génération de Code (à configurer)

```bash
# Générer un composant
npx plop component

# Générer une page
npx plop page

# Générer un store
npx plop store
```

## 🌐 Internationalisation (à implémenter)

```bash
# Extraire les traductions
npm run i18n:extract

# Compiler les traductions
npm run i18n:compile
```

## 📸 Screenshots (à implémenter)

```bash
# Prendre des screenshots
npm run screenshots

# Générer des previews
npm run previews
```

## 🎨 Storybook (à implémenter)

```bash
# Lancer Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

## 📚 Documentation (à implémenter)

```bash
# Générer la documentation
npm run docs

# Servir la documentation
npm run docs:serve
```

## 🔍 Commandes Utiles

```bash
# Trouver les fichiers volumineux
find . -type f -size +1M

# Compter les lignes de code
find . -name '*.tsx' -o -name '*.ts' | xargs wc -l

# Rechercher dans les fichiers
grep -r "searchTerm" ./components

# Lister les dépendances inutilisées
npx depcheck
```

## 🆘 Dépannage

```bash
# Port déjà utilisé (Windows)
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Port déjà utilisé (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Problème de cache
rm -rf .next node_modules package-lock.json
npm install

# Problème TypeScript
npx tsc --noEmit
```

## 📱 URLs de Développement

```
Portail:    http://localhost:3000
Client:     http://localhost:3000/client
Vendeur:    http://localhost:3000/vendeur
Admin:      http://localhost:3000/admin
```

## 🎯 Raccourcis Utiles

```bash
# Alias à ajouter dans ~/.bashrc ou ~/.zshrc

alias fd-dev="npm run dev"
alias fd-build="npm run build"
alias fd-start="npm start"
alias fd-clean="rm -rf .next node_modules && npm install"
alias fd-logs="pm2 logs flash-deals"
```

---

**💡 Astuce:** Ajoutez ces commandes à votre documentation d'équipe !
