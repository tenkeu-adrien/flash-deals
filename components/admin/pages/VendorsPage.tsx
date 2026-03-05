'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';
import { getPendingVendors, approveVendor, rejectVendor } from '@/lib/firebase/firestore';

interface VendorsPageProps {
  onNavigate: (page: string) => void;
}

export default function VendorsPage({ onNavigate }: VendorsPageProps) {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    setLoading(true);
    const result = await getPendingVendors();
    if (result.success && result.vendors) {
      setVendors(result.vendors);
    }
    setLoading(false);
  };

  const handleApprove = async (vendorId: string) => {
    setActionLoading(true);
    const result = await approveVendor(vendorId);
    
    if (result.success) {
      alert('Vendeur validé avec succès!');
      loadVendors();
      setShowModal(false);
    } else {
      alert('Erreur: ' + result.error);
    }
    setActionLoading(false);
  };

  const handleReject = async (vendorId: string) => {
    const reason = prompt('Raison du rejet:');
    if (!reason) return;

    setActionLoading(true);
    const result = await rejectVendor(vendorId, reason);
    
    if (result.success) {
      alert('Vendeur rejeté');
      loadVendors();
      setShowModal(false);
    } else {
      alert('Erreur: ' + result.error);
    }
    setActionLoading(false);
  };

  const openVendorDetails = (vendor: any) => {
    setSelectedVendor(vendor);
    setShowModal(true);
  };

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
          <p className="text-sm text-gray-medium">{vendors.length} vendeurs en attente de validation</p>
        </header>

        <div className="p-8">
          {vendors.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">Aucun vendeur en attente</h3>
              <p className="text-gray-medium">Tous les vendeurs ont été traités</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vendors.map((vendor, index) => (
                <motion.div
                  key={vendor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-bg-medium rounded-lg p-6 border border-[#333]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{vendor.businessName}</h3>
                      <p className="text-xs text-gray-dark mb-3">ID: {vendor.id}</p>
                      <div className="grid grid-cols-2 gap-4 text-[13px]">
                        <div>
                          <span className="text-gray-medium">Email: </span>
                          <span>{vendor.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-medium">Téléphone: </span>
                          <span>{vendor.phone}</span>
                        </div>
                        <div>
                          <span className="text-gray-medium">Adresse: </span>
                          <span>{vendor.address}</span>
                        </div>
                        <div>
                          <span className="text-gray-medium">Type: </span>
                          <span>{vendor.businessType || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow/20 text-yellow">
                      En attente
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="primary" 
                      size="small"
                      onClick={() => openVendorDetails(vendor)}
                    >
                      Voir détails
                    </Button>
                    <Button 
                      variant="success" 
                      size="small"
                      onClick={() => handleApprove(vendor.id)}
                      disabled={actionLoading}
                    >
                      Valider
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="small"
                      onClick={() => handleReject(vendor.id)}
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

      {/* Modal détails vendeur */}
      {showModal && selectedVendor && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bg-medium rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-4">{selectedVendor.businessName}</h2>
            
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
                </div>
              </div>

              {selectedVendor.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-gray-medium">{selectedVendor.description}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Documents</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedVendor.cniUrl && (
                    <div>
                      <p className="text-sm text-gray-medium mb-2">CNI</p>
                      <img 
                        src={selectedVendor.cniUrl} 
                        alt="CNI" 
                        className="w-full h-40 object-cover rounded-lg border border-gray-700"
                      />
                    </div>
                  )}
                  {selectedVendor.registreUrl && (
                    <div>
                      <p className="text-sm text-gray-medium mb-2">Registre de commerce</p>
                      <img 
                        src={selectedVendor.registreUrl} 
                        alt="Registre" 
                        className="w-full h-40 object-cover rounded-lg border border-gray-700"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="success"
                onClick={() => handleApprove(selectedVendor.id)}
                disabled={actionLoading}
                className="flex-1"
              >
                {actionLoading ? 'Traitement...' : 'Valider le vendeur'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleReject(selectedVendor.id)}
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
