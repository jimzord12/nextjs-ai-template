import { getLang, i18n, type Lang } from './i18n.js'

// ── Constants ──────────────────────────────────────────────────────────
const QUESTION_COUNT = 4
const AUTO_ADVANCE_MS = 400
const WEIGHTS = [1.0, 1.5, 1.3, 1.2] as const
const TOTAL_WEIGHT = WEIGHTS.reduce((s, w) => s + w, 0) // 5.0
// Tier score per option: A→1, B→2/3, C→4/5
const OPTION_SCORES: Record<string, number[]> = {
  a: [1, 1, 1, 1],
  b: [2, 3, 3, 3],
  c: [4, 5, 4, 5],
}

// ── DOM refs ───────────────────────────────────────────────────────────
let form: HTMLElement
let container: HTMLElement
let result: HTMLElement
let progressFill: HTMLElement

// ── State ──────────────────────────────────────────────────────────────
let current = 0 // 0-indexed question index
const answers: string[] = [] // 'a' | 'b' | 'c' per question
let cards: HTMLElement[] = []
let langObserver: MutationObserver | null = null
let advanceTimer: ReturnType<typeof setTimeout> | null = null

// ── Helpers ────────────────────────────────────────────────────────────
function t(key: string, lang?: Lang): string {
  return i18n[lang ?? getLang()][key] ?? key
}

// ── Build a single quiz card ──────────────────────────────────────────
function buildCard(qIndex: number): HTMLElement {
  const qi = qIndex + 1
  const lang = getLang()

  const card = document.createElement('div')
  card.className = 'quiz-card'
  card.setAttribute('role', 'group')
  card.setAttribute('aria-label', t('quiz.progress').replace('{n}', String(qi)))
  card.dataset.q = String(qIndex)

  // Question label
  const label = document.createElement('p')
  label.className = 'quiz-card__question'
  label.dataset.i18nQ = String(qIndex)
  label.textContent = t(`quiz.q${qi}.question`, lang)
  card.appendChild(label)

  // Radio group
  const group = document.createElement('wa-radio-group')
  group.name = `quiz-q${qi}`
  group.setAttribute('label', '')

  for (const opt of ['a', 'b', 'c'] as const) {
    const radio = document.createElement('wa-radio')
    radio.value = opt
    radio.dataset.i18nOpt = `${qi}.${opt}`
    radio.textContent = t(`quiz.q${qi}.option${opt.toUpperCase()}`, lang)
    group.appendChild(radio)
  }

  card.appendChild(group)
  return card
}

// ── Render all cards (initial build) ──────────────────────────────────
function buildCards(): void {
  container.innerHTML = ''
  cards = []
  for (let i = 0; i < QUESTION_COUNT; i++) {
    const card = buildCard(i)
    if (i !== current) card.hidden = true
    cards.push(card)
    container.appendChild(card)
  }
}

// ── Update text on the current card (language switch) ────────────────
function refreshCurrentCard(): void {
  const lang = getLang()
  const qi = current + 1

  // Update progress text via aria-label on current card
  if (cards[current]) {
    cards[current]?.setAttribute(
      'aria-label',
      t('quiz.progress', lang).replace('{n}', String(qi)),
    )
  }

  // Update question + options on ALL cards so they're ready when shown
  for (let i = 0; i < QUESTION_COUNT; i++) {
    const idx = i + 1
    const card = cards[i]
    if (!card) continue

    const questionEl = card.querySelector<HTMLElement>('[data-i18n-q]')
    if (questionEl) questionEl.textContent = t(`quiz.q${idx}.question`, lang)

    const cardDetails = card.querySelectorAll<HTMLElement>('[data-i18n-opt]')

    for (const el of cardDetails) {
      const parts = (el.dataset.i18nOpt ?? '.').split('.')
      const qStr = parts[0] ?? ''
      const opt = parts[1] ?? ''
      if (!qStr || !opt) continue
      el.textContent = t(`quiz.q${qStr}.option${opt.toUpperCase()}`, lang)
    }
  }

  // If result is visible, re-render it too
  if (!result.hidden) {
    const tier = computeTier()
    renderResult(tier, lang)
  }

  // Update progress text nodes
  updateProgress()
}

// ── Update progress bar ───────────────────────────────────────────────
function updateProgress(): void {
  progressFill.style.width = `${((current + 1) / QUESTION_COUNT) * 100}%`
}

// ── Show a specific card ──────────────────────────────────────────────
function showCard(index: number): void {
  for (let i = 0; i < cards.length; i++) {
    const c = cards[i]
    if (!c) continue
    if (i === index) {
      c.hidden = false
      c.classList.add('quiz-card--active')
    } else {
      c.hidden = true
      c.classList.remove('quiz-card--active')
    }
  }
  updateProgress()
}

// ── Advance to next question or show result ───────────────────────────
function advance(): void {
  advanceTimer = null
  current++
  if (current >= QUESTION_COUNT) {
    showResult()
  } else {
    showCard(current)
  }
}

// ── Handle radio selection ────────────────────────────────────────────
function onRadioChange(e: Event): void {
  const group = e.target as HTMLElement
  if (!(group instanceof HTMLElement) || group.tagName !== 'WA-RADIO-GROUP')
    return

  const value = (group as { value?: string }).value
  if (!value || !['a', 'b', 'c'].includes(value)) return

  const qIndex = Number(group.closest<HTMLElement>('[data-q]')?.dataset.q)
  if (Number.isNaN(qIndex) || qIndex < 0 || qIndex >= QUESTION_COUNT) return

  answers[qIndex] = value

  if (advanceTimer) clearTimeout(advanceTimer)
  advanceTimer = setTimeout(advance, AUTO_ADVANCE_MS)
}

// ── Scoring ───────────────────────────────────────────────────────────
function computeTier(): number {
  let weighted = 0
  for (let i = 0; i < QUESTION_COUNT; i++) {
    const opt = answers[i]
    if (!opt) continue
    const scores = OPTION_SCORES[opt]
    if (!scores) continue
    const score = scores[i]
    if (score == null) continue
    weighted += score * (WEIGHTS[i] ?? 0)
  }

  const raw = weighted / TOTAL_WEIGHT

  // Tiebreaker on .5 boundary
  if (Math.abs((raw % 1) - 0.5) < 0.001) {
    const q2 = answers[1]
    if (q2 === 'b' || q2 === 'c') {
      return Math.min(5, Math.ceil(raw))
    }
    return Math.max(1, Math.floor(raw))
  }

  return Math.max(1, Math.min(5, Math.round(raw)))
}
// ── Render result card ────────────────────────────────────────────────
function renderResult(tier: number, lang?: Lang): void {
  const l = lang ?? getLang()
  const tierName = t(`tier${tier}.name`, l)
  const justification = t(`quiz.result.tier${tier}.text`, l)

  // Build result text from templates in m5-context
  const isGr = l === 'gr'
  const body = isGr
    ? `Βάσει των απαντήσεών σας, το ${tierName} ταιριάζει καλύτερα στις ανάγκες σας. ${justification} Επικοινωνήστε μαζί μας για μια προσφορά κομμένη και ραμμένη στα μέτρα σας.`
    : `Based on your answers, ${tierName} is the best fit for your needs. ${justification} Get in touch for a tailored quote.`

  const ctaText = t('quiz.result.cta', l).replace('{tier}', tierName)
  const retakeText = t('quiz.result.retake', l)
  const heading = t('quiz.result.heading', l)

  result.innerHTML = `
    <div class="quiz-result__card quiz-result__card--tier${tier}">
      <p class="quiz-result__heading" data-i18n="quiz.result.heading">${heading}</p>
      <p class="quiz-result__tier-name">${tierName}</p>
      <p class="quiz-result__body">${body}</p>
      <a class="quiz-result__cta" href="#tier-${tier}">${ctaText}</a>
      <button type="button" class="quiz-result__retake">${retakeText}</button>
    </div>
  `

  // Wire CTA scroll
  const cta = result.querySelector<HTMLAnchorElement>('.quiz-result__cta')
  if (cta) {
    cta.addEventListener('click', (e) => {
      e.preventDefault()
      const target = document.getElementById(`tier-${tier}`)
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  // Wire retake
  const retake = result.querySelector<HTMLButtonElement>('.quiz-result__retake')
  if (retake) {
    retake.addEventListener('click', resetQuiz)
  }
}

// ── Show result ───────────────────────────────────────────────────────
function showResult(): void {
  container.hidden = true
  progressFill.style.width = '100%'

  const tier = computeTier()
  renderResult(tier)

  result.hidden = false
  result.classList.add('is-visible')
}

// ── Reset quiz ────────────────────────────────────────────────────────
function resetQuiz(): void {
  current = 0
  answers.length = 0
  if (advanceTimer) {
    clearTimeout(advanceTimer)
    advanceTimer = null
  }
  // Rebuild cards to clear radio selections
  buildCards()
  showCard(0)

  result.hidden = true
  result.classList.remove('is-visible')
  container.hidden = false
}

// ── Listen for language changes ───────────────────────────────────────
function observeLangChange(): void {
  // MutationObserver on <html data-lang="...">
  langObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'attributes' && m.attributeName === 'data-lang') {
        refreshCurrentCard()
        return
      }
    }
  })
  langObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-lang'],
  })
}

// ── Init ──────────────────────────────────────────────────────────────
export function initQuiz(): void {
  form = document.querySelector('.quiz-form') as HTMLElement
  container = document.querySelector('.quiz-container') as HTMLElement
  result = document.querySelector('.quiz-result') as HTMLElement
  progressFill = document.querySelector('.quiz-progress__fill') as HTMLElement

  if (!form || !container || !result || !progressFill) return

  // Build initial cards
  buildCards()
  showCard(0)

  // Delegate radio change events
  form.addEventListener('wa-change', onRadioChange as EventListener)

  // Watch for language switches
  observeLangChange()
}
