'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';
import { Order } from '@/lib/firebase/firestore';
import { getAllOrders } from '@/lib/firebase/firestore-admin';

interface OrdersPageProps {
  onNavigate: (page: string) => void;
}

export default function OrdersPage({ onNavigate }: OrdersPageProps) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await getAllOrders();
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
      setLoading(false);
    };
    load();
  }, []);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      delivered: 'bg-green/20 text-green',
      shipped: 'bg-blue/20 text-blue',
      confirmed: 'bg-blue/20 text-blue',
      pending: 'bg-yellow/20 text-yellow',
      cancelled: 'bg-red/20 text-red'
    };
    const labels: Record<string, string> = {
      delivered: 'Livré',
      shipped: 'Expédié',
      confirmed: 'Confirmé',
      pending: 'En attente',
      cancelled: 'Annulé'
    };
    const cls = styles[status] || 'bg-yellow/20 text-yellow';
    const label = labels[status] || status;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="flex">
      <AdminSidebar currentPage="orders" onNavigate={onNavigate} />

      <div className="flex-1 ml-[260px]">
        <header className="bg-bg-medium border-b border-[#333] px-8 py-4">
          <h1 className="text-2xl font-bold mb-1">Gestion des Commandes</h1>
          <p className="text-sm text-gray-medium">
            {loading ? 'Chargement des commandes...' : `${orders.length} commandes récentes`}
          </p>
        </header>

        <div className="p-8">
          {loading ? (
            <div className="text-center py-12 text-gray-medium">
              <div className="text-4xl mb-4">⏳</div>
              <p>Chargement des commandes...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-gray-medium">
              <p>Aucune commande trouvée pour le moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-bg-card">
                    <th className="px-4 py-4 text-left border-b border-[#333] text-[13px] text-gray-medium uppercase tracking-wider font-semibold">
                      Commande
                    </th>
                    <th className="px-4 py-4 text-left border-b border-[#333] text-[13px] text-gray-medium uppercase tracking-wider font-semibold">
                      Client
                    </th>
                    <th className="px-4 py-4 text-left border-b border-[#333] text-[13px] text-gray-medium uppercase tracking-wider font-semibold">
                      Vendeur
                    </th>
                    <th className="px-4 py-4 text-left border-b border-[#333] text-[13px] text-gray-medium uppercase tracking-wider font-semibold">
                      Montant
                    </th>
                    <th className="px-4 py-4 text-left border-b border-[#333] text-[13px] text-gray-medium uppercase tracking-wider font-semibold">
                      Statut
                    </th>
                    <th className="px-4 py-4 text-left border-b border-[#333] text-[13px] text-gray-medium uppercase tracking-wider font-semibold">
                      Paiement
                    </th>
                    <th className="px-4 py-4 text-left border-b border-[#333] text-[13px] text-gray-medium uppercase tracking-wider font-semibold">
                      Date
                    </th>
                    <th className="px-4 py-4 text-left border-b border-[#333] text-[13px] text-gray-medium uppercase tracking-wider font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => {
                    const created =
                      (order.createdAt as any)?.toDate?.() || new Date(order.createdAt);
                    return (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-bg-card transition-colors border-b border-[#333]"
                      >
                        <td className="px-4 py-4">
                          <div className="font-bold">#{(order.id || '').toString().substring(0, 8)}</div>
                        </td>
                        <td className="px-4 py-4 text-sm">{order.userId?.substring(0, 8) || 'N/A'}</td>
                        <td className="px-4 py-4 text-sm">
                          {order.vendorId?.substring(0, 8) || 'N/A'}
                        </td>
                        <td className="px-4 py-4 font-bold text-orange">
                          {(order.totalPrice || 0).toLocaleString()} XAF
                        </td>
                        <td className="px-4 py-4">
                          {getStatusBadge(order.status || 'pending')}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {order.paymentStatus || 'pending'}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {created?.toLocaleDateString('fr-FR') || 'N/A'}
                        </td>
                        <td className="px-4 py-4">
                          <Button variant="secondary" size="small" onClick={() => setSelectedOrder(order)}>
                            Détails
                          </Button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Détails Commande */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bg-medium rounded-xl p-6 max-w-lg w-full"
          >
            <h2 className="text-xl font-bold mb-4">Commande #{(selectedOrder.id || '').substring(0, 8)}</h2>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-medium">Client ID</span>
                <span>{selectedOrder.userId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-medium">Vendeur ID</span>
                <span>{selectedOrder.vendorId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-medium">Montant</span>
                <span className="font-bold text-orange">{(selectedOrder.totalPrice || 0).toLocaleString()} XAF</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-medium">Statut</span>
                {getStatusBadge(selectedOrder.status || 'pending')}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-medium">Paiement</span>
                <span>{selectedOrder.paymentStatus || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-medium">Méthode</span>
                <span>{selectedOrder.paymentMethod || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-medium">Quantité</span>
                <span>{selectedOrder.quantity || 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-medium">Date</span>
                <span>{((selectedOrder.createdAt as any)?.toDate?.() || new Date(selectedOrder.createdAt))?.toLocaleString('fr-FR') || 'N/A'}</span>
              </div>
              {selectedOrder.deliveryAddress && (
                <div className="flex justify-between">
                  <span className="text-gray-medium">Adresse</span>
                  <span className="text-right max-w-[200px]">{typeof selectedOrder.deliveryAddress === 'string' ? selectedOrder.deliveryAddress : JSON.stringify(selectedOrder.deliveryAddress)}</span>
                </div>
              )}
            </div>
            <Button variant="secondary" className="w-full" onClick={() => setSelectedOrder(null)}>
              Fermer
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
