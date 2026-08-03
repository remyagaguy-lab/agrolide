import { SignUp } from "@clerk/nextjs"

export const metadata = { title: "Inscription - Agrolide" }

export default function InscriptionPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 items-center">
      <div className="w-full max-w-md flex flex-col items-center">
        <SignUp routing="hash" signInUrl="/login" fallbackRedirectUrl="/membres/dashboard" />
        <p className="mt-6 text-center text-[13px] text-gray-500 max-w-[360px]">
          En créant un compte, vous acceptez de recevoir notre newsletter « Parlons agriculture ». Vous pourrez vous désabonner à tout moment.
        </p>
      </div>
    </div>
  )
}
