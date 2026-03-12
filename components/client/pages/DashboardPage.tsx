'use client';

import { useEffect, useState } from 'react';
import { getActiveCampaigns, Campaign } from '@/lib/firebase/firestore';
import DealCard from '@/components/client/DealCard';
import { useClientStore } from '@/lib/stores/clientStore';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, setSelectedCampaignId } = useClientStore();

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    const result = await getActiveCampaigns(10);
    if (result.success && result.campaigns) {
      setCampaigns(result.campaigns);
    }
    setLoading(false);
  };

  const handleDealClick = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    onNavigate('product');
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

  return (
    <div>
      {/* Hero Section */}
      <section style={{ padding: 'var(--spacing-lg)', backgroundColor: '#1a1a1a' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>
          👋 Bonjour {user?.displayName || 'Client'}!
        </h1>
        <p style={{ color: 'var(--color-gray-medium)', fontSize: '14px' }}>
          Découvrez les meilleurs deals du moment
        </p>
      </section>

      {/* Deals Actifs */}
      <section className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
          <h2 className="section-title">🔥 Deals Actifs</h2>
        </div>

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
            <p style={{ color: '#666' }}>Les deals flash arrivent bientôt!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            {campaigns.map((campaign) => (
              <DealCard
                key={campaign.id}
                id={campaign.id!}
                badge={campaign.sold > campaign.stock * 0.5 ? 'POPULAIRE' : 'NOUVEAU'}
                endDate={campaign.endDate}
                icon="📦"
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
        )}
      </section>

      <div style={{ height: '80px' }}></div>
    </div>
  );
}
