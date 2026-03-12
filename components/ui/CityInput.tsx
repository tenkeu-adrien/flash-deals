'use client';

import { CAMEROON_CITIES } from '@/lib/firebase';

interface CityInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}

export function CityInput({ 
  label, 
  value, 
  onChange, 
  required = false,
  error 
}: CityInputProps) {
  return (
    <div className="w-full">
      <label className="block mb-2 text-[14px] font-semibold text-white">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <input
        type="text"
        list="cities-list"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder="Ex: Yaoundé"
        className={`w-full px-3.5 py-3.5 rounded-[12px] border-2 border-[#333] bg-[#1a1a1a] text-white text-[16px] transition-all duration-300 focus:outline-none focus:border-[#FF6600] focus:shadow-[0_0_0_3px_rgba(255,102,0,0.1)] ${
          error 
            ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' 
            : ''
        }`}
      />
      
      <datalist id="cities-list">
        {CAMEROON_CITIES.map((city) => (
          <option key={city} value={city} />
        ))}
      </datalist>
      
      {error && (
        <p className="mt-1.5 text-[12px] text-red-500">{error}</p>
      )}
      
      <p className="mt-1 text-xs text-gray-500">
        Sélectionnez une ville ou tapez la vôtre
      </p>
    </div>
  );
}
