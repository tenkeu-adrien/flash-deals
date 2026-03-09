'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getCart, removeFromCart, createOrderWithItem, clearCart } from '@/lib/firebase/firestore';
import { useClientStore } from '@/lib/stores/clientStore';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export default function CartPage({ onNavigate }: CartPageProps) {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    region: '',
    phone: ''
  });
  const { user } = useClientStore();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const result = await getCart();
    if (result.success && result.cart) {
      setCart(result.cart);
    }
    setLoading(false);
  };

  const handleRemove = async (itemId: string) => {
    const result = await removeFromCart(itemId);
    if (result.success) {
      setCart(cart.filter(item => item.id !== itemId));
    }
  };

  const handleCheckout = async () => {
    if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.region || !deliveryAddress.phone) {
      alert('Veuillez remplir tous les champs de livraison');
      return;
    }

    setCheckingOut(true);

    try {
      // Créer une commande pour chaque article (1 article = 1 commande dans ce design)
      const orderPromises = cart.map((item) =>
        createOrderWithItem({
          campaign: {
            id: item.campaignId,
            vendorId: item.campaign?.vendorId,
            title: item.campaign?.title,
            images: item.campaign?.images || [],
            currentPrice: item.campaign?.currentPrice || 0
          },
          quantity: item.quantity,
          deliveryAddress
        })
      );

      const results = await Promise.all(orderPromises);
      const failed = results.filter((r) => !r.success);

      if (failed.length === 0) {
        await clearCart();
        alert('✅ Commande passée avec succès! Vous recevrez une confirmation par SMS.');
        onNavigate('dashboard');
      } else {
        const errors = failed.map((r) => r.error || 'Erreur inconnue').join('\n');
        alert(`❌ Certaines commandes ont échoué:\n\n${errors}`);
      }
    } finally {
      setCheckingOut(false);
    }

  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.campaign.currentPrice * item.quantity), 0);
  };

  const calculateSavings = () => {
    return cart.reduce((sum, item) => 
      sum + ((item.campaign.originalPrice - item.campaign.currentPrice) * item.quantity), 0
    );
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
        {cart.length === 0 ? (
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
                Articles ({cart.length})
              </h2>

              {cart.map((item) => (
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
                    background: item.campaign.images?.[0]
                      ? `url(${item.campaign.images[0]}) center/cover`
                      : '#2a2a2a',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px'
                  }}>
                    {!item.campaign.images?.[0] && '📦'}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>
                      {item.campaign.title}
                    </h3>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: 'var(--color-orange)',
                      margin: 'var(--spacing-xs) 0'
                    }}>
                      {(item.campaign.currentPrice * item.quantity).toLocaleString()} XAF
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'var(--spacing-xs)'
                    }}>
                      <span style={{ fontSize: '14px', color: 'var(--color-gray-medium)' }}>
                        Quantité: {item.quantity}
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
                <span>{calculateTotal().toLocaleString()} XAF</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-sm)',
                fontSize: '15px'
              }}>
                <span>Livraison</span>
                <span style={{ color: 'var(--color-green)' }}>Gratuite</span>
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
              onClick={() => onNavigate('checkout')}
              variant="primary"
              size="block"
              disabled={cart.length === 0}
            >
              Passer la commande →
            </Button>
          </>
        )}
      </div>

      <div style={{ height: '80px' }}></div>
    </div>
  );
}
