"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitOnboarding } from '@/app/actions/onboarding'
import { CheckCircle2, User, Building, Briefcase, GraduationCap, Loader2 } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categorie, setCategorie] = useState('professionnel')

  const profiles = [
    { id: 'junior', label: 'Junior / Étudiant', icon: GraduationCap, desc: 'Vous débutez dans le secteur' },
    { id: 'professionnel', label: 'Professionnel', icon: User, desc: 'Vous êtes un acteur du secteur' },
    { id: 'senior', label: 'Expert / Senior', icon: Briefcase, desc: 'Vous avez une forte expérience' },
    { id: 'entreprise', label: 'Entreprise / Organisation', icon: Building, desc: 'Vous représentez une structure' },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    formData.set('categorie', categorie)

    const res = await submitOnboarding(formData)

    if (res.success) {
      router.push('/membres/dashboard')
    } else {
      setError(res.error || 'Erreur lors de l\'enregistrement.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 font-heading">
          Bienvenue sur agrolide !
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Complétez votre profil pour rejoindre l'annuaire public du réseau.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Choix du profil */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Quel est votre profil ? *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profiles.map((p) => {
                  const Icon = p.icon
                  const isSelected = categorie === p.id
                  return (
                    <div
                      key={p.id}
                      onClick={() => setCategorie(p.id)}
                      className={`cursor-pointer relative border rounded-xl p-4 flex flex-col items-center text-center transition-all ${
                        isSelected 
                          ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500' 
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-primary-600" />
                      )}
                      <Icon className={`w-8 h-8 mb-2 ${isSelected ? 'text-primary-600' : 'text-gray-400'}`} />
                      <span className={`font-semibold text-sm ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                        {p.label}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">{p.desc}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Spécialité */}
            <div>
              <label htmlFor="specialite" className="block text-sm font-medium text-gray-700">
                Spécialité / Fonction
              </label>
              <div className="mt-1">
                <input
                  id="specialite"
                  name="specialite"
                  type="text"
                  placeholder="Ex: Ingénieur Agronome, Consultant, etc."
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Biographie */}
            <div>
              <label htmlFor="biographie" className="block text-sm font-medium text-gray-700">
                Courte biographie
              </label>
              <div className="mt-1">
                <textarea
                  id="biographie"
                  name="biographie"
                  rows={3}
                  placeholder="Présentez-vous en quelques mots..."
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Terminer mon inscription'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
