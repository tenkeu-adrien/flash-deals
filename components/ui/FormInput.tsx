'use client';

import { InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

export default function FormInput({
  label,
  error,
  success,
  helperText,
  type,
  className = '',
  onChange,
  onBlur,
  ...props
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  
  const hasError = !!error;
  const hasSuccess = success && !hasError;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <input
          type={inputType}
          className={`
            w-full px-3.5 py-3.5 rounded-[12px] border-2 bg-[#1a1a1a] text-white text-[16px] 
            transition-all duration-300 focus:outline-none
            ${hasError 
              ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' 
              : hasSuccess
              ? 'border-green-500 focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.1)]'
              : 'border-[#333] focus:border-[#FF6600] focus:shadow-[0_0_0_3px_rgba(255,102,0,0.1)]'
            }
            ${isPassword ? 'pr-12' : hasError || hasSuccess ? 'pr-12' : ''}
            ${className}
          `}
          onChange={handleChange}
          onBlur={onBlur}
          {...props}
        />
        
        {/* Icône de mot de passe */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        
        {/* Icône d'erreur */}
        {hasError && !isPassword && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
            <AlertCircle size={20} />
          </div>
        )}
        
        {/* Icône de succès */}
        {hasSuccess && !isPassword && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <CheckCircle size={20} />
          </div>
        )}
      </div>
      
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
