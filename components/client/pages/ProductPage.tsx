'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import {
  getCampaign,
  Campaign,
  addToCart,
  markAsInterested,
  addReview,
  getCampaignReviews,
  Review
} from '@/lib/firebase/firestore';
import { useClientStore } from '@/lib/stores/clientStore';

interface ProductPageProps {
  onNavigate: (page: string) => void;
}

export default function ProductPage({ onNavigate }: ProductPageProps) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const { user, selectedCampaignId } = useClientStore();

  useEffect(() => {
    if (selectedCampaignId) {
      loadCampaign();
    }
  }, [selectedCampaignId]);

  const loadCampaign = async () => {
    if (!selectedCampaignId) return;

    const result = await getCampaign(selectedCampaignId);
    if (result.success && result.campaign) {
      setCampaign(result.campaign);
      // Charger les avis pour cette campagne
      loadReviews(result.campaign.id!);
    }
    setLoading(false);
  };

  const loadReviews = async (campaignId: string) => {
    setLoadingReviews(true);
    const res = await getCampaignReviews(campaignId, 20);
    if (res.success && res.reviews) {
      setReviews(res.reviews);
    }
    setLoadingReviews(false);
  };

  const handleAddToCart = async () => {
    if (!campaign?.id) return;

    setAddingToCart(true);
    const result = await addToCart(campaign.id, quantity);

    if (result.success) {
      alert('✅ Produit ajouté au panier!');
      onNavigate('cart');
    } else {
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

  const getTimeRemaining = (endDate: any) => {
    if (!endDate) return '0h 0min';
    
    const end = endDate.toDate ? endDate.toDate() : new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expiré';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}min`;
  };

  const handleSubmitReview = async () => {
    if (!campaign?.id) return;

    if (!user) {
      alert('Vous devez être connecté pour laisser un avis.');
      onNavigate('login');
      return;
    }

    if (!newComment.trim()) {
      alert('Veuillez écrire un avis.');
      return;
    }

    setSubmittingReview(true);
    const res = await addReview(campaign.id, newRating, newComment.trim());

    if (res.success) {
      setNewComment('');
      // Recharger les avis et la campagne (pour mettre à jour la moyenne)
      await loadReviews(campaign.id);
      await loadCampaign();
      alert('✅ Merci pour votre avis !');
    } else {
      alert('❌ ' + (res.error || 'Erreur lors de l\'envoi de votre avis'));
    }

    setSubmittingReview(false);
  };

  const computedAverage =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : campaign?.averageRating || 0;

  const totalReviews = reviews.length || campaign?.reviewCount || 0;

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
          ⏰ {getTimeRemaining(campaign.endDate)}
        </div>
        <div style={{
          width: '100%',
          height: '320px',
          background: campaign.images?.[0] 
            ? `url(${campaign.images[0]}) center/cover` 
            : 'linear-gradient(to bottom, #FF6600, #000)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '80px'
        }}>
          {!campaign.images?.[0] && '📦'}
        </div>
      </div>

      {/* Contenu */}
      <div style={{ padding: 'var(--spacing-lg)' }}>
        <h1 style={{ fontSize: '24px', marginBottom: 'var(--spacing-sm)' }}>
          {campaign.title}
        </h1>

        <div style={{ color: '#FFD700', fontSize: '14px', marginBottom: 'var(--spacing-md)' }}>
          ⭐⭐⭐⭐⭐ {computedAverage ? computedAverage.toFixed(1) : '4.8'}/5 ({totalReviews} avis)
        </div>

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
            📦 Plus que {campaign.stock}/{campaign.stock + campaign.sold} unités disponibles
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

        {/* Avis clients */}
        <div
          style={{
            marginTop: 'var(--spacing-lg)',
            paddingTop: 'var(--spacing-lg)',
            borderTop: '1px solid #333'
          }}
        >
          <h3 style={{ fontSize: '18px', marginBottom: 'var(--spacing-md)' }}>💬 Avis des clients</h3>

          {/* Formulaire d'avis */}
          <div
            style={{
              backgroundColor: '#1a1a1a',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--border-radius)',
              border: '1px solid #333',
              marginBottom: 'var(--spacing-md)'
            }}
          >
            <p style={{ fontSize: '14px', marginBottom: 'var(--spacing-sm)' }}>
              Notez ce produit et laissez un avis.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-sm)' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '22px',
                    color: newRating >= star ? '#FFD700' : '#555'
                  }}
                >
                  ★
                </button>
              ))}
              <span style={{ fontSize: '14px', color: 'var(--color-gray-medium)' }}>
                {newRating}/5
              </span>
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Partagez votre expérience avec ce produit..."
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #333',
                backgroundColor: '#0a0a0a',
                color: 'white',
                fontSize: '14px',
                marginBottom: 'var(--spacing-sm)',
                resize: 'vertical'
              }}
            />

            <Button
              onClick={handleSubmitReview}
              variant="primary"
              size="block"
              disabled={submittingReview}
            >
              {submittingReview ? '⏳ Envoi de votre avis...' : 'Envoyer mon avis'}
            </Button>
          </div>

          {/* Liste des avis */}
          {loadingReviews ? (
            <p style={{ fontSize: '14px', color: 'var(--color-gray-medium)' }}>Chargement des avis...</p>
          ) : reviews.length === 0 ? (
            <p style={{ fontSize: '14px', color: 'var(--color-gray-medium)' }}>
              Aucun avis pour le moment. Soyez le premier à donner votre avis !
            </p>
          ) : (
            <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
              {reviews.map((review) => {
                const date =
                  (review.createdAt as any)?.toDate
                    ? (review.createdAt as any).toDate()
                    : new Date(review.createdAt);

                return (
                  <div
                    key={review.id}
                    style={{
                      backgroundColor: '#1a1a1a',
                      padding: 'var(--spacing-sm)',
                      borderRadius: '8px',
                      border: '1px solid #333'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px'
                      }}
                    >
                      <div style={{ color: '#FFD700', fontSize: '14px' }}>
                        {'★'.repeat(review.rating)}{' '}
                        <span style={{ color: 'var(--color-gray-medium)' }}>
                          {'☆'.repeat(5 - review.rating)}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'var(--color-gray-medium)'
                        }}
                      >
                        {date.toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'var(--color-gray-light)',
                        lineHeight: 1.5
                      }}
                    >
                      {review.comment}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div style={{ height: '80px' }}></div>
    </div>
  );
}
