import { permanentRedirect } from 'next/navigation'

/** L'ancienne page « Actualités » est scindée : /evenements, /webinaires et /opportunites. */
export default function ActualitesPage() {
  permanentRedirect('/evenements')
}
