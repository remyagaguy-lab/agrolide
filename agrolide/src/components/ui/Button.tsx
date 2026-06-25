import * as React from "react"
import { cn } from "@/lib/utils/formatters"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "outline" | "ghost";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const variants = {
      primary: "bg-[var(--color-vert-principal)] text-[var(--color-blanc)] hover:opacity-90",
      accent: "bg-[var(--color-orange-accent)] text-[var(--color-blanc)] hover:opacity-90",
      outline: "border-2 border-[var(--color-vert-principal)] text-[var(--color-vert-principal)] hover:bg-[var(--color-vert-principal)] hover:text-[var(--color-blanc)]",
      ghost: "text-[var(--color-gris-texte)] hover:bg-[var(--color-gris-clair)]",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-heading font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-vert-principal)] disabled:pointer-events-none disabled:opacity-50 min-h-[48px] px-6 py-2",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
