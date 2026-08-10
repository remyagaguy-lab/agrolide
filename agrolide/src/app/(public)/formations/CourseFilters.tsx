'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Filter, X } from 'lucide-react';

export default function CourseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    router.push(`?${createQueryString(name, value)}`);
  };

  const clearFilters = () => {
    router.push('?');
  };

  const source = searchParams.get('source') || '';
  const niveau = searchParams.get('niveau') || '';
  const prix = searchParams.get('prix') || '';

  const hasFilters = source || niveau || prix;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6 md:hidden">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Filter size={20} className="text-[#1b5e38]" /> Filtres
        </h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500">
          {isOpen ? <X size={24} /> : <Filter size={24} />}
        </button>
      </div>

      <div className={`md:block ${isOpen ? 'block' : 'hidden'}`}>
        <div className="mb-6 hidden md:flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Filter size={20} className="text-[#1b5e38]" /> Filtres
          </h2>
          {hasFilters && (
            <button 
              onClick={clearFilters}
              className="text-sm text-[#f99e1d] font-medium hover:underline flex items-center gap-1"
            >
              <X size={14} /> Effacer
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Source */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Source</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="source" 
                  checked={source === ''} 
                  onChange={() => handleFilterChange('source', '')}
                  className="text-[#1b5e38] focus:ring-[#1b5e38]"
                />
                Toutes les sources
              </label>
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="source" 
                  checked={source === 'Agrolide'} 
                  onChange={() => handleFilterChange('source', 'Agrolide')}
                  className="text-[#1b5e38] focus:ring-[#1b5e38]"
                />
                Agrolide
              </label>
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="source" 
                  checked={source === 'FAO elearning Academy'} 
                  onChange={() => handleFilterChange('source', 'FAO elearning Academy')}
                  className="text-[#1b5e38] focus:ring-[#1b5e38]"
                />
                FAO
              </label>
            </div>
          </div>

          <div className="h-px bg-gray-100"></div>

          {/* Niveau */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Niveau</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="niveau" 
                  checked={niveau === ''} 
                  onChange={() => handleFilterChange('niveau', '')}
                  className="text-[#1b5e38] focus:ring-[#1b5e38]"
                />
                Tous niveaux
              </label>
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="niveau" 
                  checked={niveau === 'Débutant'} 
                  onChange={() => handleFilterChange('niveau', 'Débutant')}
                  className="text-[#1b5e38] focus:ring-[#1b5e38]"
                />
                Débutant
              </label>
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="niveau" 
                  checked={niveau === 'Intermédiaire'} 
                  onChange={() => handleFilterChange('niveau', 'Intermédiaire')}
                  className="text-[#1b5e38] focus:ring-[#1b5e38]"
                />
                Intermédiaire
              </label>
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="niveau" 
                  checked={niveau === 'Avancé'} 
                  onChange={() => handleFilterChange('niveau', 'Avancé')}
                  className="text-[#1b5e38] focus:ring-[#1b5e38]"
                />
                Avancé
              </label>
            </div>
          </div>

          <div className="h-px bg-gray-100"></div>

          {/* Prix */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Accès</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="prix" 
                  checked={prix === ''} 
                  onChange={() => handleFilterChange('prix', '')}
                  className="text-[#1b5e38] focus:ring-[#1b5e38]"
                />
                Tous
              </label>
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="prix" 
                  checked={prix === 'gratuit'} 
                  onChange={() => handleFilterChange('prix', 'gratuit')}
                  className="text-[#1b5e38] focus:ring-[#1b5e38]"
                />
                Gratuit
              </label>
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <input 
                  type="radio" 
                  name="prix" 
                  checked={prix === 'payant'} 
                  onChange={() => handleFilterChange('prix', 'payant')}
                  className="text-[#1b5e38] focus:ring-[#1b5e38]"
                />
                Payant
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
