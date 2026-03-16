'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/Sidebar';
import { Search, Bell } from 'lucide-react';
import { getGlobalStats, checkFirebaseHealth, getAllOrders } from '@/lib/firebase/firestore-admin';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle');
  const [healthMessage, setHealthMessage] = useState<string>('');
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
    loadRecentActivity();
  }, []);

  const loadStats = async () => {
    try {
      const result = await getGlobalStats();
      if (result.success && result.stats) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentActivity = async () => {
    try {
      const result = await getAllOrders();
      if (result.success && result.orders) {
        setRecentOrders(result.orders.slice(0, 5));
      }
    } catch (error) {
      console.error('Erreur chargement activité:', error);
    }
  };

  // Calculer les métriques à partir des vraies données (sans pourcentages fictifs)
  const metrics = stats
    ? [
        {
          label: 'GMV Total',
          value: `${(stats.totalRevenue / 1000000).toFixed(1)}M XAF`,
        },
        {
          label: 'Commandes',
          value: stats.totalOrders.toLocaleString(),
        },
        {
          label: 'Utilisateurs',
          value: stats.totalUsers.toLocaleString(),
        },
        {
          label: 'Taux conversion',
          value:
            stats.totalOrders > 0 && stats.totalUsers > 0
              ? `${((stats.totalOrders / stats.totalUsers) * 100).toFixed(1)}%`
              : '0%',
        },
        {
          label: 'Vendeurs actifs',
          value: stats.activeVendors.toString(),
        },
        {
          label: 'Campagnes actives',
          value: stats.activeCampaigns.toString(),
        },
        {
          label: 'Panier moyen',
          value:
            stats.totalOrders > 0
              ? `${(stats.totalRevenue / stats.totalOrders).toLocaleString()} XAF`
              : '0 XAF',
        },
        {
          label: 'Vendeurs en attente',
          value: stats.pendingVendors.toString(),
        },
      ]
    : [
        { label: 'GMV Total', value: '0 XAF' },
        { label: 'Commandes', value: '0' },
        { label: 'Utilisateurs', value: '0' },
        { label: 'Taux conversion', value: '0%' },
        { label: 'Vendeurs actifs', value: '0' },
        { label: 'Campagnes actives', value: '0' },
        { label: 'Panier moyen', value: '0 XAF' },
        { label: 'Vendeurs en attente', value: '0' },
      ];

  const handleHealthCheck = async () => {
    setHealthStatus('checking');
    setHealthMessage('');
    const res = await checkFirebaseHealth();
    if (res.success) {
      setHealthStatus('ok');
      setHealthMessage('Connexion Firebase OK (campagnes et commandes accessibles)');
    } else {
      setHealthStatus('error');
      setHealthMessage(res.error || 'Erreur inconnue lors de la vérification Firebase');
    }
  };

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
            <button
              onClick={handleHealthCheck}
              className="px-3 py-2 bg-bg-card border border-[#333] rounded-lg text-xs text-gray-medium hover:bg-[#333] transition-colors"
            >
              {healthStatus === 'checking' ? 'Vérification Firebase...' : 'Vérifier Firebase'}
            </button>
            <button className="relative p-2 hover:bg-bg-card rounded-full transition-colors">
              <Bell size={20} />
              {stats && stats.pendingOrders > 0 && (
                <span className="absolute top-1 right-1 bg-red text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center font-bold">
                  {stats.pendingOrders > 99 ? '99+' : stats.pendingOrders}
                </span>
              )}
            </button>
          </div>
        </header>

        <div className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-[28px] font-bold mb-2">Dashboard</h1>
            <p className="text-sm text-gray-medium">Vue d'ensemble de la plateforme</p>
          </div>

          {/* Health status */}
          {healthStatus !== 'idle' && (
            <div
              className={`mb-6 p-3 rounded-lg text-sm ${
                healthStatus === 'ok'
                  ? 'bg-green/10 border border-green text-green'
                  : healthStatus === 'error'
                  ? 'bg-red/10 border border-red text-red'
                  : 'bg-bg-card border border-[#333] text-gray-medium'
              }`}
            >
              {healthMessage ||
                (healthStatus === 'checking'
                  ? 'Vérification en cours...'
                  : 'Statut Firebase inconnu')}
            </div>
          )}

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
              </motion.div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
              <h2 className="text-lg font-bold mb-4">Activité récente</h2>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-medium">
                  <p>Aucune activité récente</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order, i) => (
                    <div key={order.id || i} className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-orange" />
                      <span className="text-gray-medium">
                        {order.createdAt?.toDate?.()?.toLocaleString('fr-FR') || 'N/A'}
                      </span>
                      <span>Commande #{order.id?.substring(0, 8)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
              <h2 className="text-lg font-bold mb-4">Résumé</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-medium">Campagnes actives</span>
                  <span className="text-sm font-bold text-orange">{stats?.activeCampaigns || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-medium">Vendeurs actifs</span>
                  <span className="text-sm font-bold text-green">{stats?.activeVendors || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-medium">Commandes totales</span>
                  <span className="text-sm font-bold">{stats?.totalOrders || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-medium">Utilisateurs</span>
                  <span className="text-sm font-bold">{stats?.totalUsers || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
