/**
 * Thème clair / sombre / système.
 *
 * Fonctionnement : <html data-theme="light|dark"> est posé avant le premier rendu par un script en ligne
 * (aucun flash). Les jetons de src/styles/tokens/generated.css basculent sur [data-theme='dark'].
 *
 * DARK_MODE_ENABLED : la migration vers les jetons est complète ; le mode sombre est actif, avec la bascule
 * Clair / Sombre / Système (ThemeToggle) dans l'en-tête public et le menu du compte.
 */
export const DARK_MODE_ENABLED = true

export const THEME_STORAGE_KEY = 'agrolide-theme'
export type ThemePreference = 'light' | 'dark' | 'system'

/** Script exécuté dans <head> avant l'hydratation. Ne dépend de rien d'autre. */
export const themeInitScript = `(function(){try{var e=${DARK_MODE_ENABLED ? 'true' : 'false'};var d=document.documentElement;var p=localStorage.getItem('${THEME_STORAGE_KEY}')||'system';var t='light';if(e){t=p==='dark'||(p==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'}d.setAttribute('data-theme',t)}catch(_){document.documentElement.setAttribute('data-theme','light')}})();`

export function readThemePreference(): ThemePreference {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY)
    return v === 'light' || v === 'dark' ? v : 'system'
  } catch {
    return 'system'
  }
}

export function applyThemePreference(pref: ThemePreference) {
  try {
    if (pref === 'system') localStorage.removeItem(THEME_STORAGE_KEY)
    else localStorage.setItem(THEME_STORAGE_KEY, pref)
  } catch {
    /* stockage indisponible : la préférence ne sera pas mémorisée */
  }
  const dark = DARK_MODE_ENABLED && (pref === 'dark' || (pref === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches))
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
}
