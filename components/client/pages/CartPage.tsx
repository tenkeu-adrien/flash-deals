'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ToastContainer from '@/components/ui/ToastContainer';
import { useToast } from '@/lib/hooks/useToast';
import { createOrderWithItem, clearCart } from '@/lib/firebase/firestore';
import { getUserAddress, saveUserAddress } from '@/lib/firebase/firestore-address';
import { useClientStore } from '@/lib/stores/clientStore';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export default function CartPage({ onNavigate }: CartPageProps) {
  const { cart: localCart, removeFromCart: removeFromLocalCart, updateQuantity, user } = useClientStore();
  const { toasts, removeToast, success, error, warning } = useToast();
  const [loading, setLoading] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    region: '',
    phone: ''
  });
  const [savedAddress, setSavedAddress] = useState<any>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  // Charger l'adresse sauvegardée de l'utilisateur
  useEffect(() => {
    const loadSavedAddress = async () => {
      if (user) {
        setLoading(true);
        const result = await getUserAddress(user.uid);
        if (result.success && result.address) {
          setSavedAddress(result.address);
          setDeliveryAddress({
            street: result.address.street || '',
            city: result.address.city || '',
            region: result.address.region || '',
            phone: result.address.phone || ''
          });
        }
        setLoading(false);
      }
    };

    loadSavedAddress();
  }, [user]);

  const calculateSubtotal = () => {
    return localCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryFee = 1500; // Frais de livraison fixe
    return subtotal + deliveryFee;
  };

  const calculateSavings = () => {
    // Pour l'instant, retourner 0
    // Plus tard, on pourra calculer les économies si on a les prix originaux
    return 0;
  };

  const handleRemove = (itemId: string) => {
    removeFromLocalCart(itemId);
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemove(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleSaveAddress = async () => {
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.region || !deliveryAddress.phone) {
      warning('Veuillez remplir tous les champs de livraison');
      return;
    }

    if (!user) {
      warning('Vous devez être connecté pour sauvegarder une adresse');
      return;
    }

    setSavingAddress(true);
    try {
      const result = await saveUserAddress(deliveryAddress);
      if (result.success) {
        setSavedAddress({ ...deliveryAddress, userId: user.uid });
        setShowAddressForm(false);
        success('Adresse sauvegardée pour vos prochaines commandes!');
      } else {
        error('Erreur lors de la sauvegarde: ' + result.error);
      }
    } finally {
      setSavingAddress(false);
    }
  };

  const handleCheckout = () => {
    if (localCart.length === 0) {
      warning('Votre panier est vide');
      return;
    }

    if (!user) {
      warning('Vous devez être connecté pour passer une commande');
      onNavigate('login');
      return;
    }

    // Rediriger vers la nouvelle page de checkout
    onNavigate('new-checkout');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <p>Chargement du panier...</p>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <header className="header">
        <button 
          onClick={() => onNavigate('dashboard')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          ← Retour
        </button>
        <div className="header-logo">🛒 Mon Panier</div>
        <div></div>
      </header>

      <div style={{ padding: 'var(--spacing-lg)' }}>
        {localCart.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#1a1a1a',
            borderRadius: '12px',
            border: '1px solid #333'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
            <h3 style={{ marginBottom: '12px' }}>Votre panier est vide</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Découvrez nos deals flash et ajoutez des produits!
            </p>
            <Button onClick={() => onNavigate('dashboard')} variant="primary">
              Voir les deals
            </Button>
          </div>
        ) : (
          <>
            {/* Articles */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h2 style={{ fontSize: '18px', marginBottom: 'var(--spacing-md)' }}>
                Articles ({localCart.length})
              </h2>

              {localCart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#1a1a1a',
                    borderRadius: 'var(--border-radius)',
                    padding: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-md)',
                    display: 'flex',
                    gap: 'var(--spacing-md)',
                    border: '1px solid #333'
                  }}
                >
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '8px',
                    background: '#2a2a2a',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px'
                  }}>
                    📦
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>
                      Produit #{item.campaignId}
                    </h3>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: 'var(--color-orange)',
                      margin: 'var(--spacing-xs) 0'
                    }}>
                      {(item.price * item.quantity).toLocaleString()} XAF
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'var(--spacing-xs)'
                    }}>
                      <span style={{ fontSize: '14px', color: 'var(--color-gray-medium)' }}>
                        Quantité: 
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          style={{
                            margin: '0 8px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            border: '1px solid #333',
                            backgroundColor: '#222',
                            color: 'var(--color-white)',
                            cursor: 'pointer'
                          }}
                        >
                          -
                        </button>
                        {item.quantity}
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          style={{
                            margin: '0 8px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            border: '1px solid #333',
                            backgroundColor: '#222',
                            color: 'var(--color-white)',
                            cursor: 'pointer'
                          }}
                        >
                          +
                        </button>
                      </span>
                      <button
                        onClick={() => handleRemove(item.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--color-red)',
                          fontSize: '14px',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        🗑️ Retirer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Adresse de livraison */}
            <div style={{
              backgroundColor: '#1a1a1a',
              borderRadius: 'var(--border-radius)',
              padding: 'var(--spacing-md)',
              border: '1px solid #333',
              marginBottom: 'var(--spacing-lg)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                <h3 style={{ fontSize: '16px' }}>
                  📦 Adresse de livraison
                </h3>
                {savedAddress && !showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--color-orange)',
                      color: 'var(--color-orange)',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    ✏️ Modifier
                  </button>
                )}
              </div>
              
              {savedAddress && !showAddressForm ? (
                <div style={{ padding: 'var(--spacing-sm)', backgroundColor: '#222', borderRadius: '6px' }}>
                  <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                    <strong>Adresse:</strong> {savedAddress.street}
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                    <strong>Ville:</strong> {savedAddress.city}
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                    <strong>Région:</strong> {savedAddress.region}
                  </div>
                  <div style={{ fontSize: '14px' }}>
                    <strong>Téléphone:</strong> {savedAddress.phone}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-gray-medium)', marginTop: 'var(--spacing-sm)' }}>
                    💡 Cette adresse est sauvegardée pour vos prochaines commandes
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                    <Input
                      label="Rue et numéro"
                      value={deliveryAddress.street}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, street: e.target.value})}
                      placeholder="Ex: Rue 1234, Quartier..."
                    />
                    <Input
                      label="Ville"
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                      placeholder="Ex: Douala"
                    />
                    <Input
                      label="Région"
                      value={deliveryAddress.region}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, region: e.target.value})}
                      placeholder="Ex: Littoral"
                    />
                    <Input
                      label="Téléphone"
                      value={deliveryAddress.phone}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, phone: e.target.value})}
                      placeholder="Ex: 6XXXXXXXX"
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
                    <Button
                      onClick={handleSaveAddress}
                      variant="secondary"
                      disabled={savingAddress}
                    >
                      {savingAddress ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
                    </Button>
                    {savedAddress && (
                      <Button
                        onClick={() => {
                          setShowAddressForm(false);
                          setDeliveryAddress({
                            street: savedAddress.street || '',
                            city: savedAddress.city || '',
                            region: savedAddress.region || '',
                            phone: savedAddress.phone || ''
                          });
                        }}
                        variant="outline"
                      >
                        Annuler
                      </Button>
                    )}
                  </div>
                  
                  <p style={{ fontSize: '12px', color: 'var(--color-gray-medium)', marginTop: 'var(--spacing-sm)' }}>
                    💡 Cette adresse sera sauvegardée pour vos prochaines commandes
                  </p>
                </>
              )}
            </div>

            {/* Résumé */}
            <div style={{
              backgroundColor: '#1a1a1a',
              borderRadius: 'var(--border-radius)',
              padding: 'var(--spacing-md)',
              border: '1px solid #333',
              marginBottom: 'var(--spacing-lg)'
            }}>
              <h3 style={{ fontSize: '16px', marginBottom: 'var(--spacing-md)' }}>
                Résumé de la commande
              </h3>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-sm)',
                fontSize: '15px'
              }}>
                <span>Sous-total</span>
                <span>{calculateSubtotal().toLocaleString()} XAF</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-sm)',
                fontSize: '15px'
              }}>
                <span>Livraison</span>
                <span>1 500 XAF</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'var(--color-orange)',
                paddingTop: 'var(--spacing-sm)',
                borderTop: '1px solid #333',
                marginTop: 'var(--spacing-sm)'
              }}>
                <span>Total</span>
                <span>{calculateTotal().toLocaleString()} XAF</span>
              </div>

              {calculateSavings() > 0 && (
                <div style={{
                  backgroundColor: 'var(--color-green)',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  textAlign: 'center',
                  marginTop: 'var(--spacing-sm)',
                  fontWeight: 600
                }}>
                  💰 Vous économisez {calculateSavings().toLocaleString()} XAF!
                </div>
              )}
            </div>

            {/* Bouton Commander */}
            <Button
              onClick={handleCheckout}
              variant="primary"
              size="block"
              disabled={checkingOut || localCart.length === 0}
            >
              {checkingOut ? '⏳ Traitement...' : 'Passer la commande →'}
            </Button>
          </>
        )}
      </div>

      <div style={{ height: '80px' }}></div>
    </div>
  );
}