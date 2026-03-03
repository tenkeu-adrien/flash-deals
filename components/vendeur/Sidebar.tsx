'use client';

import { LayoutDashboard, Megaphone, Package, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'campaigns', icon: Megaphone, label: 'Mes Campagnes' },
    { id: 'orders', icon: Package, label: 'Commandes' },
    { id: 'settings', icon: Settings, label: 'Paramètres' },
  ];

  return (
    <aside className="w-[260px] bg-[#151515] border-r border-[#333] p-6 fixed h-screen overflow-y-auto">
      <div className="text-xl font-bold text-orange mb-2">🔥 Flash Deals</div>
      <div className="text-[11px] text-gray-dark mb-8">Business</div>

      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                currentPage === item.id
                  ? 'bg-orange text-white'
                  : 'text-gray-medium hover:bg-bg-medium hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
