'use client';

import { useEffect, useState } from 'react';
import DealCard from '@/components/client/DealCard';
import { getActiveCampaigns, Campaign } from '@/lib/firebase/firestore';
import { useClientStore } from '@/lib/stores/clientStore';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedCampaignId, isAuthenticated } = useClientStore();

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    const result = await getActiveCampaigns(6);
    if (result.success && result.campaigns) {
      setCampaigns(result.campaigns);
    }
    setLoading(false);
  };

  const handleDealClick = (campaignId: string) => {
    if (!isAuthenticated) {
      onNavigate('signup');
    } else {
      setSelectedCampaignId(campaignId);
      onNavigate('product');
    }
  };

  const steps = [
    { icon: '1️⃣', title: 'Inscrivez-vous gratuitement', description: 'Créez votre compte en 2 minutes avec votre numéro de téléphone' },
    { icon: '2️⃣', title: 'Découvrez les deals', description: 'Parcourez les offres flash disponibles pendant 24-48h seulement' },
    { icon: '3️⃣', title: 'Commandez rapidement', description: 'Ajoutez au panier et payez en toute sécurité' },
    { icon: '4️⃣', title: 'Recevez chez vous', description: 'Livraison rapide à Douala et Yaoundé sous 24-48h' },
  ];

  const testimonials = [
    { name: 'Marie Ngo', role: 'Cliente à Douala', text: 'J\'ai économisé 120 000 XAF sur mon smartphone ! Service rapide et fiable.' },
    { name: 'Jean Kamga', role: 'Client à Yaoundé', text: 'Les deals sont vraiment incroyables. J\'ai acheté 3 produits la semaine dernière.' },
    { name: 'Fatima B.', role: 'Cliente à Douala', text: 'Livraison ultra rapide et produits authentiques. Je recommande à 100%!' },
  ];

  // Calculer le temps restant pour une campagne
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

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Deals à Prix Cassés 🔥</h1>
        <p className="hero-subtitle">Économisez jusqu'à 70% sur vos produits préférés</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <p>Chargement des deals...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            backgroundColor: '#1a1a1a',
            borderRadius: '12px',
            border: '1px solid #333'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <h3 style={{ marginBottom: '12px' }}>Aucune campagne active</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Les deals flash arrivent bientôt!
            </p>
          </div>
        ) : (
          <>
            {/* Premier deal en vedette */}
            {campaigns[0] && (
              <DealCard
                id={campaigns[0].id!}
                badge="NOUVEAU"
                endDate={campaigns[0].endDate}
                icon="📱"
                image={campaigns[0].images?.[0]}
                title={campaigns[0].title}
                rating={`⭐⭐⭐⭐⭐ ${campaigns[0].averageRating || 4.8}/5 (${campaigns[0].reviewCount || 0} avis)`}
                originalPrice={campaigns[0].originalPrice}
                currentPrice={campaigns[0].currentPrice}
                discount={`-${campaigns[0].discount}%`}
                stock={{ current: campaigns[0].stock, total: campaigns[0].stock + campaigns[0].sold }}
                delivery={campaigns[0].delivery}
                location={campaigns[0].location}
                interested={campaigns[0].interested}
                onAction={handleDealClick}
              />
            )}
          </>
        )}
      </section>

      {/* Autres deals */}
      {campaigns.length > 1 && (
        <section className="section" style={{ backgroundColor: 'var(--bg-dark)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
            <h2 className="section-title">🔥 Autres Deals Actifs</h2>
          </div>
          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            {campaigns.slice(1).map((campaign) => (
              <DealCard
                key={campaign.id}
                id={campaign.id!}
                badge={campaign.sold > campaign.stock * 0.5 ? 'POPULAIRE' : 'NOUVEAU'}
                endDate={campaign.endDate}
                icon="📦"
                image={campaign.images?.[0]}
                title={campaign.title}
                rating={`⭐⭐⭐⭐⭐ ${campaign.averageRating || 4.8}/5 (${campaign.reviewCount || 0} avis)`}
                originalPrice={campaign.originalPrice}
                currentPrice={campaign.currentPrice}
                discount={`-${campaign.discount}%`}
                stock={{ current: campaign.stock, total: campaign.stock + campaign.sold }}
                delivery={campaign.delivery}
                location={campaign.location}
                interested={campaign.interested}
                onAction={handleDealClick}
                actionLabel="Voir le deal →"
              />
            ))}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="section" style={{ backgroundColor: 'var(--bg-dark)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
          <h2 className="section-title">✅ Comment ça marche</h2>
        </div>
        <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div style={{ fontSize: '24px', flexShrink: 0 }}>{step.icon}</div>
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--color-gray-medium)' }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
          <h2 className="section-title">💬 Ils nous font confiance</h2>
        </div>
        <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--color-orange), var(--color-red))' 
                }} />
                <div>
                  <h4 style={{ fontSize: '15px', marginBottom: '2px' }}>{testimonial.name}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--color-gray-medium)' }}>{testimonial.role}</p>
                </div>
              </div>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-gray-light)', fontStyle: 'italic' }}>
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--color-orange)' }}>À propos</h3>
            <ul style={{ listStyle: 'none' }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: 'var(--color-gray-medium)', textDecoration: 'none', fontSize: '14px', transition: 'var(--transition)' }}>
                  Qui sommes-nous
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: 'var(--color-gray-medium)', textDecoration: 'none', fontSize: '14px', transition: 'var(--transition)' }}>
                  Comment ça marche
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: 'var(--color-gray-medium)', textDecoration: 'none', fontSize: '14px', transition: 'var(--transition)' }}>
                  Devenir vendeur
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--color-orange)' }}>Support</h3>
            <ul style={{ listStyle: 'none' }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: 'var(--color-gray-medium)', textDecoration: 'none', fontSize: '14px', transition: 'var(--transition)' }}>
                  Centre d'aide
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: 'var(--color-gray-medium)', textDecoration: 'none', fontSize: '14px', transition: 'var(--transition)' }}>
                  Contact
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: 'var(--color-gray-medium)', textDecoration: 'none', fontSize: '14px', transition: 'var(--transition)' }}>
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--color-orange)' }}>Suivez-nous</h3>
            <div style={{ display: 'flex', gap: '24px', fontSize: '24px' }}>
              <span>📘</span>
              <span>📷</span>
              <span>🐦</span>
            </div>
          </div>
        </div>
        <div style={{ 
          marginTop: '32px', 
          paddingTop: '16px', 
          borderTop: '1px solid #333', 
          textAlign: 'center', 
          fontSize: '13px', 
          color: 'var(--color-gray-dark)' 
        }}>
          <p>© 2026 Flash Deals Cameroun. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
