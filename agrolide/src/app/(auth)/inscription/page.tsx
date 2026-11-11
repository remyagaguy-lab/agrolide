'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { ResendConfirmation } from '@/components/auth/ResendConfirmation'
import { AuthCard, buttonClass, inputClass, translateAuthError } from '@/components/auth/AuthCard'

export default function InscriptionPage() {
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error } = await createSupabaseBrowser().auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { prenom: form.prenom.trim(), nom: form.nom.trim(), full_name: `${form.prenom} ${form.nom}`.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setLoading(false)
    if (error) return setError(translateAuthError(error.message))
    // Supabase renvoie un utilisateur sans identité si l'e-mail existe déjà (anti-énumération).
    if (data.user && data.user.identities?.length === 0) {
      return setError(translateAuthError('already registered'))
    }
    setSent(true)
  }

  if (sent) {
    return (
      <AuthCard title="Vérifiez votre boîte e-mail" subtitle={`Un lien de confirmation a été envoyé à ${form.email}.`}>
        <p className="text-sm text-gray-600 text-center">
          Cliquez sur le lien pour activer votre compte (valable 15 minutes). Pensez à vérifier votre dossier spam.
        </p>
        <ResendConfirmation email={form.email} showInput={false} />
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Rejoindre le réseau"
      subtitle="Créez votre compte membre gratuitement"
      footer={<>Déjà membre ? <Link href="/login" className="font-semibold text-[#1b5e38]">Se connecter</Link></>}
    >
      <GoogleButton />
      <form onSubmit={onSubmit} className="space-y-5">
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="prenom" className="mb-1 block text-sm font-medium text-gray-700">Prénom</label>
            <input id="prenom" required autoComplete="given-name" value={form.prenom} onChange={set('prenom')} className={inputClass} />
          </div>
          <div>
            <label htmlFor="nom" className="mb-1 block text-sm font-medium text-gray-700">Nom</label>
            <input id="nom" required autoComplete="family-name" value={form.nom} onChange={set('nom')} className={inputClass} />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Adresse e-mail</label>
          <input id="email" type="email" required autoComplete="email" value={form.email} onChange={set('email')} className={inputClass} />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">Mot de passe (8 caractères min.)</label>
          <input id="password" type="password" required minLength={8} autoComplete="new-password" value={form.password} onChange={set('password')} className={inputClass} />
        </div>
        <button type="submit" disabled={loading} className={buttonClass}>{loading ? 'Création…' : 'Créer mon compte'}</button>
        <p className="text-center text-[12px] text-gray-500">
          En créant un compte, vous acceptez de recevoir notre newsletter « Parlons agriculture ». Vous pourrez vous désabonner à tout moment.
        </p>
      </form>
    </AuthCard>
  )
}
