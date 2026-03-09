'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';
import { 
  getOrdersByStatus,
  validateOrderPayment,
  markOrderInDelivery,
  markOrderDelivered,
  getOrderMessages,
  sendOrderMessage,
  OrderWithPayment,
  ChatMessage
} from '@/lib/firebase';

interface OrderManagementPageProps {
  onNavigate: (page: string) => void;
}

export default function OrderManagementPage({ onNavigate }: OrderManagementPageProps) {
  const [orders, setOrders] = useState<OrderWithPayment[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<OrderWithPayment['status']>('pending_validation');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithPayment | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadOrders();
  }, [selectedStatus]);

  const loadOrders = async () => {
    setLoading(true);
    const result = await getOrdersByStatus(selectedStatus);
    
    if (result.success && result.orders) {
      setOrders(result.orders);
    }
    
    setLoading(false);
  };

  const loadChat = async (orderId: string) => {
    const result = await getOrderMessages(orderId);
    
    if (result.success && result.messages) {
      setChatMessages(result.messages);
    }
  };

  const handleValidatePayment = async (orderId: string) => {
    if (!confirm('Confirmer que le paiement a été reçu ?')) return;

    const result = await validateOrderPayment(orderId);

    if (result.success) {
      await loadOrders();
      alert('✅ Paiement validé ! La commande est maintenant en attente de livraison.');
    } else {
      alert(`❌ Erreur: ${result.error}`);
    }
  };

  const handleMarkInDelivery = async (orderId: string) => {
    const result = await markOrderInDelivery(orderId);

    if (result.success) {
      await loadOrders();
      alert('✅ Commande marquée en livraison');
    }
  };

  const handleMarkDelivered = async (orderId: string) => {
    if (!confirm('Confirmer que la commande a été livrée ?')) return;

    const result = await markOrderDelivered(orderId);

    if (result.success) {
      await loadOrders();
      alert('✅ Commande livrée !');
    }
  };

  const handleSendMessage = async () => {
    if (!selectedOrder || !newMessage.trim()) return;

    const userName = 'Admin';

    const result = await sendOrderMessage(
      selectedOrder.id!,
      newMessage.trim(),
      'admin',
      userName
    );

    if (result.success) {
      setNewMessage('');
      await loadChat(selectedOrder.id!);
    }
  };

  const handleOpenChat = async (order: OrderWithPayment) => {
    setSelectedOrder(order);
    await loadChat(order.id!);
  };

  const statusLabels: Record<OrderWithPayment['status'], string> = {
    pending_validation: 'En attente de validation',
    payment_confirmed: 'Paiement confirmé / En attente',
    in_delivery: 'En livraison',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  };

  const statusColors: Record<OrderWithPayment['status'], string> = {
    pending_validation: 'bg-yellow-500/10 text-yellow-500 border-yellow-500',
    payment_confirmed: 'bg-blue-500/10 text-blue-500 border-blue-500',
    in_delivery: 'bg-purple-500/10 text-purple-500 border-purple-500',
    delivered: 'bg-green/10 text-green border-green',
    cancelled: 'bg-red/10 text-red border-red'
  };

  return (
    <div className="flex">
      <AdminSidebar currentPage="order-management" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-[260px]">
        <div className="p-8">
          <h1 className="text-[28px] font-bold mb-6">Gestion des Commandes</h1>

          {/* Filtres par statut */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {Object.entries(statusLabels).map(([status, label]) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status as OrderWithPayment['status'])}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors text-sm ${
                  selectedStatus === status
                    ? 'bg-orange text-white'
                    : 'bg-bg-medium text-gray-medium hover:bg-bg-card border border-[#333]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-bg-medium rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-bg-medium rounded-lg border border-[#333] p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          Commande #{order.id?.slice(-8)}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm border ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-medium space-y-1">
                        <p>Quantité: {order.quantity}</p>
                        <p>Total: {order.totalPrice.toLocaleString()} FCFA</p>
                        <p>Paiement: {
                          order.paymentMethod === 'orange_money' ? 'Orange Money' :
                          order.paymentMethod === 'mobile_money' ? 'Mobile Money' :
                          'À la livraison'
                        }</p>
                        {order.merchantCode && (
                          <p>Code marchand: {order.merchantCode}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {order.status === 'pending_validation' && (
                        <Button
                          onClick={() => handleValidatePayment(order.id!)}
                          className="bg-green hover:bg-green/80"
                        >
                          Valider le paiement
                        </Button>
                      )}

                      {order.status === 'payment_confirmed' && (
                        <Button
                          onClick={() => handleMarkInDelivery(order.id!)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Marquer en livraison
                        </Button>
                      )}

                      {order.status === 'in_delivery' && (
                        <Button
                          onClick={() => handleMarkDelivered(order.id!)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Marquer comme livrée
                        </Button>
                      )}

                      <Button
                        onClick={() => handleOpenChat(order)}
                        variant="secondary"
                      >
                        💬 Chat avec client
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-[#333] pt-4 mt-4">
                    <h4 className="font-medium mb-2">Adresse de livraison</h4>
                    <p className="text-sm text-gray-medium">
                      {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.region}
                      <br />
                      Tél: {order.deliveryAddress.phone}
                    </p>
                    {order.deliveryNotes && (
                      <p className="text-sm text-gray-dark mt-2">
                        Note: {order.deliveryNotes}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {orders.length === 0 && (
                <div className="text-center py-12 bg-bg-medium rounded-lg border border-[#333]">
                  <p className="text-gray-medium">
                    Aucune commande avec le statut "{statusLabels[selectedStatus]}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Modal de chat */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-bg-dark rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col border border-[#333]">
                <div className="p-4 border-b border-[#333] flex justify-between items-center">
                  <h2 className="text-lg font-semibold">
                    Chat - Commande #{selectedOrder.id?.slice(-8)}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-medium hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderRole === 'admin' || msg.senderRole === 'manager' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.senderRole === 'admin' || msg.senderRole === 'manager'
                            ? 'bg-orange text-white'
                            : 'bg-bg-medium text-white'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {msg.senderName} - {msg.senderRole === 'admin' ? 'Admin' : msg.senderRole === 'manager' ? 'Manager' : 'Client'}
                        </p>
                      </div>
                    </div>
                  ))}

                  {chatMessages.length === 0 && (
                    <p className="text-center text-gray-medium">Aucun message</p>
                  )}
                </div>

                <div className="p-4 border-t border-[#333]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Tapez votre message..."
                      className="flex-1 px-4 py-2 bg-bg-medium border border-[#333] rounded-lg text-white focus:outline-none focus:border-orange"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-orange hover:bg-orange/80"
                    >
                      Envoyer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
