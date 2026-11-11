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

  const thematique = searchParams.get('thematique') || '';

  const hasFilters = source || niveau || prix || thematique;

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-6">
      <div className="flex items-center justify-between mb-6 md:hidden">
        <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
          <Filter size={20} className="text-primary" /> Filtres
        </h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-on-surface-muted">
          {isOpen ? <X size={24} /> : <Filter size={24} />}
        </button>
      </div>

      <div className={`md:block ${isOpen ? 'block' : 'hidden'}`}>
        <div className="mb-6 hidden md:flex items-center justify-between">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <Filter size={20} className="text-primary" /> Filtres
          </h2>
          {hasFilters && (
            <button 
              onClick={clearFilters}
              className="text-sm text-on-tertiary-container font-medium hover:underline flex items-center gap-1"
            >
              <X size={14} /> Effacer
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Thématique */}
          <div>
            <h3 className="font-semibold text-on-surface mb-3 text-sm uppercase tracking-wider">Thématique</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-on-surface-variant cursor-pointer">
                <input 
                  type="radio" 
                  name="thematique" 
                  checked={!searchParams.get('thematique')} 
                  onChange={() => handleFilterChange('thematique', '')}
                  className="text-primary focus:ring-primary"
                />
                Toutes les thématiques
              </label>
              {[
                "Agrobusiness",
                "Production Animale",
                "Production Végétale",
                "Financement",
                "Agroécologie",
                "Gestion des Sols"
              ].map((theme) => (
                <label key={theme} className="flex items-center gap-2 text-on-surface-variant cursor-pointer">
                  <input 
                    type="radio" 
                    name="thematique" 
                    checked={searchParams.get('thematique') === theme} 
                    onChange={() => handleFilterChange('thematique', theme)}
                    className="text-primary focus:ring-primary"
                  />
                  {theme}
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-surface-container"></div>

          {/* Source */}
          <div>
            <h3 className="font-semibold text-on-surface mb-3 text-sm uppercase tracking-wider">Source</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-on-surface-variant cursor-pointer">
                <input 
                  type="radio" 
                  name="source" 
                  checked={source === ''} 
                  onChange={() => handleFilterChange('source', '')}
                  className="text-primary focus:ring-primary"
                />
                Toutes les sources
              </label>
              <label className="flex items-center gap-2 text-on-surface-variant cursor-pointer">
                <input 
                  type="radio" 
                  name="source" 
                  checked={source === 'Agrolide'} 
                  onChange={() => handleFilterChange('source', 'Agrolide')}
                  className="text-primary focus:ring-primary"
                />
                Agrolide
              </label>
              <label className="flex items-center gap-2 text-on-surface-variant cursor-pointer">
                <input 
                  type="radio" 
                  name="source" 
                  checked={source === 'FAO elearning Academy'} 
                  onChange={() => handleFilterChange('source', 'FAO elearning Academy')}
                  className="text-primary focus:ring-primary"
                />
                FAO
              </label>
              <label className="flex items-center gap-2 text-on-surface-variant cursor-pointer">
                <input 
                  type="radio" 
                  name="source" 
                  checked={source === 'FUN MOOC'} 
                  onChange={() => handleFilterChange('source', 'FUN MOOC')}
                  className="text-primary focus:ring-primary"
                />
                FUN MOOC
              </label>
            </div>
          </div>

          <div className="h-px bg-surface-container"></div>

          {/* Niveau */}
          <div>
            <h3 className="font-semibold text-on-surface mb-3 text-sm uppercase tracking-wider">Niveau</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-on-surface-variant cursor-pointer">
                <input 
                  type="radio" 
                  name="niveau" 
                  checked={niveau === ''} 
                  onChange={() => handleFilterChange('niveau', '')}
                  className="text-primary focus:ring-primary"
                />
                Tous niveaux
              </label>
              <label className="flex items-center gap-2 text-on-surface-variant cursor-pointer">
                <input 
                  type="radio" 
                  name="niveau" 
                  checked={niveau === 'Débutant'} 
                  onChange={() => handleFilterChange('niveau', 'Débutant')}
                  className="text-primary focus:ring-primary"
                />
                Débutant
              </label>
              <label className="flex items-center gap-2 text-on-surface-variant cursor-pointer">
                <input 
                  type="radio" 
                  name="niveau" 
                  checked={niveau === 'Intermédiaire'} 
                  onChange={() => handleFilterChange('niveau', 'Intermédiaire')}
                  className="text-primary focus:ring-primary"
                />
                Intermédiaire
              </label>
              <label className="flex items-center gap-2 text-on-surface-variant cursor-pointer">
                <input 
                  type="radio" 
                  name="niveau" 
                  checked={niveau === 'Avancé'} 
                  onChange={() => handleFilterChange('niveau', 'Avancé')}
                  className="text-primary focus:ring-primary"
                />
                Avancé
              </label>
            </div>
          </div>

          <div className="h-px bg-surface-container"></div>

          {/* Prix */}
          <div>
            <h3 className="font-semibold text-on-surface mb-3 text-sm uppercase tracking-wider">Accès</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-on-surface-variant cursor-pointer">
                <input 
                  type="radio" 
                  name="prix" 
                  checked={prix === ''} 
                  onChange={() => handleFilterChange('prix', '')}
                  className="text-primary focus:ring-primary"
                />
                Tous
              </label>
              <label className="flex items-center gap-2 text-on-surface-variant cursor-pointer">
                <input 
                  type="radio" 
                  name="prix" 
                  checked={prix === 'gratuit'} 
                  onChange={() => handleFilterChange('prix', 'gratuit')}
                  className="text-primary focus:ring-primary"
                />
                Gratuit
              </label>
              <label className="flex items-center gap-2 text-on-surface-variant cursor-pointer">
                <input 
                  type="radio" 
                  name="prix" 
                  checked={prix === 'payant'} 
                  onChange={() => handleFilterChange('prix', 'payant')}
                  className="text-primary focus:ring-primary"
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
