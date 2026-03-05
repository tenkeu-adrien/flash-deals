'use client';

import Button from '@/components/ui/Button';
import { ShoppingCart, Bell } from 'lucide-react';
import { useClientStore } from '@/lib/stores/clientStore';

interface HeaderProps {
  onNavigate?: (page: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const { isAuthenticated, cart } = useClientStore();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="header">
      <div className="header-logo">🔥 Flash Deals</div>
      <div style={{ display: 'flex', gap: '12px' }}>
        {!isAuthenticated ? (
          <>
            <Button
              variant="secondary"
              size="medium"
              onClick={() => onNavigate?.('login')}
            >
              Se connecter
            </Button>
            <Button
              variant="primary"
              size="medium"
              onClick={() => onNavigate?.('signup')}
            >
              S'inscrire
            </Button>
          </>
        ) : (
          <>
            <button
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '8px',
                position: 'relative'
              }}
              onClick={() => onNavigate?.('cart')}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: 'var(--color-red)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {cartCount}
                </span>
              )}
            </button>
            <button style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px',
              position: 'relative'
            }}
            onClick={() => onNavigate?.('notifications')}
            >
              <Bell size={20} />
              <span style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'var(--color-red)',
                color: 'white',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                3
              </span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}
