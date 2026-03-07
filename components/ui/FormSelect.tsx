'use client';

import { SelectHTMLAttributes } from 'react';
import { AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';

interface FormSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

export default function FormSelect({
  label,
  error,
  success,
  helperText,
  options,
  className = '',
  onChange,
  onBlur,
  ...props
}: FormSelectProps) {
  const hasError = !!error;
  const hasSuccess = success && !hasError;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
        <select
          className={`
            w-full px-3.5 py-3.5 rounded-[12px] border-2 bg-[#1a1a1a] text-white text-[16px] 
            transition-all duration-300 focus:outline-none appearance-none cursor-pointer
            ${hasError 
              ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' 
              : hasSuccess
              ? 'border-green-500 focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.1)]'
              : 'border-[#333] focus:border-[#FF6600] focus:shadow-[0_0_0_3px_rgba(255,102,0,0.1)]'
            }
            pr-12
            ${className}
          `}
          onChange={handleChange}
          onBlur={onBlur}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Icône de flèche */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <ChevronDown size={20} />
        </div>
        
        {/* Icône d'erreur */}
        {hasError && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2 text-red-500">
            <AlertCircle size={20} />
          </div>
        )}
        
        {/* Icône de succès */}
        {hasSuccess && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500">
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
