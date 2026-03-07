# Guide de Migration des Formulaires

## 🎯 Objectif

Migrer tous les formulaires existants vers le nouveau système avec validation Zod.

---

## 📋 Formulaires à migrer

### Client (components/client/pages/)
1. ✅ LoginPage.tsx
2. ✅ SignupPage.tsx
3. ⏳ ProfileSetupPage.tsx
4. ⏳ OTPPage.tsx
5. ⏳ ProfilePage.tsx

### Vendeur (components/vendeur/pages/)
6. ⏳ LoginPage.tsx
7. ⏳ SignupPage.tsx (déjà partiellement fait)
8. ⏳ CreateCampaignPage.tsx
9. ⏳ SettingsPage.tsx

### Admin (components/admin/pages/)
10. ⏳ LoginPage.tsx

---

## 🔄 Processus de migration

### Étape 1: Identifier le schéma Zod

Choisir le schéma approprié dans `lib/validations/schemas.ts`:
- Login → `loginSchema`
- Signup → `signupSchema`
- Profile → `profileSchema`
- Campaign → `campaignSchema`
- etc.

### Étape 2: Remplacer useState par useForm

**Avant:**
```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
```

**Après:**
```typescript
import { useForm } from '@/lib/hooks/useForm';
import { loginSchema, LoginFormData } from '@/lib/validations/schemas';

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
    // Logique de soumission
  },
  initialValues: {
    email: '',
    password: ''
  }
});
```

### Étape 3: Remplacer les composants Input

**Avant:**
```typescript
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
```

**Après:**
```typescript
<FormInput
  label="Email"
  type="email"
  value={values.email || ''}
  onChange={(value) => handleChange('email', value)}
  onBlur={() => validateField('email')}
  error={errors.email}
  required
/>
```

### Étape 4: Mettre à jour la soumission

**Avant:**
```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  // Validation manuelle
  if (!email || !password) {
    setError('Tous les champs sont requis');
    setLoading(false);
    return;
  }

  const result = await loginWithEmail(email, password);
  
  if (!result.success) {
    setError(result.error || 'Erreur');
  }
  
  setLoading(false);
};
```

**Après:**
```typescript
// Dans useForm onSubmit:
onSubmit: async (data) => {
  const result = await loginWithEmail(data.email, data.password);
  
  if (!result.success) {
    throw new Error(result.error || 'Erreur de connexion');
  }
  
  // Redirection...
}
```

### Étape 5: Gérer les erreurs générales

```typescript
{errors._general && (
  <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
    {errors._general}
  </div>
)}
```

---

## 📝 Exemples de migration

### Exemple 1: LoginPage (Client)

**Fichier:** `components/client/pages/LoginPage.tsx`

```typescript
'use client';

import { useForm } from '@/lib/hooks/useForm';
import { loginSchema, LoginFormData } from '@/lib/validations/schemas';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import { loginWithEmail, loginWithGoogle, loginWithFacebook } from '@/lib/firebase/auth';
import { useClientStore } from '@/lib/stores/clientStore';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const { setUser, setCurrentPage } = useClientStore();

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    validateField,
    setFieldError
  } = useForm<LoginFormData>({
    schema: loginSchema,
    onSubmit: async (data) => {
      const result = await loginWithEmail(data.email, data.password);

      if (!result.success) {
        throw new Error(result.error || 'Erreur de connexion');
      }

      if (result.user) {
        setUser(result.user);
        setCurrentPage('dashboard');
        onNavigate('dashboard');
      }
    },
    initialValues: {
      email: '',
      password: ''
    }
  });

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    if (result.success && result.user) {
      setUser(result.user);
      setCurrentPage('dashboard');
      onNavigate('dashboard');
    } else {
      setFieldError('_general', result.error || 'Erreur de connexion Google');
    }
  };

  const handleFacebookLogin = async () => {
    const result = await loginWithFacebook();
    if (result.success && result.user) {
      setUser(result.user);
      setCurrentPage('dashboard');
      onNavigate('dashboard');
    } else {
      setFieldError('_general', result.error || 'Erreur de connexion Facebook');
    }
  };

  return (
    <div>
      <header className="header">
        <button onClick={() => onNavigate('home')}>
          🔥 Flash Deals
        </button>
      </header>

      <div className="container">
        <h1>Connexion</h1>

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email"
            type="email"
            value={values.email || ''}
            onChange={(value) => handleChange('email', value)}
            onBlur={() => validateField('email')}
            error={errors.email}
            placeholder="votre@email.com"
            required
          />

          <FormInput
            label="Mot de passe"
            type="password"
            value={values.password || ''}
            onChange={(value) => handleChange('password', value)}
            onBlur={() => validateField('password')}
            error={errors.password}
            placeholder="••••••••"
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

        <div className="divider">OU</div>

        <Button onClick={handleGoogleLogin} variant="secondary" size="block">
          <img src="/google-icon.svg" alt="Google" /> Continuer avec Google
        </Button>

        <Button onClick={handleFacebookLogin} variant="secondary" size="block">
          <img src="/facebook-icon.svg" alt="Facebook" /> Continuer avec Facebook
        </Button>

        <p className="text-center mt-4">
          Pas encore de compte?{' '}
          <a onClick={() => onNavigate('signup')} className="text-orange cursor-pointer">
            S'inscrire gratuitement
          </a>
        </p>
      </div>
    </div>
  );
}
```

---

### Exemple 2: CreateCampaignPage (Vendeur)

**Fichier:** `components/vendeur/pages/CreateCampaignPage.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useForm } from '@/lib/hooks/useForm';
import { campaignSchema, CampaignFormData } from '@/lib/validations/schemas';
import FormInput from '@/components/ui/FormInput';
import FormTextarea from '@/components/ui/FormTextarea';
import FormSelect from '@/components/ui/FormSelect';
import Button from '@/components/ui/Button';
import { createCampaign } from '@/lib/firebase/firestore';
import { uploadCompressedImage } from '@/lib/firebase/storage';
import { Timestamp } from 'firebase/firestore';

interface CreateCampaignPageProps {
  onNavigate: (page: string) => void;
}

export default function CreateCampaignPage({ onNavigate }: CreateCampaignPageProps) {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    validateField,
    setFieldError
  } = useForm<CampaignFormData>({
    schema: campaignSchema,
    onSubmit: async (data) => {
      // Validation des images
      if (images.length === 0) {
        throw new Error('Veuillez ajouter au moins une image');
      }

      // Upload des images
      const imageUrls: string[] = [];
      for (let i = 0; i < images.length; i++) {
        setUploadProgress(((i + 1) / images.length) * 100);
        const result = await uploadCompressedImage(images[i], 'campaigns', 1920, 0.8);
        if (result.success && result.url) {
          imageUrls.push(result.url);
        }
      }

      // Calculer le prix actuel
      const currentPrice = data.originalPrice * (1 - data.discount / 100);

      // Calculer les dates
      const now = new Date();
      const endDate = new Date(now.getTime() + parseInt(data.duration) * 60 * 60 * 1000);

      // Créer la campagne
      const result = await createCampaign({
        title: data.title,
        description: data.description,
        images: imageUrls,
        originalPrice: data.originalPrice,
        currentPrice,
        discount: data.discount,
        stock: data.stock,
        category: data.category,
        delivery: data.delivery,
        location: data.location,
        startDate: Timestamp.fromDate(now),
        endDate: Timestamp.fromDate(endDate),
        sold: 0,
        views: 0,
        interested: 0,
        vendorId: '' // Sera rempli par createCampaign
      });

      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la création');
      }

      // Redirection
      onNavigate('campaigns');
    },
    initialValues: {
      title: '',
      description: '',
      originalPrice: 0,
      discount: 10,
      stock: 1,
      category: 'Électronique',
      delivery: 'Livraison gratuite à Douala et Yaoundé',
      location: 'Douala, Cameroun',
      duration: '24'
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      if (files.length + images.length > 5) {
        setFieldError('_general', 'Maximum 5 images autorisées');
        return;
      }

      // Créer les previews
      const newPreviews: string[] = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === files.length) {
            setImagePreviews([...imagePreviews, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });

      setImages([...images, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2>Informations de base</h2>
            
            <FormInput
              label="Titre de la campagne"
              type="text"
              value={values.title || ''}
              onChange={(value) => handleChange('title', value)}
              onBlur={() => validateField('title')}
              error={errors.title}
              helperText="Soyez précis et attractif (10-100 caractères)"
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
              helperText="Décrivez votre produit en détail"
              required
            />

            <FormSelect
              label="Catégorie"
              value={values.category || ''}
              onChange={(value) => handleChange('category', value)}
              error={errors.category}
              options={[
                { value: 'Électronique', label: 'Électronique' },
                { value: 'Mode', label: 'Mode & Vêtements' },
                { value: 'Maison', label: 'Maison & Jardin' },
                { value: 'Beauté', label: 'Beauté & Santé' },
                { value: 'Sport', label: 'Sport & Loisirs' },
                { value: 'Alimentation', label: 'Alimentation' },
                { value: 'Autre', label: 'Autre' }
              ]}
              required
            />
          </div>
        );

      case 2:
        return (
          <div>
            <h2>Images du produit</h2>
            
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">
                Images (max 5) <span className="text-red-500">*</span>
              </label>
              
              <div className="border-2 border-dashed border-[#333] rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="text-5xl mb-4">📸</div>
                  <p className="text-sm text-gray-400">
                    Cliquez pour ajouter des images
                  </p>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2>Prix et stock</h2>
            
            <FormInput
              label="Prix original (FCFA)"
              type="number"
              value={values.originalPrice || ''}
              onChange={(value) => handleChange('originalPrice', parseFloat(value) || 0)}
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
              onChange={(value) => handleChange('discount', parseFloat(value) || 0)}
              onBlur={() => validateField('discount')}
              error={errors.discount}
              min={5}
              max={90}
              helperText="Entre 5% et 90%"
              required
            />

            {values.originalPrice && values.discount && (
              <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded-lg">
                <p className="text-sm text-green-500">
                  Prix final: {(values.originalPrice * (1 - values.discount / 100)).toLocaleString()} FCFA
                </p>
              </div>
            )}

            <FormInput
              label="Stock disponible"
              type="number"
              value={values.stock || ''}
              onChange={(value) => handleChange('stock', parseInt(value) || 0)}
              onBlur={() => validateField('stock')}
              error={errors.stock}
              min={1}
              max={10000}
              required
            />

            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">
                Durée de la campagne
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['24', '48', '72'].map((duration) => (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => handleChange('duration', duration)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      values.duration === duration
                        ? 'border-orange bg-orange/10'
                        : 'border-[#333] hover:border-orange/50'
                    }`}
                  >
                    {duration}h
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h2>Livraison et localisation</h2>
            
            <FormInput
              label="Informations de livraison"
              type="text"
              value={values.delivery || ''}
              onChange={(value) => handleChange('delivery', value)}
              onBlur={() => validateField('delivery')}
              error={errors.delivery}
              helperText="Ex: Livraison gratuite à Douala"
              required
            />

            <FormInput
              label="Localisation"
              type="text"
              value={values.location || ''}
              onChange={(value) => handleChange('location', value)}
              onBlur={() => validateField('location')}
              error={errors.location}
              helperText="Ex: Douala, Cameroun"
              required
            />
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1>Créer une campagne</h1>

      {/* Progress */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              s <= step ? 'bg-orange text-white' : 'bg-[#333] text-gray-400'
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {renderStep()}

        {errors._general && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {errors._general}
          </div>
        )}

        {isSubmitting && uploadProgress > 0 && (
          <div className="mb-4">
            <div className="w-full bg-[#333] rounded-full h-2">
              <div
                className="bg-orange h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2 text-center">
              Upload en cours... {Math.round(uploadProgress)}%
            </p>
          </div>
        )}

        <div className="flex gap-4">
          {step > 1 && (
            <Button
              type="button"
              onClick={() => setStep(step - 1)}
              variant="secondary"
              disabled={isSubmitting}
            >
              Retour
            </Button>
          )}
          
          {step < 4 ? (
            <Button
              type="button"
              onClick={() => setStep(step + 1)}
              variant="primary"
              className="flex-1"
            >
              Continuer →
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Création...' : 'Créer la campagne'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
```

---

## ✅ Checklist de migration

Pour chaque formulaire:

- [ ] Identifier le schéma Zod approprié
- [ ] Remplacer useState par useForm
- [ ] Remplacer Input par FormInput
- [ ] Remplacer textarea par FormTextarea
- [ ] Remplacer select par FormSelect
- [ ] Ajouter validation onBlur
- [ ] Gérer les erreurs générales
- [ ] Tester tous les champs
- [ ] Tester la soumission
- [ ] Tester les cas d'erreur
- [ ] Vérifier l'intégration Firebase
- [ ] Tester sur mobile

---

## 🚀 Ordre de migration recommandé

1. **Client LoginPage** (simple, 2 champs)
2. **Client SignupPage** (moyen, 4 champs + checkbox)
3. **Vendor LoginPage** (simple, 2 champs)
4. **Admin LoginPage** (simple, 2 champs)
5. **ProfileSetupPage** (moyen, 4 champs)
6. **CreateCampaignPage** (complexe, multi-step)
7. **VendorSignupPage** (complexe, multi-step)
8. **SettingsPage** (moyen, plusieurs onglets)
9. **OTPPage** (simple, 1 champ)
10. **ProfilePage** (moyen, plusieurs champs)

---

Migration complète = système professionnel! 🎉
