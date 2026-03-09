'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import FormTextarea from '@/components/ui/FormTextarea';
import { RegionSelect } from '@/components/ui/RegionSelect';
import { CityInput } from '@/components/ui/CityInput';
import { 
  createOrderWithPayment,
  getUserAddress,
  saveUserAddress,
  getOrCreateConversation,
  sendChatMessage,
  getChatMessages,
  onChatMessagesChange,
  ChatMessageData
} from '@/lib/firebase';
import { useClientStore } from '@/lib/stores/clientStore';

export default function NewCheckoutPage() {
  const { cart, clearCart, setCurrentPage } = useClientStore();
  const [step, setStep] = useState<'address' | 'payment' | 'confirmation'>('address');
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(true);
  
  // Adresse de livraison
  const [address, setAddress] = useState({
    street: '',
    city: '',
    region: '',
    postalCode: '',
    phone: ''
  });
  
  // Méthode de paiement
  const [paymentMethod, setPaymentMethod] = useState<'orange_money' | 'mobile_money' | 'cash_on_delivery'>('cash_on_delivery');
  const [merchantCode, setMerchantCode] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  
  // Chat
  const [showChat, setShowChat] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessageData[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [unsubscribeChat, setUnsubscribeChat] = useState<(() => void) | null>(null);
  
  // Résultat
  const [orderId, setOrderId] = useState('');

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const firstItem = cart[0];

  useEffect(() => {
    loadUserAddress();
    
    // Nettoyer l'écouteur au démontage
    return () => {
      if (unsubscribeChat) {
        unsubscribeChat();
      }
    };
  }, []);

  const loadUserAddress = async () => {
    setLoadingAddress(true);
    const result = await getUserAddress();
    
    if (result.success && result.address) {
      setAddress({
        street: result.address.street,
        city: result.address.city,
        region: result.address.region,
        postalCode: result.address.postalCode || '',
        phone: result.address.phone
      });
    }
    
    setLoadingAddress(false);
  };

  const handleOpenChat = async () => {
    if (!firstItem) return;

    const result = await getOrCreateConversation(
      firstItem.campaignId,
      firstItem.campaign?.title || 'Produit',
      firstItem.campaign?.images?.[0]
    );

    if (result.success && result.conversationId) {
      setConversationId(result.conversationId);
      setShowChat(true);

      // Charger les messages
      const messagesResult = await getChatMessages(result.conversationId);
      if (messagesResult.success && messagesResult.messages) {
        setChatMessages(messagesResult.messages);
      }

      // Écouter les nouveaux messages
      const unsub = onChatMessagesChange(result.conversationId, (messages) => {
        setChatMessages(messages);
      });
      setUnsubscribeChat(() => unsub);
    }
  };

  const handleSendMessage = async () => {
    if (!conversationId || !newMessage.trim()) return;

    const result = await sendChatMessage(
      conversationId,
      newMessage.trim(),
      'client',
      'Client' // À adapter avec le vrai nom
    );

    if (result.success) {
      setNewMessage('');
    }
  };

  const handleAddressSubmit = async () => {
    if (!address.street || !address.city || !address.region || !address.phone) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Enregistrer l'adresse
    await saveUserAddress(address);
    
    setStep('payment');
  };

  const handlePaymentSubmit = async () => {
    if (cart.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    setLoading(true);

    try {
      const result = await createOrderWithPayment({
        campaignId: firstItem.campaignId,
        vendorId: firstItem.campaign?.vendorId || '',
        quantity: firstItem.quantity,
        totalPrice: totalAmount,
        paymentMethod,
        deliveryAddress: {
          street: address.street,
          city: address.city,
          region: address.region,
          postalCode: address.postalCode,
          phone: address.phone
        },
        deliveryNotes
      });

      if (result.success && result.orderId) {
        setOrderId(result.orderId);
        if (result.merchantCode) {
          setMerchantCode(result.merchantCode);
        }
        setStep('confirmation');
        clearCart();
      } else {
        alert(`Erreur: ${result.error}`);
      }
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'address') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Adresse de livraison
              </h1>
              
              <Button
                onClick={handleOpenChat}
                variant="secondary"
                className="flex items-center gap-2"
              >
                💬 Chater avec nous
              </Button>
            </div>

            {loadingAddress ? (
              <div className="animate-pulse space-y-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <FormInput
                  label="Rue / Quartier"
                  type="text"
                  value={address.street}
                  onChange={(value) => setAddress({ ...address, street: value })}
                  placeholder="Ex: Quartier Bastos"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <CityInput
                    label="Ville"
                    value={address.city}
                    onChange={(value) => setAddress({ ...address, city: value })}
                    required
                  />

                  <RegionSelect
                    label="Région"
                    value={address.region}
                    onChange={(value) => setAddress({ ...address, region: value })}
                    required
                  />
                </div>

                <FormInput
                  label="Code postal (optionnel)"
                  type="text"
                  value={address.postalCode}
                  onChange={(value) => setAddress({ ...address, postalCode: value })}
                  placeholder="Ex: 1234"
                />

                <FormInput
                  label="Téléphone"
                  type="tel"
                  value={address.phone}
                  onChange={(value) => setAddress({ ...address, phone: value })}
                  placeholder="Ex: +237 6XX XXX XXX"
                  required
                />

                <FormTextarea
                  label="Notes de livraison (optionnel)"
                  value={deliveryNotes}
                  onChange={(value) => setDeliveryNotes(value)}
                  placeholder="Instructions spéciales pour la livraison..."
                  rows={3}
                />

                <div className="flex gap-3 pt-4 mt-6 border-t">
                  <Button
                    onClick={handleAddressSubmit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Continuer vers le paiement
                  </Button>
                  
                  <Button
                    onClick={() => setCurrentPage('cart')}
                    variant="secondary"
                  >
                    Retour au panier
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de chat */}
        {showChat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">Chat avec le support</h2>
                  <p className="text-sm text-gray-600">
                    {firstItem?.campaign?.title || 'Produit'}
                  </p>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderRole === 'client' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.senderRole === 'client'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.senderName}
                      </p>
                    </div>
                  </div>
                ))}

                {chatMessages.length === 0 && (
                  <p className="text-center text-gray-500">
                    Commencez la conversation
                  </p>
                )}
              </div>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Tapez votre message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Envoyer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Méthode de paiement
            </h1>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Choisissez votre moyen de paiement :
              </p>

              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  paymentMethod === 'cash_on_delivery' ? 'border-green-600 bg-green-50' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-5 h-5 text-green-600"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Paiement à la livraison</p>
                    <p className="text-sm text-gray-600">
                      Payez en espèces lors de la réception
                    </p>
                  </div>
                  <div className="text-2xl">💵</div>
                </label>

                <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  paymentMethod === 'orange_money' ? 'border-orange-600 bg-orange-50' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="orange_money"
                    checked={paymentMethod === 'orange_money'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-5 h-5 text-orange-600"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Orange Money</p>
                    <p className="text-sm text-gray-600">
                      Paiement via Orange Money
                    </p>
                  </div>
                  <div className="text-2xl">🟠</div>
                </label>

                <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  paymentMethod === 'mobile_money' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="mobile_money"
                    checked={paymentMethod === 'mobile_money'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Mobile Money</p>
                    <p className="text-sm text-gray-600">
                      Paiement via Mobile Money (MTN, etc.)
                    </p>
                  </div>
                  <div className="text-2xl">📱</div>
                </label>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                Montant à payer
              </h3>
              <p className="text-3xl font-bold text-blue-900">
                {totalAmount.toLocaleString()} FCFA
              </p>
            </div>

            {paymentMethod !== 'cash_on_delivery' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  ℹ️ Après validation, vous recevrez le code marchand pour effectuer votre paiement.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handlePaymentSubmit}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Traitement...' : 'Confirmer la commande'}
              </Button>
              
              <Button
                onClick={() => setStep('address')}
                variant="secondary"
                disabled={loading}
              >
                Retour
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-6xl mb-4">✅</div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Commande créée avec succès !
            </h1>

            <p className="text-gray-600 mb-6">
              Votre commande #{orderId.slice(-8)} a été enregistrée.
            </p>

            {paymentMethod === 'cash_on_delivery' ? (
              <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-green-900 mb-4">
                  💵 Paiement à la livraison
                </h2>
                
                <p className="text-green-800">
                  Votre commande est en attente de livraison. Vous paierez en espèces lors de la réception.
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-yellow-900 mb-4">
                  📱 Effectuez votre paiement
                </h2>
                
                <div className="space-y-3 text-left">
                  <div>
                    <p className="text-sm text-yellow-800 font-medium">Méthode :</p>
                    <p className="text-lg font-bold text-yellow-900">
                      {paymentMethod === 'orange_money' ? 'Orange Money' : 'Mobile Money'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-yellow-800 font-medium">Code marchand :</p>
                    <p className="text-2xl font-bold text-yellow-900 font-mono">
                      {merchantCode}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-yellow-800 font-medium">Montant :</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {totalAmount.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-100 rounded">
                  <p className="text-sm text-yellow-900">
                    ⚠️ Utilisez ce code marchand pour effectuer votre paiement.
                    Votre commande sera validée une fois le paiement reçu.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={() => setCurrentPage('dashboard')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Voir mes commandes
              </Button>
              
              <Button
                onClick={() => setCurrentPage('home')}
                variant="secondary"
                className="w-full"
              >
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
