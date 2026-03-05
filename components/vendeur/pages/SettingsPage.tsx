'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/vendeur/Sidebar';
import Header from '@/components/vendeur/Header';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { User, Store, Bell, Lock, Save } from 'lucide-react';
import { getVendorProfile, updateVendorProfile } from '@/lib/firebase/firestore';
import { uploadCompressedImage } from '@/lib/firebase/storage';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export default function SettingsPage({ onNavigate }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    businessName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    logo: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const result = await getVendorProfile();
    if (result.success && result.vendor) {
      setProfile({
        businessName: result.vendor.businessName || '',
        email: result.vendor.email || '',
        phone: result.vendor.phone || '',
        address: result.vendor.address || '',
        description: result.vendor.description || '',
        logo: result.vendor.logo || ''
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await updateVendorProfile(profile);
    if (result.success) {
      alert('Profil mis à jour avec succès!');
    } else {
      alert('Erreur: ' + result.error);
    }
    setSaving(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const result = await uploadCompressedImage(file, 'logos', 512, 0.9);
      if (result.success && result.url) {
        setProfile(prev => ({ ...prev, logo: result.url! }));
      }
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'business', label: 'Entreprise', icon: Store },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Lock }
  ];

  if (loading) {
    return (
      <div className="flex">
        <Sidebar currentPage="settings" onNavigate={onNavigate} />
        <div className="flex-1 ml-[260px] flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p>Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar currentPage="settings" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-[260px]">
        <Header onNavigate={onNavigate} />

        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">Paramètres</h1>
              <p className="text-sm text-gray-medium">Gérez votre profil et vos préférences</p>
            </div>
            <Button 
              variant="primary" 
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={16} className="mr-2" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>

          <div className="flex gap-6">
            {/* Tabs */}
            <div className="w-64">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm ${
                        activeTab === tab.id
                          ? 'bg-orange text-white'
                          : 'text-gray-medium hover:bg-bg-medium hover:text-white'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
                    <h2 className="text-lg font-bold mb-6">Informations Personnelles</h2>
                    
                    <div className="mb-6">
                      <label className="block mb-2 text-sm font-semibold">Photo de profil</label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange to-red flex items-center justify-center text-2xl font-bold overflow-hidden">
                          {profile.logo ? (
                            <img src={profile.logo} alt="Logo" className="w-full h-full object-cover" />
                          ) : (
                            profile.businessName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                            id="logo-upload"
                          />
                          <label htmlFor="logo-upload">
                            <Button variant="secondary" size="small" as="span">
                              Changer la photo
                            </Button>
                          </label>
                          <p className="text-xs text-gray-medium mt-1">JPG, PNG max 2MB</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 text-sm font-semibold">Email</label>
                        <Input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="votre@email.com"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold">Téléphone</label>
                        <Input
                          value={profile.phone}
                          onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+237 6XX XX XX XX"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Business Tab */}
              {activeTab === 'business' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
                    <h2 className="text-lg font-bold mb-6">Informations Entreprise</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 text-sm font-semibold">Nom de l'entreprise</label>
                        <Input
                          value={profile.businessName}
                          onChange={(e) => setProfile(prev => ({ ...prev, businessName: e.target.value }))}
                          placeholder="TechStore Douala"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold">Adresse</label>
                        <Input
                          value={profile.address}
                          onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Douala, Cameroun"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold">Description</label>
                        <textarea
                          value={profile.description}
                          onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-4 py-3 bg-bg-dark border border-[#333] rounded-lg text-white focus:border-orange focus:outline-none"
                          rows={4}
                          placeholder="Décrivez votre activité..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
                    <h2 className="text-lg font-bold mb-4">Statistiques</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-bg-dark rounded-lg">
                        <div className="text-sm text-gray-medium mb-1">Campagnes créées</div>
                        <div className="text-2xl font-bold">0</div>
                      </div>
                      <div className="p-4 bg-bg-dark rounded-lg">
                        <div className="text-sm text-gray-medium mb-1">Ventes totales</div>
                        <div className="text-2xl font-bold">0</div>
                      </div>
                      <div className="p-4 bg-bg-dark rounded-lg">
                        <div className="text-sm text-gray-medium mb-1">Revenus</div>
                        <div className="text-2xl font-bold text-orange">0 FCFA</div>
                      </div>
                      <div className="p-4 bg-bg-dark rounded-lg">
                        <div className="text-sm text-gray-medium mb-1">Note moyenne</div>
                        <div className="text-2xl font-bold text-green">0.0 ⭐</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
                    <h2 className="text-lg font-bold mb-6">Préférences de Notification</h2>
                    
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 bg-bg-dark rounded-lg cursor-pointer">
                        <div>
                          <div className="font-semibold">Nouvelles commandes</div>
                          <div className="text-xs text-gray-medium">Recevoir une notification pour chaque nouvelle commande</div>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-bg-dark rounded-lg cursor-pointer">
                        <div>
                          <div className="font-semibold">Validation de campagne</div>
                          <div className="text-xs text-gray-medium">Être notifié quand une campagne est validée</div>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-bg-dark rounded-lg cursor-pointer">
                        <div>
                          <div className="font-semibold">Stock faible</div>
                          <div className="text-xs text-gray-medium">Alerte quand le stock est inférieur à 10%</div>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-bg-dark rounded-lg cursor-pointer">
                        <div>
                          <div className="font-semibold">Fin de campagne</div>
                          <div className="text-xs text-gray-medium">Notification 24h avant la fin d'une campagne</div>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5" />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-bg-dark rounded-lg cursor-pointer">
                        <div>
                          <div className="font-semibold">Nouveaux avis</div>
                          <div className="text-xs text-gray-medium">Être notifié des nouveaux avis clients</div>
                        </div>
                        <input type="checkbox" className="w-5 h-5" />
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
                    <h2 className="text-lg font-bold mb-6">Changer le Mot de Passe</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 text-sm font-semibold">Mot de passe actuel</label>
                        <Input type="password" placeholder="••••••••" />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold">Nouveau mot de passe</label>
                        <Input type="password" placeholder="••••••••" />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold">Confirmer le mot de passe</label>
                        <Input type="password" placeholder="••••••••" />
                      </div>

                      <Button variant="primary">Changer le mot de passe</Button>
                    </div>
                  </div>

                  <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
                    <h2 className="text-lg font-bold mb-4">Sécurité du Compte</h2>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-bg-dark rounded-lg">
                        <div>
                          <div className="font-semibold">Authentification à deux facteurs</div>
                          <div className="text-xs text-gray-medium">Sécurisez votre compte avec 2FA</div>
                        </div>
                        <Button variant="secondary" size="small">Activer</Button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-bg-dark rounded-lg">
                        <div>
                          <div className="font-semibold">Sessions actives</div>
                          <div className="text-xs text-gray-medium">Gérer les appareils connectés</div>
                        </div>
                        <Button variant="secondary" size="small">Voir</Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red/10 border border-red rounded-lg p-6">
                    <h2 className="text-lg font-bold mb-2 text-red">Zone Dangereuse</h2>
                    <p className="text-sm text-gray-medium mb-4">
                      Ces actions sont irréversibles. Procédez avec prudence.
                    </p>
                    <Button variant="danger">Supprimer mon compte</Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
