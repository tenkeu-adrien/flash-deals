'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface DealCardProps {
  id: string;
  badge?: string;
  endDate: Date | string | any; // Date de fin pour le chronomètre
  icon: string;
  title: string;
  rating: string;
  originalPrice: number;
  currentPrice: number;
  discount: string;
  stock: { current: number; total: number };
  delivery: string;
  location: string;
  interested: number;
  onAction?: (campaignId: string) => void;
  actionLabel?: string;
}

export default function DealCard({
  id,
  badge,
  endDate,
  icon,
  title,
  rating,
  originalPrice,
  currentPrice,
  discount,
  stock,
  delivery,
  location,
  interested,
  onAction,
  actionLabel = "Je m'inscris pour acheter →",
}: DealCardProps) {
  const stockPercentage = (stock.current / stock.total) * 100;
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Fonction pour calculer le temps restant
  const calculateTimeRemaining = () => {
    let end: Date;
    
    if (endDate && typeof endDate === 'object' && 'toDate' in endDate) {
      // C'est un Timestamp Firebase
      end = (endDate as any).toDate();
    } else {
      // C'est déjà une Date ou une string
      end = new Date(endDate);
    }
    
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expiré';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Mettre à jour le chronomètre en temps réel
  useEffect(() => {
    if (!endDate) return;
    
    const updateTimer = () => {
      setTimeRemaining(calculateTimeRemaining());
    };
    
    // Mettre à jour immédiatement
    updateTimer();
    
    // Mettre à jour toutes les secondes
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [endDate]);

  // Calcul initial
  useEffect(() => {
    if (endDate) {
      setTimeRemaining(calculateTimeRemaining());
    }
  }, [endDate]);

  return (
    <Card>
      <div style={{ position: 'relative' }}>
        {badge && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: 'var(--color-orange)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 'bold',
            zIndex: 10
          }}>
            {badge}
          </div>
        )}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'var(--color-orange)',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 'bold',
          backdropFilter: 'blur(10px)'
        }}>
          ⏰ {timeRemaining || 'Chargement...'}
        </div>
        <div style={{
          width: '100%',
          height: '280px',
          background: 'linear-gradient(to bottom, #2a2a2a, #1a1a1a)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px'
        }}>
          {icon}
        </div>
      </div>
      
      <div style={{ padding: 'var(--spacing-md)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{title}</h2>
        <div style={{ color: '#FFD700', fontSize: '14px', marginBottom: '12px' }}>{rating}</div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span style={{ textDecoration: 'line-through', color: 'var(--color-gray-medium)', fontSize: '16px' }}>
            {originalPrice.toLocaleString()} XAF
          </span>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-orange)' }}>
            {currentPrice.toLocaleString()} XAF
          </span>
          <span style={{ 
            backgroundColor: 'var(--color-red)', 
            color: 'white', 
            padding: '4px 8px', 
            borderRadius: '4px', 
            fontSize: '14px', 
            fontWeight: 'bold' 
          }}>
            {discount}
          </span>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-medium)', marginBottom: '4px' }}>
            📦 Reste {stock.current} produits en stock
          </p>
          <div style={{ 
            width: '100%', 
            height: '8px', 
            backgroundColor: '#333', 
            borderRadius: '4px', 
            overflow: 'hidden' 
          }}>
            <div style={{
              height: '100%',
              width: `${stockPercentage}%`,
              background: 'linear-gradient(90deg, var(--color-orange) 0%, var(--color-red) 100%)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        <div style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--color-gray-medium)' }}>
          🚚 Livraison: {delivery}<br />
          📍 {location}
        </div>

        <Button variant="primary" size="block" onClick={() => onAction?.(id)}>
          {actionLabel}
        </Button>

        <div style={{ 
          fontSize: '13px', 
          color: 'var(--color-gray-dark)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px', 
          marginTop: '12px' 
        }}>
          ♥️ {interested} personnes intéressées
        </div>
      </div>
    </Card>
  );
}
