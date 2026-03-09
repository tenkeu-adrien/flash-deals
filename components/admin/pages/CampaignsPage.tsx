'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';
import { approveCampaign, rejectCampaign } from '@/lib/firebase/firestore';
import { getAllCampaignsAdmin, suspendCampaign, reactivateCampaign } from '@/lib/firebase/firestore-admin';

interface CampaignsPageProps {
  onNavigate: (page: string) => void;
}

export default function CampaignsPage({ onNavigate }: CampaignsPageProps) {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'active' | 'completed' | 'cancelled'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  useEffect(() => {
    filterCampaigns();
  }, [statusFilter, campaigns]);

  const loadCampaigns = async () => {
    setLoading(true);
    const result = await getAllCampaignsAdmin();
    if (result.success && result.campaigns) {
      setCampaigns(result.campaigns);
    }
    setLoading(false);
  };

  const filterCampaigns = () => {
    if (statusFilter === 'all') {
      setFilteredCampaigns(campaigns);
    } else {
      setFilteredCampaigns(campaigns.filter(c => c.status === statusFilter));
    }
  };

  const handleApprove = async (campaignId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir valider cette campagne ?')) return;
    
    setActionLoading(true);
    const result = await approveCampaign(campaignId);
    
    if (result.success) {
      alert('✅ Campagne validée avec succès!');
      loadCampaigns();
      setShowModal(false);
    } else {
      alert('❌ Erreur: ' + result.error);
    }
    setActionLoading(false);
  };

  const handleReject = async (campaignId: string) => {
    const reason = prompt('Raison du rejet:');
    if (!reason) return;

    setActionLoading(true);
    const result = await rejectCampaign(campaignId, reason);
    
    if (result.success) {
      alert('✅ Campagne rejetée');
      loadCampaigns();
      setShowModal(false);
    } else {
      alert('❌ Erreur: ' + result.error);
    }
    setActionLoading(false);
  };

  const handleSuspend = async (campaignId: string) => {
    const reason = prompt('Raison de la suspension:');
    if (!reason) return;

    if (!confirm('Êtes-vous sûr de vouloir suspendre cette campagne ?')) return;

    setActionLoading(true);
    const result = await suspendCampaign(campaignId, reason);
    
    if (result.success) {
      alert('✅ Campagne suspendue');
      loadCampaigns();
      setShowModal(false);
    } else {
      alert('❌ Erreur: ' + result.error);
    }
    setActionLoading(false);
  };

  const handleReactivate = async (campaignId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir réactiver cette campagne ?')) return;

    setActionLoading(true);
    const result = await reactivateCampaign(campaignId);
    
    if (result.success) {
      alert('✅ Campagne réactivée');
      loadCampaigns();
      setShowModal(false);
    } else {
      alert('❌ Erreur: ' + result.error);
    }
    setActionLoading(false);
  };

  const openCampaignDetails = (campaign: any) => {
    setSelectedCampaign(campaign);
    setShowModal(true);
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: { bg: 'bg-yellow/20', text: 'text-yellow', label: '⏳ En attente' },
      active: { bg: 'bg-green/20', text: 'text-green', label: '✅ Active' },
      completed: { bg: 'bg-blue/20', text: 'text-blue', label: '✔️ Terminée' },
      cancelled: { bg: 'bg-red/20', text: 'text-red', label: '❌ Annulée' }
    };
    
    const style = styles[status] || styles.pending;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const getCampaignStats = () => {
    return {
      total: campaigns.length,
      pending: campaigns.filter(c => c.status === 'pending').length,
      active: campaigns.filter(c => c.status === 'active').length,
      completed: campaigns.filter(c => c.status === 'completed').length,
      cancelled: campaigns.filter(c => c.status === 'cancelled').length
    };
  };

  const stats = getCampaignStats();

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
          <p className="text-sm text-gray-medium">{filteredCampaigns.length} campagne(s) affichée(s)</p>
        </header>

        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-bg-medium rounded-lg p-4 border border-[#333]">
              <div className="text-2xl font-bold text-blue">{stats.total}</div>
              <div className="text-sm text-gray-medium">Total</div>
            </div>
            <div className="bg-bg-medium rounded-lg p-4 border border-yellow/30">
              <div className="text-2xl font-bold text-yellow">{stats.pending}</div>
              <div className="text-sm text-gray-medium">En attente</div>
            </div>
            <div className="bg-bg-medium rounded-lg p-4 border border-green/30">
              <div className="text-2xl font-bold text-green">{stats.active}</div>
              <div className="text-sm text-gray-medium">Actives</div>
            </div>
            <div className="bg-bg-medium rounded-lg p-4 border border-blue/30">
              <div className="text-2xl font-bold text-blue">{stats.completed}</div>
              <div className="text-sm text-gray-medium">Terminées</div>
            </div>
            <div className="bg-bg-medium rounded-lg p-4 border border-red/30">
              <div className="text-2xl font-bold text-red">{stats.cancelled}</div>
              <div className="text-sm text-gray-medium">Annulées</div>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                statusFilter === 'all'
                  ? 'bg-orange text-white'
                  : 'bg-bg-medium text-gray-medium hover:bg-bg-card'
              }`}
            >
              Toutes ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-yellow text-black'
                  : 'bg-bg-medium text-gray-medium hover:bg-bg-card'
              }`}
            >
              En attente ({stats.pending})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                statusFilter === 'active'
                  ? 'bg-green text-white'
                  : 'bg-bg-medium text-gray-medium hover:bg-bg-card'
              }`}
            >
              Actives ({stats.active})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-blue text-white'
                  : 'bg-bg-medium text-gray-medium hover:bg-bg-card'
              }`}
            >
              Terminées ({stats.completed})
            </button>
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                statusFilter === 'cancelled'
                  ? 'bg-red text-white'
                  : 'bg-bg-medium text-gray-medium hover:bg-bg-card'
              }`}
            >
              Annulées ({stats.cancelled})
            </button>
          </div>

          {/* Liste des campagnes */}
          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold mb-2">Aucune campagne</h3>
              <p className="text-gray-medium">Aucune campagne ne correspond à ce filtre</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCampaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-bg-medium rounded-lg p-6 border border-[#333] hover:border-orange/50 transition-colors"
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
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-bold">{campaign.title}</h3>
                            {getStatusBadge(campaign.status)}
                          </div>
                          <p className="text-xs text-gray-dark">ID: {campaign.id}</p>
                        </div>
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
                          <div className="font-bold">{campaign.stock} / {(campaign.stock || 0) + (campaign.sold || 0)}</div>
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
                      📋 Détails
                    </Button>
                    
                    {campaign.status === 'pending' && (
                      <>
                        <Button 
                          variant="success" 
                          size="small"
                          onClick={() => handleApprove(campaign.id)}
                          disabled={actionLoading}
                        >
                          ✅ Valider
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="small"
                          onClick={() => handleReject(campaign.id)}
                          disabled={actionLoading}
                        >
                          ❌ Rejeter
                        </Button>
                      </>
                    )}
                    
                    {campaign.status === 'active' && (
                      <Button 
                        variant="secondary" 
                        size="small"
                        onClick={() => handleSuspend(campaign.id)}
                        disabled={actionLoading}
                      >
                        🔒 Suspendre
                      </Button>
                    )}
                    
                    {campaign.status === 'cancelled' && (
                      <Button 
                        variant="success" 
                        size="small"
                        onClick={() => handleReactivate(campaign.id)}
                        disabled={actionLoading}
                      >
                        🔓 Réactiver
                      </Button>
                    )}
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
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedCampaign.title}</h2>
              {getStatusBadge(selectedCampaign.status)}
            </div>
            
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
                      className="w-full h-32 object-cover rounded-lg border border-gray-700 cursor-pointer hover:opacity-80"
                      onClick={() => window.open(img, '_blank')}
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
                  <div>
                    <span className="text-gray-medium">Vendus:</span>
                    <p className="font-bold">{selectedCampaign.sold || 0} unités</p>
                  </div>
                </div>
              </div>
            </div>

            {(selectedCampaign.rejectionReason || selectedCampaign.suspensionReason) && (
              <div className="bg-red/10 border border-red rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-2 text-red">Raison du rejet/suspension</h3>
                <p className="text-sm">{selectedCampaign.rejectionReason || selectedCampaign.suspensionReason}</p>
              </div>
            )}

            <div className="flex gap-4">
              {selectedCampaign.status === 'pending' && (
                <>
                  <Button
                    variant="success"
                    onClick={() => handleApprove(selectedCampaign.id)}
                    disabled={actionLoading}
                    className="flex-1"
                  >
                    {actionLoading ? 'Traitement...' : '✅ Valider la campagne'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleReject(selectedCampaign.id)}
                    disabled={actionLoading}
                    className="flex-1"
                  >
                    ❌ Rejeter
                  </Button>
                </>
              )}
              
              {selectedCampaign.status === 'active' && (
                <Button
                  variant="secondary"
                  onClick={() => handleSuspend(selectedCampaign.id)}
                  disabled={actionLoading}
                  className="flex-1"
                >
                  {actionLoading ? 'Traitement...' : '🔒 Suspendre'}
                </Button>
              )}
              
              {selectedCampaign.status === 'cancelled' && (
                <Button
                  variant="success"
                  onClick={() => handleReactivate(selectedCampaign.id)}
                  disabled={actionLoading}
                  className="flex-1"
                >
                  {actionLoading ? 'Traitement...' : '🔓 Réactiver'}
                </Button>
              )}
              
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
