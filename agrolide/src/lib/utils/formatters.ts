import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * Fusion de classes Tailwind qui connaît les jetons du design system
 * (tailles de texte par rôle, formes et élévations nommées), pour que
 * `text-body-md` ne soit pas pris pour une couleur et que les surcharges fonctionnent.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-lg", "display-md", "headline-lg", "headline-md", "headline-sm",
            "title-lg", "title-md", "title-sm", "body-lg", "body-md", "body-sm",
            "label-lg", "label-md", "label-sm",
          ],
        },
      ],
      rounded: [{ rounded: ["tag", "control", "card", "panel", "sheet"] }],
      shadow: [{ shadow: ["elev-1", "elev-2", "elev-3", "elev-4"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
