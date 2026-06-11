export function initTcoBars(): void {
  const rows = document.querySelectorAll<HTMLElement>('.tco-bar-row')
  if (rows.length === 0) return

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-animated')

          const amounts = (
            entry.target as HTMLElement
          ).querySelectorAll<HTMLElement>('.tco-amount')
          for (const el of amounts) {
            const raw =
              el.textContent
                ?.replace(/[^\d.,]/g, '')
                .replace(/\./g, '')
                .replace(',', '.') ?? ''
            const target = parseFloat(raw)
            if (!Number.isNaN(target)) {
              if (reducedMotion) {
                el.textContent = `€${target.toLocaleString('el-GR')}`
              } else {
                animateCounter(el, target)
              }
            }
          }

          observer.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.3 },
  )

  for (const row of rows) {
    observer.observe(row)
  }
}

function animateCounter(
  element: HTMLElement,
  target: number,
  duration = 1200,
): void {
  const start = performance.now()
  const format = (n: number) => `€${n.toLocaleString('el-GR')}`

  function tick(now: number): void {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - (1 - progress) ** 3
    const current = Math.round(target * eased)
    element.textContent = format(current)
    if (progress < 1) requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}
