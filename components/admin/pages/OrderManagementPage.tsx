'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';
import toast, { Toaster } from 'react-hot-toast';
import { 
  getOrdersByStatus,
  validateOrderPayment,
  markOrderInDelivery,
  markOrderDelivered,
  getOrderMessages,
  sendOrderMessage,
  OrderWithPayment,
  ChatMessage
} from '@/lib/firebase/firestore-payment';
import { getCampaign } from '@/lib/firebase/firestore';

interface OrderManagementPageProps {
  onNavigate: (page: string) => void;
}

export default function OrderManagementPage({ onNavigate }: OrderManagementPageProps) {
  const [orders, setOrders] = useState<OrderWithPayment[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<OrderWithPayment['status']>('pending_validation');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithPayment | null>(null);
  const [detailsOrder, setDetailsOrder] = useState<OrderWithPayment | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [campaignDetails, setCampaignDetails] = useState<any>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [selectedStatus]);

  const loadOrders = async () => {
    setLoading(true);
    const result = await getOrdersByStatus(selectedStatus);
    
    if (result.success && result.orders) {
      setOrders(result.orders);
    } else {
      toast.error('Erreur lors du chargement des commandes');
    }
    
    setLoading(false);
  };

  const loadChat = async (orderId: string) => {
    const result = await getOrderMessages(orderId);
    
    if (result.success && result.messages) {
      setChatMessages(result.messages);
    }
  };

  const loadCampaignDetails = async (campaignId: string) => {
    const result = await getCampaign(campaignId);
    if (result.success && result.campaign) {
      setCampaignDetails(result.campaign);
    }
  };

  const handleValidatePayment = async (orderId: string) => {
    setLoadingAction(true);
    const result = await validateOrderPayment(orderId);

    if (result.success) {
      toast.success('✅ Paiement validé ! La commande est maintenant en attente de livraison.');
      await loadOrders();
    } else {
      toast.error(`❌ Erreur: ${result.error}`);
    }
    setLoadingAction(false);
  };

  const handleMarkInDelivery = async (orderId: string) => {
    setLoadingAction(true);
    const result = await markOrderInDelivery(orderId);

    if (result.success) {
      toast.success('✅ Commande marquée en livraison');
      await loadOrders();
    } else {
      toast.error(`❌ Erreur: ${result.error}`);
    }
    setLoadingAction(false);
  };

  const handleMarkDelivered = async (orderId: string) => {
    setLoadingAction(true);
    const result = await markOrderDelivered(orderId);

    if (result.success) {
      toast.success('✅ Commande livrée !');
      await loadOrders();
    } else {
      toast.error(`❌ Erreur: ${result.error}`);
    }
    setLoadingAction(false);
  };

  const handleSendMessage = async () => {
    if (!selectedOrder || !newMessage.trim()) return;

    const result = await sendOrderMessage(
      selectedOrder.id!,
      newMessage.trim(),
      'admin',
      'Admin'
    );

    if (result.success) {
      setNewMessage('');
      await loadChat(selectedOrder.id!);
      toast.success('Message envoyé');
    } else {
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const handleOpenChat = async (order: OrderWithPayment) => {
    setSelectedOrder(order);
    await loadChat(order.id!);
  };

  const handleOpenDetails = async (order: OrderWithPayment) => {
    setDetailsOrder(order);
    await loadCampaignDetails(order.campaignId);
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

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #333',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
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
                      {/* Actions selon le statut */}
                      {order.status === 'pending_validation' && (
                        <>
                          <Button
                            onClick={() => handleValidatePayment(order.id!)}
                            disabled={loadingAction}
                            className="bg-green hover:bg-green/80 text-sm"
                          >
                            ✅ Valider le paiement
                          </Button>
                          <Button
                            onClick={() => handleOpenDetails(order)}
                            variant="secondary"
                            className="text-sm"
                          >
                            👁️ Voir détails
                          </Button>
                        </>
                      )}

                      {order.status === 'payment_confirmed' && (
                        <>
                          <Button
                            onClick={() => handleMarkInDelivery(order.id!)}
                            disabled={loadingAction}
                            className="bg-purple-600 hover:bg-purple-700 text-sm"
                          >
                            🚚 Marquer en livraison
                          </Button>
                          <Button
                            onClick={() => handleOpenDetails(order)}
                            variant="secondary"
                            className="text-sm"
                          >
                            👁️ Voir détails
                          </Button>
                        </>
                      )}

                      {order.status === 'in_delivery' && (
                        <>
                          <Button
                            onClick={() => handleMarkDelivered(order.id!)}
                            disabled={loadingAction}
                            className="bg-blue-600 hover:bg-blue-700 text-sm"
                          >
                            ✅ Marquer comme livrée
                          </Button>
                          <Button
                            onClick={() => handleOpenDetails(order)}
                            variant="secondary"
                            className="text-sm"
                          >
                            👁️ Voir détails
                          </Button>
                        </>
                      )}

                      {order.status === 'delivered' && (
                        <Button
                          onClick={() => handleOpenDetails(order)}
                          variant="secondary"
                          className="text-sm"
                        >
                          👁️ Voir détails
                        </Button>
                      )}

                      <Button
                        onClick={() => handleOpenChat(order)}
                        variant="secondary"
                        className="text-sm"
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

          {/* Modal de détails */}
          {detailsOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-bg-dark rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto border border-[#333]">
                <div className="p-6 border-b border-[#333] flex justify-between items-center sticky top-0 bg-bg-dark">
                  <h2 className="text-xl font-semibold">
                    Détails de la commande #{detailsOrder.id?.slice(-8)}
                  </h2>
                  <button
                    onClick={() => {
                      setDetailsOrder(null);
                      setCampaignDetails(null);
                    }}
                    className="text-gray-medium hover:text-white text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Statut */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Statut</h3>
                    <span className={`px-4 py-2 rounded-full text-sm border inline-block ${statusColors[detailsOrder.status]}`}>
                      {statusLabels[detailsOrder.status]}
                    </span>
                  </div>

                  {/* Informations de la commande */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Informations</h3>
                    <div className="bg-bg-medium rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-medium">Date de commande:</span>
                        <span>{formatDate(detailsOrder.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-medium">Quantité:</span>
                        <span>{detailsOrder.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-medium">Prix total:</span>
                        <span className="font-semibold">{detailsOrder.totalPrice.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-medium">Moyen de paiement:</span>
                        <span>
                          {detailsOrder.paymentMethod === 'orange_money' ? '🟠 Orange Money' :
                           detailsOrder.paymentMethod === 'mobile_money' ? '🟡 Mobile Money' :
                           '💵 Paiement à la livraison'}
                        </span>
                      </div>
                      {detailsOrder.merchantCode && (
                        <div className="flex justify-between">
                          <span className="text-gray-medium">Code marchand:</span>
                          <span className="font-mono font-semibold">{detailsOrder.merchantCode}</span>
                        </div>
                      )}
                      {detailsOrder.paymentConfirmedAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-medium">Paiement confirmé le:</span>
                          <span>{formatDate(detailsOrder.paymentConfirmedAt)}</span>
                        </div>
                      )}
                      {detailsOrder.deliveredAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-medium">Livré le:</span>
                          <span>{formatDate(detailsOrder.deliveredAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Détails de la campagne */}
                  {campaignDetails && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Produit</h3>
                      <div className="bg-bg-medium rounded-lg p-4">
                        <div className="flex gap-4">
                          {campaignDetails.images?.[0] && (
                            <img 
                              src={campaignDetails.images[0]} 
                              alt={campaignDetails.title}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{campaignDetails.title}</h4>
                            <p className="text-sm text-gray-medium mb-2">{campaignDetails.description}</p>
                            <div className="flex gap-4 text-sm">
                              <span className="text-gray-medium">
                                Prix: <span className="text-orange font-semibold">{campaignDetails.currentPrice?.toLocaleString()} FCFA</span>
                              </span>
                              <span className="text-gray-medium">
                                Stock: <span className="text-white">{campaignDetails.stock}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Adresse de livraison */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Adresse de livraison</h3>
                    <div className="bg-bg-medium rounded-lg p-4 space-y-2 text-sm">
                      <p>{detailsOrder.deliveryAddress.street}</p>
                      <p>{detailsOrder.deliveryAddress.city}, {detailsOrder.deliveryAddress.region}</p>
                      {detailsOrder.deliveryAddress.postalCode && (
                        <p>Code postal: {detailsOrder.deliveryAddress.postalCode}</p>
                      )}
                      <p className="pt-2 border-t border-[#333]">
                        📞 Téléphone: {detailsOrder.deliveryAddress.phone}
                      </p>
                      {detailsOrder.deliveryNotes && (
                        <p className="pt-2 border-t border-[#333] text-gray-dark">
                          📝 Note: {detailsOrder.deliveryNotes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-[#333]">
                    {detailsOrder.status === 'pending_validation' && (
                      <Button
                        onClick={() => {
                          handleValidatePayment(detailsOrder.id!);
                          setDetailsOrder(null);
                          setCampaignDetails(null);
                        }}
                        disabled={loadingAction}
                        className="bg-green hover:bg-green/80"
                      >
                        ✅ Valider le paiement
                      </Button>
                    )}
                    {detailsOrder.status === 'payment_confirmed' && (
                      <Button
                        onClick={() => {
                          handleMarkInDelivery(detailsOrder.id!);
                          setDetailsOrder(null);
                          setCampaignDetails(null);
                        }}
                        disabled={loadingAction}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        🚚 Marquer en livraison
                      </Button>
                    )}
                    {detailsOrder.status === 'in_delivery' && (
                      <Button
                        onClick={() => {
                          handleMarkDelivered(detailsOrder.id!);
                          setDetailsOrder(null);
                          setCampaignDetails(null);
                        }}
                        disabled={loadingAction}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        ✅ Marquer comme livrée
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        setDetailsOrder(null);
                        setCampaignDetails(null);
                      }}
                      variant="secondary"
                    >
                      Fermer
                    </Button>
                  </div>
                </div>
              </div>
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
