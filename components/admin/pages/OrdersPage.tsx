'use client';

import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';

interface OrdersPageProps {
  onNavigate: (page: string) => void;
}

export default function OrdersPage({ onNavigate }: OrdersPageProps) {
  const orders = [
    { id: 12345, customer: 'Marie Ngo', product: 'Samsung Galaxy A54', amount: 145000, status: 'delivered', date: '2026-02-28' },
    { id: 12344, customer: 'Jean Kamga', product: 'Nike Air Max 90', amount: 45000, status: 'shipping', date: '2026-02-27' },
    { id: 12343, customer: 'Fatima B.', product: 'Sony WH-1000XM4', amount: 85000, status: 'pending', date: '2026-02-27' },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      delivered: 'bg-green/20 text-green',
      shipping: 'bg-blue/20 text-blue',
      pending: 'bg-yellow/20 text-yellow',
      cancelled: 'bg-red/20 text-red',
    };
    const labels = {
      delivered: 'Livré',
      shipping: 'En cours',
      pending: 'En attente',
      cancelled: 'Annulé',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="flex">
      <AdminSidebar currentPage="orders" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-[260px]">
        <header className="bg-bg-medium border-b border-[#333] px-8 py-4">
          <h1 className="text-2xl font-bold mb-1">Gestion des Commandes</h1>
          <p className="text-sm text-gray-medium">{orders.length} commandes récentes</p>
        </header>

        <div className="p-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bg-card">
                  <th className="px-4 py-4 text-left border-b border-[#333] text-[13px] text-gray-medium uppercase tracking-wider font-semibold">
                    Commande
                  </th>
                  <th className="px-4 py-4 text-left border-b border-[#333] text-[13px] text-gray-medium uppercase tracking-wider font-semibold">
                    Client
                  </th>
                  <th className="px-4 py-4 text-left border-b border-[#333] text-[13px] text-gray-medium uppercase tracking-wider font-semibold">
                    Produit
                  </th>
                  <th className="px-4 py-4 text-left border-b border-[#333] text-[13px] text-gray-medium uppercase tracking-wider font-semibold">
                    Montant
                  </th>
                  <th className="px-4 py-4 text-left border-b border-[#333] text-[13px] text-gray-medium uppercase tracking-wider font-semibold">
                    Statut
                  </th>
                  <th className="px-4 py-4 text-left border-b border-[#333] text-[13px] text-gray-medium uppercase tracking-wider font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-bg-card transition-colors border-b border-[#333]"
                  >
                    <td className="px-4 py-4">
                      <div className="font-bold">#{order.id}</div>
                      <div className="text-xs text-gray-medium">{order.date}</div>
                    </td>
                    <td className="px-4 py-4">{order.customer}</td>
                    <td className="px-4 py-4">{order.product}</td>
                    <td className="px-4 py-4 font-bold text-orange">{order.amount.toLocaleString()} XAF</td>
                    <td className="px-4 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-4 py-4">
                      <Button variant="secondary" size="small">Détails</Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
