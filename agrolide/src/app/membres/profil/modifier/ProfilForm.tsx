"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Alert } from "@/components/ui/Alert"
import { useToast } from "@/components/ui/Toast"
import { Avatar } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { FormField } from "@/components/ui/FormField"
import { Input } from "@/components/ui/Input"
import { MultiSelect } from "@/components/ui/MultiSelect"
import { NativeSelect } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { uploadAvatarAction } from "@/app/actions/upload"
import { updateAvatarUrl, updateProfil } from "@/app/actions/profil"
import { CENTRES_INTERET_GROUPES, LANGUES, PAYS, PAYS_AUTRE, THEMATIQUES } from "@/lib/reseau/profil"
import { completionProfil } from "@/lib/reseau/profil-schema"

import { Camera, Save } from "@/components/ui/icons"
export interface ProfilInitial {
  prenom: string
  nom: string
  organisation: string
  specialite: string
  pays: string
  ville: string
  niveau_etudes: string
  biographie: string
  thematiques: string[]
  centres_interet: string[]
  langue_maternelle: string
  langues: string[]
  linkedin_url: string
  site_web_url: string
  photo_url: string
}

type Valeurs = Omit<ProfilInitial, "photo_url">

/** Liste proposée + valeurs déjà enregistrées hors liste (rien n'est perdu à l'enregistrement). */
const avecExistantes = (proposees: readonly string[], choisies: string[]) => [
  ...proposees,
  ...choisies.filter((c) => !proposees.includes(c)),
]

export function ProfilForm({ initial }: { initial: ProfilInitial }) {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const [valeurs, setValeurs] = React.useState<Valeurs>(() => {
    const { photo_url: _photo, ...reste } = initial
    return reste
  })
  const [photo, setPhoto] = React.useState(initial.photo_url)
  const [erreurs, setErreurs] = React.useState<Record<string, string>>({})
  const [erreurGenerale, setErreurGenerale] = React.useState("")
  const [pending, startTransition] = React.useTransition()
  const [envoiPhoto, setEnvoiPhoto] = React.useState(false)

  const maj = <K extends keyof Valeurs>(cle: K, valeur: Valeurs[K]) => {
    setValeurs((v) => ({ ...v, [cle]: valeur }))
  }

  const completion = completionProfil({ ...valeurs, photo_url: photo })
  const optionsPays = avecExistantes([...PAYS, PAYS_AUTRE], valeurs.pays ? [valeurs.pays] : [])

  const choisirPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const apercu = URL.createObjectURL(file)
    const ancienne = photo
    setPhoto(apercu)
    setEnvoiPhoto(true)
    setErreurGenerale("")
    try {
      const formData = new FormData()
      formData.append("photo", file)
      const res = await uploadAvatarAction(formData)
      if (!res.success || !res.url) throw new Error(res.error || "L’envoi de la photo a échoué.")
      setPhoto(res.url)
      await updateAvatarUrl(res.url)
    } catch (err) {
      setErreurGenerale(err instanceof Error && err.message ? err.message : "L’envoi de la photo a échoué.")
      setPhoto(ancienne)
    } finally {
      setEnvoiPhoto(false)
      URL.revokeObjectURL(apercu)
    }
  }

  const envoyer = (e: React.FormEvent) => {
    e.preventDefault()
    setErreurs({})
    setErreurGenerale("")
    startTransition(async () => {
      try {
        const res = await updateProfil(valeurs)
        if (res.success) {
          toast({ title: "Profil enregistré", description: "Vos modifications sont prises en compte.", variant: "success" })
          // Retour automatique à la fiche : le cache de la page est déjà invalidé côté serveur.
          router.push("/membres/profil")
        } else {
          setErreurs(res.champs ?? {})
          setErreurGenerale(res.error)
          const premiere = res.champs ? Object.keys(res.champs)[0] : undefined
          if (premiere) document.getElementById(`champ-${premiere}`)?.focus()
        }
      } catch {
        setErreurGenerale("L’enregistrement a échoué. Vérifiez votre connexion et réessayez.")
      }
    })
  }

  return (
    <form onSubmit={envoyer} noValidate className="flex flex-col gap-8">
      <div role="group" aria-labelledby="completion-titre" className="rounded-card border border-outline-variant bg-surface-container-low p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="completion-titre" className="text-title-sm text-on-surface">Profil complété</h2>
          <p className="text-title-sm text-on-surface">{completion.pourcentage} %</p>
        </div>
        <div
          role="progressbar"
          aria-valuenow={completion.pourcentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-labelledby="completion-titre"
          className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-container-high"
        >
          <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${completion.pourcentage}%` }} />
        </div>
        {completion.manquants.length > 0 ? (
          <p className="mt-2 text-body-sm text-on-surface-variant">À renseigner : {completion.manquants.join(", ")}.</p>
        ) : (
          <p className="mt-2 text-body-sm text-on-surface-variant">Tous les champs sont renseignés.</p>
        )}
      </div>

      <div aria-live="polite" className="empty:hidden">
        {erreurGenerale && <Alert variant="error">{erreurGenerale}</Alert>}
      </div>

      <div role="group" aria-labelledby="photo-titre" className="space-y-3">
        <h2 id="photo-titre" className="text-title-md text-on-surface">Photo de profil</h2>
        <div className="flex items-center gap-4">
          <Avatar src={photo || null} name={`${valeurs.prenom} ${valeurs.nom}`.trim() || undefined} size="xl" />
          <div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={choisirPhoto} className="sr-only" tabIndex={-1} aria-label="Choisir une photo" />
            <Button type="button" variant="outline" loading={envoiPhoto} onClick={() => fileInputRef.current?.click()}>
              <Camera className="size-5" aria-hidden />
              {photo ? "Changer la photo" : "Ajouter une photo"}
            </Button>
            <p className="mt-1.5 text-body-sm text-on-surface-muted">JPEG, PNG ou WebP, 2 Mo au maximum. La photo est enregistrée dès son envoi.</p>
          </div>
        </div>
      </div>

      <div role="group" aria-labelledby="identite-titre" className="space-y-4">
        <h2 id="identite-titre" className="text-title-md text-on-surface">Identité</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Prénom" required id="champ-prenom" error={erreurs.prenom}>
            <Input value={valeurs.prenom} onChange={(e) => maj("prenom", e.target.value)} autoComplete="given-name" maxLength={60} />
          </FormField>
          <FormField label="Nom" required id="champ-nom" error={erreurs.nom}>
            <Input value={valeurs.nom} onChange={(e) => maj("nom", e.target.value)} autoComplete="family-name" maxLength={60} />
          </FormField>
        </div>
        <FormField label="Métier ou fonction" id="champ-specialite" error={erreurs.specialite} hint="Ce que vous faites, avec vos mots (par exemple : ingénieur agronome, éleveur de volaille).">
          <Input value={valeurs.specialite} onChange={(e) => maj("specialite", e.target.value)} maxLength={100} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Entreprise ou organisation" id="champ-organisation" error={erreurs.organisation}>
            <Input value={valeurs.organisation} onChange={(e) => maj("organisation", e.target.value)} autoComplete="organization" maxLength={120} />
          </FormField>
          <FormField label="Niveau d’études" id="champ-niveau_etudes" error={erreurs.niveau_etudes}>
            <Input value={valeurs.niveau_etudes} onChange={(e) => maj("niveau_etudes", e.target.value)} maxLength={80} />
          </FormField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Pays" id="champ-pays" error={erreurs.pays}>
            <NativeSelect value={valeurs.pays} onChange={(e) => maj("pays", e.target.value)}>
              <option value="">Non précisé</option>
              {optionsPays.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </NativeSelect>
          </FormField>
          <FormField label="Ville" id="champ-ville" error={erreurs.ville}>
            <Input value={valeurs.ville} onChange={(e) => maj("ville", e.target.value)} autoComplete="address-level2" maxLength={80} />
          </FormField>
        </div>
        <FormField label="Biographie" id="champ-biographie" error={erreurs.biographie} hint={`Présentez-vous aux autres membres. ${valeurs.biographie.length} / 500 caractères.`}>
          <Textarea value={valeurs.biographie} onChange={(e) => maj("biographie", e.target.value)} maxLength={500} rows={5} />
        </FormField>
      </div>

      <div role="group" aria-labelledby="themes-titre" className="space-y-5">
        <div>
          <h2 id="themes-titre" className="text-title-md text-on-surface">Spécialités et centres d’intérêt</h2>
          <p className="mt-1 text-body-sm text-on-surface-muted">Ils apparaissent sur votre fiche et servent aux suggestions de membres.</p>
        </div>
        <FormField label="Vos spécialités" id="champ-thematiques" error={erreurs.thematiques} hint="Vos domaines de compétence. Plusieurs choix possibles.">
          <MultiSelect
            ariaLabel="Spécialités"
            placeholder="Choisir mes spécialités"
            value={valeurs.thematiques}
            onChange={(v) => maj("thematiques", v)}
            groupes={[{ options: avecExistantes(THEMATIQUES, valeurs.thematiques) }]}
          />
        </FormField>
        <FormField label="Centres d’intérêt" id="champ-centres_interet" error={erreurs.centres_interet} hint="Agriculture, mais aussi sport, musique, lecture, voyage… Ajoutez le vôtre s’il manque.">
          <MultiSelect
            ariaLabel="Centres d’intérêt"
            placeholder="Choisir mes centres d’intérêt"
            value={valeurs.centres_interet}
            onChange={(v) => maj("centres_interet", v)}
            groupes={CENTRES_INTERET_GROUPES}
            ajoutLibre="Un autre centre d’intérêt"
          />
        </FormField>
      </div>

      <div role="group" aria-labelledby="langues-titre" className="space-y-5">
        <div>
          <h2 id="langues-titre" className="text-title-md text-on-surface">Langues</h2>
          <p className="mt-1 text-body-sm text-on-surface-muted">Pour que le réseau sache dans quelle langue vous échanger le plus naturellement.</p>
        </div>
        <FormField label="Langue maternelle" id="champ-langue_maternelle" error={erreurs.langue_maternelle} hint="Choisissez dans la liste ou écrivez la vôtre (par exemple : Sérère, Éwé, Kikongo).">
          <Input
            value={valeurs.langue_maternelle}
            onChange={(e) => maj("langue_maternelle", e.target.value)}
            list="langues-proposees"
            maxLength={40}
            autoComplete="off"
            placeholder="Ex. : Wolof"
          />
          <datalist id="langues-proposees">
            {LANGUES.map((l) => (
              <option key={l} value={l} />
            ))}
          </datalist>
        </FormField>
        <FormField label="Autres langues parlées" id="champ-langues" error={erreurs.langues} hint="Plusieurs choix possibles. Ajoutez une langue absente de la liste.">
          <MultiSelect
            ariaLabel="Autres langues parlées"
            placeholder="Choisir les langues que je parle"
            value={valeurs.langues}
            onChange={(v) => maj("langues", v)}
            groupes={[{ options: LANGUES }]}
            ajoutLibre="Une autre langue"
          />
        </FormField>
      </div>

      <div role="group" aria-labelledby="liens-titre" className="space-y-4">
        <h2 id="liens-titre" className="text-title-md text-on-surface">Liens</h2>
        <FormField label="Profil LinkedIn" id="champ-linkedin_url" error={erreurs.linkedin_url} hint="Adresse complète commençant par https://">
          <Input type="url" inputMode="url" value={valeurs.linkedin_url} onChange={(e) => maj("linkedin_url", e.target.value)} maxLength={300} placeholder="https://www.linkedin.com/in/…" />
        </FormField>
        <FormField label="Site web" id="champ-site_web_url" error={erreurs.site_web_url} hint="Adresse complète commençant par https://">
          <Input type="url" inputMode="url" value={valeurs.site_web_url} onChange={(e) => maj("site_web_url", e.target.value)} maxLength={300} placeholder="https://…" />
        </FormField>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-outline-variant pt-6 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" href="/membres/profil">Annuler</Button>
        <Button type="submit" variant="secondary" loading={pending} disabled={envoiPhoto}>
          <Save className="size-5" aria-hidden />
          Enregistrer mon profil
        </Button>
      </div>
    </form>
  )
}
