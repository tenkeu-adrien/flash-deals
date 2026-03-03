'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

interface OTPPageProps {
  onNavigate: (page: string) => void;
}

export default function OTPPage({ onNavigate }: OTPPageProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="px-6 py-6 min-h-screen flex flex-col justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="text-6xl text-center mb-6">📱</div>
        <h1 className="text-2xl font-bold mb-2 text-center">Vérification</h1>
        <p className="text-sm text-gray-medium mb-8 text-center">
          Entrez le code à 6 chiffres envoyé au<br />
          <strong className="text-white">+237 6 XX XX XX XX</strong>
        </p>

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-[60px] h-[60px] text-center text-2xl font-bold border-2 border-[#333] rounded-[12px] bg-bg-medium text-white focus:outline-none focus:border-orange"
            />
          ))}
        </div>

        <Button
          variant="primary"
          size="block"
          onClick={() => onNavigate('profile-setup')}
          disabled={otp.some(d => !d)}
        >
          Vérifier
        </Button>

        <p className="text-center text-sm text-gray-medium mt-6">
          Code non reçu ?{' '}
          <button className="text-orange font-semibold">Renvoyer (45s)</button>
        </p>
      </motion.div>
    </div>
  );
}
