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
      <label className="block text-sm font-medium text-gray-700 mb-1">
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
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
          error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300'
        }`}
      />
      
      <datalist id="cities-list">
        {CAMEROON_CITIES.map((city) => (
          <option key={city} value={city} />
        ))}
      </datalist>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      <p className="mt-1 text-xs text-gray-500">
        Sélectionnez une ville ou tapez la vôtre
      </p>
    </div>
  );
}
