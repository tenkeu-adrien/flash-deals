'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useClientStore } from '@/lib/stores/clientStore';
import { ArrowLeft } from 'lucide-react';

interface ProductPageProps {
  onNavigate: (page: string) => void;
}

export default function ProductPage({ onNavigate }: ProductPageProps) {
  const { addToCart } = useClientStore();

  const handleAddToCart = () => {
    addToCart({
      id: '1',
      title: 'Samsung Galaxy A54 - Noir 128GB',
      price: 145000,
      originalPrice: 245000,
      quantity: 1,
    });
    onNavigate('cart');
  };

  return (
    <div className="pb-20">
      <div className="sticky top-0 bg-black z-10 px-4 py-4 flex items-center gap-4 border-b border-[#222]">
        <button onClick={() => onNavigate('dashboard')} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">Détails du produit</h1>
      </div>

      <div className="relative">
        <div className="absolute top-4 left-4 bg-orange text-white px-3 py-1.5 rounded-md text-xs font-bold z-10">
          HOT
        </div>
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-[10px] text-orange px-3 py-2 rounded-md text-sm font-bold">
          ⏰ 14h 23min
        </div>
        <div className="w-full h-[400px] bg-gradient-to-b from-[#2a2a2a] to-bg-medium flex items-center justify-center text-[120px]">
          📱
        </div>
      </div>

      <div className="px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-2">Samsung Galaxy A54 - Noir 128GB</h1>
          <div className="text-[#FFD700] text-sm mb-4">⭐⭐⭐⭐⭐ 4.8/5 (127 avis)</div>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="line-through text-gray-medium text-lg">245 000 XAF</span>
            <span className="text-3xl font-bold text-orange">145 000 XAF</span>
            <span className="bg-red text-white px-3 py-1 rounded text-sm font-bold">-41%</span>
          </div>

          <div className="bg-bg-medium border border-[#333] rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-medium mb-2">📦 Plus que 23/50 unités disponibles</p>
            <div className="w-full h-2 bg-[#333] rounded overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange to-red" style={{ width: '46%' }} />
            </div>
          </div>

          <div className="bg-bg-medium border border-[#333] rounded-lg p-4 mb-6">
            <h3 className="font-bold mb-3">📋 Caractéristiques</h3>
            <ul className="space-y-2 text-sm">
              <li>• Écran: 6.4" Super AMOLED</li>
              <li>• Processeur: Exynos 1380</li>
              <li>• RAM: 8GB</li>
              <li>• Stockage: 128GB</li>
              <li>• Caméra: 50MP + 12MP + 5MP</li>
              <li>• Batterie: 5000mAh</li>
            </ul>
          </div>

          <div className="bg-bg-medium border border-[#333] rounded-lg p-4 mb-6">
            <h3 className="font-bold mb-2">🚚 Livraison</h3>
            <p className="text-sm text-gray-medium">Frais: 2 000 XAF</p>
            <p className="text-sm text-gray-medium">Délai: 24-48h</p>
            <p className="text-sm text-gray-medium">Zones: Douala & Yaoundé</p>
          </div>

          <Button variant="primary" size="block" onClick={handleAddToCart}>
            Ajouter au panier 🛒
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
