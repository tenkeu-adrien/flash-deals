'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import FormTextarea from '@/components/ui/FormTextarea';
import { RegionSelect } from '@/components/ui/RegionSelect';
import { 
  createOrderWithPayment,
  getUserAddresses,
  saveDeliveryAddress,
  updateDeliveryAddress,
  deleteDeliveryAddress,
  SavedAddress
} from '@/lib/firebase';
import { useClientStore } from '@/lib/stores/clientStore';

export default function CheckoutPage() {
  const { cart, clearCart, setCurrentPage } = useClientStore();
  const [step, setStep] = useState<'address' | 'payment' | 'confirmation'>('address');
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  
  // Adresse de livraison
  const [address, setAddress] = useState({
    label: '',
    street: '',
    city: '',
    region: '',
    postalCode: '',
    phone: ''
  });
  
  // Méthode de paiement
  const [paymentMethod, setPaymentMethod] = useState<'orange_money' | 'mobile_money'>('orange_money');
  const [merchantCode, setMerchantCode] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [saveAddress, setSaveAddress] = useState(false);
  
  // Résultat
  const [orderId, setOrderId] = useState('');

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    const result = await getUserAddresses();
    if (result.success && result.addresses) {
      setSavedAddresses(result.addresses);
      
      // Sélectionner l'adresse par défaut
      const defaultAddress = result.addresses.find(a => a.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id!);
        setAddress({
          label: defaultAddress.label,
          street: defaultAddress.street,
          city: defaultAddress.city,
          region: defaultAddress.region,
          postalCode: defaultAddress.postalCode || '',
          phone: defaultAddress.phone
        });
      }
    }
  };

  const handleSelectAddress = (addressId: string) => {
    const selected = savedAddresses.find(a => a.id === addressId);
    if (selected) {
      setSelectedAddressId(addressId);
      setAddress({
        label: selected.label,
        street: selected.street,
        city: selected.city,
        region: selected.region,
        postalCode: selected.postalCode || '',
        phone: selected.phone
      });
      setShowNewAddressForm(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Supprimer cette adresse ?')) return;
    
    const result = await deleteDeliveryAddress(addressId);
    if (result.success) {
      await loadAddresses();
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null);
        setAddress({
          label: '',
          street: '',
          city: '',
          region: '',
          postalCode: '',
          phone: ''
        });
      }
    }
  };

  const handleAddressSubmit = async () => {
    if (!address.street || !address.city || !address.region || !address.phone) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Enregistrer l'adresse si demandé
    if (saveAddress && showNewAddressForm) {
      await saveDeliveryAddress({
        label: address.label || 'Adresse',
        street: address.street,
        city: address.city,
        region: address.region,
        postalCode: address.postalCode,
        phone: address.phone,
        isDefault: savedAddresses.length === 0
      });
      await loadAddresses();
    }

    setStep('payment');
  };

  const handlePaymentSubmit = async () => {
    if (cart.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    setLoading(true);

    try {
      const firstItem = cart[0];
      
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

      if (result.success && result.orderId && result.merchantCode) {
        setOrderId(result.orderId);
        setMerchantCode(result.merchantCode);
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
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Adresse de livraison
            </h1>

            {/* Adresses enregistrées */}
            {savedAddresses.length > 0 && !showNewAddressForm && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Mes adresses
                </h2>
                <div className="space-y-2">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedAddressId === addr.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleSelectAddress(addr.id!)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900">{addr.label}</p>
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                                Par défaut
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {addr.street}, {addr.city}, {addr.region}
                          </p>
                          <p className="text-sm text-gray-600">{addr.phone}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(addr.id!);
                          }}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => setShowNewAddressForm(true)}
                  variant="secondary"
                  className="w-full mt-3"
                >
                  + Ajouter une nouvelle adresse
                </Button>
              </div>
            )}

            {/* Formulaire nouvelle adresse */}
            {(showNewAddressForm || savedAddresses.length === 0) && (
              <div className="space-y-4">
                <FormInput
                  label="Nom de l'adresse (ex: Maison, Bureau)"
                  type="text"
                  value={address.label}
                  onChange={(value) => setAddress({ ...address, label: value })}
                  placeholder="Maison"
                />

                <FormInput
                  label="Rue / Quartier"
                  type="text"
                  value={address.street}
                  onChange={(value) => setAddress({ ...address, street: value })}
                  placeholder="Ex: Quartier Bastos"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Ville"
                    type="text"
                    value={address.city}
                    onChange={(value) => setAddress({ ...address, city: value })}
                    placeholder="Ex: Yaoundé"
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

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Enregistrer cette adresse pour plus tard
                  </span>
                </label>

                {savedAddresses.length > 0 && (
                  <Button
                    onClick={() => setShowNewAddressForm(false)}
                    variant="secondary"
                    className="w-full"
                  >
                    Utiliser une adresse existante
                  </Button>
                )}
              </div>
            )}

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
        </div>
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
                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
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

                <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
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
