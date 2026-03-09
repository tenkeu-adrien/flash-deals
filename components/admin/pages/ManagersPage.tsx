'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/Sidebar';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import { 
  getAllManagers,
  createManager,
  updateManagerPermissions,
  deactivateManager,
  activateManager,
  deleteManager,
  Manager 
} from '@/lib/firebase';

interface ManagersPageProps {
  onNavigate: (page: string) => void;
}

export default function ManagersPage({ onNavigate }: ManagersPageProps) {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    setLoading(true);
    const result = await getAllManagers();
    
    if (result.success && result.managers) {
      setManagers(result.managers);
    }
    
    setLoading(false);
  };

  const handleAddManager = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setMessage('❌ Nom et email requis');
      return;
    }

    setMessage('');
    const result = await createManager(formData);

    if (result.success) {
      setMessage('✅ Manager ajouté avec succès');
      setFormData({ name: '', email: '', phone: '' });
      setShowAddForm(false);
      await loadManagers();
    } else {
      setMessage(`❌ Erreur: ${result.error}`);
    }
  };

  const handleToggleStatus = async (managerId: string, currentStatus: string) => {
    const result = currentStatus === 'active'
      ? await deactivateManager(managerId)
      : await activateManager(managerId);

    if (result.success) {
      await loadManagers();
    }
  };

  const handleDelete = async (managerId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce manager ?')) {
      return;
    }

    const result = await deleteManager(managerId);

    if (result.success) {
      await loadManagers();
    }
  };

  const handleTogglePermission = async (
    managerId: string,
    permission: keyof Manager['permissions'],
    currentValue: boolean
  ) => {
    const result = await updateManagerPermissions(managerId, {
      [permission]: !currentValue
    });

    if (result.success) {
      await loadManagers();
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar currentPage="managers" onNavigate={onNavigate} />
        <div className="flex-1 ml-[260px] p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-bg-medium rounded w-1/3"></div>
            <div className="h-32 bg-bg-medium rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar currentPage="managers" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-[260px]">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-[28px] font-bold mb-2">Gestion des Managers</h1>
              <p className="text-sm text-gray-medium">
                {managers.length} manager(s) enregistré(s)
              </p>
            </div>
            
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-orange hover:bg-orange/80"
            >
              {showAddForm ? 'Annuler' : '+ Ajouter un Manager'}
            </Button>
          </div>

          {message && (
            <div className={`mb-4 p-4 rounded-lg ${
              message.includes('✅') 
                ? 'bg-green/10 border border-green text-green' 
                : 'bg-red/10 border border-red text-red'
            }`}>
              {message}
            </div>
          )}

          {showAddForm && (
            <div className="bg-bg-medium rounded-lg border border-[#333] p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Nouveau Manager</h2>
              
              <div className="space-y-4">
                <FormInput
                  label="Nom complet"
                  type="text"
                  value={formData.name}
                  onChange={(value) => setFormData({ ...formData, name: value })}
                  placeholder="Jean Dupont"
                  required
                />

                <FormInput
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(value) => setFormData({ ...formData, email: value })}
                  placeholder="jean@example.com"
                  required
                />

                <FormInput
                  label="Téléphone (optionnel)"
                  type="tel"
                  value={formData.phone}
                  onChange={(value) => setFormData({ ...formData, phone: value })}
                  placeholder="+237 6XX XXX XXX"
                />

                <Button
                  onClick={handleAddManager}
                  className="bg-orange hover:bg-orange/80"
                >
                  Créer le Manager
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {managers.map((manager) => (
              <div
                key={manager.id}
                className="bg-bg-medium rounded-lg border border-[#333] p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {manager.name}
                    </h3>
                    <p className="text-gray-medium">{manager.email}</p>
                    {manager.phone && (
                      <p className="text-gray-dark text-sm">{manager.phone}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleToggleStatus(manager.id!, manager.status)}
                      variant="secondary"
                      className={manager.status === 'active' ? 'text-green' : 'text-gray-medium'}
                    >
                      {manager.status === 'active' ? 'Actif' : 'Inactif'}
                    </Button>

                    <Button
                      onClick={() => handleDelete(manager.id!)}
                      variant="danger"
                      className="text-red hover:bg-red/10"
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>

                <div className="border-t border-[#333] pt-4">
                  <h4 className="font-medium mb-3">Permissions</h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(manager.permissions).map(([key, value]) => (
                      <label
                        key={key}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handleTogglePermission(
                            manager.id!,
                            key as keyof Manager['permissions'],
                            value
                          )}
                          className="w-4 h-4 text-orange rounded"
                        />
                        <span className="text-sm text-gray-medium">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {managers.length === 0 && (
              <div className="text-center py-12 bg-bg-medium rounded-lg border border-[#333]">
                <p className="text-gray-medium">Aucun manager enregistré</p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 bg-orange hover:bg-orange/80"
                >
                  Ajouter le premier manager
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
