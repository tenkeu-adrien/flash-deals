'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';
import { DollarSign, Download, Calendar } from 'lucide-react';
import { getAllOrders, getGlobalStats, checkFirebaseHealth } from '@/lib/firebase/firestore';

interface FinancesPageProps {
  onNavigate: (page: string) => void;
}

export default function FinancesPage({ onNavigate }: FinancesPageProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [period, setPeriod] = useState('month');
  const [healthStatus, setHealthStatus] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle');
  const [healthMessage, setHealthMessage] = useState<string>('');

  useEffect(() => {
    loadFinances();
  }, []);

  const loadFinances = async () => {
    setLoading(true);
    
    // Charger les statistiques
    const statsResult = await getGlobalStats();
    if (statsResult.success && statsResult.stats) {
      setStats(statsResult.stats);
    }

    // Charger les commandes récentes
    const ordersResult = await getAllOrders();
    if (ordersResult.success && ordersResult.orders) {
      setTransactions(ordersResult.orders.slice(0, 20));
    }

    setLoading(false);
  };

  const financialMetrics = [
    {
      label: 'Revenu Total',
      value: stats ? `${(stats.totalRevenue || 0).toLocaleString()} FCFA` : '0 FCFA',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600'
    },
    {
      label: 'Transactions',
      value: stats ? stats.totalOrders : '0',
      icon: DollarSign,
      color: 'from-orange to-red'
    },
    {
      label: 'Panier moyen',
      value: stats && stats.totalOrders > 0
        ? `${(stats.totalRevenue / stats.totalOrders).toLocaleString()} FCFA`
        : '0 FCFA',
      icon: DollarSign,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      label: 'Vendeurs actifs',
      value: stats ? stats.activeVendors : '0',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: 'bg-green/20 text-green',
      pending: 'bg-yellow/20 text-yellow',
      failed: 'bg-red/20 text-red',
      refunded: 'bg-gray-500/20 text-gray-400'
    };
    const labels = {
      paid: 'Payé',
      pending: 'En attente',
      failed: 'Échoué',
      refunded: 'Remboursé'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles] || styles.pending}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const handleHealthCheck = async () => {
    setHealthStatus('checking');
    setHealthMessage('');
    const res = await checkFirebaseHealth();
    if (res.success) {
      setHealthStatus('ok');
      setHealthMessage('Connexion Firebase OK (commandes et campagnes accessibles)');
    } else {
      setHealthStatus('error');
      setHealthMessage(res.error || 'Erreur inconnue lors de la vérification Firebase');
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar currentPage="finances" onNavigate={onNavigate} />
        <div className="flex-1 ml-[260px] flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p>Chargement des finances...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar currentPage="finances" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-[260px]">
        <header className="bg-bg-medium border-b border-[#333] px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-1">Gestion Financière</h1>
              <p className="text-sm text-gray-medium">Suivi des revenus et transactions</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleHealthCheck}
                className="px-3 py-2 bg-bg-dark border border-[#333] rounded-lg text-xs text-gray-medium hover:bg-bg-card"
              >
                {healthStatus === 'checking' ? 'Vérification Firebase...' : 'Vérifier Firebase'}
              </button>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-2 bg-bg-dark border border-[#333] rounded-lg text-white text-sm"
              >
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
          {/* Financial Metrics */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {financialMetrics.map((metric, index) => {
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
                  </div>
                  <div className="text-[13px] text-gray-medium mb-1">{metric.label}</div>
                  <div className="text-[28px] font-bold">{metric.value}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Revenue Chart Placeholder */}
          <div className="bg-bg-medium rounded-lg p-6 border border-[#333] mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Évolution du Revenu</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-orange text-white rounded-lg text-sm">Jour</button>
                <button className="px-3 py-1 bg-bg-dark text-gray-medium rounded-lg text-sm hover:bg-bg-card">Semaine</button>
                <button className="px-3 py-1 bg-bg-dark text-gray-medium rounded-lg text-sm hover:bg-bg-card">Mois</button>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-[#333] rounded-lg">
              <div className="text-center text-gray-medium">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p>Graphique d'évolution du revenu</p>
                <p className="text-sm mt-2">Intégration Chart.js à venir</p>
              </div>
            </div>
          </div>

          {/* Transactions récentes */}
          <div className="bg-bg-medium rounded-lg p-6 border border-[#333]">
            <h2 className="text-lg font-bold mb-6">Transactions Récentes</h2>
            
            {transactions.length === 0 ? (
              <div className="text-center py-12 text-gray-medium">
                <DollarSign size={48} className="mx-auto mb-4 opacity-50" />
                <p>Aucune transaction pour le moment</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-bg-card">
                      <th className="px-4 py-4 text-left border-b border-[#333] text-[13px] text-gray-medium uppercase tracking-wider font-semibold">
                        ID Transaction
                      </th>
                      <th className="px-4 py-4 text-left border-b border-[#333] text-[13px] text-gray-medium uppercase tracking-wider font-semibold">
                        Date
                      </th>
                      <th className="px-4 py-4 text-left border-b border-[#333] text-[13px] text-gray-medium uppercase tracking-wider font-semibold">
                        Client
                      </th>
                      <th className="px-4 py-4 text-left border-b border-[#333] text-[13px] text-gray-medium uppercase tracking-wider font-semibold">
                        Montant
                      </th>
                      <th className="px-4 py-4 text-left border-b border-[#333] text-[13px] text-gray-medium uppercase tracking-wider font-semibold">
                        Moyen de paiement
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
                    {transactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-bg-card transition-colors border-b border-[#333]"
                      >
                        <td className="px-4 py-4">
                          <div className="font-mono text-sm">{transaction.id?.substring(0, 8)}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            {transaction.createdAt?.toDate?.()?.toLocaleDateString('fr-FR') || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">{transaction.userId?.substring(0, 8) || 'N/A'}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-bold text-orange">
                            {(transaction.totalPrice || 0).toLocaleString()} FCFA
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-medium">
                            {transaction.paymentMethod || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {getStatusBadge(transaction.paymentStatus || 'pending')}
                        </td>
                        <td className="px-4 py-4">
                          <Button variant="secondary" size="small">Détails</Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Statistiques Financières */}
          <div className="bg-bg-medium rounded-lg p-6 border border-[#333] mt-8">
            <h3 className="text-lg font-bold mb-4">Statistiques Financières</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-medium">Panier moyen</span>
                <span className="font-bold text-orange">
                  {stats && stats.totalOrders > 0
                    ? `${(stats.totalRevenue / stats.totalOrders).toLocaleString()} FCFA`
                    : '0 FCFA'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-medium">Taux de conversion</span>
                <span className="font-bold text-green">
                  {stats && stats.totalOrders > 0 && stats.totalUsers > 0
                    ? `${((stats.totalOrders / stats.totalUsers) * 100).toFixed(1)}%`
                    : '0%'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-medium">Vendeurs actifs</span>
                <span className="font-bold">{stats ? stats.activeVendors : '0'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
