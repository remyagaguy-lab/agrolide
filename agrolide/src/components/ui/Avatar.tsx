import * as React from "react"
import { cn } from "@/lib/utils/formatters"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  initials?: string;
}

export function Avatar({ className, src, initials, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[var(--color-gris-clair)] border border-[var(--color-gris-moyen)]",
        className
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt="Avatar"
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-sm font-medium text-[var(--color-gris-texte)] uppercase">
          {initials?.substring(0, 2) || "U"}
        </span>
      )}
    </div>
  )
}
