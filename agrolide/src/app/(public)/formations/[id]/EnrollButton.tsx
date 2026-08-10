"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ExternalLink } from "lucide-react";

export function EnrollButton({ 
  formationId, 
  firstLeconId, 
  isEnrolled,
  isLoggedIn,
  isExternal = false,
  lienExterne = ""
}: { 
  formationId: string; 
  firstLeconId?: string;
  isEnrolled: boolean;
  isLoggedIn: boolean;
  isExternal?: boolean;
  lienExterne?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/formations/${formationId}`);
      return;
    }

    if (isEnrolled) {
      if (isExternal && lienExterne) {
        window.open(lienExterne, "_blank");
      } else if (firstLeconId) {
        router.push(`/learn/${formationId}/${firstLeconId}`);
      }
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/formations/${formationId}/enroll`, {
        method: "POST",
      });
      if (res.ok) {
        if (isExternal && lienExterne) {
          window.open(lienExterne, "_blank");
          router.refresh();
        } else if (firstLeconId) {
          router.push(`/learn/${formationId}/${firstLeconId}`);
          router.refresh();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleEnroll}
      disabled={loading}
      className="inline-flex items-center justify-center bg-[#f99e1d] hover:bg-[#fcb726] text-white font-heading font-[700] text-[15px] px-[28px] py-[12px] rounded-lg transition-colors min-h-[48px] disabled:opacity-70"
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!isLoggedIn 
        ? (isExternal ? "Se connecter pour accéder" : "Se connecter pour commencer")
        : isEnrolled 
          ? (isExternal ? "Accéder à la formation" : "Reprendre la formation")
          : (isExternal ? "S'inscrire et accéder" : "S'inscrire et commencer")}
      
      {isExternal && <ExternalLink className="ml-2 w-5 h-5 inline" />}
    </button>
  );
}

