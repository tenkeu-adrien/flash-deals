'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getUserProfile, updateUserProfile, logout, UserData } from '@/lib/firebase/auth';
import { getUserOrders } from '@/lib/firebase/firestore';
import { useClientStore } from '@/lib/stores/clientStore';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const [profile, setProfile] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    phoneNumber: '',
    city: '',
    region: '',
    street: ''
  });
  const { user, setUser, setCurrentPage } = useClientStore();

  useEffect(() => {
    loadProfile();
    loadOrders();
  }, []);

  const loadProfile = async () => {
    const result = await getUserProfile();
    if (result.success && result.profile) {
      setProfile(result.profile);
      setFormData({
        displayName: result.profile.displayName || '',
        phoneNumber: result.profile.phoneNumber || '',
        city: result.profile.address?.city || '',
        region: result.profile.address?.region || '',
        street: result.profile.address?.street || ''
      });
    }
    setLoading(false);
  };

  const loadOrders = async () => {
    const result = await getUserOrders();
    if (result.success && result.orders) {
      setOrders(result.orders);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    const result = await updateUserProfile({
      displayName: formData.displayName,
      phoneNumber: formData.phoneNumber,
      address: {
        city: formData.city,
        region: formData.region,
        street: formData.street
      }
    });

    if (result.success) {
      alert('✅ Profil mis à jour avec succès!');
      setEditing(false);
      loadProfile();
    } else {
      alert('❌ ' + (result.error || 'Erreur lors de la mise à jour'));
    }

    setSaving(false);
  };

  const handleLogout = async () => {
    if (confirm('Voulez-vous vraiment vous déconnecter?')) {
      await logout();
      setUser(null);
      setCurrentPage('home');
      onNavigate('home');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FFC107';
      case 'confirmed': return '#2196F3';
      case 'shipped': return '#9C27B0';
      case 'delivered': return '#00C853';
      case 'cancelled': return '#FF3D00';
      default: return '#666';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <p>Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div>
      <header className="header">
        <button 
          onClick={() => onNavigate('dashboard')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          ← Retour
        </button>
        <div className="header-logo">👤 Mon Profil</div>
        <div></div>
      </header>

      <div style={{ padding: 'var(--spacing-lg)' }}>
        {/* Informations du profil */}
        <div style={{
          backgroundColor: '#1a1a1a',
          borderRadius: 'var(--border-radius)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-lg)',
          border: '1px solid #333',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-orange), var(--color-red))',
            margin: '0 auto var(--spacing-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px'
          }}>
            👤
          </div>
          <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>
            {profile?.displayName || 'Utilisateur'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-medium)' }}>
            {profile?.email}
          </p>
        </div>

        {/* Formulaire d'édition */}
        {editing ? (
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: 'var(--border-radius)',
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-lg)',
            border: '1px solid #333'
          }}>
            <h3 style={{ fontSize: '16px', marginBottom: 'var(--spacing-md)' }}>
              ✏️ Modifier le profil
            </h3>

            <Input
              label="Nom complet"
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder="Jean Dupont"
            />

            <Input
              label="Téléphone"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="+237 6XX XXX XXX"
            />

            <Input
              label="Adresse"
              type="text"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              placeholder="Rue, quartier..."
            />

            <Input
              label="Ville"
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Douala, Yaoundé..."
            />

            <Input
              label="Région"
              type="text"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              placeholder="Littoral, Centre..."
            />

            <Button
              onClick={handleSave}
              variant="primary"
              size="block"
              disabled={saving}
            >
              {saving ? '⏳ Enregistrement...' : '✅ Enregistrer'}
            </Button>

            <button
              onClick={() => setEditing(false)}
              style={{
                width: '100%',
                padding: '14px',
                marginTop: 'var(--spacing-sm)',
                background: 'transparent',
                border: 'none',
                color: 'var(--color-gray-medium)',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Annuler
            </button>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: 'var(--border-radius)',
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-lg)',
            border: '1px solid #333'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--spacing-md)'
            }}>
              <h3 style={{ fontSize: '16px' }}>📋 Informations</h3>
              <button
                onClick={() => setEditing(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-orange)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                ✏️ Modifier
              </button>
            </div>

            <div style={{ fontSize: '14px', lineHeight: '2' }}>
              <div style={{ color: 'var(--color-gray-medium)' }}>
                📞 {profile?.phoneNumber || 'Non renseigné'}
              </div>
              <div style={{ color: 'var(--color-gray-medium)' }}>
                📍 {profile?.address?.street || 'Adresse non renseignée'}
              </div>
              <div style={{ color: 'var(--color-gray-medium)' }}>
                🏙️ {profile?.address?.city || 'Ville non renseignée'}
              </div>
              <div style={{ color: 'var(--color-gray-medium)' }}>
                🗺️ {profile?.address?.region || 'Région non renseignée'}
              </div>
            </div>
          </div>
        )}

        {/* Mes commandes */}
        <div style={{
          backgroundColor: '#1a1a1a',
          borderRadius: 'var(--border-radius)',
          padding: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-lg)',
          border: '1px solid #333'
        }}>
          <h3 style={{ fontSize: '16px', marginBottom: 'var(--spacing-md)' }}>
            📦 Mes commandes ({orders.length})
          </h3>

          {orders.length === 0 ? (
            <p style={{ fontSize: '14px', color: 'var(--color-gray-medium)', textAlign: 'center', padding: '20px' }}>
              Aucune commande pour le moment
            </p>
          ) : (
            <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  style={{
                    padding: 'var(--spacing-sm)',
                    backgroundColor: '#222',
                    borderRadius: '8px',
                    border: '1px solid #333'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>
                      Commande #{order.id.slice(0, 8)}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: getStatusColor(order.status),
                      color: 'white',
                      fontWeight: 600
                    }}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-gray-medium)' }}>
                    {order.totalPrice.toLocaleString()} XAF • {order.quantity} article(s)
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
          <button
            onClick={() => onNavigate('dashboard')}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--border-radius)',
              border: '2px solid #333',
              backgroundColor: '#1a1a1a',
              color: 'var(--color-white)',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            🏠 Retour aux deals
          </button>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--border-radius)',
              border: '2px solid var(--color-red)',
              backgroundColor: 'transparent',
              color: 'var(--color-red)',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            🚪 Se déconnecter
          </button>
        </div>
      </div>

      <div style={{ height: '80px' }}></div>
    </div>
  );
}
