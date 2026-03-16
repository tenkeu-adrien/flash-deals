'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';
import { getFirebaseDb, Collections } from '@/lib/firebase/config';
import { getDocs, collection, query, orderBy, limit } from 'firebase/firestore';

interface ClientsPageProps {
  onNavigate: (page: string) => void;
}

export default function ClientsPage({ onNavigate }: ClientsPageProps) {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('Toutes');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const db = getFirebaseDb();
      const q = query(collection(db, Collections.USERS), orderBy('createdAt', 'desc'), limit(100));
      const snapshot = await getDocs(q);
      const data: any[] = [];
      snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setClients(data);
    } catch (e) {
      // fallback sans orderBy
      try {
        const db = getFirebaseDb();
        const snapshot = await getDocs(collection(db, Collections.USERS));
        const data: any[] = [];
        snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
        setClients(data);
      } catch {}
    }
    setLoading(false);
  };

  const filtered = clients.filter((c) => {
    const matchSearch = !search ||
      (c.displayName || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(search.toLowerCase());
    const matchCity = cityFilter === 'Toutes' || (c.address?.city || '') === cityFilter;
    return matchSearch && matchCity;
  });

  const cities = ['Toutes', ...Array.from(new Set(clients.map((c) => c.address?.city).filter(Boolean)))];


  return (
    <div className="flex">
      <AdminSidebar currentPage="clients" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-[260px]">
        <header className="bg-bg-medium border-b border-[#333] px-8 py-4">
          <h1 className="text-2xl font-bold mb-1">Gestion des Clients</h1>
          <p className="text-sm text-gray-medium">
            {loading ? 'Chargement...' : `${filtered.length} client(s)`}
          </p>
        </header>

        <div className="p-8">
          <div className="flex gap-4 items-center flex-wrap mb-6 p-4 bg-bg-medium rounded-lg border border-[#333]">
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-gray-medium">Ville:</span>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="px-3 py-2 bg-bg-dark border border-[#333] rounded-lg text-white text-[13px]"
              >
                {cities.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 bg-bg-dark border border-[#333] rounded-lg text-white text-[13px]"
            />
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-medium">
              <div className="text-4xl mb-4">⏳</div>
              <p>Chargement des clients...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-medium">
              <p>Aucun client trouvé.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-bg-medium rounded-lg p-6 border border-[#333]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{client.displayName || 'Sans nom'}</h3>
                      <p className="text-xs text-gray-dark mb-3">ID: {client.id?.substring(0, 12)}</p>
                      <div className="grid grid-cols-3 gap-4 text-[13px]">
                        <div>
                          <span className="text-gray-medium">Email: </span>
                          <span>{client.email || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-medium">Téléphone: </span>
                          <span>{client.phoneNumber || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-medium">Ville: </span>
                          <span>{client.address?.city || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      client.status === 'active' ? 'bg-green/20 text-green' : 'bg-red/20 text-red'
                    }`}>
                      {client.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
