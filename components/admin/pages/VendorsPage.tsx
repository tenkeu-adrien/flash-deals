'use client';

import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';

interface VendorsPageProps {
  onNavigate: (page: string) => void;
}

export default function VendorsPage({ onNavigate }: VendorsPageProps) {
  const vendors = [
    { id: 1, name: 'TechStore Douala', email: 'tech@store.cm', campaigns: 15, sales: 2400000, status: 'active' },
    { id: 2, name: 'Fashion Boutique', email: 'fashion@boutique.cm', campaigns: 8, sales: 1200000, status: 'pending' },
    { id: 3, name: 'ElectroShop', email: 'electro@shop.cm', campaigns: 22, sales: 3500000, status: 'active' },
  ];

  return (
    <div className="flex">
      <AdminSidebar currentPage="vendors" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-[260px]">
        <header className="bg-bg-medium border-b border-[#333] px-8 py-4">
          <h1 className="text-2xl font-bold mb-1">Gestion des Commerçants</h1>
          <p className="text-sm text-gray-medium">{vendors.length} vendeurs enregistrés</p>
        </header>

        <div className="p-8">
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
                    <h3 className="text-lg font-bold mb-1">{vendor.name}</h3>
                    <p className="text-xs text-gray-dark mb-3">ID: #{vendor.id.toString().padStart(6, '0')}</p>
                    <div className="grid grid-cols-3 gap-4 text-[13px]">
                      <div>
                        <span className="text-gray-medium">Email: </span>
                        <span>{vendor.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-medium">Campagnes: </span>
                        <strong className="text-orange">{vendor.campaigns}</strong>
                      </div>
                      <div>
                        <span className="text-gray-medium">Ventes: </span>
                        <strong className="text-orange">{vendor.sales.toLocaleString()} XAF</strong>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    vendor.status === 'active' ? 'bg-green/20 text-green' : 'bg-yellow/20 text-yellow'
                  }`}>
                    {vendor.status === 'active' ? 'Actif' : 'En attente'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="small">Voir profil</Button>
                  <Button variant="secondary" size="small">Campagnes</Button>
                  {vendor.status === 'pending' && (
                    <Button variant="success" size="small">Valider KYC</Button>
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
