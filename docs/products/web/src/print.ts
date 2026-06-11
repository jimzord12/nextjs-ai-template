export function initPrint(): void {
  const printBtn = document.querySelector<HTMLButtonElement>('#print-btn')
  if (!printBtn) return

  printBtn.addEventListener('click', () => {
    // Expand all wa-details accordions before printing
    document.querySelectorAll('wa-details').forEach((el) => {
      el.setAttribute('open', '')
    })

    requestAnimationFrame(() => {
      window.print()
    })
  })
}
