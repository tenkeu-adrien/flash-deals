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
  saveUserAddress
} from '@/lib/firebase';
import { useClientStore } from '@/lib/stores/clientStore';

export default function SimpleCheckoutPage() {
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
  const [deliveryNotes, setDeliveryNotes] = useState('');
  
  // Résultat
  const [orderId, setOrderId] = useState('');

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 1500;
  const totalWithDelivery = totalAmount + deliveryFee;

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
        postalCode: result.address.postalCode || '',
        phone: result.address.phone
      });
    }
    
    setLoadingAddress(false);
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
      // Créer une commande pour chaque article
      for (const item of cart) {
        const result = await createOrderWithPayment({
          campaignId: item.campaignId,
          vendorId: item.campaign?.vendorId || '',
          quantity: item.quantity,
          totalPrice: item.price * item.quantity,
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

        if (!result.success) {
          throw new Error(result.error || 'Erreur lors de la création de la commande');
        }
      }

      setOrderId('CMD-' + Date.now());
      setStep('confirmation');
      clearCart();
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCart = () => {
    setCurrentPage('cart');
  };

  // Rendu de l'étape adresse
  if (step === 'address') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        padding: 'var(--spacing-lg)'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* En-tête */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white'
            }}>
              Adresse de livraison
            </h1>
            <Button
              onClick={handleBackToCart}
              variant="secondary"
            >
              ← Retour au panier
            </Button>
          </div>

          {/* Formulaire d'adresse */}
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: 'var(--border-radius)',
            padding: 'var(--spacing-lg)',
            border: '1px solid #333'
          }}>
            {loadingAddress ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                <p style={{ color: 'var(--color-gray-medium)' }}>Chargement de votre adresse...</p>
              </div>
            ) : (
              <>
                <FormInput
                  label="Rue et numéro"
                  value={address.street}
                  onChange={(value) => setAddress({...address, street: value})}
                  required
                  placeholder="Ex: Rue 1234, Quartier..."
                />

                <CityInput
                  label="Ville"
                  value={address.city}
                  onChange={(value) => setAddress({...address, city: value})}
                  required
                />

                <RegionSelect
                  label="Région"
                  value={address.region}
                  onChange={(value) => setAddress({...address, region: value})}
                  required
                />

                <FormInput
                  label="Code postal (optionnel)"
                  value={address.postalCode}
                  onChange={(value) => setAddress({...address, postalCode: value})}
                  placeholder="Ex: 12345"
                />

                <FormInput
                  label="Téléphone"
                  value={address.phone}
                  onChange={(value) => setAddress({...address, phone: value})}
                  required
                  placeholder="Ex: 612345678"
                />

                <FormTextarea
                  label="Notes de livraison (optionnel)"
                  value={deliveryNotes}
                  onChange={(value) => setDeliveryNotes(value)}
                  placeholder="Ex: Sonner 2 fois, laisser chez le voisin..."
                  rows={3}
                />

                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                  <Button
                    onClick={handleAddressSubmit}
                    variant="primary"
                    size="block"
                  >
                    Continuer vers le paiement →
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Rendu de l'étape paiement
  if (step === 'payment') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        padding: 'var(--spacing-lg)'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* En-tête */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white'
            }}>
              Méthode de paiement
            </h1>
            <Button
              onClick={() => setStep('address')}
              variant="secondary"
              className="bg-[#333] text-white"
            >
              ← Retour à l'adresse
            </Button>
          </div>

          {/* Résumé de la commande */}
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: 'var(--border-radius)',
            padding: 'var(--spacing-lg)',
            border: '1px solid #333',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 'var(--spacing-md)'
            }}>
              Résumé de la commande
            </h2>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 'var(--spacing-sm)',
              fontSize: '15px',
              color: 'var(--color-gray-medium)'
            }}>
              <span>Sous-total ({cart.length} articles)</span>
              <span>{totalAmount.toLocaleString()} XAF</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 'var(--spacing-sm)',
              fontSize: '15px',
              color: 'var(--color-gray-medium)'
            }}>
              <span>Livraison</span>
              <span>{deliveryFee.toLocaleString()} XAF</span>
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
              <span>{totalWithDelivery.toLocaleString()} XAF</span>
            </div>
          </div>

          {/* Méthodes de paiement */}
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: 'var(--border-radius)',
            padding: 'var(--spacing-lg)',
            border: '1px solid #333',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 'var(--spacing-md)'
            }}>
              Choisissez votre mode de paiement
            </h2>

            <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
              {[
                { id: 'orange_money', label: 'Orange Money', icon: '🟠' },
                { id: 'mobile_money', label: 'Mobile Money', icon: '📱' },
                { id: 'cash_on_delivery', label: 'Paiement à la livraison', icon: '💰' }
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    padding: 'var(--spacing-md)',
                    borderRadius: '8px',
                    border: `2px solid ${paymentMethod === method.id ? 'var(--color-orange)' : '#333'}`,
                    backgroundColor: paymentMethod === method.id ? 'rgba(255, 102, 0, 0.1)' : '#222',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{method.icon}</span>
                  <span style={{ fontSize: '16px', fontWeight: 600 }}>{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bouton de confirmation */}
          <Button
            onClick={handlePaymentSubmit}
            variant="primary"
            size="block"
            disabled={loading}
          >
            {loading ? '⏳ Traitement en cours...' : 'Confirmer et payer'}
          </Button>
        </div>
      </div>
    );
  }

  // Rendu de l'étape confirmation
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      padding: 'var(--spacing-lg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '80px',
          marginBottom: 'var(--spacing-lg)',
          color: 'var(--color-green)'
        }}>
          ✅
        </div>

        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: 'var(--spacing-md)'
        }}>
          Commande confirmée !
        </h1>

        <p style={{
          fontSize: '16px',
          color: 'var(--color-gray-medium)',
          marginBottom: 'var(--spacing-lg)',
          lineHeight: 1.6
        }}>
          Votre commande <strong style={{ color: 'var(--color-orange)' }}>{orderId}</strong> a été enregistrée avec succès.
          <br />
          Vous recevrez un SMS de confirmation sous peu.
        </p>

        <div style={{
          backgroundColor: '#1a1a1a',
          borderRadius: 'var(--border-radius)',
          padding: 'var(--spacing-lg)',
          border: '1px solid #333',
          marginBottom: 'var(--spacing-lg)',
          textAlign: 'left'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 'var(--spacing-sm)'
          }}>
            Détails de livraison
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-medium)', marginBottom: '4px' }}>
            <strong>Adresse:</strong> {address.street}, {address.city}
          </p>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-medium)', marginBottom: '4px' }}>
            <strong>Téléphone:</strong> {address.phone}
          </p>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-medium)' }}>
            <strong>Mode de paiement:</strong> {paymentMethod === 'orange_money' ? 'Orange Money' : 
                                               paymentMethod === 'mobile_money' ? 'Mobile Money' : 
                                               'Paiement à la livraison'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <Button
            onClick={() => setCurrentPage('dashboard')}
            variant="primary"
            size="block"
          >
            Retour aux deals
          </Button>
          <Button
            onClick={() => setCurrentPage('orders')}
            variant="secondary"
            size="block"
            className="bg-gray-800 text-white"
          >
            Voir mes commandes
          </Button>
        </div>
      </div>
    </div>
  );
}