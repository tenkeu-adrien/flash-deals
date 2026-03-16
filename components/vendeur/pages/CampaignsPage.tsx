'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Sidebar from '@/components/vendeur/Sidebar';
import Header from '@/components/vendeur/Header';
import { getVendorCampaigns, updateCampaign } from '@/lib/firebase/firestore';

interface CampaignsPageProps {
  onNavigate: (page: string) => void;
}

export default function CampaignsPage({ onNavigate }: CampaignsPageProps) {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editFields, setEditFields] = useState({ stock: 0, currentPrice: 0, description: '' });

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    const result = await getVendorCampaigns();
    if (result.success && result.campaigns) {
      setCampaigns(result.campaigns);
    }
    setLoading(false);
  };

  const handleStopCampaign = async (campaignId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir arrêter cette campagne?')) return;
    
    const result = await updateCampaign(campaignId, { status: 'cancelled' });
    if (result.success) {
      alert('Campagne arrêtée');
      loadCampaigns();
    } else {
      alert('Erreur: ' + result.error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green/20 text-green',
      pending: 'bg-yellow/20 text-yellow',
      completed: 'bg-gray-medium/20 text-gray-medium',
      cancelled: 'bg-red/20 text-red'
    };
    const labels = { 
      active: 'Actif', 
      pending: 'En attente', 
      completed: 'Terminé',
      cancelled: 'Annulé'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles] || styles.pending}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar currentPage="campaigns" onNavigate={onNavigate} />
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
      <Sidebar currentPage="campaigns" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-[260px]">
        <Header onNavigate={onNavigate} />

        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold">Mes Campagnes</h1>
              <p className="text-sm text-gray-medium">{campaigns.length} campagnes au total</p>
            </div>
            <Button variant="primary" onClick={() => onNavigate('create-campaign')}>
              + Nouvelle Campagne
            </Button>
          </div>

          {campaigns.length === 0 ? (
            <div className="text-center py-12 bg-bg-medium rounded-lg border border-[#333]">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold mb-2">Aucune campagne</h3>
              <p className="text-gray-medium mb-6">
                Créez votre première campagne pour commencer à vendre!
              </p>
              <Button variant="primary" onClick={() => onNavigate('create-campaign')}>
                Créer une campagne
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-bg-medium rounded-lg p-6 border border-[#333]"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-bg-card rounded-lg flex-shrink-0 overflow-hidden">
                      {campaign.images && campaign.images[0] ? (
                        <img 
                          src={campaign.images[0]} 
                          alt={campaign.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          📱
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold mb-1">{campaign.title}</h3>
                          <p className="text-[13px] text-gray-dark">ID: {campaign.id?.substring(0, 8)}</p>
                        </div>
                        {getStatusBadge(campaign.status)}
                      </div>
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        <div>
                          <div className="text-xs text-gray-medium mb-1">Vendus</div>
                          <div className="text-lg font-bold">{campaign.sold || 0}/{campaign.stock + (campaign.sold || 0)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-medium mb-1">Prix</div>
                          <div className="text-lg font-bold text-orange">{campaign.currentPrice?.toLocaleString()} FCFA</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-medium mb-1">Revenus (85%)</div>
                          <div className="text-lg font-bold text-green">
                            {((campaign.sold || 0) * campaign.currentPrice * 0.85).toLocaleString()} FCFA
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-medium mb-1">Progression</div>
                          <div className="w-full h-2 bg-[#333] rounded overflow-hidden mt-2">
                            <div
                              className="h-full bg-gradient-to-r from-orange to-red"
                              style={{ width: `${((campaign.sold || 0) / (campaign.stock + (campaign.sold || 0))) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="secondary" 
                      size="small"
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setEditFields({ stock: campaign.stock || 0, currentPrice: campaign.currentPrice || 0, description: campaign.description || '' });
                        setShowEditModal(true);
                      }}
                    >
                      Modifier
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="small"
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setShowStatsModal(true);
                      }}
                    >
                      Statistiques
                    </Button>
                    {campaign.status === 'active' && (
                      <Button 
                        variant="danger" 
                        size="small"
                        onClick={() => handleStopCampaign(campaign.id)}
                      >
                        Arrêter
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Statistiques */}
      {showStatsModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bg-medium rounded-xl p-6 max-w-2xl w-full"
          >
            <h2 className="text-2xl font-bold mb-4">Statistiques - {selectedCampaign.title}</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-bg-dark rounded-lg">
                <div className="text-sm text-gray-medium mb-1">Vues</div>
                <div className="text-2xl font-bold">{selectedCampaign.views || 0}</div>
              </div>
              <div className="p-4 bg-bg-dark rounded-lg">
                <div className="text-sm text-gray-medium mb-1">Intéressés</div>
                <div className="text-2xl font-bold">{selectedCampaign.interested || 0}</div>
              </div>
              <div className="p-4 bg-bg-dark rounded-lg">
                <div className="text-sm text-gray-medium mb-1">Ventes</div>
                <div className="text-2xl font-bold text-green">{selectedCampaign.sold || 0}</div>
              </div>
              <div className="p-4 bg-bg-dark rounded-lg">
                <div className="text-sm text-gray-medium mb-1">Taux de conversion</div>
                <div className="text-2xl font-bold text-orange">
                  {selectedCampaign.views > 0 
                    ? ((selectedCampaign.sold / selectedCampaign.views) * 100).toFixed(1) 
                    : 0}%
                </div>
              </div>
              <div className="p-4 bg-bg-dark rounded-lg">
                <div className="text-sm text-gray-medium mb-1">Revenus totaux</div>
                <div className="text-2xl font-bold text-orange">
                  {((selectedCampaign.sold || 0) * selectedCampaign.currentPrice).toLocaleString()} FCFA
                </div>
              </div>
              <div className="p-4 bg-bg-dark rounded-lg">
                <div className="text-sm text-gray-medium mb-1">Votre part (85%)</div>
                <div className="text-2xl font-bold text-green">
                  {((selectedCampaign.sold || 0) * selectedCampaign.currentPrice * 0.85).toLocaleString()} FCFA
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              onClick={() => setShowStatsModal(false)}
              className="w-full"
            >
              Fermer
            </Button>
          </motion.div>
        </div>
      )}

      {/* Modal Modifier */}
      {showEditModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bg-medium rounded-xl p-6 max-w-2xl w-full"
          >
            <h2 className="text-2xl font-bold mb-4">Modifier - {selectedCampaign.title}</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block mb-2 text-sm font-semibold">Stock disponible</label>
                <input
                  type="number"
                  value={editFields.stock}
                  onChange={(e) => setEditFields(prev => ({ ...prev, stock: Number(e.target.value) }))}
                  className="w-full px-4 py-3 bg-bg-dark border border-[#333] rounded-lg text-white focus:border-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold">Prix</label>
                <input
                  type="number"
                  value={editFields.currentPrice}
                  onChange={(e) => setEditFields(prev => ({ ...prev, currentPrice: Number(e.target.value) }))}
                  className="w-full px-4 py-3 bg-bg-dark border border-[#333] rounded-lg text-white focus:border-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold">Description</label>
                <textarea
                  value={editFields.description}
                  onChange={(e) => setEditFields(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-bg-dark border border-[#333] rounded-lg text-white focus:border-orange focus:outline-none"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="primary"
                disabled={editSaving}
                onClick={async () => {
                  setEditSaving(true);
                  const result = await updateCampaign(selectedCampaign.id, {
                    stock: editFields.stock,
                    currentPrice: editFields.currentPrice,
                    description: editFields.description,
                  });
                  setEditSaving(false);
                  if (result.success) {
                    setShowEditModal(false);
                    loadCampaigns();
                  } else {
                    alert('Erreur: ' + result.error);
                  }
                }}
                className="flex-1"
              >
                {editSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
              >
                Annuler
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
