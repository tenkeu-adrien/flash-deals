'use client';

import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/Sidebar';
import { Search, Bell, User, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const metrics = [
    { label: 'GMV Total', value: '45.2M XAF', change: '+12.5%', positive: true },
    { label: 'Commandes', value: '1,234', change: '+8.2%', positive: true },
    { label: 'Utilisateurs', value: '12,456', change: '+15.3%', positive: true },
    { label: 'Taux conversion', value: '8.7%', change: '-1.2%', positive: false },
    { label: 'Vendeurs actifs', value: '156', change: '+5.1%', positive: true },
    { label: 'Campagnes actives', value: '89', change: '+3.4%', positive: true },
    { label: 'Panier moyen', value: '36,600 XAF', change: '+7.8%', positive: true },
    { label: 'Satisfaction', value: '4.8/5', change: '+0.2', positive: true },
  ];

  const alerts = [
    { type: 'critical', icon: '🚨', title: 'Stock critique', description: '3 campagnes ont moins de 10% de stock' },
    { type: 'warning', icon: '⚠️', title: 'Validation en attente', description: '12 vendeurs attendent validation KYC' },
    { type: 'info', icon: 'ℹ️', title: 'Pic de trafic', description: 'Trafic +45% aujourd\'hui vs hier' },
  ];

  return (
    <div className="flex">
      <AdminSidebar currentPage="dashboard" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-[260px]">
        {/* Header */}
        <header className="bg-bg-medium border-b border-[#333] px-8 py-4 flex justify-between items-center sticky top-0 z-[999]">
          <div className="flex-1 max-w-[500px] relative">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full px-4 py-3 bg-bg-dark border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-orange"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-dark" size={20} />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-bg-card rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 bg-red text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center font-bold">
                5
              </span>
            </button>
            <div className="flex items-center gap-3 px-3 py-2 bg-bg-card rounded-lg cursor-pointer hover:bg-[#333] transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange to-red flex items-center justify-center font-bold">
                A
              </div>
              <span className="text-sm">Admin</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-[28px] font-bold mb-2">Dashboard</h1>
            <p className="text-sm text-gray-medium">Vue d'ensemble de la plateforme</p>
          </div>

          {/* Alerts */}
          <div className="space-y-4 mb-8">
            {alerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 flex items-start gap-4 ${
                  alert.type === 'critical'
                    ? 'bg-red/10 border-red'
                    : alert.type === 'warning'
                    ? 'bg-yellow/10 border-yellow'
                    : 'bg-blue/10 border-blue'
                }`}
              >
                <div className="text-2xl flex-shrink-0">{alert.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold mb-1">{alert.title}</div>
                  <div className="text-sm text-gray-medium">{alert.description}</div>
                </div>
                <button className="text-sm text-orange hover:underline">Voir</button>
              </motion.div>
            ))}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
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

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
              <h2 className="text-lg font-bold mb-4">Activité récente</h2>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-orange" />
                    <span className="text-gray-medium">Il y a {i * 5} min</span>
                    <span>Nouvelle commande #12{i}45</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
              <h2 className="text-lg font-bold mb-4">Top Vendeurs</h2>
              <div className="space-y-3">
                {['TechStore Douala', 'Fashion Boutique', 'ElectroShop', 'BeautyPro'].map((vendor, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm">{vendor}</span>
                    <span className="text-sm font-bold text-orange">{(50 - i * 10)}K XAF</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
