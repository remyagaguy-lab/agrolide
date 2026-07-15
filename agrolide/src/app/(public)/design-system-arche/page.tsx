import React from 'react';

// Le composant SVG qui reproduit EXACTEMENT la géométrie de votre capture d'écran
const FormeLogoExacte = ({ className = "", width = "100%", height = "100%" }) => (
  <svg viewBox="0 0 200 120" className={className} width={width} height={height} xmlns="http://www.w3.org/2000/svg">
    {/* 1. L'arche verte extérieure */}
    {/* Elle n'a pas une base plate, elle est coupée par la courbe */}
    <path 
      d="M 12 90 
         A 90 90 0 0 1 185 80 
         Q 175 75 165 72
         A 75 75 0 0 0 25 80
         Q 18 85 12 90 Z" 
      fill="#297b41" 
    />

    {/* 2. Le soleil jaune intérieur */}
    {/* Base courbée qui suit la ligne des collines */}
    <path 
      d="M 35 77 
         A 63 63 0 0 1 155 70 
         Q 110 50 35 77 Z" 
      fill="#fcb726" 
    />
    
    {/* 3. La première colline verte (ligne épaisse en dessous du soleil) */}
    <path 
      d="M 5 95 
         Q 80 60 195 85
         Q 185 92 175 92
         Q 80 72 15 105 Z" 
      fill="#297b41" 
    />

    {/* 4. La deuxième colline verte (ligne fine tout en bas) */}
    <path 
      d="M 40 115 
         Q 90 90 190 98
         Q 185 103 175 104
         Q 90 98 45 120 Z" 
      fill="#297b41" 
    />
  </svg>
);

export default function DesignSystemFormeExacte() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-24">
        
        {/* En-tête */}
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-8">
            <FormeLogoExacte className="w-64" />
          </div>
          <h1 className="text-4xl font-extrabold text-[#297b41]">La Vraie Forme du Logo</h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
            Analyse : La base n'est pas plate. Elle est structurée par des courbes dynamiques ascendantes (évoquant des collines ou des sillons). Le soleil jaune vient se poser sur cette courbure. C'est ce dynamisme qui fait la force de votre marqueur !
          </p>
        </div>

        {/* Cas 1 : La Carte avec le motif en filigrane */}
        <section>
          <h2 className="text-2xl font-bold text-[#297b41] mb-8">1. L'Encart "Soleil Levant"</h2>
          <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
            {/* Forme du logo en arrière plan qui déborde */}
            <div className="absolute -top-12 -right-12 w-64 opacity-10 transform rotate-12">
               <FormeLogoExacte />
            </div>
            
            <div className="p-10 relative z-10">
              <div className="w-20 mb-6">
                <FormeLogoExacte />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Un Réseau Connecté</h3>
              <p className="text-gray-600 mb-8">
                Fédérer la chaîne de valeur agricole africaine grâce à des acteurs engagés et une vision commune.
              </p>
              <button className="text-[#297b41] font-bold flex items-center hover:text-[#fcb726] transition-colors">
                En savoir plus &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* Cas 2 : Le Séparateur de Section (La Colline) */}
        <section>
          <h2 className="text-2xl font-bold text-[#297b41] mb-8">2. La Transition Organique (Les Collines)</h2>
          <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-lg">
            <div className="bg-white p-12 text-center pb-20">
              <h3 className="text-3xl font-bold text-gray-900">Notre Impact</h3>
            </div>
            
            {/* Séparateur basé sur les courbes du logo */}
            <div className="relative h-24 w-full bg-[#297b41] mt-[-4rem]">
              <svg 
                className="absolute top-0 left-0 w-full h-full text-white" 
                viewBox="0 0 100 100" 
                preserveAspectRatio="none"
              >
                {/* On reprend la courbure de la colline du logo pour couper la section */}
                <path d="M 0 100 L 0 50 Q 50 10 100 60 L 100 100 Z" fill="#297b41" />
                <path d="M 0 50 Q 50 10 100 60 L 100 0 L 0 0 Z" fill="#ffffff" />
              </svg>
            </div>

            <div className="bg-[#297b41] p-12 text-center text-white">
              <div className="w-32 mx-auto mb-8 opacity-50">
                <FormeLogoExacte />
              </div>
              <p className="text-xl max-w-2xl mx-auto">
                La courbe sépare les sections de manière organique, rappelant les sillons des champs.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
