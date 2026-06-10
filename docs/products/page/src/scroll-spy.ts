const TIER_COUNT = 5
const OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0.3,
  rootMargin: '-20% 0px -60% 0px',
}

function sectionId(index: number): string {
  return `tier-${index}`
}

function pillSelector(index: number): string {
  return `.tier-nav__pill[data-tier="${index}"]`
}

export function initScrollSpy(): void {
  const sections: Element[] = []
  const pills: (HTMLElement | null)[] = []
  let activePill: HTMLElement | null = null

  for (let i = 1; i <= TIER_COUNT; i++) {
    const section = document.getElementById(sectionId(i))
    if (section) sections.push(section)
    pills.push(document.querySelector(pillSelector(i)))
  }

  // Highlight the pill matching the currently intersecting section
  function setActive(section: Element): void {
    const idx = sections.indexOf(section) + 1
    const pill = pills[idx - 1]
    if (!pill) return

    if (activePill && activePill !== pill) {
      activePill.classList.remove('tier-nav__pill--active')
    }
    pill.classList.add('tier-nav__pill--active')
    activePill = pill
  }

  // Observe each tier section for visibility
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        setActive(entry.target)
      }
    }
  }, OBSERVER_OPTIONS)

  for (const section of sections) {
    observer.observe(section)
  }

  // Pill click → smooth scroll to corresponding section
  for (let i = 0; i < pills.length; i++) {
    const pill = pills[i]
    if (!pill) continue

    pill.addEventListener('click', (e) => {
      e.preventDefault()
      const section = document.getElementById(sectionId(i + 1))
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
}
