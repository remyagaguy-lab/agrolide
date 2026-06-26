"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

export const ArticleEditorForm = dynamic(
  () => import("./ArticleEditorForm").then(mod => mod.ArticleEditorForm),
  { ssr: false, loading: () => <div className="flex justify-center p-12"><Loader2 className="animate-spin w-8 h-8 text-gray-400" /></div> }
)
