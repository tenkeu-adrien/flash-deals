'use client';

import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 text-[14px] font-semibold">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3.5 py-3.5 rounded-[12px] border-2 border-[#333] bg-[#1a1a1a] text-white text-[16px] transition-all duration-300 focus:outline-none focus:border-[#FF6600] focus:shadow-[0_0_0_3px_rgba(255,102,0,0.1)] ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-[12px] text-[#FF3D00]">{error}</p>
      )}
    </div>
  );
}
