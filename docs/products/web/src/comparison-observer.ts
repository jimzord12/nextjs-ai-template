const OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0.2,
}

export function initComparisonObserver(): void {
  const rows = document.querySelectorAll<HTMLTableRowElement>(
    '.comparison-table tbody tr',
  )

  // Assign stagger index as custom property
  rows.forEach((row, i) => {
    row.style.setProperty('--i', String(i))
  })

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        for (const row of rows) {
          row.classList.add('is-visible')
        }
        observer.unobserve(entry.target)
      }
    }
  }, OBSERVER_OPTIONS)

  // Observe the table section itself, not individual rows
  const table = document.querySelector('.comparison-table')
  if (table) {
    observer.observe(table)
  }
}
