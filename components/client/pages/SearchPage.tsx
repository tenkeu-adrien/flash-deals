'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import DealCard from '@/components/client/DealCard';
import Button from '@/components/ui/Button';
import { getActiveCampaigns, Campaign } from '@/lib/firebase/firestore';
import { useClientStore } from '@/lib/stores/clientStore';

interface SearchPageProps {
  onNavigate: (page: string) => void;
}

export default function SearchPage({ onNavigate }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high' | 'popular'>('recent');
  const { setSelectedCampaignId } = useClientStore();

  const categories = [
    { id: 'all', label: 'Tout', icon: '🔥' },
    { id: 'electronics', label: 'Électronique', icon: '📱' },
    { id: 'fashion', label: 'Mode', icon: '👕' },
    { id: 'home', label: 'Maison', icon: '🏠' },
    { id: 'beauty', label: 'Beauté', icon: '💄' },
    { id: 'sports', label: 'Sport', icon: '⚽' },
  ];

  useEffect(() => {
    loadCampaigns();
  }, []);

  useEffect(() => {
    filterAndSortCampaigns();
  }, [searchQuery, selectedCategory, priceRange, sortBy, campaigns]);

  const loadCampaigns = async () => {
    setLoading(true);
    const result = await getActiveCampaigns(50);
    if (result.success && result.campaigns) {
      setCampaigns(result.campaigns);
    }
    setLoading(false);
  };

  const filterAndSortCampaigns = () => {
    let filtered = [...campaigns];

    // Recherche par texte
    if (searchQuery) {
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(campaign => campaign.category === selectedCategory);
    }

    // Filtre par prix
    if (priceRange !== 'all') {
      filtered = filtered.filter(campaign => {
        if (priceRange === 'low') return campaign.currentPrice < 50000;
        if (priceRange === 'medium') return campaign.currentPrice >= 50000 && campaign.currentPrice < 200000;
        if (priceRange === 'high') return campaign.currentPrice >= 200000;
        return true;
      });
    }

    // Tri
    filtered.sort((a, b) => {
      if (sortBy === 'recent') {
        return b.createdAt?.seconds - a.createdAt?.seconds;
      }
      if (sortBy === 'price-low') {
        return a.currentPrice - b.currentPrice;
      }
      if (sortBy === 'price-high') {
        return b.currentPrice - a.currentPrice;
      }
      if (sortBy === 'popular') {
        return (b.sold || 0) - (a.sold || 0);
      }
      return 0;
    });

    setFilteredCampaigns(filtered);
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
      {/* Barre de recherche */}
      <div style={{
        padding: 'var(--spacing-md)',
        backgroundColor: '#1a1a1a',
        borderBottom: '1px solid #333',
        position: 'sticky',
        top: '60px',
        zIndex: 100
      }}>
        <div style={{ position: 'relative', marginBottom: 'var(--spacing-sm)' }}>
          <Search
            size={20}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-gray-medium)'
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un produit..."
            style={{
              width: '100%',
              padding: '12px 40px',
              backgroundColor: '#222',
              border: '1px solid #333',
              borderRadius: '8px',
              color: 'white',
              fontSize: '15px'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--color-gray-medium)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: showFilters ? 'var(--color-orange)' : '#222',
            border: '1px solid #333',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          <Filter size={16} />
          Filtres
        </button>
      </div>

      {/* Filtres */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          style={{
            padding: 'var(--spacing-md)',
            backgroundColor: '#1a1a1a',
            borderBottom: '1px solid #333'
          }}
        >
          {/* Catégories */}
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
              Catégories
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: selectedCategory === cat.id ? 'var(--color-orange)' : '#222',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Prix */}
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
              Prix
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { id: 'all', label: 'Tous' },
                { id: 'low', label: '< 50K' },
                { id: 'medium', label: '50K - 200K' },
                { id: 'high', label: '> 200K' }
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setPriceRange(range.id as any)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: priceRange === range.id ? 'var(--color-orange)' : '#222',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '13px',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tri */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
              Trier par
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#222',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px'
              }}
            >
              <option value="recent">Plus récents</option>
              <option value="price-low">Prix croissant</option>
              <option value="price-high">Prix décroissant</option>
              <option value="popular">Plus populaires</option>
            </select>
          </div>
        </motion.div>
      )}

      {/* Résultats */}
      <div style={{ padding: 'var(--spacing-lg)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-md)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>
            {filteredCampaigns.length} résultat{filteredCampaigns.length > 1 ? 's' : ''}
          </h2>
          {(searchQuery || selectedCategory !== 'all' || priceRange !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setPriceRange('all');
              }}
              style={{
                padding: '6px 12px',
                backgroundColor: 'transparent',
                border: '1px solid #333',
                borderRadius: '6px',
                color: 'var(--color-gray-medium)',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Réinitialiser
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <p>Chargement...</p>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#1a1a1a',
            borderRadius: '12px',
            border: '1px solid #333'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ marginBottom: '8px' }}>Aucun résultat</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Essayez d'autres mots-clés ou filtres
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setPriceRange('all');
              }}
              variant="primary"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            {filteredCampaigns.map((campaign) => (
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
      </div>

      <div style={{ height: '80px' }}></div>
    </div>
  );
}
