'use client';

import { InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, type, className = '', ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 text-[14px] font-semibold">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          className={`w-full px-3.5 py-3.5 rounded-[12px] border-2 border-[#333] bg-[#1a1a1a] text-white text-[16px] transition-all duration-300 focus:outline-none focus:border-[#FF6600] focus:shadow-[0_0_0_3px_rgba(255,102,0,0.1)] ${isPassword ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-[12px] text-[#FF3D00]">{error}</p>
      )}
    </div>
  );
}
