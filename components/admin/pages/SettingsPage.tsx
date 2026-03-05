'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Settings, Bell, Shield, DollarSign, Mail, Globe, Save } from 'lucide-react';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export default function SettingsPage({ onNavigate }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Flash Deals Cameroun',
    siteDescription: 'Plateforme de ventes flash au Cameroun',
    contactEmail: 'contact@flashdeals.cm',
    supportEmail: 'support@flashdeals.cm',
    phone: '+237 6XX XX XX XX',
    address: 'Douala, Cameroun',
    commissionRate: '15',
    minOrderAmount: '5000',
    maxOrderAmount: '5000000',
    deliveryFee: '2000',
    freeDeliveryThreshold: '50000',
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderNotifications: true,
    campaignNotifications: true,
    vendorNotifications: true,
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    requirePhoneVerification: false
  });

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'finances', label: 'Finances', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'advanced', label: 'Avancé', icon: Globe }
  ];

  const handleSave = async () => {
    setSaving(true);
    // Simuler la sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    alert('Paramètres sauvegardés avec succès!');
  };

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex">
      <AdminSidebar currentPage="settings" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-[260px]">
        <header className="bg-bg-medium border-b border-[#333] px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-1">Paramètres</h1>
              <p className="text-sm text-gray-medium">Configuration de la plateforme</p>
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
        </header>

        <div className="flex">
          {/* Tabs Sidebar */}
          <div className="w-64 bg-bg-medium border-r border-[#333] p-4">
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
                        : 'text-gray-medium hover:bg-bg-card hover:text-white'
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
          <div className="flex-1 p-8">
            {/* Général */}
            {activeTab === 'general' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
                  <h2 className="text-lg font-bold mb-6">Informations Générales</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-semibold">Nom du site</label>
                      <Input
                        value={settings.siteName}
                        onChange={(e) => handleChange('siteName', e.target.value)}
                        placeholder="Flash Deals Cameroun"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold">Description</label>
                      <textarea
                        value={settings.siteDescription}
                        onChange={(e) => handleChange('siteDescription', e.target.value)}
                        className="w-full px-4 py-3 bg-bg-dark border border-[#333] rounded-lg text-white focus:border-orange focus:outline-none"
                        rows={3}
                        placeholder="Description du site"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-semibold">Email de contact</label>
                        <Input
                          type="email"
                          value={settings.contactEmail}
                          onChange={(e) => handleChange('contactEmail', e.target.value)}
                          placeholder="contact@flashdeals.cm"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold">Email support</label>
                        <Input
                          type="email"
                          value={settings.supportEmail}
                          onChange={(e) => handleChange('supportEmail', e.target.value)}
                          placeholder="support@flashdeals.cm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-semibold">Téléphone</label>
                        <Input
                          value={settings.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          placeholder="+237 6XX XX XX XX"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold">Adresse</label>
                        <Input
                          value={settings.address}
                          onChange={(e) => handleChange('address', e.target.value)}
                          placeholder="Douala, Cameroun"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Finances */}
            {activeTab === 'finances' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
                  <h2 className="text-lg font-bold mb-6">Paramètres Financiers</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-semibold">Taux de commission (%)</label>
                      <Input
                        type="number"
                        value={settings.commissionRate}
                        onChange={(e) => handleChange('commissionRate', e.target.value)}
                        placeholder="15"
                      />
                      <p className="text-xs text-gray-medium mt-1">
                        Commission prélevée sur chaque vente
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-semibold">Montant minimum (FCFA)</label>
                        <Input
                          type="number"
                          value={settings.minOrderAmount}
                          onChange={(e) => handleChange('minOrderAmount', e.target.value)}
                          placeholder="5000"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold">Montant maximum (FCFA)</label>
                        <Input
                          type="number"
                          value={settings.maxOrderAmount}
                          onChange={(e) => handleChange('maxOrderAmount', e.target.value)}
                          placeholder="5000000"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-semibold">Frais de livraison (FCFA)</label>
                        <Input
                          type="number"
                          value={settings.deliveryFee}
                          onChange={(e) => handleChange('deliveryFee', e.target.value)}
                          placeholder="2000"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold">Livraison gratuite à partir de (FCFA)</label>
                        <Input
                          type="number"
                          value={settings.freeDeliveryThreshold}
                          onChange={(e) => handleChange('freeDeliveryThreshold', e.target.value)}
                          placeholder="50000"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
                  <h2 className="text-lg font-bold mb-4">Méthodes de Paiement</h2>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 bg-bg-dark rounded-lg cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                      <div>
                        <div className="font-semibold">Mobile Money (MTN, Orange)</div>
                        <div className="text-xs text-gray-medium">Paiement par téléphone</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-bg-dark rounded-lg cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5" />
                      <div>
                        <div className="font-semibold">Paiement à la livraison</div>
                        <div className="text-xs text-gray-medium">Cash à la réception</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-bg-dark rounded-lg cursor-pointer">
                      <input type="checkbox" className="w-5 h-5" />
                      <div>
                        <div className="font-semibold">Carte bancaire</div>
                        <div className="text-xs text-gray-medium">Visa, Mastercard</div>
                      </div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
                  <h2 className="text-lg font-bold mb-6">Canaux de Notification</h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-bg-dark rounded-lg cursor-pointer">
                      <div>
                        <div className="font-semibold">Notifications Email</div>
                        <div className="text-xs text-gray-medium">Envoyer des emails aux utilisateurs</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                        className="w-5 h-5"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-bg-dark rounded-lg cursor-pointer">
                      <div>
                        <div className="font-semibold">Notifications SMS</div>
                        <div className="text-xs text-gray-medium">Envoyer des SMS aux utilisateurs</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.smsNotifications}
                        onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                        className="w-5 h-5"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-bg-dark rounded-lg cursor-pointer">
                      <div>
                        <div className="font-semibold">Notifications Push</div>
                        <div className="text-xs text-gray-medium">Notifications dans le navigateur</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                        className="w-5 h-5"
                      />
                    </label>
                  </div>
                </div>

                <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
                  <h2 className="text-lg font-bold mb-6">Types de Notifications</h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-bg-dark rounded-lg cursor-pointer">
                      <div>
                        <div className="font-semibold">Nouvelles commandes</div>
                        <div className="text-xs text-gray-medium">Notifier lors d'une nouvelle commande</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.orderNotifications}
                        onChange={(e) => handleChange('orderNotifications', e.target.checked)}
                        className="w-5 h-5"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-bg-dark rounded-lg cursor-pointer">
                      <div>
                        <div className="font-semibold">Nouvelles campagnes</div>
                        <div className="text-xs text-gray-medium">Notifier lors d'une nouvelle campagne</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.campaignNotifications}
                        onChange={(e) => handleChange('campaignNotifications', e.target.checked)}
                        className="w-5 h-5"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-bg-dark rounded-lg cursor-pointer">
                      <div>
                        <div className="font-semibold">Nouveaux vendeurs</div>
                        <div className="text-xs text-gray-medium">Notifier lors d'une inscription vendeur</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.vendorNotifications}
                        onChange={(e) => handleChange('vendorNotifications', e.target.checked)}
                        className="w-5 h-5"
                      />
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Sécurité */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
                  <h2 className="text-lg font-bold mb-6">Paramètres de Sécurité</h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-bg-dark rounded-lg cursor-pointer">
                      <div>
                        <div className="font-semibold">Vérification email obligatoire</div>
                        <div className="text-xs text-gray-medium">Les utilisateurs doivent vérifier leur email</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.requireEmailVerification}
                        onChange={(e) => handleChange('requireEmailVerification', e.target.checked)}
                        className="w-5 h-5"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-bg-dark rounded-lg cursor-pointer">
                      <div>
                        <div className="font-semibold">Vérification téléphone obligatoire</div>
                        <div className="text-xs text-gray-medium">Les utilisateurs doivent vérifier leur numéro</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.requirePhoneVerification}
                        onChange={(e) => handleChange('requirePhoneVerification', e.target.checked)}
                        className="w-5 h-5"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-bg-dark rounded-lg cursor-pointer">
                      <div>
                        <div className="font-semibold">Autoriser les inscriptions</div>
                        <div className="text-xs text-gray-medium">Permettre aux nouveaux utilisateurs de s'inscrire</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.allowRegistration}
                        onChange={(e) => handleChange('allowRegistration', e.target.checked)}
                        className="w-5 h-5"
                      />
                    </label>
                  </div>
                </div>

                <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
                  <h2 className="text-lg font-bold mb-4">Règles de Mot de Passe</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green" />
                      <span>Minimum 8 caractères</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green" />
                      <span>Au moins une majuscule</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green" />
                      <span>Au moins un chiffre</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green" />
                      <span>Au moins un caractère spécial</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Email */}
            {activeTab === 'email' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
                  <h2 className="text-lg font-bold mb-6">Configuration SMTP</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-semibold">Serveur SMTP</label>
                        <Input placeholder="smtp.gmail.com" />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold">Port</label>
                        <Input placeholder="587" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-semibold">Nom d'utilisateur</label>
                        <Input placeholder="noreply@flashdeals.cm" />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold">Mot de passe</label>
                        <Input type="password" placeholder="••••••••" />
                      </div>
                    </div>

                    <Button variant="secondary">Tester la configuration</Button>
                  </div>
                </div>

                <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
                  <h2 className="text-lg font-bold mb-4">Templates d'Email</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-bg-dark rounded-lg">
                      <span>Email de bienvenue</span>
                      <Button variant="secondary" size="small">Modifier</Button>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-bg-dark rounded-lg">
                      <span>Confirmation de commande</span>
                      <Button variant="secondary" size="small">Modifier</Button>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-bg-dark rounded-lg">
                      <span>Réinitialisation mot de passe</span>
                      <Button variant="secondary" size="small">Modifier</Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Avancé */}
            {activeTab === 'advanced' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
                  <h2 className="text-lg font-bold mb-6">Paramètres Avancés</h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-bg-dark rounded-lg cursor-pointer">
                      <div>
                        <div className="font-semibold">Mode Maintenance</div>
                        <div className="text-xs text-gray-medium">Désactiver temporairement le site</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                        className="w-5 h-5"
                      />
                    </label>
                  </div>
                </div>

                <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
                  <h2 className="text-lg font-bold mb-4">Actions Dangereuses</h2>
                  <div className="space-y-3">
                    <Button variant="secondary" className="w-full">Vider le cache</Button>
                    <Button variant="secondary" className="w-full">Réindexer la base de données</Button>
                    <Button variant="secondary" className="w-full text-red border-red hover:bg-red/10">
                      Réinitialiser les paramètres
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
