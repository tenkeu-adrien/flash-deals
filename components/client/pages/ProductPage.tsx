'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import {
  getCampaign,
  Campaign,
  addToCart,
  markAsInterested,
  getVendorProfile
} from '@/lib/firebase/firestore';
import { getOrCreateConversation } from '@/lib/firebase/firestore-chat';
import { useClientStore } from '@/lib/stores/clientStore';

interface ProductPageProps {
  onNavigate: (page: string) => void;
}

export default function ProductPage({ onNavigate }: ProductPageProps) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [vendorInfo, setVendorInfo] = useState<any>(null);
  const [loadingVendor, setLoadingVendor] = useState(false);
  const { user, selectedCampaignId } = useClientStore();

  useEffect(() => {
    if (selectedCampaignId) {
      loadCampaign();
    }
  }, [selectedCampaignId]);

  // Effet pour mettre à jour le chronomètre en temps réel
  useEffect(() => {
    if (!campaign?.endDate) return;

    const updateTimer = () => {
      let end: Date;
      if (campaign.endDate && typeof campaign.endDate === 'object' && 'toDate' in campaign.endDate) {
        // C'est un Timestamp Firebase
        end = (campaign.endDate as any).toDate();
      } else {
        // C'est déjà un Date ou une string
        end = new Date(campaign.endDate);
      }
      
      const now = new Date();
      const diff = end.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining('Expiré');
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      // Format: 01h 05m 30s (avec zéros devant si nécessaire)
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');
      
      setTimeRemaining(`${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`);
    };

    // Mettre à jour immédiatement
    updateTimer();

    // Mettre à jour toutes les secondes
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [campaign]);

  const loadCampaign = async () => {
    if (!selectedCampaignId) return;

    const result = await getCampaign(selectedCampaignId);
    if (result.success && result.campaign) {
      setCampaign(result.campaign);
      // Initialiser le temps restant
      let end: Date;
      if (result.campaign.endDate && typeof result.campaign.endDate === 'object' && 'toDate' in result.campaign.endDate) {
        // C'est un Timestamp Firebase
        end = (result.campaign.endDate as any).toDate();
      } else {
        // C'est déjà un Date ou une string
        end = new Date(result.campaign.endDate);
      }
      
      const now = new Date();
      const diff = end.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining('Expiré');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      }
      
      // Charger les infos du vendeur
      loadVendorInfo(result.campaign.vendorId);
    }
    setLoading(false);
  };

  const loadVendorInfo = async (vendorId: string) => {
    setLoadingVendor(true);
    const result = await getVendorProfile(vendorId);
    if (result.success && result.vendor) {
      setVendorInfo(result.vendor);
    }
    setLoadingVendor(false);
  };



  const handleAddToCart = async () => {
    if (!campaign?.id) return;

    setAddingToCart(true);

    // 1. Ajouter au panier local (Zustand) immédiatement pour une UX rapide
    const { addToCart: addToLocalCart } = useClientStore.getState();
    addToLocalCart({
      id: `${user?.uid}_${campaign.id}`,
      campaignId: campaign.id,
      quantity: quantity,
      price: campaign.currentPrice,
      campaign: campaign
    });

    // 2. Synchroniser avec Firebase en arrière-plan
    const result = await addToCart(campaign.id, quantity);

    if (result.success) {
      // Redirection silencieuse vers le panier
      onNavigate('cart');
    } else {
      // En cas d'erreur, retirer du panier local
      const { removeFromCart } = useClientStore.getState();
      removeFromCart(`${user?.uid}_${campaign.id}`);
      alert('❌ ' + (result.error || 'Erreur lors de l\'ajout au panier'));
    }

    setAddingToCart(false);
  };

  const handleInterested = async () => {
    if (!campaign?.id) return;

    const result = await markAsInterested(campaign.id);
    if (result.success) {
      alert('✅ Vous serez notifié des prochains deals similaires!');
    }
  };

  const handleOpenChat = async () => {
    if (!campaign?.id) return;

    // Créer ou récupérer la conversation
    const result = await getOrCreateConversation(
      campaign.id,
      campaign.title,
      campaign.images?.[0]
    );

    if (result.success) {
      onNavigate('chat');
    } else {
      alert('❌ Erreur lors de l\'ouverture du chat');
    }
  };

  const getTimeRemaining = (endDate: any) => {
    if (!endDate) return '0h 0min';
    
    let end: Date;
    if (endDate && typeof endDate === 'object' && 'toDate' in endDate) {
      // C'est un Timestamp Firebase
      end = (endDate as any).toDate();
    } else {
      // C'est déjà un Date ou une string
      end = new Date(endDate);
    }
    
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expiré';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}min`;
  };



  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
        <p>Produit non trouvé</p>
        <Button onClick={() => onNavigate('dashboard')} variant="primary">
          Retour aux deals
        </Button>
      </div>
    );
  }

  const stockPercentage = (campaign.stock / (campaign.stock + campaign.sold)) * 100;

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
        <div className="header-logo">🔥 Flash Deals</div>
        <button 
          onClick={() => onNavigate('cart')}
          className="icon-btn"
        >
          🛒
        </button>
      </header>

      {/* Image principale */}
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: 'var(--spacing-sm)',
          left: 'var(--spacing-sm)',
          backgroundColor: 'var(--color-orange)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 'bold',
          zIndex: 10
        }}>
          NOUVEAU
        </div>
        <div style={{
          position: 'absolute',
          top: 'var(--spacing-sm)',
          right: 'var(--spacing-sm)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'var(--color-orange)',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 'bold',
          backdropFilter: 'blur(10px)'
        }}>
          ⏰ {timeRemaining || getTimeRemaining(campaign.endDate)}
        </div>
        
        {/* Slider d'images */}
        <div style={{
          width: '100%',
          height: '320px',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#1a1a1a'
        }}>
          {campaign.images && campaign.images.length > 0 ? (
            <>
              {/* Images */}
              <div style={{
                display: 'flex',
                width: `${campaign.images.length * 100}%`,
                height: '100%',
                transform: `translateX(-${currentImageIndex * (100 / campaign.images.length)}%)`,
                transition: 'transform 0.35s ease'
              }}>
                {campaign.images.map((img, i) => (
                  <div key={i} style={{ width: `${100 / campaign.images!.length}%`, height: '100%', flexShrink: 0 }}>
                    <img
                      src={img}
                      alt={`${campaign.title} ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                ))}
              </div>

              {/* Flèches */}
              {campaign.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => prev === 0 ? campaign.images!.length - 1 : prev - 1)}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      border: 'none',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 5
                    }}
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => prev === campaign.images!.length - 1 ? 0 : prev + 1)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      border: 'none',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 5
                    }}
                  >
                    ›
                  </button>

                  {/* Dots */}
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '6px',
                    zIndex: 5
                  }}>
                    {campaign.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        style={{
                          width: index === currentImageIndex ? '20px' : '8px',
                          height: '8px',
                          borderRadius: '4px',
                          backgroundColor: index === currentImageIndex ? 'var(--color-orange)' : 'rgba(255,255,255,0.5)',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          transition: 'all 0.2s ease'
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(to bottom, #FF6600, #000)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '80px'
            }}>
              📦
            </div>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div style={{ padding: 'var(--spacing-lg)' }}>
        <h1 style={{ fontSize: '24px', marginBottom: 'var(--spacing-md)' }}>
          {campaign.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
          <span style={{
            textDecoration: 'line-through',
            color: 'var(--color-gray-medium)',
            fontSize: '18px'
          }}>
            {campaign.originalPrice.toLocaleString()} XAF
          </span>
          <span style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: 'var(--color-orange)'
          }}>
            {campaign.currentPrice.toLocaleString()} XAF
          </span>
          <span style={{
            backgroundColor: 'var(--color-red)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            -{campaign.discount}%
          </span>
        </div>

        {/* Stock */}
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-medium)', marginBottom: '4px' }}>
            📦 Reste {campaign.stock} produits en stock
          </p>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#333',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--color-orange) 0%, var(--color-red) 100%)',
              width: `${stockPercentage}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Description */}
        <div style={{
          backgroundColor: '#1a1a1a',
          padding: 'var(--spacing-md)',
          borderRadius: 'var(--border-radius)',
          marginBottom: 'var(--spacing-md)',
          border: '1px solid #333'
        }}>
          <h3 style={{ fontSize: '16px', marginBottom: 'var(--spacing-sm)' }}>📝 Description</h3>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-medium)', lineHeight: '1.6' }}>
            {campaign.description}
          </p>
        </div>

        {/* Infos livraison */}
        <div style={{
          backgroundColor: '#1a1a1a',
          padding: 'var(--spacing-md)',
          borderRadius: 'var(--border-radius)',
          marginBottom: 'var(--spacing-md)',
          border: '1px solid #333'
        }}>
          <div style={{ fontSize: '14px', marginBottom: 'var(--spacing-xs)' }}>
            🚚 {campaign.delivery}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--color-gray-medium)' }}>
            📍 {campaign.location}
          </div>
        </div>

        {/* Infos de la boutique */}
        <div style={{
          backgroundColor: '#1a1a1a',
          padding: 'var(--spacing-md)',
          borderRadius: 'var(--border-radius)',
          marginBottom: 'var(--spacing-md)',
          border: '1px solid #333'
        }}>
          <h3 style={{ fontSize: '16px', marginBottom: 'var(--spacing-sm)' }}>🏪 Informations de la boutique</h3>
          
          {loadingVendor ? (
            <div style={{ fontSize: '14px', color: 'var(--color-gray-medium)' }}>
              Chargement des informations du vendeur...
            </div>
          ) : vendorInfo ? (
            <>
              <div style={{ fontSize: '14px', marginBottom: 'var(--spacing-xs)' }}>
                <strong>Nom de la boutique :</strong> {vendorInfo.businessName || 'Non spécifié'}
              </div>
              <div style={{ fontSize: '14px', marginBottom: 'var(--spacing-xs)' }}>
                <strong>Type d'activité :</strong> {vendorInfo.businessType || 'Non spécifié'}
              </div>
              <div style={{ fontSize: '14px', marginBottom: 'var(--spacing-xs)' }}>
                <strong>Ville :</strong> {vendorInfo.city || 'Non spécifié'}
              </div>
              <div style={{ fontSize: '14px', marginBottom: 'var(--spacing-xs)' }}>
                <strong>Adresse :</strong> {vendorInfo.address || 'Non spécifié'}
              </div>
              <div style={{ fontSize: '14px', marginBottom: 'var(--spacing-xs)' }}>
                <strong>Téléphone :</strong> {vendorInfo.phone || 'Non spécifié'}
              </div>
              <div style={{ fontSize: '14px', marginBottom: 'var(--spacing-xs)' }}>
                <strong>Email :</strong> {vendorInfo.email || 'Non spécifié'}
              </div>
              {vendorInfo.description && (
                <div style={{ fontSize: '14px', color: 'var(--color-gray-medium)', marginTop: 'var(--spacing-xs)' }}>
                  <strong>Description :</strong> {vendorInfo.description}
                </div>
              )}
              <div style={{ fontSize: '14px', color: 'var(--color-orange)', marginTop: 'var(--spacing-xs)' }}>
                <strong>Note de la boutique :</strong> ⭐ {vendorInfo.rating?.toFixed(1) || '0.0'}/5 ({vendorInfo.reviewCount || 0} avis)
              </div>
            </>
          ) : (
            <div style={{ fontSize: '14px', color: 'var(--color-gray-medium)' }}>
              Informations du vendeur non disponibles
            </div>
          )}
        </div>

        {/* Quantité */}
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <label style={{
            display: 'block',
            marginBottom: 'var(--spacing-xs)',
            fontSize: '14px',
            fontWeight: 600
          }}>
            Quantité
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '6px',
                border: '1px solid #333',
                backgroundColor: '#222',
                color: 'var(--color-white)',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              -
            </button>
            <span style={{
              fontSize: '18px',
              fontWeight: 600,
              minWidth: '40px',
              textAlign: 'center'
            }}>
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(campaign.stock, quantity + 1))}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '6px',
                border: '1px solid #333',
                backgroundColor: '#222',
                color: 'var(--color-white)',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Actions */}
        <Button
          onClick={handleAddToCart}
          variant="primary"
          size="block"
          disabled={addingToCart || campaign.stock === 0}
        >
          {addingToCart ? '⏳ Ajout...' : campaign.stock === 0 ? 'Rupture de stock' : `🛒 Ajouter au panier - ${(campaign.currentPrice * quantity).toLocaleString()} XAF`}
        </Button>

        <button
          onClick={handleInterested}
          style={{
            width: '100%',
            padding: '14px',
            marginTop: 'var(--spacing-sm)',
            borderRadius: 'var(--border-radius)',
            border: '2px solid #333',
            backgroundColor: '#1a1a1a',
            color: 'var(--color-white)',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
        >
          ⭐ Je suis intéressé ({campaign.interested} personnes)
        </button>

        <button
          onClick={handleOpenChat}
          style={{
            width: '100%',
            padding: '14px',
            marginTop: 'var(--spacing-sm)',
            borderRadius: 'var(--border-radius)',
            border: '2px solid var(--color-orange)',
            backgroundColor: 'transparent',
            color: 'var(--color-orange)',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
        >
          💬 Poser une question
        </button>


      </div>

      <div style={{ height: '80px' }}></div>
    </div>
  );
}
