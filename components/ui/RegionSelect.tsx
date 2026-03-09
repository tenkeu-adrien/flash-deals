'use client';

import { CAMEROON_REGIONS } from '@/lib/firebase';

interface RegionSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}

export function RegionSelect({ 
  label, 
  value, 
  onChange, 
  required = false,
  error 
}: RegionSelectProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
          error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300'
        }`}
      >
        <option value="">Sélectionnez une région</option>
        {CAMEROON_REGIONS.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
