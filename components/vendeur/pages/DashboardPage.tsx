'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getFirebaseDb, Collections } from '@/lib/firebase/config';
import { getCurrentUserId } from '@/lib/firebase/auth';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalSales: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const vendorId = getCurrentUserId();
    if (!vendorId) return;

    try {
      const db = getFirebaseDb();
      
      // Charger les campagnes du vendeur
      const campaignsQuery = query(
        collection(db, Collections.CAMPAIGNS),
        where('vendorId', '==', vendorId)
      );
      
      const snapshot = await getDocs(campaignsQuery);
      const campaignsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setCampaigns(campaignsData);

      // Calculer les statistiques
      const activeCampaigns = campaignsData.filter(c => c.status === 'active').length;
      const totalSales = campaignsData.reduce((sum, c) => sum + (c.sold || 0), 0);
      const totalRevenue = campaignsData.reduce((sum, c) => 
        sum + ((c.currentPrice || 0) * (c.sold || 0)), 0
      );

      setStats({
        totalCampaigns: campaignsData.length,
        activeCampaigns,
        totalSales,
        totalRevenue
      });
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    }

    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'var(--color-green)';
      case 'pending': return 'var(--color-yellow)';
      case 'completed': return 'var(--color-gray-medium)';
      case 'cancelled': return 'var(--color-red)';
      default: return '#666';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'pending': return 'En attente';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <section style={{ padding: 'var(--spacing-lg)' }}>
        <h1 style={{ fontSize: '24px', marginBottom: 'var(--spacing-md)' }}>
          📊 Tableau de bord
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid #333'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-orange)' }}>
              {stats.totalCampaigns}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-gray-medium)' }}>
              Campagnes totales
            </div>
          </div>

          <div style={{
            backgroundColor: '#1a1a1a',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid #333'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-green)' }}>
              {stats.activeCampaigns}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-gray-medium)' }}>
              Campagnes actives
            </div>
          </div>

          <div style={{
            backgroundColor: '#1a1a1a',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid #333'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-blue)' }}>
              {stats.totalSales}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-gray-medium)' }}>
              Ventes totales
            </div>
          </div>

          <div style={{
            backgroundColor: '#1a1a1a',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid #333'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--color-orange)' }}>
              {(stats.totalRevenue / 1000).toFixed(1)}K
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-gray-medium)' }}>
              Revenus (XAF)
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <Button
          onClick={() => onNavigate('create-campaign')}
          variant="primary"
          size="block"
        >
          ➕ Créer une nouvelle campagne
        </Button>
      </section>

      {/* Mes campagnes */}
      <section style={{ padding: '0 var(--spacing-lg) var(--spacing-lg)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-md)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>
            🔥 Mes campagnes
          </h2>
          <button
            onClick={() => onNavigate('campaigns')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-orange)',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Voir tout →
          </button>
        </div>

        {campaigns.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#1a1a1a',
            borderRadius: '12px',
            border: '1px solid #333'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <h3 style={{ marginBottom: '12px' }}>Aucune campagne</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Créez votre première campagne pour commencer à vendre!
            </p>
            <Button onClick={() => onNavigate('create-campaign')} variant="primary">
              Créer une campagne
            </Button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            {campaigns.slice(0, 3).map((campaign) => (
              <div
                key={campaign.id}
                style={{
                  backgroundColor: '#1a1a1a',
                  borderRadius: 'var(--border-radius)',
                  padding: 'var(--spacing-md)',
                  border: '1px solid #333'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                      {campaign.title}
                    </h3>
                    <div style={{ fontSize: '14px', color: 'var(--color-gray-medium)' }}>
                      {campaign.currentPrice?.toLocaleString()} XAF • {campaign.sold || 0}/{(campaign.stock || 0) + (campaign.sold || 0)} vendus
                    </div>
                  </div>
                  <span style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: getStatusColor(campaign.status),
                    color: 'white',
                    fontWeight: 600
                  }}>
                    {getStatusLabel(campaign.status)}
                  </span>
                </div>

                <div style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: '#333',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  marginTop: 'var(--spacing-sm)'
                }}>
                  <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--color-orange), var(--color-red))',
                    width: `${((campaign.sold || 0) / ((campaign.stock || 0) + (campaign.sold || 0))) * 100}%`
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
