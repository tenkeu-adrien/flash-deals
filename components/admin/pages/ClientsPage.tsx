'use client';

import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';

interface ClientsPageProps {
  onNavigate: (page: string) => void;
}

export default function ClientsPage({ onNavigate }: ClientsPageProps) {
  const clients = [
    { id: 1, name: 'Marie Ngo', email: 'marie@email.com', phone: '+237 6XX XX XX XX', orders: 12, spent: 450000, status: 'active' },
    { id: 2, name: 'Jean Kamga', email: 'jean@email.com', phone: '+237 6XX XX XX XX', orders: 8, spent: 320000, status: 'active' },
    { id: 3, name: 'Fatima B.', email: 'fatima@email.com', phone: '+237 6XX XX XX XX', orders: 15, spent: 580000, status: 'active' },
  ];

  return (
    <div className="flex">
      <AdminSidebar currentPage="clients" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-[260px]">
        <header className="bg-bg-medium border-b border-[#333] px-8 py-4">
          <h1 className="text-2xl font-bold mb-1">Gestion des Clients</h1>
          <p className="text-sm text-gray-medium">{clients.length} clients actifs</p>
        </header>

        <div className="p-8">
          {/* Filters */}
          <div className="flex gap-4 items-center flex-wrap mb-6 p-4 bg-bg-medium rounded-lg border border-[#333]">
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-gray-medium">Statut:</span>
              <select className="px-3 py-2 bg-bg-dark border border-[#333] rounded-lg text-white text-[13px]">
                <option>Tous</option>
                <option>Actifs</option>
                <option>Inactifs</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-gray-medium">Ville:</span>
              <select className="px-3 py-2 bg-bg-dark border border-[#333] rounded-lg text-white text-[13px]">
                <option>Toutes</option>
                <option>Douala</option>
                <option>Yaoundé</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              className="flex-1 px-3 py-2 bg-bg-dark border border-[#333] rounded-lg text-white text-[13px]"
            />
          </div>

          {/* Clients List */}
          <div className="space-y-4">
            {clients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-bg-medium rounded-lg p-6 border border-[#333]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{client.name}</h3>
                    <p className="text-xs text-gray-dark mb-3">ID: #{client.id.toString().padStart(6, '0')}</p>
                    <div className="grid grid-cols-4 gap-4 text-[13px]">
                      <div>
                        <span className="text-gray-medium">Email: </span>
                        <span>{client.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-medium">Téléphone: </span>
                        <span>{client.phone}</span>
                      </div>
                      <div>
                        <span className="text-gray-medium">Commandes: </span>
                        <strong className="text-orange">{client.orders}</strong>
                      </div>
                      <div>
                        <span className="text-gray-medium">Dépensé: </span>
                        <strong className="text-orange">{client.spent.toLocaleString()} XAF</strong>
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green/20 text-green">
                    Actif
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="small">Voir profil</Button>
                  <Button variant="secondary" size="small">Historique</Button>
                  <Button variant="secondary" size="small">Contacter</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
