export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

export function getTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
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
  localStorage.setItem(STORAGE_KEY, theme)
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
    if (!localStorage.getItem(STORAGE_KEY)) {
      setTheme(e.matches ? 'dark' : 'light')
    }
  })
}
