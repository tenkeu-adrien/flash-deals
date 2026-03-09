'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';
import { approveVendor, rejectVendor } from '@/lib/firebase/firestore';
import { getAllVendors, deactivateVendor, reactivateVendor } from '@/lib/firebase/firestore-admin';

interface VendorsPageProps {
  onNavigate: (page: string) => void;
}

export default function VendorsPage({ onNavigate }: VendorsPageProps) {
  const [vendors, setVendors] = useState<any[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'active' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadVendors();
  }, []);

  useEffect(() => {
    filterVendors();
  }, [statusFilter, vendors]);

  const loadVendors = async () => {
    setLoading(true);
    const result = await getAllVendors();
    if (result.success && result.vendors) {
      setVendors(result.vendors);
    }
    setLoading(false);
  };

  const filterVendors = () => {
    if (statusFilter === 'all') {
      setFilteredVendors(vendors);
    } else {
      setFilteredVendors(vendors.filter(v => v.status === statusFilter));
    }
  };

  const handleApprove = async (vendorId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir valider ce vendeur ?')) return;
    
    setActionLoading(true);
    const result = await approveVendor(vendorId);
    
    if (result.success) {
      alert('✅ Vendeur validé avec succès!');
      loadVendors();
      setShowModal(false);
    } else {
      alert('❌ Erreur: ' + result.error);
    }
    setActionLoading(false);
  };

  const handleReject = async (vendorId: string) => {
    const reason = prompt('Raison du rejet:');
    if (!reason) return;

    setActionLoading(true);
    const result = await rejectVendor(vendorId, reason);
    
    if (result.success) {
      alert('✅ Vendeur rejeté');
      loadVendors();
      setShowModal(false);
    } else {
      alert('❌ Erreur: ' + result.error);
    }
    setActionLoading(false);
  };

  const handleDeactivate = async (vendorId: string) => {
    const reason = prompt('Raison de la désactivation:');
    if (!reason) return;

    if (!confirm('Êtes-vous sûr de vouloir désactiver ce vendeur ? Il ne pourra plus créer de campagnes.')) return;

    setActionLoading(true);
    const result = await deactivateVendor(vendorId, reason);
    
    if (result.success) {
      alert('✅ Vendeur désactivé');
      loadVendors();
      setShowModal(false);
    } else {
      alert('❌ Erreur: ' + result.error);
    }
    setActionLoading(false);
  };

  const handleReactivate = async (vendorId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir réactiver ce vendeur ?')) return;

    setActionLoading(true);
    const result = await reactivateVendor(vendorId);
    
    if (result.success) {
      alert('✅ Vendeur réactivé');
      loadVendors();
      setShowModal(false);
    } else {
      alert('❌ Erreur: ' + result.error);
    }
    setActionLoading(false);
  };

  const openVendorDetails = (vendor: any) => {
    setSelectedVendor(vendor);
    setShowModal(true);
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: { bg: 'bg-yellow/20', text: 'text-yellow', label: '⏳ En attente' },
      active: { bg: 'bg-green/20', text: 'text-green', label: '✅ Actif' },
      rejected: { bg: 'bg-red/20', text: 'text-red', label: '❌ Rejeté' }
    };
    
    const style = styles[status] || styles.pending;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const getVendorStats = () => {
    return {
      total: vendors.length,
      pending: vendors.filter(v => v.status === 'pending').length,
      active: vendors.filter(v => v.status === 'active').length,
      rejected: vendors.filter(v => v.status === 'rejected').length
    };
  };

  const stats = getVendorStats();

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar currentPage="vendors" onNavigate={onNavigate} />
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
      <AdminSidebar currentPage="vendors" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-[260px]">
        <header className="bg-bg-medium border-b border-[#333] px-8 py-4">
          <h1 className="text-2xl font-bold mb-1">Gestion des Commerçants</h1>
          <p className="text-sm text-gray-medium">{filteredVendors.length} vendeur(s) affiché(s)</p>
        </header>

        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
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
              <div className="text-sm text-gray-medium">Actifs</div>
            </div>
            <div className="bg-bg-medium rounded-lg p-4 border border-red/30">
              <div className="text-2xl font-bold text-red">{stats.rejected}</div>
              <div className="text-sm text-gray-medium">Rejetés</div>
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
              Tous ({stats.total})
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
              Actifs ({stats.active})
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                statusFilter === 'rejected'
                  ? 'bg-red text-white'
                  : 'bg-bg-medium text-gray-medium hover:bg-bg-card'
              }`}
            >
              Rejetés ({stats.rejected})
            </button>
          </div>

          {/* Liste des vendeurs */}
          {filteredVendors.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold mb-2">Aucun vendeur</h3>
              <p className="text-gray-medium">Aucun vendeur ne correspond à ce filtre</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVendors.map((vendor, index) => (
                <motion.div
                  key={vendor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-bg-medium rounded-lg p-6 border border-[#333] hover:border-orange/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{vendor.businessName}</h3>
                        {getStatusBadge(vendor.status)}
                      </div>
                      <p className="text-xs text-gray-dark mb-3">ID: {vendor.id}</p>
                      <div className="grid grid-cols-3 gap-4 text-[13px]">
                        <div>
                          <span className="text-gray-medium">Email: </span>
                          <span>{vendor.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-medium">Téléphone: </span>
                          <span>{vendor.phone}</span>
                        </div>
                        <div>
                          <span className="text-gray-medium">Ville: </span>
                          <span>{vendor.city || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="primary" 
                      size="small"
                      onClick={() => openVendorDetails(vendor)}
                    >
                      📋 Détails
                    </Button>
                    
                    {vendor.status === 'pending' && (
                      <>
                        <Button 
                          variant="success" 
                          size="small"
                          onClick={() => handleApprove(vendor.id)}
                          disabled={actionLoading}
                        >
                          ✅ Valider
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="small"
                          onClick={() => handleReject(vendor.id)}
                          disabled={actionLoading}
                        >
                          ❌ Rejeter
                        </Button>
                      </>
                    )}
                    
                    {vendor.status === 'active' && (
                      <Button 
                        variant="secondary" 
                        size="small"
                        onClick={() => handleDeactivate(vendor.id)}
                        disabled={actionLoading}
                      >
                        🔒 Désactiver
                      </Button>
                    )}
                    
                    {vendor.status === 'rejected' && (
                      <Button 
                        variant="success" 
                        size="small"
                        onClick={() => handleReactivate(vendor.id)}
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

      {/* Modal détails vendeur */}
      {showModal && selectedVendor && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bg-medium rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedVendor.businessName}</h2>
              {getStatusBadge(selectedVendor.status)}
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Informations générales</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-medium">Email:</span>
                    <p>{selectedVendor.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-medium">Téléphone:</span>
                    <p>{selectedVendor.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-medium">Adresse:</span>
                    <p>{selectedVendor.address}</p>
                  </div>
                  <div>
                    <span className="text-gray-medium">Type d'entreprise:</span>
                    <p>{selectedVendor.businessType || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-medium">Ville:</span>
                    <p>{selectedVendor.city || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {selectedVendor.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-gray-medium">{selectedVendor.description}</p>
                </div>
              )}

              {(selectedVendor.cniUrl || selectedVendor.registreUrl) && (
                <div>
                  <h3 className="font-semibold mb-2">Documents</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedVendor.cniUrl && (
                      <div>
                        <p className="text-sm text-gray-medium mb-2">CNI</p>
                        <img 
                          src={selectedVendor.cniUrl} 
                          alt="CNI" 
                          className="w-full h-40 object-cover rounded-lg border border-gray-700 cursor-pointer hover:opacity-80"
                          onClick={() => window.open(selectedVendor.cniUrl, '_blank')}
                        />
                      </div>
                    )}
                    {selectedVendor.registreUrl && (
                      <div>
                        <p className="text-sm text-gray-medium mb-2">Registre de commerce</p>
                        <img 
                          src={selectedVendor.registreUrl} 
                          alt="Registre" 
                          className="w-full h-40 object-cover rounded-lg border border-gray-700 cursor-pointer hover:opacity-80"
                          onClick={() => window.open(selectedVendor.registreUrl, '_blank')}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(selectedVendor.rejectionReason || selectedVendor.deactivationReason) && (
                <div className="bg-red/10 border border-red rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-red">Raison du rejet/désactivation</h3>
                  <p className="text-sm">{selectedVendor.rejectionReason || selectedVendor.deactivationReason}</p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              {selectedVendor.status === 'pending' && (
                <>
                  <Button
                    variant="success"
                    onClick={() => handleApprove(selectedVendor.id)}
                    disabled={actionLoading}
                    className="flex-1"
                  >
                    {actionLoading ? 'Traitement...' : '✅ Valider le vendeur'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleReject(selectedVendor.id)}
                    disabled={actionLoading}
                    className="flex-1"
                  >
                    ❌ Rejeter
                  </Button>
                </>
              )}
              
              {selectedVendor.status === 'active' && (
                <Button
                  variant="secondary"
                  onClick={() => handleDeactivate(selectedVendor.id)}
                  disabled={actionLoading}
                  className="flex-1"
                >
                  {actionLoading ? 'Traitement...' : '🔒 Désactiver'}
                </Button>
              )}
              
              {selectedVendor.status === 'rejected' && (
                <Button
                  variant="success"
                  onClick={() => handleReactivate(selectedVendor.id)}
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
