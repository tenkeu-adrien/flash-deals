# 🚀 Guide de Déploiement - Flash Deals

## Déploiement sur Vercel (Recommandé)

### Prérequis
- Compte Vercel
- Repository Git (GitHub, GitLab, Bitbucket)

### Étapes

1. **Push vers Git**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Déployer sur Vercel**
- Aller sur [vercel.com](https://vercel.com)
- Cliquer sur "New Project"
- Importer votre repository
- Vercel détectera automatiquement Next.js
- Cliquer sur "Deploy"

3. **Configuration des Variables d'Environnement**
- Dans le dashboard Vercel, aller dans Settings > Environment Variables
- Ajouter vos variables d'environnement

### Configuration Automatique
Vercel configure automatiquement:
- Build command: `next build`
- Output directory: `.next`
- Install command: `npm install`

## Déploiement sur Netlify

### Étapes

1. **Créer netlify.toml**
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

2. **Déployer**
- Aller sur [netlify.com](https://netlify.com)
- New site from Git
- Sélectionner votre repository
- Deploy

## Déploiement Manuel (VPS/Serveur)

### Prérequis
- Node.js 18+ installé
- PM2 pour la gestion des processus
- Nginx comme reverse proxy

### Installation

```bash
# Cloner le projet
git clone <your-repo-url>
cd flash-deals-nextjs

# Installer les dépendances
npm install

# Build pour production
npm run build

# Installer PM2
npm install -g pm2

# Démarrer avec PM2
pm2 start npm --name "flash-deals" -- start

# Sauvegarder la configuration PM2
pm2 save
pm2 startup
```

### Configuration Nginx

```nginx
server {
    listen 80;
    server_name flashdeals.cm www.flashdeals.cm;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir le certificat
sudo certbot --nginx -d flashdeals.cm -d www.flashdeals.cm

# Renouvellement automatique
sudo certbot renew --dry-run
```

## Déploiement Docker

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### Commandes Docker

```bash
# Build
docker build -t flash-deals .

# Run
docker run -p 3000:3000 flash-deals

# Avec docker-compose
docker-compose up -d
```

## Variables d'Environnement de Production

Créer un fichier `.env.production`:

```env
NEXT_PUBLIC_APP_URL=https://flashdeals.cm
NEXT_PUBLIC_API_URL=https://api.flashdeals.cm

# Database
DATABASE_URL=postgresql://user:password@host:5432/flashdeals

# APIs
MTN_API_KEY=your-production-mtn-key
ORANGE_API_KEY=your-production-orange-key

# Services
SENDGRID_API_KEY=your-production-sendgrid-key
TWILIO_ACCOUNT_SID=your-production-twilio-sid
TWILIO_AUTH_TOKEN=your-production-twilio-token
```

## Optimisations de Production

### 1. Images
- Utiliser Next.js Image component
- Configurer un CDN (Cloudinary, Cloudflare)

### 2. Caching
- Configurer les headers de cache
- Utiliser Redis pour le cache serveur

### 3. Monitoring
- Installer Sentry pour le tracking d'erreurs
- Configurer Google Analytics
- Utiliser Vercel Analytics

### 4. Performance
- Activer la compression gzip
- Minifier les assets
- Lazy loading des composants

## Checklist de Déploiement

- [ ] Tests passent en local
- [ ] Build réussit sans erreurs
- [ ] Variables d'environnement configurées
- [ ] SSL/HTTPS activé
- [ ] Domaine configuré
- [ ] Monitoring activé
- [ ] Backups configurés
- [ ] CDN configuré pour les images
- [ ] Rate limiting activé
- [ ] Logs configurés

## Support et Maintenance

### Logs
```bash
# PM2
pm2 logs flash-deals

# Docker
docker logs <container-id>

# Vercel
Voir dans le dashboard Vercel
```

### Mise à jour
```bash
# Pull les changements
git pull origin main

# Rebuild
npm run build

# Redémarrer
pm2 restart flash-deals
```

## Troubleshooting

### Erreur de Build
- Vérifier les versions de Node.js
- Nettoyer le cache: `rm -rf .next node_modules && npm install`

### Erreur 502 Bad Gateway
- Vérifier que l'app tourne: `pm2 status`
- Vérifier les logs: `pm2 logs`

### Performance Lente
- Activer la compression
- Vérifier la taille du bundle
- Optimiser les images

---

**Note:** Ce guide couvre les déploiements les plus courants. Adaptez selon vos besoins spécifiques.
