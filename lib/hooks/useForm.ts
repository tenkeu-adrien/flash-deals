// ============================================
// CUSTOM FORM HOOK WITH ZOD VALIDATION
// ============================================

import { useState } from 'react';
import { z } from 'zod';
import { formatZodErrors } from '@/lib/validations/schemas';

interface UseFormOptions<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void> | void;
  initialValues?: Partial<T>;
}

interface UseFormReturn<T> {
  values: Partial<T>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (name: keyof T, value: any) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setFieldValue: (name: keyof T, value: any) => void;
  setFieldError: (name: keyof T, error: string) => void;
  clearErrors: () => void;
  reset: () => void;
  validateField: (name: keyof T) => boolean;
}

/**
 * Hook personnalisé pour gérer les formulaires avec validation Zod
 */
export function useForm<T extends Record<string, any>>({
  schema,
  onSubmit,
  initialValues = {},
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<Partial<T>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  /**
   * Gérer le changement d'un champ
   */
  const handleChange = (name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur du champ
    if (errors[name as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as string];
        return newErrors;
      });
    }
  };

  /**
   * Définir la valeur d'un champ
   */
  const setFieldValue = (name: keyof T, value: any) => {
    handleChange(name, value);
  };

  /**
   * Définir l'erreur d'un champ
   */
  const setFieldError = (name: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [name as string]: error }));
  };

  /**
   * Effacer toutes les erreurs
   */
  const clearErrors = () => {
    setErrors({});
  };

  /**
   * Réinitialiser le formulaire
   */
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
    setIsValid(false);
  };

  /**
   * Valider un champ spécifique
   */
  const validateField = (name: keyof T): boolean => {
    try {
      // Créer un schéma partiel pour valider un seul champ
      const fieldSchema = schema.pick({ [name]: true } as any);
      fieldSchema.parse({ [name]: values[name] });
      
      // Effacer l'erreur si la validation réussit
      if (errors[name as string]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name as string];
          return newErrors;
        });
      }
      
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = formatZodErrors(error);
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }
      return false;
    }
  };

  /**
   * Gérer la soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Valider les données avec le schéma Zod
      const validatedData = schema.parse(values);
      setIsValid(true);

      // Appeler la fonction onSubmit
      await onSubmit(validatedData);
    } catch (error) {
      setIsValid(false);
      
      if (error instanceof z.ZodError) {
        // Formater les erreurs Zod
        const formattedErrors = formatZodErrors(error);
        setErrors(formattedErrors);
      } else {
        // Erreur générale
        setErrors({ _general: 'Une erreur est survenue lors de la soumission' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    isValid,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldError,
    clearErrors,
    reset,
    validateField,
  };
}
