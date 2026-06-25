import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { Loader2 } from "lucide-react"

export function Spinner({ className, ...props }: React.ComponentProps<typeof Loader2>) {
  return (
    <Loader2
      className={cn("h-4 w-4 animate-spin text-[var(--color-vert-principal)]", className)}
      {...props}
    />
  )
}
