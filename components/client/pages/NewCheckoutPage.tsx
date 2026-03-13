'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { RegionSelect } from '@/components/ui/RegionSelect';
import { CityInput } from '@/components/ui/CityInput';
import ToastContainer from '@/components/ui/ToastContainer';
import { useToast } from '@/lib/hooks/useToast';
import { 
  createOrderWithPayment,
  getPaymentSettings
} from '@/lib/firebase/firestore-payment';
import { getUserAddress, saveUserAddress } from '@/lib/firebase/firestore-address';
import { clearCart } from '@/lib/firebase/firestore';
import { useClientStore } from '@/lib/stores/clientStore';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

export default function NewCheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { cart: localCart, user, clearCart: clearLocalCart } = useClientStore();
  const { toasts, removeToast, success, error, warning } = useToast();
  
  const [step, setStep] = useState<'recap' | 'address' | 'payment' | 'confirmation'>('recap');
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(true);
  
  // Adresse de livraison
  const [address, setAddress] = useState({
    street: '',
    city: '',
    region: '',
    phone: ''
  });
  
  // Méthode de paiement
  const [paymentMethod, setPaymentMethod] = useState<'orange_money' | 'mobile_money' | 'cash_on_delivery'>('cash_on_delivery');
  const [merchantCode, setMerchantCode] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  
  // Résultat
  const [orderId, setOrderId] = useState('');

  const DELIVERY_FEE = 1500;
  const subtotal = localCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + DELIVERY_FEE;

  useEffect(() => {
    loadUserAddress();
  }, []);

  const loadUserAddress = async () => {
    setLoadingAddress(true);
    const result = await getUserAddress();
    
    if (result.success && result.address) {
      setAddress({
        street: result.address.street,
        city: result.address.city,
        region: result.address.region,
        phone: result.address.phone
      });
    }
    
    setLoadingAddress(false);
  };

  const handleContinueToAddress = () => {
    if (localCart.length === 0) {
      error('Votre panier est vide');
      onNavigate('cart');
      return;
    }
    setStep('address');
  };

  const handleAddressSubmit = async () => {
    if (!address.street || !address.city || !address.region || !address.phone) {
      warning('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Enregistrer l'adresse
    const result = await saveUserAddress(address);
    if (result.success) {
      success('Adresse sauvegardée');
    }
    
    setStep('payment');
  };

  const handlePaymentSubmit = async () => {
    if (localCart.length === 0) {
      error('Votre panier est vide');
      return;
    }

    setLoading(true);

    try {
      // Récupérer le code marchand si nécessaire
      let finalMerchantCode = '';
      if (paymentMethod !== 'cash_on_delivery') {
        const settingsResult = await getPaymentSettings();
        if (settingsResult.success && settingsResult.settings) {
          finalMerchantCode = paymentMethod === 'orange_money' 
            ? settingsResult.settings.orangeMoneyCode
            : settingsResult.settings.mobileMoneyCode;
        }
      }

      // Créer une commande pour chaque article
      const orderPromises = localCart.map((item) => {
        if (!item.campaign) {
          return Promise.resolve({ 
            success: false, 
            error: `Données manquantes pour le produit ${item.campaignId}` 
          });
        }

        return createOrderWithPayment({
          campaignId: item.campaignId,
          vendorId: item.campaign.vendorId,
          quantity: item.quantity,
          totalPrice: item.price * item.quantity + DELIVERY_FEE,
          paymentMethod,
          deliveryAddress: {
            street: address.street,
            city: address.city,
            region: address.region,
            phone: address.phone
          },
          deliveryNotes
        });
      });

      const results = await Promise.all(orderPromises);
      const failed = results.filter((r) => !r.success);

      if (failed.length === 0) {
        // Récupérer le code marchand de la première commande réussie
        const firstSuccess = results.find(r => r.success);
        if (firstSuccess && 'merchantCode' in firstSuccess && firstSuccess.merchantCode) {
          setMerchantCode(firstSuccess.merchantCode);
        }

        // Vider le panier local ET Firebase
        clearLocalCart();
        await clearCart();
        
        setOrderId('CMD-' + Date.now());
        setStep('confirmation');
        success('Commande créée avec succès !');
      } else {
        const errorMessages = failed.map((r) => r.error || 'Erreur inconnue').join(', ');
        error(`Erreur: ${errorMessages}`);
      }
    } catch (err: any) {
      error(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Étape 1 : Récapitulatif
  if (step === 'recap') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        
        <header className="header">
          <button 
            onClick={() => onNavigate('cart')}
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
          <div className="header-logo">📋 Récapitulatif</div>
          <div></div>
        </header>

        <div style={{ padding: 'var(--spacing-lg)', maxWidth: '600px', margin: '0 auto' }}>
          {/* Articles */}
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: '12px',
            padding: 'var(--spacing-lg)',
            border: '1px solid #333',
            marginBottom: 'var(--spacing-md)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: 'var(--spacing-md)' }}>
              📦 Vos articles ({localCart.length})
            </h2>

            {localCart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: 'var(--spacing-md)',
                  padding: 'var(--spacing-md)',
                  backgroundColor: '#222',
                  borderRadius: '8px',
                  marginBottom: 'var(--spacing-sm)'
                }}
              >
                {item.campaign?.images?.[0] && (
                  <img
                    src={item.campaign.images[0]}
                    alt={item.campaign.title}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: '500', marginBottom: '4px' }}>
                    {item.campaign?.title || 'Produit'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    Quantité: {item.quantity}
                  </div>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--color-orange)' }}>
                  {(item.price * item.quantity).toLocaleString()} XAF
                </div>
              </div>
            ))}
          </div>

          {/* Résumé des coûts */}
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: '12px',
            padding: 'var(--spacing-lg)',
            border: '1px solid #333',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: 'var(--spacing-md)' }}>
              💰 Résumé
            </h2>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 'var(--spacing-sm)',
              fontSize: '15px',
              color: '#999'
            }}>
              <span>Sous-total</span>
              <span>{subtotal.toLocaleString()} XAF</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 'var(--spacing-md)',
              fontSize: '15px',
              color: '#999'
            }}>
              <span>Frais de livraison</span>
              <span>{DELIVERY_FEE.toLocaleString()} XAF</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'var(--color-orange)',
              paddingTop: 'var(--spacing-sm)',
              borderTop: '1px solid #333'
            }}>
              <span>Total</span>
              <span>{total.toLocaleString()} XAF</span>
            </div>
          </div>

          <Button
            onClick={handleContinueToAddress}
            variant="primary"
            size="block"
          >
            Continuer vers la livraison →
          </Button>
        </div>
      </div>
    );
  }

  // Étape 2 : Adresse
  if (step === 'address') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        
        <header className="header">
          <button 
            onClick={() => setStep('recap')}
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
          <div className="header-logo">📍 Livraison</div>
          <div></div>
        </header>

        <div style={{ padding: 'var(--spacing-lg)', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: '12px',
            padding: 'var(--spacing-lg)',
            border: '1px solid #333',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: 'var(--spacing-md)' }}>
              Adresse de livraison
            </h2>

            {loadingAddress ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                <p style={{ color: '#666' }}>Chargement...</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--spacing-xs)',
                    fontSize: '14px',
                    fontWeight: 600
                  }}>
                    Rue et numéro *
                  </label>
                  <Input
                    value={address.street}
                    onChange={(e) => setAddress({...address, street: e.target.value})}
                    placeholder="Ex: Rue 1234, Quartier Bonamoussadi"
                  />
                </div>

                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <CityInput
                    label="Ville *"
                    value={address.city}
                    onChange={(value) => setAddress({...address, city: value})}
                  />
                </div>

                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <RegionSelect
                    label="Région *"
                    value={address.region}
                    onChange={(value) => setAddress({...address, region: value})}
                  />
                </div>

                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--spacing-xs)',
                    fontSize: '14px',
                    fontWeight: 600
                  }}>
                    Téléphone *
                  </label>
                  <Input
                    value={address.phone}
                    onChange={(e) => setAddress({...address, phone: e.target.value})}
                    placeholder="Ex: +237 6XX XXX XXX"
                  />
                </div>

                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: 'var(--spacing-xs)',
                    fontSize: '14px',
                    fontWeight: 600
                  }}>
                    Notes de livraison (optionnel)
                  </label>
                  <textarea
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Ex: Sonner 2 fois, laisser chez le voisin..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #333',
                      backgroundColor: '#222',
                      color: 'white',
                      fontSize: '15px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <Button
                  onClick={handleAddressSubmit}
                  variant="primary"
                  size="block"
                >
                  Continuer vers le paiement →
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Étape 3 : Paiement
  if (step === 'payment') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        
        <header className="header">
          <button 
            onClick={() => setStep('address')}
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
          <div className="header-logo">💳 Paiement</div>
          <div></div>
        </header>

        <div style={{ padding: 'var(--spacing-lg)', maxWidth: '600px', margin: '0 auto' }}>
          {/* Résumé */}
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: '12px',
            padding: 'var(--spacing-lg)',
            border: '1px solid #333',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: 'var(--spacing-md)' }}>
              Montant à payer
            </h2>

            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'var(--color-orange)',
              textAlign: 'center',
              padding: 'var(--spacing-md) 0'
            }}>
              {total.toLocaleString()} XAF
            </div>

            <div style={{ fontSize: '13px', color: '#666', textAlign: 'center' }}>
              Sous-total: {subtotal.toLocaleString()} XAF + Livraison: {DELIVERY_FEE.toLocaleString()} XAF
            </div>
          </div>

          {/* Méthodes de paiement */}
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: '12px',
            padding: 'var(--spacing-lg)',
            border: '1px solid #333',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: 'var(--spacing-md)' }}>
              Choisissez votre mode de paiement
            </h2>

            <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
              {[
                { id: 'orange_money', label: 'Orange Money', icon: '🟠', desc: 'Paiement mobile sécurisé' },
                { id: 'mobile_money', label: 'MTN Mobile Money', icon: '📱', desc: 'Paiement mobile sécurisé' },
                { id: 'cash_on_delivery', label: 'Paiement à la livraison', icon: '💰', desc: 'Payez en espèces à la réception' }
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    borderRadius: '8px',
                    border: `2px solid ${paymentMethod === method.id ? 'var(--color-orange)' : '#333'}`,
                    backgroundColor: paymentMethod === method.id ? 'rgba(255, 102, 0, 0.1)' : '#222',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '32px' }}>{method.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                      {method.label}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {method.desc}
                    </div>
                  </div>
                  {paymentMethod === method.id && (
                    <span style={{ fontSize: '20px', color: 'var(--color-orange)' }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handlePaymentSubmit}
            variant="primary"
            size="block"
            disabled={loading}
          >
            {loading ? '⏳ Traitement en cours...' : `Confirmer la commande - ${total.toLocaleString()} XAF`}
          </Button>
        </div>
      </div>
    );
  }

  // Étape 4 : Confirmation
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-lg)'
    }}>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <div style={{
          fontSize: '80px',
          marginBottom: 'var(--spacing-lg)',
          animation: 'bounce 0.6s ease-in-out'
        }}>
          ✅
        </div>

        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: 'var(--spacing-md)'
        }}>
          Commande confirmée !
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#999',
          marginBottom: 'var(--spacing-lg)',
          lineHeight: 1.6
        }}>
          Votre commande <strong style={{ color: 'var(--color-orange)' }}>{orderId}</strong> a été enregistrée avec succès.
        </p>

        {/* Détails */}
        <div style={{
          backgroundColor: '#1a1a1a',
          borderRadius: '12px',
          padding: 'var(--spacing-lg)',
          border: '1px solid #333',
          marginBottom: 'var(--spacing-lg)',
          textAlign: 'left'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: 'var(--spacing-md)' }}>
            📋 Détails de la commande
          </h3>
          
          <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>
            <strong>Livraison:</strong> {address.street}, {address.city}
          </div>
          <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>
            <strong>Téléphone:</strong> {address.phone}
          </div>
          <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>
            <strong>Paiement:</strong> {
              paymentMethod === 'orange_money' ? 'Orange Money' : 
              paymentMethod === 'mobile_money' ? 'MTN Mobile Money' : 
              'Paiement à la livraison'
            }
          </div>
          <div style={{ fontSize: '14px', color: '#999' }}>
            <strong>Montant:</strong> {total.toLocaleString()} XAF
          </div>

          {merchantCode && paymentMethod !== 'cash_on_delivery' && (
            <div style={{
              marginTop: 'var(--spacing-md)',
              padding: 'var(--spacing-md)',
              backgroundColor: '#222',
              borderRadius: '8px',
              border: '1px solid var(--color-orange)'
            }}>
              <div style={{ fontSize: '13px', color: '#999', marginBottom: '4px' }}>
                Code marchand pour le paiement:
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-orange)' }}>
                {merchantCode}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <Button
            onClick={() => onNavigate('dashboard')}
            variant="primary"
            size="block"
          >
            Retour aux deals
          </Button>
        </div>

        <style jsx>{`
          @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        `}</style>
      </div>
    </div>
  );
}
