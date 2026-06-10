export type Lang = 'gr' | 'en'

export const i18n: Record<Lang, Record<string, string>> = {
  gr: {
    'site.title': 'Ο Οδηγός της Ιστοσελίδας',
    'site.titleShort': 'Οδηγός',

    'header.langGr': 'Ελληνικά',
    'header.langEn': 'English',
    'header.themeLight': 'Φωτεινό',
    'header.themeDark': 'Σκοτεινό',

    'hero.eyebrow': 'Για επιχειρηματίες που θέλουν να καταλάβουν',
    'hero.headline': 'Γιατί μια ιστοσελίδα δεν είναι απλώς… μια ιστοσελίδα.',

    'hero.card.left.title': 'Αυτοκίνητο πόλης',
    'hero.card.left.price': '~€10.000',
    'hero.card.left.bullet1': 'Πάει από το Α στο Β',
    'hero.card.left.bullet2': 'Κλιματισμός, ραδιόφωνο, ηλεκτρικά παράθυρα',
    'hero.card.left.bullet3': 'Δεν εντυπωσιάζει κανέναν',

    'hero.card.right.title': 'BMW Σειρά 3',
    'hero.card.right.price': '~€40.000',
    'hero.card.right.bullet1': 'Άνεση, ασφάλεια, τεχνολογία',
    'hero.card.right.bullet2': 'Εμπιστοσύνη και κύρος στον δρόμο',
    'hero.card.right.bullet3': 'Σε αντιπροσωπείες και πελάτες',

    'hero.bridge':
      'Αυτή η λογική ισχύει ακριβώς το ίδιο για τις ιστοσελίδες. Ορίστε τα πέντε επίπεδα.',
  },
  en: {
    'site.title': 'The Website Tiers Guide',
    'site.titleShort': 'Guide',

    'header.langGr': 'Ελληνικά',
    'header.langEn': 'English',
    'header.themeLight': 'Light',
    'header.themeDark': 'Dark',

    'hero.eyebrow': 'For business owners who want to understand',
    'hero.headline': 'Why a website is not just… a website.',

    'hero.card.left.title': 'City hatchback',
    'hero.card.left.price': '~€10,000',
    'hero.card.left.bullet1': 'Gets you from A to B',
    'hero.card.left.bullet2': 'A/C, radio, power windows',
    'hero.card.left.bullet3': 'Impresses absolutely no one',

    'hero.card.right.title': 'BMW 3 Series',
    'hero.card.right.price': '~€40,000',
    'hero.card.right.bullet1': 'Comfort, safety, technology',
    'hero.card.right.bullet2': 'Trust and presence on the road',
    'hero.card.right.bullet3': 'From dealers and clients alike',

    'hero.bridge':
      'This same logic applies exactly to websites. Here are the five tiers.',
  },
}

export function getLang(): Lang {
  const hash = location.hash.match(/(?:^|#)lang=(gr|en)(?:&|$)/)
  if (hash) return hash[1] as Lang

  const stored = localStorage.getItem('lang')
  if (stored === 'gr' || stored === 'en') return stored

  return 'gr'
}

export function setLang(lang: Lang): void {
  document.documentElement.setAttribute('data-lang', lang)

  const keys = i18n[lang]
  for (const el of document.querySelectorAll<HTMLElement>('[data-i18n]')) {
    const key = el.dataset.i18n
    if (key) {
      const value = keys?.[key]
      if (value !== undefined) el.textContent = value
    }
  }

  localStorage.setItem('lang', lang)
  history.replaceState(null, '', `#lang=${lang}`)

  updateLangToggle(lang)
}

export function updateLangToggle(lang: Lang): void {
  for (const btn of document.querySelectorAll<HTMLElement>(
    '[data-lang-toggle]',
  )) {
    const isPressed = btn.dataset.langToggle === lang
    btn.setAttribute('aria-pressed', String(isPressed))
  }
}

export function initLang(): void {
  setLang(getLang())
}
