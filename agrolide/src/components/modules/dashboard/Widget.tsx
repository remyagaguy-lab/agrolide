import * as React from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/Button"
import { cn } from "@/lib/utils/formatters"

/** Conteneur commun des widgets du tableau de bord : carte à bordure fine, en-tête et corps. */
export function Widget({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-card border border-outline-variant bg-surface-container-lowest shadow-elev-1",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const dots = { primary: "bg-primary", tertiary: "bg-tertiary", leaf: "bg-accent-leaf" } as const

export function WidgetHeader({
  title,
  count,
  tone = "primary",
  href,
  linkLabel,
}: {
  title: string
  count?: number
  tone?: keyof typeof dots
  href?: string
  linkLabel?: string
}) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-outline-variant px-5 py-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", dots[tone])} />
        <h2 className="truncate text-label-md uppercase tracking-wider text-on-surface">{title}</h2>
        {count ? (
          <span className="rounded-full bg-primary-container px-2 py-0.5 text-label-sm tabular-nums text-on-primary-container">{count}</span>
        ) : null}
      </div>
      {href && linkLabel && (
        <Link href={href} className={buttonVariants({ variant: "tonal", size: "sm", className: "shrink-0 text-label-md" })}>
          {linkLabel}
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
