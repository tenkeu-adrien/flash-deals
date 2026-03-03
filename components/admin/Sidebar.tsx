'use client';

import { LayoutDashboard, Users, Store, Megaphone, Package, DollarSign, BarChart3, Settings } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function AdminSidebar({ currentPage, onNavigate }: SidebarProps) {
  const sections = [
    {
      title: 'Principal',
      items: [{ id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' }],
    },
    {
      title: 'Utilisateurs',
      items: [
        { id: 'clients', icon: Users, label: 'Clients' },
        { id: 'vendors', icon: Store, label: 'Commerçants' },
      ],
    },
    {
      title: 'Gestion',
      items: [
        { id: 'campaigns', icon: Megaphone, label: 'Campagnes' },
        { id: 'orders', icon: Package, label: 'Commandes' },
        { id: 'finances', icon: DollarSign, label: 'Finances' },
      ],
    },
    {
      title: 'Analytics',
      items: [
        { id: 'analytics', icon: BarChart3, label: 'Rapports' },
        { id: 'settings', icon: Settings, label: 'Paramètres' },
      ],
    },
  ];

  return (
    <aside className="w-[260px] bg-[#151515] border-r border-[#333] p-6 fixed h-screen overflow-y-auto">
      <div className="text-xl font-bold text-orange mb-1">🔥 Flash Deals</div>
      <div className="text-[11px] text-gray-dark mb-8">Administration</div>

      <nav>
        {sections.map((section, sIndex) => (
          <div key={sIndex} className="mb-6">
            <div className="text-[11px] font-semibold text-gray-dark uppercase tracking-wider mb-3">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors text-sm ${
                    currentPage === item.id
                      ? 'bg-orange text-white'
                      : 'text-gray-medium hover:bg-bg-medium hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
