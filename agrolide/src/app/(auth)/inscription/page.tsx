import { SignUp } from "@clerk/nextjs"

export const metadata = { title: "Inscription - Agrolide" }

export default function InscriptionPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 items-center">
      <SignUp routing="hash" signInUrl="/login" />
    </div>
  )
}
