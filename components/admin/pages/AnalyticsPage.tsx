'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';
import { BarChart3, Users, ShoppingCart, Eye, Download, Calendar } from 'lucide-react';
import { getGlobalStats } from '@/lib/firebase/firestore';

interface AnalyticsPageProps {
  onNavigate: (page: string) => void;
}

export default function AnalyticsPage({ onNavigate }: AnalyticsPageProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [period, setPeriod] = useState('month');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    const result = await getGlobalStats();
    if (result.success && result.stats) {
      setStats(result.stats);
    }
    
    // Charger les campagnes pour les top campagnes
    const { getActiveCampaigns, getAllOrders } = await import('@/lib/firebase/firestore');
    const campaignsResult = await getActiveCampaigns(100);
    if (campaignsResult.success && campaignsResult.campaigns) {
      setCampaigns(campaignsResult.campaigns);
    }
    
    // Charger les commandes pour les statistiques
    const ordersResult = await getAllOrders();
    if (ordersResult.success && ordersResult.orders) {
      setOrders(ordersResult.orders);
    }
    
    setLoading(false);
  };

  // Métriques simples basées sur les vraies stats (sans pourcentages fictifs)
  const analyticsMetrics = stats
    ? [
        {
          label: 'Utilisateurs',
          value: stats.totalUsers?.toLocaleString?.() || stats.totalUsers || '0',
          icon: Users,
          color: 'from-blue-500 to-cyan-600'
        },
        {
          label: 'Commandes',
          value: stats.totalOrders?.toLocaleString?.() || stats.totalOrders || '0',
          icon: ShoppingCart,
          color: 'from-green-500 to-emerald-600'
        },
        {
          label: 'Campagnes actives',
          value: stats.activeCampaigns?.toString() || '0',
          icon: Eye,
          color: 'from-purple-500 to-pink-600'
        },
        {
          label: 'Revenu Total',
          value: `${(stats.totalRevenue || 0).toLocaleString()} FCFA`,
          icon: ShoppingCart,
          color: 'from-orange to-red'
        }
      ]
    : [
        {
          label: 'Utilisateurs',
          value: '0',
          icon: Users,
          color: 'from-blue-500 to-cyan-600'
        },
        {
          label: 'Commandes',
          value: '0',
          icon: ShoppingCart,
          color: 'from-green-500 to-emerald-600'
        },
        {
          label: 'Campagnes actives',
          value: '0',
          icon: Eye,
          color: 'from-purple-500 to-pink-600'
        },
        {
          label: 'Revenu Total',
          value: '0 FCFA',
          icon: ShoppingCart,
          color: 'from-orange to-red'
        }
      ];

  // Top campagnes basées sur les vraies données
  const topCampaigns = campaigns
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
    .map(c => ({
      name: c.title || 'Sans titre',
      views: c.views || 0,
      sales: c.sold || 0,
      revenue: (c.sold || 0) * (c.currentPrice || 0)
    }));

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
                  <div
                    className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${metric.color} opacity-10 rounded-full -mr-10 -mt-10`}
                  />
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color}`}>
                      <Icon size={20} className="text-white" />
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
            <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
              <h2 className="text-lg font-bold mb-6">Top Campagnes</h2>
              {topCampaigns.length === 0 ? (
                <div className="text-center py-8 text-gray-medium">
                  <p>Aucune campagne pour le moment</p>
                </div>
              ) : (
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
                        <div className="font-bold text-orange">{(campaign.revenue / 1000).toFixed(0)}K</div>
                        <div className="text-xs text-gray-medium">FCFA</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Statistiques simples */}
            <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
              <h2 className="text-lg font-bold mb-6">Statistiques</h2>
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-medium">
                  <p>Statistiques détaillées disponibles prochainement</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques Basiques */}
          <div className="bg-bg-medium rounded-lg p-6 border border-[#333] mb-8">
            <h2 className="text-lg font-bold mb-6">Résumé</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange mb-1">
                  {stats ? stats.totalCampaigns : '0'}
                </div>
                <div className="text-sm text-gray-medium">Campagnes totales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green mb-1">
                  {stats ? stats.totalOrders : '0'}
                </div>
                <div className="text-sm text-gray-medium">Commandes totales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500 mb-1">
                  {stats ? stats.totalUsers : '0'}
                </div>
                <div className="text-sm text-gray-medium">Utilisateurs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
