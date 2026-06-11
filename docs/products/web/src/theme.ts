export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

export function getTheme(): Theme {
  let stored: string | null = null
  try {
    stored = localStorage.getItem(STORAGE_KEY)
  } catch {
    /* storage unavailable */
  }
  if (stored === 'dark' || stored === 'light') return stored
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function setTheme(theme: Theme): void {
  const el = document.documentElement
  el.setAttribute('data-theme', theme)
  if (theme === 'dark') {
    el.classList.add('wa-dark')
  } else {
    el.classList.remove('wa-dark')
  }
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* storage unavailable */
  }
}

export function toggleTheme(): Theme {
  const next = getTheme() === 'dark' ? 'light' : 'dark'
  setTheme(next)
  return next
}

export function initTheme(): void {
  setTheme(getTheme())

  const mq = matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', (e) => {
    // Only auto-switch when user has no explicit localStorage preference
    let hasPref = false
    try {
      hasPref = !!localStorage.getItem(STORAGE_KEY)
    } catch {
      /* storage unavailable */
    }
    if (!hasPref) {
      setTheme(e.matches ? 'dark' : 'light')
    }
  })
}
