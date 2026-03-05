'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useVendorStore } from '@/lib/stores/vendorStore';
import { signupWithEmail } from '@/lib/firebase/auth';
import { createVendorProfile } from '@/lib/firebase/firestore';
import { uploadCompressedImage } from '@/lib/firebase/storage';

interface SignupPageProps {
  onNavigate: (page: string) => void;
}

export default function SignupPage({ onNavigate }: SignupPageProps) {
  const { signupStep, nextSignupStep, prevSignupStep, setSignupStep } = useVendorStore();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    businessName: '',
    businessType: '',
    city: 'Douala',
    address: '',
    description: ''
  });
  
  const [cniFile, setCniFile] = useState<File | null>(null);
  const [registreFile, setRegistreFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cni' | 'registre') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'cni') {
        setCniFile(e.target.files[0]);
      } else {
        setRegistreFile(e.target.files[0]);
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Validation
      if (!formData.email || !formData.password || !formData.fullName) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      if (formData.password.length < 8) {
        throw new Error('Le mot de passe doit contenir au moins 8 caractères');
      }

      if (!cniFile) {
        throw new Error('La CNI est obligatoire');
      }

      // Créer le compte utilisateur
      const authResult = await signupWithEmail(formData.email, formData.password, {
        displayName: formData.fullName,
        phoneNumber: formData.phone
      });
      
      if (!authResult.success) {
        throw new Error(authResult.error || 'Erreur lors de la création du compte');
      }

      // Upload des documents
      let cniUrl = '';
      let registreUrl = '';

      if (cniFile) {
        const cniResult = await uploadCompressedImage(cniFile, 'vendor-documents', 1920, 0.9);
        if (cniResult.success && cniResult.url) {
          cniUrl = cniResult.url;
        }
      }

      if (registreFile) {
        const registreResult = await uploadCompressedImage(registreFile, 'vendor-documents', 1920, 0.9);
        if (registreResult.success && registreResult.url) {
          registreUrl = registreResult.url;
        }
      }

      // Créer le profil vendeur
      const vendorData = {
        businessName: formData.businessName,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}`,
        description: formData.description || `${formData.businessType} à ${formData.city}`,
        cniUrl,
        registreUrl,
        businessType: formData.businessType,
        city: formData.city
      };

      const profileResult = await createVendorProfile(vendorData);
      
      if (!profileResult.success) {
        throw new Error(profileResult.error || 'Erreur lors de la création du profil');
      }

      // Passer à l'étape de confirmation
      setSignupStep(4);
      
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      console.error('Erreur inscription vendeur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setError('');
    
    if (signupStep === 1) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
        setError('Veuillez remplir tous les champs');
        return;
      }
      if (formData.password.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères');
        return;
      }
    }
    
    if (signupStep === 2) {
      if (!formData.businessName || !formData.businessType || !formData.address) {
        setError('Veuillez remplir tous les champs');
        return;
      }
    }
    
    if (signupStep === 3) {
      if (!cniFile) {
        setError('La CNI est obligatoire');
        return;
      }
      // Soumettre l'inscription
      handleSubmit();
      return;
    }
    
    nextSignupStep();
  };

  const steps = ['Informations', 'Entreprise', 'Documents', 'Validation'];

  const renderStep = () => {
    switch (signupStep) {
      case 1:
        return (
          <div>
            <Input 
              label="Nom complet" 
              name="fullName"
              type="text" 
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Ex: Jean Kamga" 
              required 
            />
            <Input 
              label="Email" 
              name="email"
              type="email" 
              value={formData.email}
              onChange={handleInputChange}
              placeholder="votre@email.com" 
              required 
            />
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Téléphone</label>
              <div className="flex gap-2">
                <select className="w-20 px-3.5 py-3.5 rounded-[12px] border-2 border-[#333] bg-bg-medium text-white">
                  <option>+237</option>
                </select>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="6 XX XX XX XX"
                  className="flex-1 px-3.5 py-3.5 rounded-[12px] border-2 border-[#333] bg-bg-medium text-white focus:outline-none focus:border-orange"
                  required
                />
              </div>
            </div>
            <Input 
              label="Mot de passe" 
              name="password"
              type="password" 
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Minimum 8 caractères" 
              required 
            />
          </div>
        );
      case 2:
        return (
          <div>
            <Input 
              label="Nom de l'entreprise" 
              name="businessName"
              type="text" 
              value={formData.businessName}
              onChange={handleInputChange}
              placeholder="Ex: TechStore Douala" 
              required 
            />
            <Input 
              label="Type d'entreprise" 
              name="businessType"
              type="text" 
              value={formData.businessType}
              onChange={handleInputChange}
              placeholder="Ex: Boutique, Grossiste" 
              required 
            />
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Ville</label>
              <select 
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3.5 py-3.5 rounded-[12px] border-2 border-[#333] bg-bg-medium text-white"
              >
                <option>Douala</option>
                <option>Yaoundé</option>
              </select>
            </div>
            <Input 
              label="Adresse physique" 
              name="address"
              type="text" 
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Quartier, rue" 
              required 
            />
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Description (optionnel)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3.5 py-3.5 rounded-[12px] border-2 border-[#333] bg-bg-medium text-white focus:outline-none focus:border-orange"
                rows={3}
                placeholder="Décrivez votre activité..."
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">CNI (obligatoire)</label>
              <div className="border-2 border-dashed border-[#333] rounded-[12px] p-8 text-center cursor-pointer hover:border-orange transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'cni')}
                  className="hidden"
                  id="cni-upload"
                />
                <label htmlFor="cni-upload" className="cursor-pointer">
                  <div className="text-5xl mb-4">📄</div>
                  <p className="text-sm text-gray-medium">
                    {cniFile ? cniFile.name : 'Cliquez pour uploader votre CNI'}
                  </p>
                </label>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Registre de commerce (optionnel)</label>
              <div className="border-2 border-dashed border-[#333] rounded-[12px] p-8 text-center cursor-pointer hover:border-orange transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'registre')}
                  className="hidden"
                  id="registre-upload"
                />
                <label htmlFor="registre-upload" className="cursor-pointer">
                  <div className="text-5xl mb-4">🏢</div>
                  <p className="text-sm text-gray-medium">
                    {registreFile ? registreFile.name : 'Cliquez pour uploader le registre'}
                  </p>
                </label>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="text-center py-8">
            <div className="text-6xl mb-6">✅</div>
            <h3 className="text-2xl font-bold mb-4">Inscription réussie !</h3>
            <p className="text-gray-medium mb-6">
              Votre compte sera validé par un administrateur sous 24-48h. Vous recevrez un email de confirmation.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-[600px] mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Devenir Partenaire</h1>
        <p className="text-[15px] text-gray-medium mb-8">
          Complétez votre inscription en 4 étapes
        </p>

        {/* Progress */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#333] z-0" />
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${
                  index + 1 <= signupStep
                    ? 'bg-orange border-orange'
                    : index + 1 < signupStep
                    ? 'bg-green border-green'
                    : 'bg-bg-medium border-[#333]'
                }`}
              >
                {index + 1 < signupStep ? '✓' : index + 1}
              </div>
              <span className="text-xs text-gray-medium">{step}</span>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {renderStep()}

        <div className="flex gap-4 mt-8">
          {signupStep > 1 && signupStep < 4 && (
            <Button 
              variant="secondary" 
              onClick={prevSignupStep} 
              className="flex-1"
              disabled={loading}
            >
              Retour
            </Button>
          )}
          {signupStep < 4 ? (
            <Button 
              variant="primary" 
              onClick={handleNext} 
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Chargement...' : signupStep === 3 ? 'Terminer' : 'Continuer →'}
            </Button>
          ) : (
            <Button variant="primary" onClick={() => onNavigate('login')} className="w-full">
              Se connecter
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
