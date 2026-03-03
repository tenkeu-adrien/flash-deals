'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Sidebar from '@/components/vendeur/Sidebar';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const metrics = [
    { label: 'GMV Total', value: '2.4M XAF', change: '+12.5%', positive: true },
    { label: 'Commandes', value: '156', change: '+8.2%', positive: true },
    { label: 'Taux conversion', value: '7.8%', change: '-1.2%', positive: false },
    { label: 'Panier moyen', value: '15,400 XAF', change: '+5.3%', positive: true },
  ];

  return (
    <div className="flex">
      <Sidebar currentPage="dashboard" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-[260px]">
        <header className="bg-bg-medium border-b border-[#333] px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-medium">Vue d'ensemble de vos performances</p>
          </div>
          <Button variant="primary" onClick={() => onNavigate('create-campaign')}>
            + Nouvelle Campagne
          </Button>
        </header>

        <div className="p-8">
          {/* Metrics */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-bg-medium rounded-lg p-6 border border-[#333] relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange to-red" />
                <div className="text-[13px] text-gray-medium mb-2">{metric.label}</div>
                <div className="text-[32px] font-bold mb-2">{metric.value}</div>
                <div className={`text-[13px] flex items-center gap-1 ${metric.positive ? 'text-green' : 'text-red'}`}>
                  {metric.positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {metric.change}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-bg-medium rounded-lg p-6 border border-[#333] mb-8">
            <h2 className="text-xl font-bold mb-4">Actions rapides</h2>
            <div className="grid grid-cols-3 gap-4">
              <Button variant="primary" onClick={() => onNavigate('create-campaign')}>
                🚀 Créer une campagne
              </Button>
              <Button variant="secondary" onClick={() => onNavigate('campaigns')}>
                📊 Voir mes campagnes
              </Button>
              <Button variant="secondary">
                📦 Gérer les commandes
              </Button>
            </div>
          </div>

          {/* Recent Campaigns */}
          <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Campagnes récentes</h2>
              <button onClick={() => onNavigate('campaigns')} className="text-orange text-sm">
                Voir tout →
              </button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-bg-card rounded-lg border border-[#333]">
                  <div className="w-16 h-16 bg-bg-medium rounded-lg flex items-center justify-center text-2xl">
                    📱
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Samsung Galaxy A54</h3>
                    <p className="text-sm text-gray-medium">Actif • 23/50 vendus</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange">145,000 XAF</div>
                    <div className="text-sm text-gray-medium">-41%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
