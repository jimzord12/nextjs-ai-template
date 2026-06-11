import {
  allDefined,
  setBasePath,
} from '@awesome.me/webawesome/dist/webawesome.js'
import './wa.js'
import { initComparisonObserver } from './comparison-observer.js'
import type { Lang } from './i18n.js'
import { initLang, setLang, updateLangToggle } from './i18n.js'
import { initPrint } from './print.js'
import { initQuiz } from './quiz.js'
import { initScrollSpy } from './scroll-spy.js'
import { initTcoBars } from './tco-bars.js'
import type { Theme } from './theme.js'
import { initTheme, toggleTheme } from './theme.js'

void (async () => {
  // Required: tells WA where to find icon/asset files
  setBasePath('/assets/webawesome')

  // Init theme and language BEFORE removing cloak to avoid flash
  initTheme()
  initLang()

  // Wait for all wa-* elements to register before removing cloak
  await allDefined()

  // Remove FOUCE cloak
  document.documentElement.classList.remove('wa-cloak')

  // Init scroll spy for tier sections
  initScrollSpy()

  initTcoBars()
  initComparisonObserver()
  initQuiz()
  initPrint()

  // Wire up toggle buttons
  const themeBtn = document.querySelector<HTMLButtonElement>('#theme-toggle')
  if (themeBtn) {
    const isDark =
      document.documentElement.getAttribute('data-theme') === 'dark'
    themeBtn.setAttribute('aria-pressed', String(isDark))
    themeBtn.setAttribute(
      'aria-label',
      isDark ? 'Switch to light mode' : 'Switch to dark mode',
    )
    themeBtn.addEventListener('click', () => {
      const next: Theme = toggleTheme()
      themeBtn.setAttribute('aria-pressed', String(next === 'dark'))
      themeBtn.setAttribute(
        'aria-label',
        next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
      )
    })
  }

  document
    .querySelectorAll<HTMLButtonElement>('[data-lang-toggle]')
    .forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang-toggle') as Lang
        if (lang === 'gr' || lang === 'en') {
          setLang(lang)
          updateLangToggle(lang)
        }
      })
    })
})()
