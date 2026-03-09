'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import { 
  getPaymentSettings, 
  setPaymentSettings,
  PaymentSettings 
} from '@/lib/firebase';

interface PaymentSettingsPageProps {
  onNavigate: (page: string) => void;
}

export default function PaymentSettingsPage({ onNavigate }: PaymentSettingsPageProps) {
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [orangeCode, setOrangeCode] = useState('');
  const [mobileCode, setMobileCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const result = await getPaymentSettings();
    
    if (result.success && result.settings) {
      setSettings(result.settings);
      setOrangeCode(result.settings.orangeMoneyCode);
      setMobileCode(result.settings.mobileMoneyCode);
    }
    
    setLoading(false);
  };

  const handleSave = async () => {
    if (!orangeCode.trim() || !mobileCode.trim()) {
      setMessage('Veuillez remplir tous les champs');
      return;
    }

    setSaving(true);
    setMessage('');

    const result = await setPaymentSettings(orangeCode.trim(), mobileCode.trim());

    if (result.success) {
      setMessage('✅ Codes marchands mis à jour avec succès');
      await loadSettings();
    } else {
      setMessage(`❌ Erreur: ${result.error}`);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar currentPage="payment-settings" onNavigate={onNavigate} />
        <div className="flex-1 ml-[260px] p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-bg-medium rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-20 bg-bg-medium rounded"></div>
              <div className="h-20 bg-bg-medium rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar currentPage="payment-settings" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-[260px]">
        <div className="p-8 max-w-4xl">
          <div className="mb-6">
            <h1 className="text-[28px] font-bold mb-2">Paramètres de Paiement</h1>
            <p className="text-sm text-gray-medium">
              Configurez les codes marchands pour Orange Money et Mobile Money
            </p>
          </div>

          <div className="bg-bg-medium rounded-lg border border-[#333] p-6">
            <div className="space-y-6">
              <div>
                <FormInput
                  label="Code Marchand Orange Money"
                  type="text"
                  value={orangeCode}
                  onChange={(value) => setOrangeCode(value)}
                  placeholder="Ex: OM-MERCHANT-001"
                  required
                />
                <p className="text-sm text-gray-dark mt-1">
                  Ce code sera affiché aux clients qui choisissent Orange Money
                </p>
              </div>

              <div>
                <FormInput
                  label="Code Marchand Mobile Money"
                  type="text"
                  value={mobileCode}
                  onChange={(value) => setMobileCode(value)}
                  placeholder="Ex: MM-MERCHANT-001"
                  required
                />
                <p className="text-sm text-gray-dark mt-1">
                  Ce code sera affiché aux clients qui choisissent Mobile Money
                </p>
              </div>

              {message && (
                <div className={`p-4 rounded-lg ${
                  message.includes('✅') 
                    ? 'bg-green/10 border border-green text-green' 
                    : 'bg-red/10 border border-red text-red'
                }`}>
                  {message}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-orange hover:bg-orange/80"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
                
                <Button
                  onClick={loadSettings}
                  variant="secondary"
                  disabled={saving}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-600/10 border border-blue-600 rounded-lg p-4">
            <h3 className="font-semibold text-blue-400 mb-2">ℹ️ Information</h3>
            <p className="text-sm text-blue-300">
              Les codes marchands sont utilisés par les clients pour effectuer leurs paiements.
              Assurez-vous que ces codes sont corrects et actifs auprès de vos fournisseurs de paiement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
