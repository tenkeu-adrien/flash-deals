'use client';

import { TextareaHTMLAttributes } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface FormTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  showCount?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

export default function FormTextarea({
  label,
  error,
  success,
  helperText,
  showCount,
  className = '',
  maxLength,
  value = '',
  onChange,
  onBlur,
  ...props
}: FormTextareaProps) {
  const hasError = !!error;
  const hasSuccess = success && !hasError;
  const currentLength = String(value).length;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 text-[14px] font-semibold text-white">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <textarea
          className={`
            w-full px-3.5 py-3.5 rounded-[12px] border-2 bg-[#1a1a1a] text-white text-[16px] 
            transition-all duration-300 focus:outline-none resize-none
            ${hasError 
              ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' 
              : hasSuccess
              ? 'border-green-500 focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.1)]'
              : 'border-[#333] focus:border-[#FF6600] focus:shadow-[0_0_0_3px_rgba(255,102,0,0.1)]'
            }
            ${className}
          `}
          value={value}
          maxLength={maxLength}
          onChange={handleChange}
          onBlur={onBlur}
          {...props}
        />
        
        {/* Icône d'erreur */}
        {hasError && (
          <div className="absolute right-3 top-3 text-red-500">
            <AlertCircle size={20} />
          </div>
        )}
        
        {/* Icône de succès */}
        {hasSuccess && (
          <div className="absolute right-3 top-3 text-green-500">
            <CheckCircle size={20} />
          </div>
        )}
      </div>
      
      {/* Compteur de caractères */}
      {showCount && maxLength && (
        <div className="mt-1.5 text-[12px] text-gray-400 text-right">
          {currentLength} / {maxLength}
        </div>
      )}
      
      {/* Message d'erreur */}
      {error && (
        <p className="mt-1.5 text-[12px] text-red-500 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
      
      {/* Texte d'aide */}
      {helperText && !error && (
        <p className="mt-1.5 text-[12px] text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}
