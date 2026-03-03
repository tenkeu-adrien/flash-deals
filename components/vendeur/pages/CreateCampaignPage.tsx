'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Sidebar from '@/components/vendeur/Sidebar';

interface CreateCampaignPageProps {
  onNavigate: (page: string) => void;
}

export default function CreateCampaignPage({ onNavigate }: CreateCampaignPageProps) {
  const [step, setStep] = useState(1);

  return (
    <div className="flex">
      <Sidebar currentPage="create-campaign" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-[260px]">
        <header className="bg-bg-medium border-b border-[#333] px-8 py-4">
          <h1 className="text-2xl font-bold">Créer une campagne</h1>
          <p className="text-sm text-gray-medium">Configurez votre deal flash en quelques étapes</p>
        </header>

        <div className="p-8 max-w-[900px]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Progress */}
            <div className="flex justify-between mb-12 relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#333] z-0" />
              {['Produit', 'Prix', 'Durée', 'Validation'].map((label, index) => (
                <div key={index} className="flex flex-col items-center gap-2 relative z-10">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${
                    index + 1 <= step ? 'bg-orange border-orange' : 'bg-bg-medium border-[#333]'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-xs text-gray-medium">{label}</span>
                </div>
              ))}
            </div>

            {step === 1 && (
              <div>
                <Input label="Nom du produit" placeholder="Ex: Samsung Galaxy A54" required />
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-semibold">Description</label>
                  <textarea
                    className="w-full px-3.5 py-3.5 rounded-[12px] border-2 border-[#333] bg-bg-medium text-white min-h-[120px] focus:outline-none focus:border-orange"
                    placeholder="Décrivez votre produit..."
                  />
                </div>
                <div className="border-2 border-dashed border-[#333] rounded-[12px] p-8 text-center cursor-pointer hover:border-orange transition-colors">
                  <div className="text-5xl mb-4">📸</div>
                  <p className="text-sm text-gray-medium">Cliquez pour ajouter des images</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <Input label="Prix original" type="number" placeholder="245000" required />
                <Input label="Prix flash" type="number" placeholder="145000" required />
                <Input label="Stock disponible" type="number" placeholder="50" required />
                <div className="bg-orange/10 border border-orange rounded-lg p-4 mt-4">
                  <p className="text-sm">
                    💡 <strong>Réduction: 41%</strong> • Commission: 15% • Vous recevrez: 123,250 XAF par vente
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <Input label="Date de début" type="datetime-local" required />
                <Input label="Date de fin" type="datetime-local" required />
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-semibold">Durée suggérée</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['24h', '48h', '72h'].map((duration) => (
                      <button
                        key={duration}
                        className="px-4 py-3 bg-bg-medium border-2 border-[#333] rounded-lg hover:border-orange transition-colors"
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-8">
                <div className="text-6xl mb-6">✅</div>
                <h3 className="text-2xl font-bold mb-4">Campagne créée !</h3>
                <p className="text-gray-medium mb-6">
                  Votre campagne sera validée sous 2-4h et publiée automatiquement.
                </p>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              {step > 1 && step < 4 && (
                <Button variant="secondary" onClick={() => setStep(step - 1)} className="flex-1">
                  Retour
                </Button>
              )}
              {step < 4 ? (
                <Button variant="primary" onClick={() => setStep(step + 1)} className="flex-1">
                  Continuer →
                </Button>
              ) : (
                <Button variant="primary" onClick={() => onNavigate('campaigns')} className="w-full">
                  Voir mes campagnes
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
