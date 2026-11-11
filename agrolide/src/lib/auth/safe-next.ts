/** N'autorise que des chemins internes (anti « open redirect »). */
export function safeNext(value: string | null | undefined, fallback = '/membres/dashboard') {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return fallback
  return value
}
