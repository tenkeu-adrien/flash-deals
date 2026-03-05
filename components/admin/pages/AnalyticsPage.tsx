'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';
import { BarChart3, TrendingUp, Users, ShoppingCart, Eye, Download, Calendar } from 'lucide-react';
import { getGlobalStats } from '@/lib/firebase/firestore';

interface AnalyticsPageProps {
  onNavigate: (page: string) => void;
}

export default function AnalyticsPage({ onNavigate }: AnalyticsPageProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    const result = await getGlobalStats();
    if (result.success && result.stats) {
      setStats(result.stats);
    }
    setLoading(false);
  };

  const analyticsMetrics = [
    {
      label: 'Visiteurs Uniques',
      value: '45,234',
      change: '+18.2%',
      positive: true,
      icon: Users,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      label: 'Pages Vues',
      value: '128,456',
      change: '+12.5%',
      positive: true,
      icon: Eye,
      color: 'from-purple-500 to-pink-600'
    },
    {
      label: 'Taux de Conversion',
      value: '8.7%',
      change: '+2.3%',
      positive: true,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600'
    },
    {
      label: 'Panier Moyen',
      value: '36,600 FCFA',
      change: '+5.8%',
      positive: true,
      icon: ShoppingCart,
      color: 'from-orange to-red'
    }
  ];

  const topCampaigns = [
    { name: 'iPhone 15 Pro Max', views: 12500, sales: 45, revenue: 22500000 },
    { name: 'Samsung Galaxy S24', views: 9800, sales: 38, revenue: 15200000 },
    { name: 'MacBook Air M2', views: 8200, sales: 25, revenue: 18750000 },
    { name: 'AirPods Pro 2', views: 7500, sales: 52, revenue: 7800000 },
    { name: 'PlayStation 5', views: 6800, sales: 18, revenue: 9000000 }
  ];

  const topCategories = [
    { name: 'Électronique', percentage: 45, color: 'bg-blue-500' },
    { name: 'Mode', percentage: 25, color: 'bg-purple-500' },
    { name: 'Maison', percentage: 15, color: 'bg-green-500' },
    { name: 'Beauté', percentage: 10, color: 'bg-pink-500' },
    { name: 'Sport', percentage: 5, color: 'bg-orange' }
  ];

  const trafficSources = [
    { source: 'Direct', visits: 18500, percentage: 41 },
    { source: 'Réseaux Sociaux', visits: 13200, percentage: 29 },
    { source: 'Recherche Google', visits: 9800, percentage: 22 },
    { source: 'Référents', visits: 3600, percentage: 8 }
  ];

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar currentPage="analytics" onNavigate={onNavigate} />
        <div className="flex-1 ml-[260px] flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p>Chargement des analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar currentPage="analytics" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-[260px]">
        <header className="bg-bg-medium border-b border-[#333] px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-1">Rapports & Analytics</h1>
              <p className="text-sm text-gray-medium">Analyse des performances de la plateforme</p>
            </div>
            <div className="flex gap-3">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-2 bg-bg-dark border border-[#333] rounded-lg text-white text-sm"
              >
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="year">Cette année</option>
              </select>
              <Button variant="primary" size="small">
                <Download size={16} className="mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Analytics Metrics */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {analyticsMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-bg-medium rounded-lg p-6 border border-[#333] relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${metric.color} opacity-10 rounded-full -mr-10 -mt-10`} />
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color}`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <div className={`text-[13px] flex items-center gap-1 ${metric.positive ? 'text-green' : 'text-red'}`}>
                      <TrendingUp size={16} />
                      {metric.change}
                    </div>
                  </div>
                  <div className="text-[13px] text-gray-medium mb-1">{metric.label}</div>
                  <div className="text-[28px] font-bold">{metric.value}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Traffic Chart Placeholder */}
          <div className="bg-bg-medium rounded-lg p-6 border border-[#333] mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Trafic & Conversions</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-orange text-white rounded-lg text-sm">Visites</button>
                <button className="px-3 py-1 bg-bg-dark text-gray-medium rounded-lg text-sm hover:bg-bg-card">Conversions</button>
                <button className="px-3 py-1 bg-bg-dark text-gray-medium rounded-lg text-sm hover:bg-bg-card">Revenus</button>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-[#333] rounded-lg">
              <div className="text-center text-gray-medium">
                <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
                <p>Graphique de trafic et conversions</p>
                <p className="text-sm mt-2">Intégration Chart.js à venir</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Top Campagnes */}
            <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
              <h2 className="text-lg font-bold mb-6">Top Campagnes</h2>
              <div className="space-y-4">
                {topCampaigns.map((campaign, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-bg-dark rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-semibold mb-1">{campaign.name}</div>
                      <div className="flex gap-4 text-xs text-gray-medium">
                        <span>{campaign.views.toLocaleString()} vues</span>
                        <span>{campaign.sales} ventes</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange">{(campaign.revenue / 1000000).toFixed(1)}M</div>
                      <div className="text-xs text-gray-medium">FCFA</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sources de Trafic */}
            <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
              <h2 className="text-lg font-bold mb-6">Sources de Trafic</h2>
              <div className="space-y-4">
                {trafficSources.map((source, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">{source.source}</span>
                      <span className="text-sm font-bold">{source.visits.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 bg-bg-dark rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange to-red transition-all duration-500"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-medium mt-1">{source.percentage}%</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Catégories Populaires */}
          <div className="bg-bg-medium rounded-lg p-6 border border-[#333] mb-8">
            <h2 className="text-lg font-bold mb-6">Catégories Populaires</h2>
            <div className="grid grid-cols-5 gap-4">
              {topCategories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="relative w-24 h-24 mx-auto mb-3">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="#333"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${category.percentage * 2.51} 251`}
                        className={category.color.replace('bg-', 'text-')}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold">{category.percentage}%</span>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">{category.name}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Statistiques Détaillées */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
              <h3 className="text-lg font-bold mb-4">Comportement Utilisateur</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-medium">Durée moyenne session</span>
                  <span className="font-bold">5m 32s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-medium">Pages par session</span>
                  <span className="font-bold">4.2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-medium">Taux de rebond</span>
                  <span className="font-bold text-orange">32.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-medium">Nouveaux visiteurs</span>
                  <span className="font-bold text-green">68%</span>
                </div>
              </div>
            </div>

            <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
              <h3 className="text-lg font-bold mb-4">Appareils</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-medium">Mobile</span>
                  <span className="font-bold">72%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-medium">Desktop</span>
                  <span className="font-bold">23%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-medium">Tablette</span>
                  <span className="font-bold">5%</span>
                </div>
              </div>
            </div>

            <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
              <h3 className="text-lg font-bold mb-4">Localisation</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-medium">Douala</span>
                  <span className="font-bold">58%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-medium">Yaoundé</span>
                  <span className="font-bold">35%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-medium">Autres</span>
                  <span className="font-bold">7%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
