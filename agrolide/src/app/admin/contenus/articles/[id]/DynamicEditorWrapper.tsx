"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "@/components/ui/icons"
export const ArticleEditorForm = dynamic(
  () => import("./ArticleEditorForm").then(mod => mod.ArticleEditorForm),
  { ssr: false, loading: () => <div className="flex justify-center p-12"><Loader2 className="animate-spin size-6 text-on-surface-muted" /></div> }
)
