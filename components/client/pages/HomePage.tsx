'use client';

import DealCard from '@/components/client/DealCard';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const steps = [
    { icon: '1️⃣', title: 'Inscrivez-vous gratuitement', description: 'Créez votre compte en 2 minutes avec votre numéro de téléphone' },
    { icon: '2️⃣', title: 'Découvrez les deals', description: 'Parcourez les offres flash disponibles pendant 24-48h seulement' },
    { icon: '3️⃣', title: 'Commandez rapidement', description: 'Ajoutez au panier et payez en toute sécurité' },
    { icon: '4️⃣', title: 'Recevez chez vous', description: 'Livraison rapide à Douala et Yaoundé sous 24-48h' },
  ];

  const testimonials = [
    { name: 'Marie Ngo', role: 'Cliente à Douala', text: 'J\'ai économisé 120 000 XAF sur mon smartphone ! Service rapide et fiable.' },
    { name: 'Jean Kamga', role: 'Client à Yaoundé', text: 'Les deals sont vraiment incroyables. J\'ai acheté 3 produits la semaine dernière.' },
    { name: 'Fatima B.', role: 'Cliente à Douala', text: 'Livraison ultra rapide et produits authentiques. Je recommande à 100%!' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Deals à Prix Cassés 🔥</h1>
        <p className="hero-subtitle">Économisez jusqu'à 70% sur vos produits préférés</p>

        <DealCard
          id="deal-1"
          badge="NOUVEAU"
          timer="14h 23min"
          icon="📱"
          title="Samsung Galaxy A54 - Noir 128GB"
          rating="⭐⭐⭐⭐⭐ 4.8/5 (127 avis)"
          originalPrice={245000}
          currentPrice={145000}
          discount="-41%"
          stock={{ current: 23, total: 50 }}
          delivery="2 000 XAF"
          location="Disponible à Douala & Yaoundé"
          interested={234}
          onAction={() => onNavigate('signup')}
        />
      </section>

      {/* How it works */}
      <section className="section" style={{ backgroundColor: 'var(--bg-dark)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
          <h2 className="section-title">✅ Comment ça marche</h2>
        </div>
        <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div style={{ fontSize: '24px', flexShrink: 0 }}>{step.icon}</div>
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--color-gray-medium)' }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
          <h2 className="section-title">💬 Ils nous font confiance</h2>
        </div>
        <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--color-orange), var(--color-red))' 
                }} />
                <div>
                  <h4 style={{ fontSize: '15px', marginBottom: '2px' }}>{testimonial.name}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--color-gray-medium)' }}>{testimonial.role}</p>
                </div>
              </div>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-gray-light)', fontStyle: 'italic' }}>
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--color-orange)' }}>À propos</h3>
            <ul style={{ listStyle: 'none' }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: 'var(--color-gray-medium)', textDecoration: 'none', fontSize: '14px', transition: 'var(--transition)' }}>
                  Qui sommes-nous
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: 'var(--color-gray-medium)', textDecoration: 'none', fontSize: '14px', transition: 'var(--transition)' }}>
                  Comment ça marche
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: 'var(--color-gray-medium)', textDecoration: 'none', fontSize: '14px', transition: 'var(--transition)' }}>
                  Devenir vendeur
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--color-orange)' }}>Support</h3>
            <ul style={{ listStyle: 'none' }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: 'var(--color-gray-medium)', textDecoration: 'none', fontSize: '14px', transition: 'var(--transition)' }}>
                  Centre d'aide
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: 'var(--color-gray-medium)', textDecoration: 'none', fontSize: '14px', transition: 'var(--transition)' }}>
                  Contact
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#" style={{ color: 'var(--color-gray-medium)', textDecoration: 'none', fontSize: '14px', transition: 'var(--transition)' }}>
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--color-orange)' }}>Suivez-nous</h3>
            <div style={{ display: 'flex', gap: '24px', fontSize: '24px' }}>
              <span>📘</span>
              <span>📷</span>
              <span>🐦</span>
            </div>
          </div>
        </div>
        <div style={{ 
          marginTop: '32px', 
          paddingTop: '16px', 
          borderTop: '1px solid #333', 
          textAlign: 'center', 
          fontSize: '13px', 
          color: 'var(--color-gray-dark)' 
        }}>
          <p>© 2026 Flash Deals Cameroun. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
