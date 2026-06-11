/**
 * Sticky CTA — shows floating contact button after hero exits viewport,
 * hides when footer enters viewport.
 */

export function initStickyCta(): void {
  const hero = document.querySelector('.hero')
  const footer = document.querySelector('.site-footer')
  const stickyCta = document.getElementById('sticky-cta')

  if (!hero || !footer || !stickyCta) return

  const heroObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (!entry) return
      if (!entry.isIntersecting) {
        stickyCta.classList.add('is-visible')
      } else {
        stickyCta.classList.remove('is-visible')
      }
    },
    { threshold: 0 },
  )

  const footerObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (!entry) return
      if (entry.isIntersecting) {
        stickyCta.classList.remove('is-visible')
      }
    },
    { threshold: 0 },
  )

  heroObserver.observe(hero)
  footerObserver.observe(footer)
}
