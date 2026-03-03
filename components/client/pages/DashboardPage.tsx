'use client';

import { motion } from 'framer-motion';
import DealCard from '@/components/client/DealCard';
import { useClientStore } from '@/lib/stores/clientStore';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { addToCart } = useClientStore();

  const deals = [
    {
      id: '1',
      badge: 'HOT',
      timer: '14h 23min',
      icon: '📱',
      title: 'Samsung Galaxy A54 - Noir 128GB',
      rating: '⭐⭐⭐⭐⭐ 4.8/5 (127 avis)',
      originalPrice: 245000,
      currentPrice: 145000,
      discount: '-41%',
      stock: { current: 23, total: 50 },
      delivery: '2 000 XAF',
      location: 'Disponible à Douala & Yaoundé',
      interested: 234,
    },
    {
      id: '2',
      badge: 'NOUVEAU',
      timer: '8h 15min',
      icon: '👟',
      title: 'Nike Air Max 90 - Blanc/Rouge',
      rating: '⭐⭐⭐⭐ 4.5/5 (89 avis)',
      originalPrice: 85000,
      currentPrice: 45000,
      discount: '-47%',
      stock: { current: 12, total: 30 },
      delivery: '1 500 XAF',
      location: 'Disponible à Douala',
      interested: 156,
    },
    {
      id: '3',
      timer: '22h 45min',
      icon: '🎧',
      title: 'Sony WH-1000XM4 - Casque Bluetooth',
      rating: '⭐⭐⭐⭐⭐ 4.9/5 (203 avis)',
      originalPrice: 130000,
      currentPrice: 85000,
      discount: '-35%',
      stock: { current: 8, total: 20 },
      delivery: '2 000 XAF',
      location: 'Disponible à Douala & Yaoundé',
      interested: 312,
    },
  ];

  const handleAddToCart = (deal: typeof deals[0]) => {
    addToCart({
      id: deal.id,
      title: deal.title,
      price: deal.currentPrice,
      originalPrice: deal.originalPrice,
      quantity: 1,
    });
    onNavigate('product');
  };

  return (
    <div className="pb-20">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange to-red p-6 text-center"
      >
        <h1 className="text-2xl font-bold mb-2">🔥 Deals du Jour</h1>
        <p className="text-sm">Ne manquez pas ces offres exceptionnelles !</p>
      </motion.div>

      {/* Deals List */}
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Deals Actifs</h2>
          <span className="text-sm text-orange">{deals.length} offres</span>
        </div>

        {deals.map((deal, index) => (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <DealCard
              {...deal}
              actionLabel="Voir le deal →"
              onAction={() => handleAddToCart(deal)}
            />
          </motion.div>
        ))}
      </div>

      {/* Categories */}
      <div className="px-4 py-6 bg-bg-dark">
        <h2 className="text-xl font-bold mb-4">Catégories</h2>
        <div className="grid grid-cols-3 gap-4">
          {['📱 Tech', '👗 Mode', '🏠 Maison', '💄 Beauté', '⚽ Sports', '🍔 Food'].map((cat, i) => (
            <motion.div
              key={i}
              whileTap={{ scale: 0.95 }}
              className="bg-bg-medium border border-[#333] rounded-lg p-4 text-center cursor-pointer hover:border-orange transition-colors"
            >
              <div className="text-2xl mb-1">{cat.split(' ')[0]}</div>
              <div className="text-xs">{cat.split(' ')[1]}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
