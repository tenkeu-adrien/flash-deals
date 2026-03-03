'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useClientStore } from '@/lib/stores/clientStore';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export default function CartPage({ onNavigate }: CartPageProps) {
  const { cart, updateQuantity, removeFromCart } = useClientStore();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savings = cart.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0);
  const delivery = 2000;
  const total = subtotal + delivery;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 pb-20">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-2">Panier vide</h2>
        <p className="text-gray-medium mb-6 text-center">
          Ajoutez des produits pour commencer vos achats
        </p>
        <Button variant="primary" onClick={() => onNavigate('dashboard')}>
          Découvrir les deals
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Mon Panier ({cart.length})</h1>

        {cart.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-bg-medium rounded-[12px] p-4 mb-4 flex gap-4 border border-[#333]"
          >
            <div className="w-20 h-20 rounded-lg bg-bg-card flex-shrink-0 flex items-center justify-center text-3xl">
              📱
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold mb-1">{item.title}</h3>
              <div className="text-lg font-bold text-orange mb-2">
                {item.price.toLocaleString()} XAF
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="w-8 h-8 rounded-md border border-[#333] bg-[#222] text-white flex items-center justify-center"
                >
                  <Minus size={18} />
                </button>
                <span className="text-base font-semibold min-w-[30px] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-md border border-[#333] bg-[#222] text-white flex items-center justify-center"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="ml-auto text-red"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        <div className="bg-bg-medium rounded-[12px] p-4 border border-[#333] mt-6">
          <div className="flex justify-between mb-3 text-[15px]">
            <span>Sous-total</span>
            <span>{subtotal.toLocaleString()} XAF</span>
          </div>
          <div className="flex justify-between mb-3 text-[15px]">
            <span>Livraison</span>
            <span>{delivery.toLocaleString()} XAF</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-[#333] mt-3 text-xl font-bold text-orange">
            <span>Total</span>
            <span>{total.toLocaleString()} XAF</span>
          </div>
          {savings > 0 && (
            <div className="bg-green text-white px-3 py-2 rounded-md text-center mt-3 font-semibold">
              Vous économisez {savings.toLocaleString()} XAF 🎉
            </div>
          )}
        </div>

        <Button variant="primary" size="block" className="mt-6">
          Passer la commande →
        </Button>
      </div>
    </div>
  );
}
