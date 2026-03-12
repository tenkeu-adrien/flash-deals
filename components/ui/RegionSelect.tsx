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
      <label className="block mb-2 text-[14px] font-semibold text-white">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`w-full px-3.5 py-3.5 rounded-[12px] border-2 bg-[#1a1a1a] text-white text-[16px] transition-all duration-300 focus:outline-none focus:border-[#FF6600] focus:shadow-[0_0_0_3px_rgba(255,102,0,0.1)] ${
          error 
            ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' 
            : 'border-[#333]'
        }`}
      >
        <option value="" className="bg-[#1a1a1a] text-white">Sélectionnez une région</option>
        {CAMEROON_REGIONS.map((region) => (
          <option key={region} value={region} className="bg-[#1a1a1a] text-white">
            {region}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1.5 text-[12px] text-red-500">{error}</p>
      )}
    </div>
  );
}
