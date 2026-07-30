import { SignIn } from "@clerk/nextjs"

export const metadata = { title: "Connexion - Agrolide" }

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 items-center">
      <SignIn routing="hash" signUpUrl="/inscription" fallbackRedirectUrl="/membres/dashboard" />
    </div>
  )
}
