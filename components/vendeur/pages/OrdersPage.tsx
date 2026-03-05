'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/vendeur/Sidebar';
import Header from '@/components/vendeur/Header';
import Button from '@/components/ui/Button';
import { Package, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { getVendorOrders } from '@/lib/firebase/firestore';
import { updateOrderStatus } from '@/lib/firebase/firestore';

interface OrdersPageProps {
  onNavigate: (page: string) => void;
}

export default function OrdersPage({ onNavigate }: OrdersPageProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const result = await getVendorOrders();
    if (result.success && result.orders) {
      setOrders(result.orders);
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const result = await updateOrderStatus(orderId, newStatus as any);
    if (result.success) {
      alert('Statut mis à jour!');
      loadOrders();
      setShowModal(false);
    } else {
      alert('Erreur: ' + result.error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow/20 text-yellow',
      confirmed: 'bg-blue/20 text-blue',
      shipped: 'bg-purple/20 text-purple',
      delivered: 'bg-green/20 text-green',
      cancelled: 'bg-red/20 text-red'
    };
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles] || styles.pending}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar currentPage="orders" onNavigate={onNavigate} />
        <div className="flex-1 ml-[260px] flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p>Chargement des commandes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar currentPage="orders" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-[260px]">
        <Header onNavigate={onNavigate} />

        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-bg-medium rounded-lg p-6 border border-[#333]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600">
                  <Package size={20} className="text-white" />
                </div>
              </div>
              <div className="text-[13px] text-gray-medium mb-1">Total Commandes</div>
              <div className="text-[28px] font-bold">{stats.total}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-bg-medium rounded-lg p-6 border border-[#333]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-orange">
                  <Clock size={20} className="text-white" />
                </div>
              </div>
              <div className="text-[13px] text-gray-medium mb-1">En Attente</div>
              <div className="text-[28px] font-bold">{stats.pending}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-bg-medium rounded-lg p-6 border border-[#333]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                  <TrendingUp size={20} className="text-white" />
                </div>
              </div>
              <div className="text-[13px] text-gray-medium mb-1">Expédiées</div>
              <div className="text-[28px] font-bold">{stats.shipped}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-bg-medium rounded-lg p-6 border border-[#333]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
                  <CheckCircle size={20} className="text-white" />
                </div>
              </div>
              <div className="text-[13px] text-gray-medium mb-1">Livrées</div>
              <div className="text-[28px] font-bold">{stats.delivered}</div>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            {['all', 'pending', 'confirmed', 'shipped', 'delivered'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  filter === status
                    ? 'bg-orange text-white'
                    : 'bg-bg-medium text-gray-medium hover:bg-bg-card'
                }`}
              >
                {status === 'all' ? 'Toutes' : status === 'pending' ? 'En attente' : 
                 status === 'confirmed' ? 'Confirmées' : status === 'shipped' ? 'Expédiées' : 'Livrées'}
              </button>
            ))}
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-bg-medium rounded-lg border border-[#333]">
              <Package size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">Aucune commande</h3>
              <p className="text-gray-medium">
                {filter === 'all' ? 'Vous n\'avez pas encore de commandes' : `Aucune commande ${filter}`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-bg-medium rounded-lg p-6 border border-[#333]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold mb-1">Commande #{order.id?.substring(0, 8)}</h3>
                      <p className="text-sm text-gray-medium">
                        {order.createdAt?.toDate?.()?.toLocaleDateString('fr-FR')} à {order.createdAt?.toDate?.()?.toLocaleTimeString('fr-FR')}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-medium mb-1">Client</div>
                      <div className="text-sm font-semibold">{order.userId?.substring(0, 8)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-medium mb-1">Quantité</div>
                      <div className="text-sm font-semibold">{order.quantity}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-medium mb-1">Montant Total</div>
                      <div className="text-sm font-semibold text-orange">{order.totalPrice?.toLocaleString()} FCFA</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-medium mb-1">Votre Part (85%)</div>
                      <div className="text-sm font-semibold text-green">{(order.totalPrice * 0.85)?.toLocaleString()} FCFA</div>
                    </div>
                  </div>

                  {order.deliveryAddress && (
                    <div className="mb-4 p-3 bg-bg-dark rounded-lg">
                      <div className="text-xs text-gray-medium mb-1">Adresse de livraison</div>
                      <div className="text-sm">
                        {order.deliveryAddress.street}, {order.deliveryAddress.city}
                      </div>
                      <div className="text-sm text-gray-medium">
                        Tél: {order.deliveryAddress.phone}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      variant="primary" 
                      size="small"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowModal(true);
                      }}
                    >
                      Gérer
                    </Button>
                    {order.status === 'pending' && (
                      <Button 
                        variant="success" 
                        size="small"
                        onClick={() => handleStatusChange(order.id, 'confirmed')}
                      >
                        Confirmer
                      </Button>
                    )}
                    {order.status === 'confirmed' && (
                      <Button 
                        variant="success" 
                        size="small"
                        onClick={() => handleStatusChange(order.id, 'shipped')}
                      >
                        Marquer comme expédiée
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de gestion */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bg-medium rounded-xl p-6 max-w-2xl w-full"
          >
            <h2 className="text-2xl font-bold mb-4">Gérer la Commande</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Changer le statut</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => handleStatusChange(selectedOrder.id, 'confirmed')}
                    disabled={selectedOrder.status !== 'pending'}
                  >
                    Confirmer
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleStatusChange(selectedOrder.id, 'shipped')}
                    disabled={selectedOrder.status !== 'confirmed'}
                  >
                    Expédier
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleStatusChange(selectedOrder.id, 'delivered')}
                    disabled={selectedOrder.status !== 'shipped'}
                  >
                    Livrer
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="w-full"
            >
              Fermer
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
