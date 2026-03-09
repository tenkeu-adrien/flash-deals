'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';
import { 
  getAllVendorsSalesReports,
  getOrdersCountByVendor,
  VendorSalesReport 
} from '@/lib/firebase';

interface VendorReportsPageProps {
  onNavigate: (page: string) => void;
}

export default function VendorReportsPage({ onNavigate }: VendorReportsPageProps) {
  const [reports, setReports] = useState<VendorSalesReport[]>([]);
  const [ordersCounts, setOrdersCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'month' | 'week'>('all');
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, [selectedPeriod]);

  const loadReports = async () => {
    setLoading(true);

    let startDate: Date | undefined;
    const endDate = new Date();

    if (selectedPeriod === 'month') {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (selectedPeriod === 'week') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    }

    const [reportsResult, countsResult] = await Promise.all([
      getAllVendorsSalesReports(startDate, endDate),
      getOrdersCountByVendor()
    ]);

    if (reportsResult.success && reportsResult.reports) {
      setReports(reportsResult.reports);
    }

    if (countsResult.success && countsResult.counts) {
      setOrdersCounts(countsResult.counts);
    }

    setLoading(false);
  };

  const totalSales = reports.reduce((sum, r) => sum + r.totalSales, 0);

  const exportToCSV = () => {
    const headers = ['Vendeur', 'Commandes', 'Ventes Totales'];
    const rows = reports.map(r => [
      r.vendorName,
      r.totalOrders,
      r.totalSales
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-vendeurs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar currentPage="vendor-reports" onNavigate={onNavigate} />
        <div className="flex-1 ml-[260px] p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-bg-medium rounded w-1/3"></div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-bg-medium rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar currentPage="vendor-reports" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-[260px]">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-[28px] font-bold mb-2">Rapports de Ventes par Vendeur</h1>
              <p className="text-sm text-gray-medium">
                Comptabilisation et paiements des vendeurs
              </p>
            </div>

            <Button
              onClick={exportToCSV}
              className="bg-green hover:bg-green/80"
            >
              📊 Exporter en CSV
            </Button>
          </div>

          {/* Filtres de période */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setSelectedPeriod('all')}
              className={`px-4 py-2 rounded-lg ${
                selectedPeriod === 'all'
                  ? 'bg-orange text-white'
                  : 'bg-bg-medium text-gray-medium hover:bg-bg-card border border-[#333]'
              }`}
            >
              Tout
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-4 py-2 rounded-lg ${
                selectedPeriod === 'month'
                  ? 'bg-orange text-white'
                  : 'bg-bg-medium text-gray-medium hover:bg-bg-card border border-[#333]'
              }`}
            >
              30 derniers jours
            </button>
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-4 py-2 rounded-lg ${
                selectedPeriod === 'week'
                  ? 'bg-orange text-white'
                  : 'bg-bg-medium text-gray-medium hover:bg-bg-card border border-[#333]'
              }`}
            >
              7 derniers jours
            </button>
          </div>

          {/* Statistiques globales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-bg-medium rounded-lg border border-[#333] p-6">
              <p className="text-gray-medium text-sm mb-1">Ventes Totales</p>
              <p className="text-2xl font-bold">
                {totalSales.toLocaleString()} FCFA
              </p>
            </div>

            <div className="bg-bg-medium rounded-lg border border-[#333] p-6">
              <p className="text-gray-medium text-sm mb-1">Nombre de Vendeurs</p>
              <p className="text-2xl font-bold text-orange">
                {reports.length}
              </p>
            </div>
          </div>

          {/* Liste des vendeurs */}
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.vendorId}
                className="bg-bg-medium rounded-lg border border-[#333] overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        {report.vendorName}
                      </h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-medium">Commandes livrées</p>
                          <p className="font-semibold">{report.totalOrders}</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-medium">Toutes commandes</p>
                          <p className="font-semibold">
                            {ordersCounts[report.vendorId] || 0}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-medium">Ventes totales</p>
                          <p className="font-semibold">
                            {report.totalSales.toLocaleString()} FCFA
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => setExpandedVendor(
                          expandedVendor === report.vendorId ? null : report.vendorId
                        )}
                        variant="secondary"
                      >
                        {expandedVendor === report.vendorId ? 'Masquer' : 'Détails'}
                      </Button>
                    </div>
                  </div>

                  {/* Détails des commandes */}
                  {expandedVendor === report.vendorId && (
                    <div className="mt-6 border-t border-[#333] pt-4">
                      <h4 className="font-medium mb-3">
                        Détail des commandes livrées
                      </h4>
                      
                      <div className="space-y-2">
                        {report.orders.map((order) => (
                          <div
                            key={order.id}
                            className="flex justify-between items-center p-3 bg-bg-dark rounded"
                          >
                            <div>
                              <p className="text-sm font-medium">
                                Commande #{order.id?.slice(-8)}
                              </p>
                              <p className="text-xs text-gray-medium">
                                {order.quantity} article(s) - {order.paymentMethod}
                              </p>
                            </div>
                            <p className="font-semibold">
                              {order.totalPrice.toLocaleString()} FCFA
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {reports.length === 0 && (
              <div className="text-center py-12 bg-bg-medium rounded-lg border border-[#333]">
                <p className="text-gray-medium">
                  Aucune vente pour la période sélectionnée
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
