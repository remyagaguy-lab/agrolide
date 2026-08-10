"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function EnrollButton({ 
  formationId, 
  firstLeconId, 
  isEnrolled,
  isLoggedIn 
}: { 
  formationId: string; 
  firstLeconId: string;
  isEnrolled: boolean;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/formations/${formationId}`);
      return;
    }

    if (isEnrolled) {
      router.push(`/learn/${formationId}/${firstLeconId}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/formations/${formationId}/enroll`, {
        method: "POST",
      });
      if (res.ok) {
        router.push(`/learn/${formationId}/${firstLeconId}`);
        router.refresh();
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
        ? "Se connecter pour commencer" 
        : isEnrolled 
          ? "Reprendre la formation" 
          : "S'inscrire et commencer"}
    </button>
  );
}
