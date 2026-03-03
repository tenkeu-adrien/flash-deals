'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import VendorHeader from '@/components/vendeur/Header';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const stats = [
    { value: '12,456', label: 'Clients actifs' },
    { value: '45.2M', label: 'XAF de GMV' },
    { value: '1,234', label: 'Commandes/mois' },
    { value: '8.7%', label: 'Taux conversion' },
  ];

  const features = [
    {
      icon: '⚡',
      title: 'Création rapide',
      description: 'Créez une campagne flash en moins de 5 minutes avec notre interface intuitive',
    },
    {
      icon: '📊',
      title: 'Dashboard complet',
      description: 'Suivez vos ventes, revenus et performances en temps réel avec des analytics détaillées',
    },
    {
      icon: '💰',
      title: 'Commission transparente',
      description: 'Seulement 15-20% de commission. Pas de frais cachés, paiement sous 7 jours',
    },
    {
      icon: '🚀',
      title: 'Boost instantané',
      description: 'Accédez à des milliers de clients prêts à acheter. Écoulez vos stocks en 24-48h',
    },
    {
      icon: '📱',
      title: 'Mobile Money intégré',
      description: 'Paiements sécurisés via MTN et Orange Money. Gestion automatique des transactions',
    },
    {
      icon: '🎯',
      title: 'Support dédié',
      description: 'Une équipe à votre écoute pour vous accompagner dans votre réussite',
    },
  ];

  return (
    <div>
      <VendorHeader onNavigate={onNavigate} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-bg-medium to-black px-6 py-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl mb-4 font-bold bg-gradient-to-r from-orange to-red bg-clip-text text-transparent"
        >
          🚀 BOOSTEZ VOS VENTES EN 24-48H
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-medium mb-8 max-w-[700px] mx-auto"
        >
          Écoulez vos stocks à prix réduits devant des milliers de clients camerounais prêts à acheter
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button variant="primary" size="large" onClick={() => onNavigate('signup')}>
            Créer ma première campagne gratuitement
          </Button>
        </motion.div>
        <div className="flex justify-center gap-6 mt-6 text-sm flex-wrap">
          <span>✅ Sans engagement</span>
          <span>✅ Configuration en 5 min</span>
          <span>✅ Support gratuit</span>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-bg-medium p-6 rounded-[12px] text-center border border-[#333]"
            >
              <div className="text-4xl font-bold text-orange mb-2">{stat.value}</div>
              <div className="text-sm text-gray-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-12 bg-bg-dark">
        <h2 className="text-3xl font-bold text-center mb-12">
          Pourquoi choisir Flash Deals ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, borderColor: '#FF6600' }}
              className="bg-bg-medium p-6 rounded-[12px] border border-[#333] transition-all"
            >
              <div className="text-[40px] mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-medium text-[15px]">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 text-center bg-gradient-to-r from-orange to-red">
        <h2 className="text-3xl font-bold mb-4">Prêt à booster vos ventes ?</h2>
        <p className="text-lg mb-8 opacity-90">
          Rejoignez des centaines de commerçants qui font confiance à Flash Deals
        </p>
        <Button variant="secondary" size="large" onClick={() => onNavigate('signup')}>
          Devenir Partenaire →
        </Button>
      </section>
    </div>
  );
}
