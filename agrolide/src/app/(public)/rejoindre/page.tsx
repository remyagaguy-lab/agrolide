import { Metadata } from "next"
import PricingSection from "./PricingSection"

export const metadata: Metadata = {
  title: "Adhésion - Rejoindre le Réseau",
  description: "Rejoignez agrolide, le premier réseau agricole africain. Connectez-vous avec des experts, participez à des événements et accédez à des ressources exclusives pour développer votre activité.",
  alternates: { canonical: '/rejoindre' }
}

export default function RejoindrePage() {
  return <PricingSection />
}
