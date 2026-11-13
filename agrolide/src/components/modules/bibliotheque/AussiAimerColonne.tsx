import Link from 'next/link'
import { DOMAINES_VISUELS, DOMAINE_PAR_DEFAUT } from '@/components/modules/bibliotheque/DocumentCard'
import { labelType, labelDomaine } from '@/lib/bibliotheque/taxonomie'

export type DocSuggere = { id: string; titre: string; type_doc: string; thematique: string; domaine?: string | null }

/** « Vous aimerez peut-être aussi » : colonne à droite sur ordinateur, bande défilante sous le lecteur sur téléphone. */
export function AussiAimerColonne({ docs, mode = 'public' }: { docs: DocSuggere[]; mode?: 'membre' | 'public' }) {
  if (docs.length === 0) return null
  return (
    <section aria-label="Vous aimerez peut-être aussi">
      <h2 className="mb-3 text-title-md font-bold text-on-surface">Vous aimerez peut-être aussi</h2>
      <ul className="flex snap-x gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        {docs.map((d) => {
          const { Icone, fond } = (d.domaine && DOMAINES_VISUELS[d.domaine]) || DOMAINE_PAR_DEFAUT
          return (
            <li key={d.id} className="w-[70%] shrink-0 snap-start sm:w-[45%] lg:w-auto">
              <Link
                href={`${mode === 'membre' ? '/membres' : ''}/bibliotheque/${d.id}`}
                className="group flex h-full min-h-14 items-start gap-3 rounded-card border border-outline-variant bg-surface-container-lowest p-3 transition-[border-color,box-shadow] duration-150 ease-standard hover:border-primary hover:shadow-elev-1"
              >
                <span className={`flex size-10 shrink-0 items-center justify-center rounded-control ${fond}`}>
                  <Icone className="size-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="line-clamp-2 block text-label-lg font-bold text-on-surface transition-colors group-hover:text-primary">{d.titre}</span>
                  <span className="mt-1 block text-label-md text-on-surface-variant">
                    {labelType(d.type_doc)} · {d.domaine ? labelDomaine(d.domaine) : d.thematique}
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
