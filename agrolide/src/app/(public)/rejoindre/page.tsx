import { Metadata } from "next"
import PricingSection from "./PricingSection"

export const metadata: Metadata = {
  title: "Adhésion | agrolide",
  description: "Choisissez votre profil dans le réseau continental de l'agriculture africaine.",
}

export default function RejoindrePage() {
  return <PricingSection />
}
