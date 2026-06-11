export function initTcoBars(): void {
  const rows = document.querySelectorAll<HTMLElement>('.tco-bar-row')
  if (rows.length === 0) return

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-animated')
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
