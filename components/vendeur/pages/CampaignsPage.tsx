'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Sidebar from '@/components/vendeur/Sidebar';

interface CampaignsPageProps {
  onNavigate: (page: string) => void;
}

export default function CampaignsPage({ onNavigate }: CampaignsPageProps) {
  const campaigns = [
    { id: 1, title: 'Samsung Galaxy A54', status: 'active', sold: 23, total: 50, price: 145000 },
    { id: 2, title: 'Nike Air Max 90', status: 'planned', sold: 0, total: 30, price: 45000 },
    { id: 3, title: 'Sony WH-1000XM4', status: 'completed', sold: 20, total: 20, price: 85000 },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green/20 text-green',
      planned: 'bg-blue/20 text-blue',
      completed: 'bg-gray-medium/20 text-gray-medium',
    };
    const labels = { active: 'Actif', planned: 'Planifié', completed: 'Terminé' };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="flex">
      <Sidebar currentPage="campaigns" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-[260px]">
        <header className="bg-bg-medium border-b border-[#333] px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Mes Campagnes</h1>
            <p className="text-sm text-gray-medium">{campaigns.length} campagnes au total</p>
          </div>
          <Button variant="primary" onClick={() => onNavigate('create-campaign')}>
            + Nouvelle Campagne
          </Button>
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
                  <div className="w-24 h-24 bg-bg-card rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                    📱
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold mb-1">{campaign.title}</h3>
                        <p className="text-[13px] text-gray-dark">ID: #{campaign.id.toString().padStart(6, '0')}</p>
                      </div>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      <div>
                        <div className="text-xs text-gray-medium mb-1">Vendus</div>
                        <div className="text-lg font-bold">{campaign.sold}/{campaign.total}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-medium mb-1">Prix</div>
                        <div className="text-lg font-bold text-orange">{campaign.price.toLocaleString()} XAF</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-medium mb-1">Revenus</div>
                        <div className="text-lg font-bold">{(campaign.sold * campaign.price * 0.85).toLocaleString()} XAF</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-medium mb-1">Progression</div>
                        <div className="w-full h-2 bg-[#333] rounded overflow-hidden mt-2">
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
                  <Button variant="secondary" size="small">Modifier</Button>
                  <Button variant="secondary" size="small">Statistiques</Button>
                  {campaign.status === 'active' && (
                    <Button variant="danger" size="small">Arrêter</Button>
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
