# 🤝 Guide de Contribution - Flash Deals

Merci de votre intérêt pour contribuer à Flash Deals ! Ce guide vous aidera à démarrer.

## 📋 Table des Matières

- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Standards de Code](#standards-de-code)
- [Structure du Projet](#structure-du-projet)
- [Workflow Git](#workflow-git)
- [Tests](#tests)

## Code de Conduite

- Soyez respectueux et professionnel
- Acceptez les critiques constructives
- Concentrez-vous sur ce qui est meilleur pour la communauté
- Montrez de l'empathie envers les autres membres

## Comment Contribuer

### Signaler un Bug

1. Vérifiez que le bug n'a pas déjà été signalé
2. Créez une issue avec:
   - Description claire du problème
   - Étapes pour reproduire
   - Comportement attendu vs actuel
   - Screenshots si applicable
   - Environnement (OS, navigateur, version)

### Proposer une Fonctionnalité

1. Créez une issue décrivant:
   - Le problème que ça résout
   - La solution proposée
   - Les alternatives considérées
   - Impact sur l'existant

### Soumettre une Pull Request

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Standards de Code

### TypeScript

```typescript
// ✅ Bon
interface UserProps {
  name: string;
  email: string;
  age?: number;
}

const user: UserProps = {
  name: 'John',
  email: 'john@example.com',
};

// ❌ Mauvais
const user = {
  name: 'John',
  email: 'john@example.com',
};
```

### Composants React

```typescript
// ✅ Bon - Composant fonctionnel avec types
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {label}
    </button>
  );
}

// ❌ Mauvais - Sans types
export default function Button({ label, onClick, variant }) {
  return <button onClick={onClick}>{label}</button>;
}
```

### Naming Conventions

```typescript
// Composants: PascalCase
export default function UserProfile() {}

// Fonctions: camelCase
function getUserData() {}

// Constantes: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// Interfaces: PascalCase avec 'I' optionnel
interface UserData {}

// Types: PascalCase
type UserRole = 'admin' | 'user';
```

### Tailwind CSS

```typescript
// ✅ Bon - Classes organisées
<div className="flex items-center justify-between px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange-dark transition-colors">

// ❌ Mauvais - Classes désorganisées
<div className="bg-orange flex rounded-lg text-white px-4 hover:bg-orange-dark py-2 items-center transition-colors justify-between">
```

### Zustand Stores

```typescript
// ✅ Bon - Store typé avec actions claires
interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

// ❌ Mauvais - Sans types
export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

## Structure du Projet

### Organisation des Fichiers

```
app/
  ├── [interface]/
  │   └── page.tsx          # Page principale de l'interface

components/
  ├── ui/                   # Composants réutilisables
  │   ├── Button.tsx
  │   ├── Input.tsx
  │   └── Card.tsx
  ├── [interface]/          # Composants spécifiques
  │   ├── Header.tsx
  │   ├── Sidebar.tsx
  │   └── pages/            # Pages de l'interface
  │       ├── HomePage.tsx
  │       └── DashboardPage.tsx

lib/
  ├── stores/               # Stores Zustand
  │   ├── clientStore.ts
  │   └── vendorStore.ts
  ├── utils/                # Fonctions utilitaires
  └── types/                # Types TypeScript
```

### Créer un Nouveau Composant

1. Créer le fichier dans le bon dossier
2. Définir l'interface des props
3. Implémenter le composant
4. Exporter par défaut
5. Documenter si nécessaire

```typescript
// components/ui/Badge.tsx
'use client';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error';
}

export default function Badge({ label, variant = 'success' }: BadgeProps) {
  const variants = {
    success: 'bg-green text-white',
    warning: 'bg-yellow text-black',
    error: 'bg-red text-white',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {label}
    </span>
  );
}
```

## Workflow Git

### Branches

- `main` - Production
- `develop` - Développement
- `feature/*` - Nouvelles fonctionnalités
- `fix/*` - Corrections de bugs
- `hotfix/*` - Corrections urgentes

### Commits

Format: `type(scope): message`

Types:
- `feat` - Nouvelle fonctionnalité
- `fix` - Correction de bug
- `docs` - Documentation
- `style` - Formatage
- `refactor` - Refactoring
- `test` - Tests
- `chore` - Maintenance

Exemples:
```bash
git commit -m "feat(client): add product filtering"
git commit -m "fix(vendor): correct campaign creation form"
git commit -m "docs(readme): update installation steps"
```

### Pull Request

Template:

```markdown
## Description
Brève description des changements

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Checklist
- [ ] Code suit les standards du projet
- [ ] Tests ajoutés/mis à jour
- [ ] Documentation mise à jour
- [ ] Build passe sans erreurs
- [ ] Testé localement

## Screenshots (si applicable)
```

## Tests

### Tests Unitaires (à implémenter)

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/ui/Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Tests E2E (à implémenter)

```typescript
// e2e/client-flow.spec.ts
import { test, expect } from '@playwright/test';

test('client can add product to cart', async ({ page }) => {
  await page.goto('/client');
  await page.click('text=S\'inscrire');
  // ... suite du test
});
```

## Checklist de Review

Avant de soumettre une PR, vérifiez:

- [ ] Code compile sans erreurs
- [ ] Pas de warnings TypeScript
- [ ] Styles Tailwind corrects
- [ ] Composants réutilisables si possible
- [ ] Props typées
- [ ] Animations fluides
- [ ] Responsive testé
- [ ] Accessible (labels, contraste)
- [ ] Performance optimale
- [ ] Documentation à jour

## Questions ?

- Créez une issue
- Contactez l'équipe
- Consultez la documentation

---

**Merci de contribuer à Flash Deals ! 🚀**
