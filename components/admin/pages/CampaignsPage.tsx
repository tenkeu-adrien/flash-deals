'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';
import { getPendingCampaigns, approveCampaign, rejectCampaign } from '@/lib/firebase/firestore';

interface CampaignsPageProps {
  onNavigate: (page: string) => void;
}

export default function CampaignsPage({ onNavigate }: CampaignsPageProps) {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    const result = await getPendingCampaigns();
    if (result.success && result.campaigns) {
      setCampaigns(result.campaigns);
    }
    setLoading(false);
  };

  const handleApprove = async (campaignId: string) => {
    setActionLoading(true);
    const result = await approveCampaign(campaignId);
    
    if (result.success) {
      alert('Campagne validée avec succès!');
      loadCampaigns();
      setShowModal(false);
    } else {
      alert('Erreur: ' + result.error);
    }
    setActionLoading(false);
  };

  const handleReject = async (campaignId: string) => {
    const reason = prompt('Raison du rejet:');
    if (!reason) return;

    setActionLoading(true);
    const result = await rejectCampaign(campaignId, reason);
    
    if (result.success) {
      alert('Campagne rejetée');
      loadCampaigns();
      setShowModal(false);
    } else {
      alert('Erreur: ' + result.error);
    }
    setActionLoading(false);
  };

  const openCampaignDetails = (campaign: any) => {
    setSelectedCampaign(campaign);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar currentPage="campaigns" onNavigate={onNavigate} />
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
      <AdminSidebar currentPage="campaigns" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-[260px]">
        <header className="bg-bg-medium border-b border-[#333] px-8 py-4">
          <h1 className="text-2xl font-bold mb-1">Gestion des Campagnes</h1>
          <p className="text-sm text-gray-medium">{campaigns.length} campagnes en attente de validation</p>
        </header>

        <div className="p-8">
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">Aucune campagne en attente</h3>
              <p className="text-gray-medium">Toutes les campagnes ont été traitées</p>
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
                    <div className="w-20 h-20 bg-bg-card rounded-lg flex-shrink-0 overflow-hidden">
                      {campaign.images && campaign.images[0] ? (
                        <img 
                          src={campaign.images[0]} 
                          alt={campaign.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          📦
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold mb-1">{campaign.title}</h3>
                          <p className="text-xs text-gray-dark">ID: {campaign.id}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow/20 text-yellow">
                          En attente
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 mt-4 text-[13px]">
                        <div>
                          <div className="text-gray-medium mb-1">Prix original</div>
                          <div className="font-bold line-through">{campaign.originalPrice?.toLocaleString()} FCFA</div>
                        </div>
                        <div>
                          <div className="text-gray-medium mb-1">Prix réduit</div>
                          <div className="font-bold text-orange">{campaign.currentPrice?.toLocaleString()} FCFA</div>
                        </div>
                        <div>
                          <div className="text-gray-medium mb-1">Réduction</div>
                          <div className="font-bold text-green">{campaign.discount}%</div>
                        </div>
                        <div>
                          <div className="text-gray-medium mb-1">Stock</div>
                          <div className="font-bold">{campaign.stock} unités</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="primary" 
                      size="small"
                      onClick={() => openCampaignDetails(campaign)}
                    >
                      Détails
                    </Button>
                    <Button 
                      variant="success" 
                      size="small"
                      onClick={() => handleApprove(campaign.id)}
                      disabled={actionLoading}
                    >
                      Valider
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="small"
                      onClick={() => handleReject(campaign.id)}
                      disabled={actionLoading}
                    >
                      Rejeter
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal détails campagne */}
      {showModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bg-medium rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-4">{selectedCampaign.title}</h2>
            
            {/* Images */}
            {selectedCampaign.images && selectedCampaign.images.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Images</h3>
                <div className="grid grid-cols-4 gap-4">
                  {selectedCampaign.images.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Image ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-700"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Informations produit</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-medium">Catégorie:</span>
                    <p>{selectedCampaign.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-medium">Description:</span>
                    <p>{selectedCampaign.description}</p>
                  </div>
                  <div>
                    <span className="text-gray-medium">Localisation:</span>
                    <p>{selectedCampaign.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-medium">Livraison:</span>
                    <p>{selectedCampaign.delivery}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Prix et stock</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-medium">Prix original:</span>
                    <p className="font-bold">{selectedCampaign.originalPrice?.toLocaleString()} FCFA</p>
                  </div>
                  <div>
                    <span className="text-gray-medium">Prix réduit:</span>
                    <p className="font-bold text-orange">{selectedCampaign.currentPrice?.toLocaleString()} FCFA</p>
                  </div>
                  <div>
                    <span className="text-gray-medium">Réduction:</span>
                    <p className="font-bold text-green">{selectedCampaign.discount}%</p>
                  </div>
                  <div>
                    <span className="text-gray-medium">Stock disponible:</span>
                    <p className="font-bold">{selectedCampaign.stock} unités</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="success"
                onClick={() => handleApprove(selectedCampaign.id)}
                disabled={actionLoading}
                className="flex-1"
              >
                {actionLoading ? 'Traitement...' : 'Valider la campagne'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleReject(selectedCampaign.id)}
                disabled={actionLoading}
                className="flex-1"
              >
                Rejeter
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
              >
                Fermer
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
                  {campaign.status === 'pending' && (
                    <>
                      <Button variant="success" size="small">Approuver</Button>
                      <Button variant="danger" size="small">Rejeter</Button>
                    </>
                  )}
                  {campaign.status === 'active' && (
                    <Button variant="danger" size="small">Suspendre</Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
