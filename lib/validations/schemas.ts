// ============================================
// ZOD VALIDATION SCHEMAS
// ============================================

import { z } from 'zod';

// ============================================
// AUTHENTICATION SCHEMAS
// ============================================

/**
 * Schéma de validation pour la connexion
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Schéma de validation pour l'inscription
 */
export const signupSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom ne peut contenir que des lettres')
    .trim(),
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(100, 'Le mot de passe ne peut pas dépasser 100 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  confirmPassword: z.string().min(1, 'Veuillez confirmer le mot de passe'),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, 'Vous devez accepter les conditions d\'utilisation'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export type SignupFormData = z.infer<typeof signupSchema>;

/**
 * Schéma de validation pour la réinitialisation du mot de passe
 */
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide')
    .toLowerCase()
    .trim(),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Schéma de validation pour le code OTP
 */
export const otpSchema = z.object({
  code: z
    .string()
    .min(1, 'Le code est requis')
    .length(6, 'Le code doit contenir 6 chiffres')
    .regex(/^\d{6}$/, 'Le code doit contenir uniquement des chiffres'),
});

export type OTPFormData = z.infer<typeof otpSchema>;

// ============================================
// PROFILE SCHEMAS
// ============================================

/**
 * Schéma de validation pour le profil utilisateur
 */
export const profileSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .trim(),
  phone: z
    .string()
    .min(1, 'Le téléphone est requis')
    .regex(/^6[0-9]{8}$/, 'Format de téléphone invalide (ex: 6XXXXXXXX)')
    .trim(),
  city: z
    .string()
    .min(1, 'La ville est requise')
    .refine((val) => ['Douala', 'Yaoundé'].includes(val), 'Ville non supportée'),
  region: z
    .string()
    .min(1, 'La région est requise')
    .optional(),
  address: z
    .string()
    .min(5, 'L\'adresse doit contenir au moins 5 caractères')
    .max(200, 'L\'adresse ne peut pas dépasser 200 caractères')
    .optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// ============================================
// VENDOR SCHEMAS
// ============================================

/**
 * Schéma de validation pour l'inscription vendeur
 */
export const vendorSignupSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Le nom complet est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .trim(),
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide')
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .min(1, 'Le téléphone est requis')
    .regex(/^6[0-9]{8}$/, 'Format de téléphone invalide (ex: 6XXXXXXXX)')
    .trim(),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(100, 'Le mot de passe ne peut pas dépasser 100 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  businessName: z
    .string()
    .min(1, 'Le nom de l\'entreprise est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .trim(),
  businessType: z
    .string()
    .min(1, 'Le type d\'entreprise est requis')
    .trim(),
  city: z
    .string()
    .min(1, 'La ville est requise')
    .refine((val) => ['Douala', 'Yaoundé'].includes(val), 'Ville non supportée'),
  address: z
    .string()
    .min(5, 'L\'adresse doit contenir au moins 5 caractères')
    .max(200, 'L\'adresse ne peut pas dépasser 200 caractères')
    .trim(),
  description: z
    .string()
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .optional(),
});

export type VendorSignupFormData = z.infer<typeof vendorSignupSchema>;

// ============================================
// CAMPAIGN SCHEMAS
// ============================================

/**
 * Schéma de validation pour la création de campagne
 */
export const campaignSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .min(10, 'Le titre doit contenir au moins 10 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères')
    .trim(),
  description: z
    .string()
    .min(1, 'La description est requise')
    .min(20, 'La description doit contenir au moins 20 caractères')
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .trim(),
  originalPrice: z
    .number({
      required_error: 'Le prix original est requis',
      invalid_type_error: 'Le prix doit être un nombre',
    })
    .positive('Le prix doit être positif')
    .min(100, 'Le prix minimum est 100 FCFA')
    .max(10000000, 'Le prix maximum est 10,000,000 FCFA'),
  discount: z
    .number({
      required_error: 'La réduction est requise',
      invalid_type_error: 'La réduction doit être un nombre',
    })
    .min(5, 'La réduction minimum est 5%')
    .max(90, 'La réduction maximum est 90%'),
  stock: z
    .number({
      required_error: 'Le stock est requis',
      invalid_type_error: 'Le stock doit être un nombre',
    })
    .int('Le stock doit être un nombre entier')
    .positive('Le stock doit être positif')
    .min(1, 'Le stock minimum est 1')
    .max(10000, 'Le stock maximum est 10,000'),
  category: z
    .string()
    .min(1, 'La catégorie est requise'),
  delivery: z
    .string()
    .min(1, 'Les informations de livraison sont requises')
    .max(200, 'Les informations de livraison ne peuvent pas dépasser 200 caractères'),
  location: z
    .string()
    .min(1, 'La localisation est requise')
    .max(100, 'La localisation ne peut pas dépasser 100 caractères'),
  duration: z
    .string()
    .min(1, 'La durée est requise')
    .refine((val) => ['24', '48', '72'].includes(val), 'Durée invalide'),
}).refine((data) => {
  const currentPrice = data.originalPrice * (1 - data.discount / 100);
  return currentPrice >= 50;
}, {
  message: 'Le prix après réduction doit être d\'au moins 50 FCFA',
  path: ['discount'],
});

export type CampaignFormData = z.infer<typeof campaignSchema>;

// ============================================
// ORDER SCHEMAS
// ============================================

/**
 * Schéma de validation pour la commande
 */
export const orderSchema = z.object({
  quantity: z
    .number({
      required_error: 'La quantité est requise',
      invalid_type_error: 'La quantité doit être un nombre',
    })
    .int('La quantité doit être un nombre entier')
    .positive('La quantité doit être positive')
    .min(1, 'La quantité minimum est 1')
    .max(100, 'La quantité maximum est 100'),
  deliveryAddress: z.object({
    street: z
      .string()
      .min(1, 'L\'adresse est requise')
      .min(5, 'L\'adresse doit contenir au moins 5 caractères')
      .max(200, 'L\'adresse ne peut pas dépasser 200 caractères'),
    city: z
      .string()
      .min(1, 'La ville est requise')
      .refine((val) => ['Douala', 'Yaoundé'].includes(val), 'Ville non supportée'),
    region: z
      .string()
      .min(1, 'La région est requise'),
    phone: z
      .string()
      .min(1, 'Le téléphone est requis')
      .regex(/^6[0-9]{8}$/, 'Format de téléphone invalide (ex: 6XXXXXXXX)'),
  }),
  paymentMethod: z
    .string()
    .min(1, 'Le mode de paiement est requis')
    .refine((val) => ['cash', 'mobile_money', 'card'].includes(val), 'Mode de paiement invalide'),
});

export type OrderFormData = z.infer<typeof orderSchema>;

// ============================================
// REVIEW SCHEMAS
// ============================================

/**
 * Schéma de validation pour les avis
 */
export const reviewSchema = z.object({
  rating: z
    .number({
      required_error: 'La note est requise',
      invalid_type_error: 'La note doit être un nombre',
    })
    .int('La note doit être un nombre entier')
    .min(1, 'La note minimum est 1')
    .max(5, 'La note maximum est 5'),
  comment: z
    .string()
    .min(1, 'Le commentaire est requis')
    .min(10, 'Le commentaire doit contenir au moins 10 caractères')
    .max(500, 'Le commentaire ne peut pas dépasser 500 caractères')
    .trim(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

// ============================================
// SEARCH SCHEMAS
// ============================================

/**
 * Schéma de validation pour la recherche
 */
export const searchSchema = z.object({
  query: z
    .string()
    .min(2, 'La recherche doit contenir au moins 2 caractères')
    .max(100, 'La recherche ne peut pas dépasser 100 caractères')
    .trim()
    .optional(),
  category: z
    .string()
    .optional(),
  minPrice: z
    .number()
    .positive('Le prix minimum doit être positif')
    .optional(),
  maxPrice: z
    .number()
    .positive('Le prix maximum doit être positif')
    .optional(),
  sortBy: z
    .enum(['price_asc', 'price_desc', 'date_desc', 'popularity'])
    .optional(),
}).refine((data) => {
  if (data.minPrice && data.maxPrice) {
    return data.minPrice <= data.maxPrice;
  }
  return true;
}, {
  message: 'Le prix minimum doit être inférieur au prix maximum',
  path: ['maxPrice'],
});

export type SearchFormData = z.infer<typeof searchSchema>;

// ============================================
// ADMIN SCHEMAS
// ============================================

/**
 * Schéma de validation pour la connexion admin
 */
export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  role: z
    .enum(['admin', 'super_admin'])
    .optional(),
});

export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Formater les erreurs Zod pour l'affichage
 */
export function formatZodErrors(errors: z.ZodError): Record<string, string> {
  const formattedErrors: Record<string, string> = {};
  
  errors.errors.forEach((error) => {
    const path = error.path.join('.');
    formattedErrors[path] = error.message;
  });
  
  return formattedErrors;
}

/**
 * Valider les données avec un schéma Zod
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: formatZodErrors(error) };
    }
    return { success: false, errors: { _general: 'Erreur de validation' } };
  }
}
