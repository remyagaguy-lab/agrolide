"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Download, Lock } from "@/components/ui/icons"
import { formationsPourCodes, genererLot, listerCodes, listerReponsesInscription, supprimerCode, type CodeAcces, type ReponseInscription } from "@/app/actions/codes-acces"

const champ = "min-h-11 w-full rounded-lg border border-outline bg-surface-container-lowest px-3 text-body-md text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
const date = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("fr-FR") : "")

function statut(c: CodeAcces) {
  if (c.utilisePar) return { texte: `Utilisé par ${c.utilisePar}, le ${date(c.utiliseLe)}`, classe: "bg-info-container text-on-info-container" }
  if (c.expireLe && c.expireLe <= new Date().toISOString()) return { texte: "Expiré", classe: "bg-surface-container text-on-surface-variant" }
  return { texte: "Disponible", classe: "bg-success-container text-on-success-container" }
}

export default function CodesAccesPage() {
  const [codes, setCodes] = useState<CodeAcces[]>([])
  const [reponses, setReponses] = useState<ReponseInscription[]>([])
  const [formations, setFormations] = useState<{ id: string; titre: string }[]>([])
  const [lot, setLot] = useState("")
  const [formationId, setFormationId] = useState("")
  const [nombre, setNombre] = useState(10)
  const [expireLe, setExpireLe] = useState("")
  const [filtre, setFiltre] = useState("")
  const [message, setMessage] = useState("")
  const [occupe, setOccupe] = useState(false)

  const charger = useCallback(async () => {
    const [c, f, r] = await Promise.all([listerCodes(), formationsPourCodes(), listerReponsesInscription()])
    setCodes(c)
    setReponses(r)
    setFormations(f)
  }, [])
  useEffect(() => { charger().catch(() => setMessage("Chargement impossible.")) }, [charger])

  const lots = useMemo(() => [...new Set(codes.map((c) => c.lot).filter((l): l is string => !!l))], [codes])
  const visibles = codes.filter((c) => !filtre || c.lot === filtre)
  const disponibles = visibles.filter((c) => !c.utilisePar && !(c.expireLe && c.expireLe <= new Date().toISOString()))

  const generer = async (e: React.FormEvent) => {
    e.preventDefault()
    setOccupe(true)
    setMessage("")
    try {
      const r = await genererLot({ lot, formationId: formationId || null, nombre, expireLe: expireLe || null })
      setMessage(`${r.nombre} codes générés pour « ${lot.trim()} ».`)
      setFiltre(lot.trim())
      await charger()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Génération impossible.")
    } finally {
      setOccupe(false)
    }
  }

  const copier = async () => {
    await navigator.clipboard.writeText(disponibles.map((c) => c.code).join("\n"))
    setMessage(`${disponibles.length} codes disponibles copiés.`)
  }

  const exporter = () => {
    const lignes = [["code", "challenge", "formation", "expire_le", "statut"], ...visibles.map((c) => [c.code, c.lot ?? "", c.formationTitre ?? "Toutes les formations agrolide", date(c.expireLe), statut(c).texte])]
    const csv = lignes.map((l) => l.map((v) => `"${v.replace(/"/g, '""')}"`).join(";")).join("\n")
    const a = document.createElement("a")
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }))
    a.download = `codes-acces${filtre ? `-${filtre}` : ""}.csv`
    a.click()
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <Link href="/admin/contenus/formations" className="text-label-md font-medium text-success hover:underline">Formations</Link>
        <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold text-on-surface"><Lock className="size-6" aria-hidden />Codes d&apos;accès</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Un code donne accès à une formation agrolide. Il est à usage unique : une fois utilisé, il est lié au membre. À remettre aux participants sélectionnés lors d&apos;un challenge.
        </p>
      </div>

      <form onSubmit={generer} className="grid gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm md:grid-cols-2">
        <label className="space-y-1 text-label-lg font-bold text-on-surface">Nom du challenge
          <input required value={lot} onChange={(e) => setLot(e.target.value)} placeholder="Ex. Challenge lancement" className={champ} />
        </label>
        <label className="space-y-1 text-label-lg font-bold text-on-surface">Formation concernée
          <select value={formationId} onChange={(e) => setFormationId(e.target.value)} className={champ}>
            <option value="">Toutes les formations agrolide</option>
            {formations.map((f) => <option key={f.id} value={f.id}>{f.titre}</option>)}
          </select>
        </label>
        <label className="space-y-1 text-label-lg font-bold text-on-surface">Nombre de codes (1 à 200)
          <input type="number" min={1} max={200} required value={nombre} onChange={(e) => setNombre(Number(e.target.value))} className={champ} />
        </label>
        <label className="space-y-1 text-label-lg font-bold text-on-surface">Date limite d&apos;utilisation (facultative)
          <input type="date" value={expireLe} onChange={(e) => setExpireLe(e.target.value)} className={champ} />
        </label>
        <div className="md:col-span-2">
          <button type="submit" disabled={occupe} className="min-h-12 rounded-lg bg-tertiary px-7 font-heading font-bold text-on-tertiary transition-colors hover:bg-accent-sun disabled:opacity-70">
            {occupe ? "Génération…" : "Générer les codes"}
          </button>
        </div>
      </form>

      {message ? <p role="status" className="text-sm font-medium text-on-surface">{message}</p> : null}

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <select aria-label="Filtrer par challenge" value={filtre} onChange={(e) => setFiltre(e.target.value)} className={`${champ} max-w-xs`}>
            <option value="">Tous les challenges</option>
            {lots.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <p className="text-sm text-on-surface-variant">{visibles.length} codes, dont {disponibles.length} disponibles</p>
          <button type="button" onClick={copier} disabled={!disponibles.length} className="min-h-11 rounded-lg border border-outline px-4 text-sm font-bold text-on-surface disabled:opacity-50">Copier les codes disponibles</button>
          <button type="button" onClick={exporter} disabled={!visibles.length} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-outline px-4 text-sm font-bold text-on-surface disabled:opacity-50"><Download className="size-4" aria-hidden />Exporter en CSV</button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-outline-variant bg-surface-container-low">
              <tr>
                {["Code", "Challenge", "Formation", "Limite", "Statut", ""].map((t, i) => <th key={i} className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-on-surface-muted">{t}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {visibles.map((c) => {
                const s = statut(c)
                return (
                  <tr key={c.id}>
                    <td className="px-4 py-3 font-mono tracking-wider text-on-surface">{c.code}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{c.lot}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{c.formationTitre ?? "Toutes"}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{date(c.expireLe)}</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${s.classe}`}>{s.texte}</span></td>
                    <td className="px-4 py-3 text-right">
                      {!c.utilisePar && (
                        <button type="button" onClick={async () => { await supprimerCode(c.id); await charger() }} className="min-h-11 px-2 text-xs font-medium text-error hover:underline">Supprimer</button>
                      )}
                    </td>
                  </tr>
                )
              })}
              {visibles.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-on-surface-variant">Aucun code pour l&apos;instant.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-title-md font-bold text-on-surface">Réponses au questionnaire d&apos;inscription</h2>
        {reponses.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">Aucune réponse pour l&apos;instant.</p>
        ) : (
          <ul className="space-y-3">
            {reponses.map((r) => (
              <li key={r.id} className="space-y-1 rounded-card border border-outline-variant bg-surface-container-lowest p-4 text-body-sm">
                <p className="font-bold text-on-surface">{r.membre} · {r.formationTitre ?? "Formation"} · {date(r.le)}</p>
                <p className="text-on-surface-variant">Projet : {r.projet === "oui" ? "en cours" : r.projet === "idee" ? "idée" : "aucun"} · Domaine : {r.domaine}</p>
                <p className="text-on-surface-variant">Objectif : {r.objectif}</p>
                <p className="text-on-surface-variant">Attentes : {r.attentes}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
