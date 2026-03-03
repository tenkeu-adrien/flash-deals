'use client';

import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';

interface CampaignsPageProps {
  onNavigate: (page: string) => void;
}

export default function CampaignsPage({ onNavigate }: CampaignsPageProps) {
  const campaigns = [
    { id: 1, title: 'Samsung Galaxy A54', vendor: 'TechStore', status: 'active', sold: 23, total: 50, price: 145000 },
    { id: 2, title: 'Nike Air Max 90', vendor: 'Fashion Boutique', status: 'pending', sold: 0, total: 30, price: 45000 },
    { id: 3, title: 'Sony WH-1000XM4', vendor: 'ElectroShop', status: 'active', sold: 18, total: 20, price: 85000 },
  ];

  return (
    <div className="flex">
      <AdminSidebar currentPage="campaigns" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-[260px]">
        <header className="bg-bg-medium border-b border-[#333] px-8 py-4">
          <h1 className="text-2xl font-bold mb-1">Gestion des Campagnes</h1>
          <p className="text-sm text-gray-medium">{campaigns.length} campagnes en cours</p>
        </header>

        <div className="p-8">
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
                  <div className="w-20 h-20 bg-bg-card rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                    📱
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold mb-1">{campaign.title}</h3>
                        <p className="text-xs text-gray-dark">Par {campaign.vendor} • ID: #{campaign.id.toString().padStart(6, '0')}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        campaign.status === 'active' ? 'bg-green/20 text-green' : 'bg-yellow/20 text-yellow'
                      }`}>
                        {campaign.status === 'active' ? 'Actif' : 'En attente'}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-4 text-[13px]">
                      <div>
                        <div className="text-gray-medium mb-1">Vendus</div>
                        <div className="font-bold">{campaign.sold}/{campaign.total}</div>
                      </div>
                      <div>
                        <div className="text-gray-medium mb-1">Prix</div>
                        <div className="font-bold text-orange">{campaign.price.toLocaleString()} XAF</div>
                      </div>
                      <div>
                        <div className="text-gray-medium mb-1">GMV</div>
                        <div className="font-bold">{(campaign.sold * campaign.price).toLocaleString()} XAF</div>
                      </div>
                      <div>
                        <div className="text-gray-medium mb-1">Progression</div>
                        <div className="w-full h-2 bg-[#333] rounded overflow-hidden mt-1">
                          <div
                            className="h-full bg-gradient-to-r from-orange to-red"
                            style={{ width: `${(campaign.sold / campaign.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="secondary" size="small">Détails</Button>
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
