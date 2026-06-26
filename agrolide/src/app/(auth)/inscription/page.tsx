"use client"
import { Suspense } from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { UserPlus, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react"

// Zod schema for Step A
const inscriptionSchema = z.object({
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe"),
  pays: z.string().min(1, "Le pays est requis"),
  ville: z.string().optional(),
  categorie: z.string().min(1, "La catégorie est requise"),
  specialite: z.string().min(1, "La spécialité est requise"),
  cgu: z.boolean().refine(val => val === true, {
    message: "Vous devez accepter les conditions générales d'utilisation"
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

type InscriptionForm = z.infer<typeof inscriptionSchema>

const paysAfricains = [
  "Afrique du Sud", "Algérie", "Angola", "Bénin", "Botswana", "Burkina Faso", "Burundi", "Cameroun", "Cap-Vert", "République centrafricaine", "Tchad", "Comores", "Congo", "République démocratique du Congo", "Djibouti", "Égypte", "Guinée équatoriale", "Érythrée", "Eswatini", "Éthiopie", "Gabon", "Gambie", "Ghana", "Guinée", "Guinée-Bissau", "Côte d'Ivoire", "Kenya", "Lesotho", "Liberia", "Libye", "Madagascar", "Malawi", "Mali", "Mauritanie", "Maurice", "Maroc", "Mozambique", "Namibie", "Niger", "Nigeria", "Rwanda", "Sao Tomé-et-Principe", "Sénégal", "Seychelles", "Sierra Leone", "Somalie", "Soudan du Sud", "Soudan", "Tanzanie", "Togo", "Tunisie", "Ouganda", "Zambie", "Zimbabwe"
]

const paysAutres = ["France", "Belgique", "Suisse", "Canada", "États-Unis", "Autre"]

const specialites = [
  "Productions végétales", "Élevage", "Agritech", "Agroéconomie", "Transformation", "Marché", "Financement", "Formation", "Autre"
]

function InscriptionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlCategory = searchParams?.get('categorie')
  const initialCategory = urlCategory === 'junior' || urlCategory === 'professionnel' ? urlCategory : ''

  const [step, setStep] = useState<1 | 2>(1)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger, getValues } = useForm<InscriptionForm>({
    resolver: zodResolver(inscriptionSchema),
    defaultValues: {
      categorie: initialCategory,
    }
  })

  const watchPassword = watch("password")
  const watchCategory = watch("categorie")

  useEffect(() => {
    if (!watchPassword) {
      setPasswordStrength(0)
      return
    }
    let strength = 0
    if (watchPassword.length >= 8) strength += 33
    if (/[A-Z]/.test(watchPassword)) strength += 33
    if (/[0-9]/.test(watchPassword)) strength += 34
    setPasswordStrength(strength)
  }, [watchPassword])

  const nextStep = async () => {
    const isValid = await trigger(["prenom", "nom", "email", "password", "confirmPassword", "pays", "categorie", "specialite", "cgu"])
    if (isValid) {
      setStep(2)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    setStep(1)
  }

  const onSubmit = async (data: InscriptionForm) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: authError, data: authData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/callback`,
          data: {
            prenom: data.prenom,
            nom: data.nom,
            pays: data.pays,
            ville: data.ville || "",
            categorie: data.categorie,
            specialite: data.specialite
          }
        }
      })

      if (authError) {
        console.error("Erreur d'inscription Supabase :", authError)
        
        let errorMsg = "Une erreur est survenue lors de l'inscription."
        if (authError?.message) errorMsg = authError.message
        else if ((authError as any)?.msg) errorMsg = (authError as any).msg
        else if (typeof authError === 'string') errorMsg = authError
        
        if (errorMsg.toLowerCase().includes("already registered") || errorMsg.toLowerCase().includes("already exists")) {
          errorMsg = "Un compte existe déjà avec cette adresse email."
        }
        
        if (errorMsg === "{}" || errorMsg === "[object Object]") {
          errorMsg = "Erreur de la base de données. Le profil n'a pas pu être créé (Trigger)."
        }
        
        setError(errorMsg)
        setIsLoading(false)
        return
      }

      // Redirige vers la page d'attente avec l'email dans l'url (ou le state)
      router.push(`/inscription/attente?email=${encodeURIComponent(data.email)}`)
    } catch (err: any) {
      console.error("Exception inattendue :", err)
      let catchMsg = "Délai d'attente dépassé ou erreur réseau. Veuillez réessayer."
      if (err?.message) catchMsg = err.message
      else if (typeof err === 'string') catchMsg = err
      
      if (catchMsg === "{}") catchMsg = "Erreur de connexion inattendue."
      
      setError(catchMsg)
      setIsLoading(false)
    }
  }

  const getCotisation = (cat: string) => {
    if (cat === "junior") return "5 000 FCFA / an"
    if (cat === "professionnel") return "15 000 FCFA / an"
    return "Sur devis"
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="flex justify-center text-[var(--color-vert-principal)] mb-6">
          <UserPlus size={48} />
        </div>
        <h2 className="text-center text-3xl font-heading font-extrabold text-gray-900">
          Créer votre compte
        </h2>
        
        {/* Progress bar */}
        <div className="mt-8 mb-8">
          <div className="flex items-center justify-between relative">
            <div className="w-full absolute top-1/2 -z-10 h-1 bg-gray-200 -translate-y-1/2"></div>
            <div className={`absolute top-1/2 -z-10 h-1 bg-[var(--color-vert-principal)] -translate-y-1/2 transition-all duration-300 ${step === 2 ? 'w-full' : 'w-0'}`}></div>
            
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step >= 1 ? 'bg-[var(--color-vert-principal)] border-[var(--color-vert-principal)] text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
              1
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors duration-300 ${step === 2 ? 'bg-[var(--color-vert-principal)] border-[var(--color-vert-principal)] text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm font-medium text-gray-500">
            <span>Informations personnelles</span>
            <span>Confirmation</span>
          </div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-sm border border-[var(--color-gris-clair)] sm:rounded-2xl sm:px-10">
          
          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 text-[#d32f2f] text-sm rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                    <Input {...register("prenom")} className={errors.prenom ? "border-red-500" : ""} />
                    {errors.prenom && <p className="mt-1 text-xs text-[#d32f2f]">{errors.prenom.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                    <Input {...register("nom")} className={errors.nom ? "border-red-500" : ""} />
                    {errors.nom && <p className="mt-1 text-xs text-[#d32f2f]">{errors.nom.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <Input type="email" {...register("email")} className={errors.email ? "border-red-500" : ""} />
                  {errors.email && <p className="mt-1 text-xs text-[#d32f2f]">{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                    <Input type="password" {...register("password")} className={errors.password ? "border-red-500" : ""} />
                    {/* Indicateur de force */}
                    {watchPassword && watchPassword.length > 0 && (
                      <div className="mt-2 flex h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${passwordStrength <= 33 ? 'bg-red-500' : passwordStrength <= 66 ? 'bg-orange-500' : 'bg-green-500'}`} 
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                    )}
                    {errors.password && <p className="mt-1 text-xs text-[#d32f2f]">{errors.password.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer mot de passe *</label>
                    <Input type="password" {...register("confirmPassword")} className={errors.confirmPassword ? "border-red-500" : ""} />
                    {errors.confirmPassword && <p className="mt-1 text-xs text-[#d32f2f]">{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pays de résidence *</label>
                    <select 
                      {...register("pays")} 
                      className={`w-full h-12 px-4 rounded-md border ${errors.pays ? "border-red-500" : "border-[var(--color-gris-clair)]"} bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-vert-principal)] text-gray-700`}
                    >
                      <option value="">Sélectionnez votre pays</option>
                      <optgroup label="Pays Africains">
                        {paysAfricains.map(p => <option key={p} value={p}>{p}</option>)}
                      </optgroup>
                      <optgroup label="Reste du monde">
                        {paysAutres.map(p => <option key={p} value={p}>{p}</option>)}
                      </optgroup>
                    </select>
                    {errors.pays && <p className="mt-1 text-xs text-[#d32f2f]">{errors.pays.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                    <Input {...register("ville")} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie de membre *</label>
                    <select 
                      {...register("categorie")} 
                      className={`w-full h-12 px-4 rounded-md border ${errors.categorie ? "border-red-500" : "border-[var(--color-gris-clair)]"} bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-vert-principal)] text-gray-700`}
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      <option value="junior">Junior</option>
                      <option value="professionnel">Professionnel</option>
                      <option value="partenaire" disabled>Partenaire (Veuillez nous contacter)</option>
                      <option value="senior" disabled>Sénior (Veuillez nous contacter)</option>
                    </select>
                    {errors.categorie && <p className="mt-1 text-xs text-[#d32f2f]">{errors.categorie.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité principale *</label>
                    <select 
                      {...register("specialite")} 
                      className={`w-full h-12 px-4 rounded-md border ${errors.specialite ? "border-red-500" : "border-[var(--color-gris-clair)]"} bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-vert-principal)] text-gray-700`}
                    >
                      <option value="">Sélectionnez une spécialité</option>
                      {specialites.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.specialite && <p className="mt-1 text-xs text-[#d32f2f]">{errors.specialite.message}</p>}
                  </div>
                </div>

                <div className="flex items-start mt-6">
                  <div className="flex items-center h-5">
                    <input
                      id="cgu"
                      type="checkbox"
                      {...register("cgu")}
                      className="w-4 h-4 text-[var(--color-vert-principal)] border-gray-300 rounded focus:ring-[var(--color-vert-principal)]"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="cgu" className="font-medium text-gray-700">
                      J'accepte les conditions générales d'utilisation *
                    </label>
                    {errors.cgu && <p className="mt-1 text-xs text-[#d32f2f]">{errors.cgu.message}</p>}
                  </div>
                </div>

                <div className="pt-6">
                  <Button type="button" variant="primary" className="w-full flex justify-center items-center gap-2" onClick={nextStep}>
                    Continuer <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="bg-[#E8F3EB] border border-green-200 rounded-xl p-6 text-center">
                  <CheckCircle className="mx-auto text-[var(--color-vert-principal)] mb-4" size={48} />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Récapitulatif de votre adhésion</h3>
                  <div className="bg-white rounded-lg p-4 mt-4 inline-block text-left shadow-sm min-w-[250px]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500">Catégorie :</span>
                      <span className="font-bold text-gray-900 capitalize">{watchCategory}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                      <span className="text-gray-500">Cotisation annuelle :</span>
                      <span className="font-bold text-[var(--color-vert-principal)]">{getCotisation(watchCategory)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-gray-600 bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <p>
                    <strong>Important :</strong> Vous allez recevoir un email de confirmation. 
                    Après vérification de votre email, vous serez redirigé(e) vers le paiement de votre cotisation pour activer définitivement votre compte.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button type="button" variant="outline" className="w-full sm:w-1/3 flex justify-center items-center gap-2" onClick={prevStep}>
                    <ArrowLeft size={18} /> Retour
                  </Button>
                  <Button type="submit" variant="primary" className="w-full sm:w-2/3" disabled={isLoading}>
                    {isLoading ? "Création en cours..." : "Créer mon compte"}
                  </Button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-8 text-center text-sm text-[var(--color-gris-texte)]">
            Déjà membre ?{" "}
            <Link href="/login" className="font-medium text-[var(--color-vert-principal)] hover:text-green-700">
              Connectez-vous ici
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InscriptionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center">Chargement...</div>}>
      <InscriptionContent />
    </Suspense>
  )
}
