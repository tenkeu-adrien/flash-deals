'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const cards = [
    {
      href: '/client',
      icon: '📱',
      title: 'Interface Client',
      description: 'Découvrez des deals à prix cassés avec des réductions jusqu\'à -70%. Achetez vos produits préférés en quelques clics.',
    },
    {
      href: '/vendeur',
      icon: '🏪',
      title: 'Interface Vendeur',
      description: 'Créez des campagnes flash pour écouler vos stocks rapidement. Boostez vos ventes en 24-48h.',
    },
    {
      href: '/admin',
      icon: '🔐',
      title: 'Interface Admin',
      description: 'Gérez la plateforme, modérez les campagnes et suivez les performances en temps réel.',
    },
  ];

  const features = [
    { icon: '⚡', title: 'Deals Flash 24-48h', description: 'Campagnes limitées dans le temps avec stock visible en temps réel' },
    { icon: '💰', title: 'Réductions Massives', description: 'Économisez jusqu\'à 70% sur vos produits préférés' },
    { icon: '📊', title: 'Dashboard Vendeur', description: 'Suivez vos ventes et performances en temps réel' },
    { icon: '🚚', title: 'Livraison Rapide', description: 'Livraison à Douala et Yaoundé sous 24-48h' },
    { icon: '📱', title: 'Mobile Money', description: 'Paiement sécurisé via MTN et Orange Money' },
    { icon: '🔒', title: 'Sécurisé', description: 'Transactions protégées et données cryptées' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-[#1a0a00] text-white flex items-center justify-center p-5">
      <div className="max-w-[1200px] w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-15"
        >
          <div className="text-6xl mb-5  ">🔥</div>
          <h1 className="text-5xl mb-4 bg-gradient-to-r from-orange to-red bg-clip-text text-transparent font-bold">
            Flash Deals Cameroun
          </h1>
          <p className="text-xl text-gray-medium  ">
            Plateforme E-commerce de Deals Flash
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-15">
          {cards.map((card, index) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={card.href}>
                <motion.div
                  whileHover={{ y: -8, borderColor: '#FF6600', boxShadow: '0 12px 40px rgba(255, 102, 0, 0.3)' }}
                  className="bg-gradient-to-br from-bg-medium to-bg-dark border-2 border-[#333] rounded-2xl p-10 text-center cursor-pointer transition-all duration-300"
                >
                  <div className="text-[80px] mb-6">{card.icon}</div>
                  <h2 className="text-[28px] font-bold mb-3">{card.title}</h2>
                  <p className="text-base text-gray-medium mb-6 leading-relaxed">
                    {card.description}
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-block bg-orange text-white px-8 py-3.5 rounded-lg font-semibold text-base"
                  >
                    Accéder →
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-bg-medium border border-[#333] rounded-2xl p-10 mb-10"
        >
          <h2 className="text-[32px] mb-8 text-center text-orange">
            ✨ Fonctionnalités Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="text-[32px] flex-shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="text-lg mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-gray-medium leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center pt-10 border-t border-[#333] text-gray-dark"
        >
          <div className="flex justify-center gap-8 mb-6 flex-wrap">
            <a href="/doc" className="text-gray-medium hover:text-orange transition-colors">
              📖 Documentation
            </a>
            <a href="#" className="text-gray-medium hover:text-orange transition-colors">
              🚀 Guide de démarrage
            </a>
            <a href="#" className="text-gray-medium hover:text-orange transition-colors">
              💡 À propos
            </a>
            <a href="#" className="text-gray-medium hover:text-orange transition-colors">
              📞 Contact
            </a>
          </div>
          <p>© 2026 Flash Deals Cameroun - Tous droits réservés</p>
          <p className="mt-2 text-xs">Version 1.0.0 - Prototype de démonstration</p>
        </motion.div>
      </div>
    </div>
  );
}
