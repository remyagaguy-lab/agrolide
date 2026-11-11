'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (id?: string) => void
      remove: (id?: string) => void
    }
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

/** True quand Turnstile est configuré (clé de site présente) : les formulaires attendent alors le jeton. */
export const turnstileEnabled = !!SITE_KEY

/**
 * Widget Cloudflare Turnstile (anti-bot). Ne rend rien si NEXT_PUBLIC_TURNSTILE_SITE_KEY est absente.
 * Les jetons sont à usage unique : changer `resetSignal` (ex. isSubmitting) redemande un jeton.
 */
export function Turnstile({ onToken, resetSignal }: { onToken: (token: string) => void; resetSignal?: unknown }) {
  const ref = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | undefined>(undefined)
  const cb = useRef(onToken)
  cb.current = onToken

  useEffect(() => {
    if (!SITE_KEY || !ref.current) return
    let cancelled = false

    const render = () => {
      if (cancelled || !ref.current || !window.turnstile || widgetId.current) return
      widgetId.current = window.turnstile.render(ref.current, {
        sitekey: SITE_KEY,
        callback: (t: string) => cb.current(t),
        'expired-callback': () => cb.current(''),
        'error-callback': () => cb.current(''),
      })
    }

    if (window.turnstile) {
      render()
    } else {
      let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
      if (!script) {
        script = document.createElement('script')
        script.src = SCRIPT_SRC
        script.async = true
        document.head.appendChild(script)
      }
      script.addEventListener('load', render)
    }

    return () => {
      cancelled = true
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current)
      widgetId.current = undefined
    }
  }, [])

  useEffect(() => {
    if (widgetId.current && window.turnstile) {
      cb.current('')
      window.turnstile.reset(widgetId.current)
    }
  }, [resetSignal])

  if (!SITE_KEY) return null
  return <div ref={ref} className="my-4" />
}
