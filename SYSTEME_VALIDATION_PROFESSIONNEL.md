# Système de Validation Professionnel avec Zod

## 📋 Vue d'ensemble

Un système complet de validation de formulaires avec Zod, intégré à Firebase (Auth, Firestore, Storage).

---

## 🎯 Composants créés

### 1. Schémas de validation Zod
**Fichier:** `lib/validations/schemas.ts`

#### Schémas disponibles:
- ✅ `loginSchema` - Connexion (email + password)
- ✅ `signupSchema` - Inscription (name, email, password, confirmPassword, terms)
- ✅ `resetPasswordSchema` - Réinitialisation mot de passe
- ✅ `otpSchema` - Code OTP (6 chiffres)
- ✅ `profileSchema` - Profil utilisateur (name, phone, city, address)
- ✅ `vendorSignupSchema` - Inscription vendeur (fullName, email, phone, businessName, etc.)
- ✅ `campaignSchema` - Création campagne (title, description, price, discount, stock, etc.)
- ✅ `orderSchema` - Commande (quantity, deliveryAddress, paymentMethod)
- ✅ `reviewSchema` - Avis (rating, comment)
- ✅ `searchSchema` - Recherche (query, category, price range, sort)
- ✅ `adminLoginSchema` - Connexion admin (email, password, role)

#### Fonctions utilitaires:
- `formatZodErrors()` - Formater les erreurs Zod
- `validateData()` - Valider des données avec un schéma

---

### 2. Hook personnalisé useForm
**Fichier:** `lib/hooks/useForm.ts`

#### Fonctionnalités:
```typescript
const {
  values,           // Valeurs du formulaire
  errors,           // Erreurs de validation
  isSubmitting,     // État de soumission
  isValid,          // Formulaire valide
  handleChange,     // Gérer changement de champ
  handleSubmit,     // Gérer soumission
  setFieldValue,    // Définir valeur d'un champ
  setFieldError,    // Définir erreur d'un champ
  clearErrors,      // Effacer toutes les erreurs
  reset,            // Réinitialiser le formulaire
  validateField,    // Valider un champ spécifique
} = useForm({
  schema: loginSchema,
  onSubmit: async (data) => { /* ... */ },
  initialValues: { email: '', password: '' }
});
```

---

### 3. Composants UI de formulaire

#### FormInput
**Fichier:** `components/ui/FormInput.tsx`

Caractéristiques:
- ✅ Toggle mot de passe (Eye/EyeOff)
- ✅ Icônes d'erreur/succès
- ✅ Messages d'erreur avec icône
- ✅ Texte d'aide
- ✅ Indicateur de champ requis (*)
- ✅ Styles adaptatifs (erreur/succès/normal)

```typescript
<FormInput
  label="Email"
  type="email"
  value={values.email}
  onChange={(value) => handleChange('email', value)}
  onBlur={() => validateField('email')}
  error={errors.email}
  required
  helperText="Utilisez votre email professionnel"
/>
```

#### FormTextarea
**Fichier:** `components/ui/FormTextarea.tsx`

Caractéristiques:
- ✅ Compteur de caractères
- ✅ Icônes d'erreur/succès
- ✅ Messages d'erreur
- ✅ Texte d'aide
- ✅ Limite de caractères

```typescript
<FormTextarea
  label="Description"
  value={values.description}
  onChange={(value) => handleChange('description', value)}
  error={errors.description}
  maxLength={1000}
  showCount
  rows={4}
  required
/>
```

#### FormSelect
**Fichier:** `components/ui/FormSelect.tsx`

Caractéristiques:
- ✅ Icône de flèche personnalisée
- ✅ Icônes d'erreur/succès
- ✅ Messages d'erreur
- ✅ Texte d'aide

```typescript
<FormSelect
  label="Ville"
  value={values.city}
  onChange={(value) => handleChange('city', value)}
  error={errors.city}
  options={[
    { value: 'Douala', label: 'Douala' },
    { value: 'Yaoundé', label: 'Yaoundé' }
  ]}
  required
/>
```

---

## 🚀 Exemples d'utilisation

### Exemple 1: Formulaire de connexion

```typescript
'use client';

import { useForm } from '@/lib/hooks/useForm';
import { loginSchema, LoginFormData } from '@/lib/validations/schemas';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import { loginWithEmail } from '@/lib/firebase/auth';

export default function LoginPage() {
  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    validateField
  } = useForm<LoginFormData>({
    schema: loginSchema,
    onSubmit: async (data) => {
      const result = await loginWithEmail(data.email, data.password);
      if (!result.success) {
        throw new Error(result.error);
      }
      // Redirection...
    },
    initialValues: {
      email: '',
      password: ''
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Email"
        type="email"
        value={values.email || ''}
        onChange={(value) => handleChange('email', value)}
        onBlur={() => validateField('email')}
        error={errors.email}
        required
      />

      <FormInput
        label="Mot de passe"
        type="password"
        value={values.password || ''}
        onChange={(value) => handleChange('password', value)}
        onBlur={() => validateField('password')}
        error={errors.password}
        required
      />

      {errors._general && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {errors._general}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} variant="primary" size="block">
        {isSubmitting ? 'Connexion...' : 'Se connecter'}
      </Button>
    </form>
  );
}
```

---

### Exemple 2: Formulaire d'inscription

```typescript
'use client';

import { useForm } from '@/lib/hooks/useForm';
import { signupSchema, SignupFormData } from '@/lib/validations/schemas';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import { signupWithEmail } from '@/lib/firebase/auth';

export default function SignupPage() {
  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    validateField
  } = useForm<SignupFormData>({
    schema: signupSchema,
    onSubmit: async (data) => {
      const result = await signupWithEmail(data.email, data.password, {
        displayName: data.name
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      // Redirection...
    },
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Nom complet"
        type="text"
        value={values.name || ''}
        onChange={(value) => handleChange('name', value)}
        onBlur={() => validateField('name')}
        error={errors.name}
        required
      />

      <FormInput
        label="Email"
        type="email"
        value={values.email || ''}
        onChange={(value) => handleChange('email', value)}
        onBlur={() => validateField('email')}
        error={errors.email}
        required
      />

      <FormInput
        label="Mot de passe"
        type="password"
        value={values.password || ''}
        onChange={(value) => handleChange('password', value)}
        onBlur={() => validateField('password')}
        error={errors.password}
        helperText="Min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre"
        required
      />

      <FormInput
        label="Confirmer le mot de passe"
        type="password"
        value={values.confirmPassword || ''}
        onChange={(value) => handleChange('confirmPassword', value)}
        onBlur={() => validateField('confirmPassword')}
        error={errors.confirmPassword}
        required
      />

      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={values.acceptTerms || false}
            onChange={(e) => handleChange('acceptTerms', e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">
            J'accepte les <a href="#" className="text-orange">conditions d'utilisation</a>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="mt-1 text-xs text-red-500">{errors.acceptTerms}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} variant="primary" size="block">
        {isSubmitting ? 'Inscription...' : 'S\'inscrire'}
      </Button>
    </form>
  );
}
```

---

### Exemple 3: Formulaire de création de campagne

```typescript
'use client';

import { useForm } from '@/lib/hooks/useForm';
import { campaignSchema, CampaignFormData } from '@/lib/validations/schemas';
import FormInput from '@/components/ui/FormInput';
import FormTextarea from '@/components/ui/FormTextarea';
import FormSelect from '@/components/ui/FormSelect';
import Button from '@/components/ui/Button';
import { createCampaign } from '@/lib/firebase/firestore';
import { uploadCompressedImage } from '@/lib/firebase/storage';

export default function CreateCampaignPage() {
  const [images, setImages] = useState<File[]>([]);

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    validateField
  } = useForm<CampaignFormData>({
    schema: campaignSchema,
    onSubmit: async (data) => {
      // Upload des images
      const imageUrls: string[] = [];
      for (const image of images) {
        const result = await uploadCompressedImage(image, 'campaigns', 1920, 0.8);
        if (result.success && result.url) {
          imageUrls.push(result.url);
        }
      }

      // Créer la campagne
      const result = await createCampaign({
        ...data,
        images: imageUrls,
        currentPrice: data.originalPrice * (1 - data.discount / 100),
        sold: 0,
        views: 0,
        interested: 0
      });

      if (!result.success) {
        throw new Error(result.error);
      }
      // Redirection...
    },
    initialValues: {
      title: '',
      description: '',
      originalPrice: 0,
      discount: 0,
      stock: 0,
      category: 'Électronique',
      delivery: 'Livraison gratuite à Douala et Yaoundé',
      location: 'Douala, Cameroun',
      duration: '24'
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Titre de la campagne"
        type="text"
        value={values.title || ''}
        onChange={(value) => handleChange('title', value)}
        onBlur={() => validateField('title')}
        error={errors.title}
        helperText="Min 10 caractères, max 100"
        required
      />

      <FormTextarea
        label="Description"
        value={values.description || ''}
        onChange={(value) => handleChange('description', value)}
        onBlur={() => validateField('description')}
        error={errors.description}
        maxLength={1000}
        showCount
        rows={4}
        required
      />

      <FormInput
        label="Prix original (FCFA)"
        type="number"
        value={values.originalPrice || ''}
        onChange={(value) => handleChange('originalPrice', parseFloat(value))}
        onBlur={() => validateField('originalPrice')}
        error={errors.originalPrice}
        min={100}
        max={10000000}
        required
      />

      <FormInput
        label="Réduction (%)"
        type="number"
        value={values.discount || ''}
        onChange={(value) => handleChange('discount', parseFloat(value))}
        onBlur={() => validateField('discount')}
        error={errors.discount}
        min={5}
        max={90}
        required
      />

      <FormInput
        label="Stock disponible"
        type="number"
        value={values.stock || ''}
        onChange={(value) => handleChange('stock', parseInt(value))}
        onBlur={() => validateField('stock')}
        error={errors.stock}
        min={1}
        max={10000}
        required
      />

      <FormSelect
        label="Catégorie"
        value={values.category || ''}
        onChange={(value) => handleChange('category', value)}
        error={errors.category}
        options={[
          { value: 'Électronique', label: 'Électronique' },
          { value: 'Mode', label: 'Mode' },
          { value: 'Maison', label: 'Maison' },
          { value: 'Beauté', label: 'Beauté' },
          { value: 'Sport', label: 'Sport' }
        ]}
        required
      />

      <Button type="submit" disabled={isSubmitting} variant="primary" size="block">
        {isSubmitting ? 'Création...' : 'Créer la campagne'}
      </Button>
    </form>
  );
}
```

---

## 📊 Règles de validation

### Email
- Format valide (xxx@xxx.xxx)
- Converti en minuscules
- Espaces supprimés

### Mot de passe
- Minimum 8 caractères
- Au moins 1 majuscule
- Au moins 1 minuscule
- Au moins 1 chiffre

### Téléphone (Cameroun)
- Format: 6XXXXXXXX (9 chiffres commençant par 6)
- Exemple: 677123456

### Prix
- Minimum: 100 FCFA
- Maximum: 10,000,000 FCFA
- Doit être positif

### Réduction
- Minimum: 5%
- Maximum: 90%
- Prix final minimum: 50 FCFA

### Stock
- Minimum: 1
- Maximum: 10,000
- Nombre entier

### Textes
- Titre campagne: 10-100 caractères
- Description: 20-1000 caractères
- Nom: 2-50 caractères
- Adresse: 5-200 caractères

---

## 🔥 Intégration Firebase

### Authentication
```typescript
import { loginWithEmail, signupWithEmail } from '@/lib/firebase/auth';

// Connexion
const result = await loginWithEmail(email, password);

// Inscription
const result = await signupWithEmail(email, password, {
  displayName: name,
  phoneNumber: phone
});
```

### Firestore
```typescript
import { createCampaign, createOrder } from '@/lib/firebase/firestore';

// Créer une campagne
const result = await createCampaign(campaignData);

// Créer une commande
const result = await createOrder(orderData);
```

### Storage
```typescript
import { uploadCompressedImage } from '@/lib/firebase/storage';

// Upload avec compression
const result = await uploadCompressedImage(
  file,
  'campaigns',  // dossier
  1920,         // largeur max
  0.8           // qualité (0-1)
);
```

---

## ✅ Checklist d'implémentation

### Pour chaque formulaire:
- [ ] Créer/utiliser le schéma Zod approprié
- [ ] Utiliser le hook `useForm`
- [ ] Remplacer `Input` par `FormInput`
- [ ] Remplacer `textarea` par `FormTextarea`
- [ ] Remplacer `select` par `FormSelect`
- [ ] Ajouter validation onBlur pour chaque champ
- [ ] Gérer les erreurs générales
- [ ] Ajouter état de chargement
- [ ] Intégrer Firebase (Auth/Firestore/Storage)
- [ ] Tester tous les cas d'erreur
- [ ] Tester la soumission réussie

---

## 🎨 Styles et UX

### États visuels:
- **Normal**: Bordure grise (#333)
- **Focus**: Bordure orange (#FF6600) + ombre
- **Erreur**: Bordure rouge + icône AlertCircle
- **Succès**: Bordure verte + icône CheckCircle
- **Disabled**: Opacité réduite + curseur not-allowed

### Feedback utilisateur:
- Messages d'erreur clairs et spécifiques
- Icônes visuelles (erreur/succès)
- Validation en temps réel (onBlur)
- Compteur de caractères
- Indicateurs de champs requis (*)
- Textes d'aide

---

## 🚀 Prochaines étapes

1. **Migrer tous les formulaires existants** vers le nouveau système
2. **Ajouter validation côté serveur** (Firebase Functions)
3. **Implémenter rate limiting** pour éviter les abus
4. **Ajouter tests unitaires** pour les schémas Zod
5. **Créer documentation utilisateur** pour les règles de validation

---

## 📝 Notes importantes

- Toujours valider côté client ET serveur
- Ne jamais faire confiance aux données utilisateur
- Utiliser HTTPS en production
- Sanitiser les entrées avant stockage
- Logger les tentatives de validation échouées
- Implémenter CAPTCHA pour les formulaires sensibles

---

Système professionnel prêt à l'emploi! 🎉
