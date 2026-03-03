import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-red-500 text-gray-800">
      
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Construisez votre application moderne
          </h1>
          <p className="mt-6 text-lg md:text-xl text-indigo-100">
            React, TailwindCSS, Firebase, PWA. 
            Une base solide pour un projet scalable.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition">
              Commencer
            </button>
            <button className="border border-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition">
              En savoir plus
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pourquoi cette stack ?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-4">⚡ Performance</h3>
              <p className="text-gray-600">
                Tailwind permet un design rapide et optimisé sans surcharge CSS inutile.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-4">🔥 Firebase Ready</h3>
              <p className="text-gray-600">
                Authentification, base de données temps réel et hosting intégrés.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-4">📱 PWA Compatible</h3>
              <p className="text-gray-600">
                Transformez votre site en application installable en quelques étapes.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold">
            Prêt à passer au niveau supérieur ?
          </h2>
          <p className="mt-4 text-gray-400">
            Lance ton projet aujourd’hui et construis quelque chose de durable.
          </p>

          <button className="mt-8 bg-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
            Créer mon projet
          </button>
        </div>
      </section>

    </div>
  );
}