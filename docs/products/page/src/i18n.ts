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

    'tierNav.tier1': 'WP Template',
    'tierNav.tier2': 'WP Semi-Custom',
    'tierNav.tier3': 'Next.js Quick',
    'tierNav.tier4': 'Next.js + CMS',
    'tierNav.tier5': 'Enterprise',

    'tier1.car': 'Μεταχειρισμένο από Facebook',
    'tier1.name': 'Το WordPress Template',
    'tier1.price': '€250–€800',
    'tier1.verdict':
      'Απλώς κάτι_online — δεν φέρνει πελάτες, αλλά τουλάχιστον υπάρχει.',
    'tier1.chip.hours': '6–16 ώρες',
    'tier1.chip.lighthouse': 'Lighthouse 35–60',
    'tier1.chip.security': 'Ασφάλεια: Χαμηλή',

    'tier1.gets.title': 'Τι παίρνεις',
    'tier1.gets.item1': 'Λειτουργική ιστοσελίδα 5–7 σελίδων',
    'tier1.gets.item2': 'Βασική φόρμα επικοινωνίας',
    'tier1.gets.item3': "SSL πιστοποιητικό (συνήθως Let's Encrypt)",
    'tier1.gets.item4': 'Μερική συμβατότητα με κινητά',
    'tier1.gets.item5': 'Βασική ανάρτηση σε Google Analytics (ίσως)',
    'tier1.gets.item6': 'Ένα stock theme με ελάχιστες αλλαγές χρωμάτων',
    'tier1.gets.item7': 'Παράδοση μέσα σε 1–2 εβδομάδες',

    'tier1.doesntGet.title': 'Τι ΔΕΝ παίρνεις',
    'tier1.doesntGet.item1': 'Καμία custom σχεδίαση — είναι template ως έχει',
    'tier1.doesntGet.item2': 'Καμία στρατηγική SEO ή keyword research',
    'tier1.doesntGet.item3': 'Καμία βελτιστοποίηση ταχύτητας',
    'tier1.doesntGet.item4': 'Κανένα child theme — updates σβήνουν αλλαγές',
    'tier1.doesntGet.item5': 'Κανένα documentation ή handoff',
    'tier1.doesntGet.item6': 'Κανένα staging environment',
    'tier1.doesntGet.item7': 'Κανένα CMS dashboard που να καταλαβαίνει πελάτης',

    'tier1.outlook.title': 'Πού θα βρεθείς σε 2 χρόνια',
    'tier1.outlook.text':
      'Σε δύο χρόνια, τα theme updates θα έχουν σπάσει τη διαμόρφωση τουλάχιστον δύο φορές. Τα plugins θα είναι χωρίς patches, η ταχύτητα θα έχει υποβαθμιστεί αισθητά, και ο προμηθευτής θα είναι αγνοήσιμος. Η ασφάλεια είναι ρίσκο — τα περισσότερα WordPress sites αυτού του tier μολύνονται μέσα στον πρώτο χρόνο αν δεν ενημερώνονται. Το πιο πιθανό σενάριο είναι πλήρης ανακατασκευή από το μηδέν.',

    'tier1.ideal.title': 'Ιδανικό για',
    'tier1.ideal.item1': 'Εταιρεία που απλώς θέλει "κάτι online"',
    'tier1.ideal.item2': 'Πρώτη επιχείρηση με budget-only mindset',
    'tier1.ideal.item3': 'Προσωρινή λύση πριν σοβαρή επένδυση',

    'tier1.tco.build': '~€525',
    'tier1.tco.ongoing': '~€4.475',
    'tier1.tco.total': '€2.500–€7.500',

    'tier2.car': 'Νέο αυτοκίνητο πόλης',
    'tier2.name': 'Το WordPress Semi-Custom',
    'tier2.price': '€800–€2.500',
    'tier2.verdict':
      'Δείχνει επαγγελματικό — αλλά η τεχνολογία από κάτω είναι ακόμα WordPress.',
    'tier2.chip.hours': '25–50 ώρες',
    'tier2.chip.lighthouse': 'Lighthouse 55–75',
    'tier2.chip.security': 'Ασφάλεια: Μέτρια',

    'tier2.gets.title': 'Τι παίρνεις',
    'tier2.gets.item1': 'Wireframe/mockup πριν ξεκινήσει το build',
    'tier2.gets.item2': 'Child theme — αλλαγές επιβιώνουν στα updates',
    'tier2.gets.item3': 'Yoast SEO ρυθμισμένο με βασικά meta',
    'tier2.gets.item4': 'Caching & CDN layer (Cloudflare ή παρόμοιο)',
    'tier2.gets.item5': 'Σχεδιασμένη φόρμα επικοινωνίας με validation',
    'tier2.gets.item6': 'Γρηγορότερο φόρτωμα desktop — LCP κάτω από 3s',
    'tier2.gets.item7': 'Google Search Console & Analytics handoff',
    'tier2.gets.item8': 'Παράδοση μέσα σε 3–6 εβδομάδες',

    'tier2.doesntGet.title': 'Τι ΔΕΝ παίρνεις',
    'tier2.doesntGet.item1': 'Core Web Vitals στο κινητό παραμένουν κακά',
    'tier2.doesntGet.item2': 'Επιφάνεια ευπάθειας από 15–25 plugins',
    'tier2.doesntGet.item3': 'Κανένα CI/CD pipeline ή version control',
    'tier2.doesntGet.item4': 'Κανένα staging environment',
    'tier2.doesntGet.item5':
      'Επεξεργασία περιεχομένου παγιδευμένη σε Elementor',
    'tier2.doesntGet.item6': 'Vendor lock-in στον page builder',

    'tier2.outlook.title': 'Πού θα βρεθείς σε 2 χρόνια',
    'tier2.outlook.text':
      'Τα plugin updates θα έχουν προκαλέσει τουλάχιστον ένα σοβαρό πρόβλημα. Layouts στο Elementor θα σπάσουν όταν ο πελάτης προσπαθήσει να επεξεργαστεί περιεχόμενο. Η απόδοση στο κινητό θα παραμένει προβληματική — τα περισσότερα WordPress semi-custom sites έχουν Lighthouse mobile 40–55. Οι ετήσιες άδειες Elementor, Yoast Premium και hosting θα προσθέτουν €300–€600/έτος. Αν θέλεις σύγχρονο stack, θα χρειαστείς πλήρη ανακατασκευή.',

    'tier2.ideal.title': 'Ιδανικό για',
    'tier2.ideal.item1': 'Μικρή επιχείρηση που θέλει βασικό επαγγελματισμό',
    'tier2.ideal.item2': 'Πρώτη φορά με SEO',
    'tier2.ideal.item3': 'Επιχείρηση άνετη με οικοσύστημα WordPress',

    'tier2.tco.build': '~€1.650',
    'tier2.tco.ongoing': '~€3.350',
    'tier2.tco.total': '€3.000–€7.000',

    'tier3.car': 'Καλογυαλισμένο used',
    'tier3.name': 'Το Next.js Γρήγορη Παράδοση',
    'tier3.price': '€800–€2.500',
    'tier3.verdict':
      'Απίστευτα γρήγορο site — αλλά κάθε αλλαγή περνάει από developer.',
    'tier3.chip.hours': '20–40 ώρες',
    'tier3.chip.lighthouse': 'Lighthouse 90–100',
    'tier3.chip.security': 'Ασφάλεια: Δυνατή',

    'tier3.gets.title': 'Τι παίρνεις',
    'tier3.gets.item1':
      'Static HTML που σερβίρεται από CDN — LCP 1–2s σε κινητό',
    'tier3.gets.item2':
      'Μηδενική επιφάνεια επίθεσης (κανένα plugin, καμία βάση)',
    'tier3.gets.item3': 'Δωρεάν hosting σε Vercel ή Cloudflare',
    'tier3.gets.item4': '99.9%+ uptime, ανεξάρτητα από traffic',
    'tier3.gets.item5': 'Future-proof codebase — αναβαθμίσιμο σε Tier 4',
    'tier3.gets.item6': 'Lighthouse score 90–100 out of the box',
    'tier3.gets.item7': 'Κανένα database dependency — κανένα σπάσιμο',

    'tier3.doesntGet.title': 'Τι ΔΕΝ παίρνεις',
    'tier3.doesntGet.item1':
      'Κανένα CMS dashboard — δεν μπορείς να αλλάξεις κείμενο μόνος σου',
    'tier3.doesntGet.item2':
      'Κάθε αλλαγή = build + deploy cycle (€50–80 για απλό edit)',
    'tier3.doesntGet.item3': 'Content hardcoded σε κώδικα',
    'tier3.doesntGet.item4': 'Κανένα staging environment',
    'tier3.doesntGet.item5': 'Κανένα automated test suite',

    'tier3.outlook.title': 'Πού θα βρεθείς σε 2 χρόνια',
    'tier3.outlook.text':
      'Το site παραμένει ταχύτατο και ασφαλές, αλλά κάθε αλλαγή κειμένου ή εικόνας απαιτεί developer. Ένα απλό edit κοστίζει €50–80, η προσθήκη σελίδας €200–250. Η εξάρτηση από developer γίνεται απογοητευτική αν το content αλλάζει συχνά.',

    'tier3.ideal.title': 'Ιδανικό για',
    'tier3.ideal.item1': 'Tech-comfortable client με στατικό content',
    'tier3.ideal.item2': 'Επιχείρηση με προτεραιότητα την απόδοση',
    'tier3.ideal.item3': 'Πελάτης που προετοιμάζεται για Tier 4',

    'tier3.tco.build': '~€1.650',
    'tier3.tco.ongoing': '~€1.300',
    'tier3.tco.total': '~€2.950',

    'tier4.car': 'BMW Σειρά 3',
    'tier4.name': 'Το Next.js + Sanity CMS',
    'tier4.price': '€2.500–€6.000',
    'tier4.verdict':
      'Επαγγελματικό site που το διαχειρίζεσαι μόνος σου — ισορροπία ποιότητας και ανεξαρτησίας.',
    'tier4.chip.hours': '50–90 ώρες',
    'tier4.chip.lighthouse': 'Lighthouse 90–100',
    'tier4.chip.security': 'Ασφάλεια: Δυνατή',

    'tier4.gets.title': 'Τι παίρνεις',
    'tier4.gets.item1': 'Όλα τα χαρακτηριστικά του Tier 3',
    'tier4.gets.item2':
      'Sanity Studio CMS — επεξεργασία κειμένου & εικόνων μόνος σου',
    'tier4.gets.item3': 'JSON-LD structured data για Google',
    'tier4.gets.item4': 'Πλήρες SEO: sitemap, robots.txt, OG meta tags',
    'tier4.gets.item5': 'WCAG AA προσβασιμότητα',
    'tier4.gets.item6':
      'Feature-based αρχιτεκτονική — επαναχρησιμοποιήσιμα components',
    'tier4.gets.item7': 'Client training session + organized handoff',
    'tier4.gets.item8':
      'Κώδικας που μπορεί να διατηρήσει οποιοσδήποτε React developer',

    'tier4.doesntGet.title': 'Τι ΔΕΝ παίρνεις',
    'tier4.doesntGet.item1': 'Κανένα automated test suite',
    'tier4.doesntGet.item2': 'Κανένα CI/CD pipeline',
    'tier4.doesntGet.item3': 'Κανένα staging environment (προαιρετικό add-on)',
    'tier4.doesntGet.item4': 'Security headers πέρα από τα βασικά',

    'tier4.outlook.title': 'Πού θα βρεθείς σε 2 χρόνια',
    'tier4.outlook.text':
      'Το content ενημερώνεται ανεξάρτητα μέσω Sanity Studio — δεν χρειάζεσαι developer για αλλαγές κειμένου ή εικόνων. Το site αποδίδει εξαιρετικά, το SEO κατατάσσεται. Κώδικας που μπορεί να αναλάβει οποιοσδήποτε React developer. Αξιόλογη επένδυση με απόδοση.',

    'tier4.ideal.title': 'Ιδανικό για',
    'tier4.ideal.item1': 'ΜΜΕ με σχέσεις ανάπτυξης',
    'tier4.ideal.item2': 'Επιχείρηση που θέλει ανεξαρτησία content',
    'tier4.ideal.item3': 'Ορίζοντας 3+ ετών, τακτική επεξεργασία content',

    'tier4.tco.build': '~€4.250',
    'tier4.tco.ongoing': '~€1.900',
    'tier4.tco.total': '~€6.150',

    'tier5.car': 'Mercedes S-Class',
    'tier5.name': 'Enterprise-Grade',
    'tier5.price': '€5.000–€12.000',
    'tier5.verdict':
      'Το site που μεγαλώνει μαζί με την επιχείρηση — zero compromises.',
    'tier5.chip.hours': '70–130 ώρες',
    'tier5.chip.lighthouse': 'Lighthouse 95–100 (CI-enforced)',
    'tier5.chip.security': 'Ασφάλεια: Οχυρωμένο',

    'tier5.gets.title': 'Τι παίρνεις',
    'tier5.gets.item1': 'Όλα τα χαρακτηριστικά του Tier 4',
    'tier5.gets.item2': 'Playwright E2E tests — regressions πριν το deploy',
    'tier5.gets.item3': 'Vitest unit tests — code quality enforced',
    'tier5.gets.item4': 'GitHub Actions CI/CD pipeline',
    'tier5.gets.item5': 'Security headers: CSP, HSTS, X-Frame-Options',
    'tier5.gets.item6': 'Staging environment — δοκιμή πριν το production',
    'tier5.gets.item7': 'Πλήρης τεκμηρίωση + client handoff guide',
    'tier5.gets.item8':
      'Performance budget enforced in CI — Lighthouse δεν πέφτει ποτέ',

    'tier5.doesntGet.title': 'Τι ΔΕΝ παίρνεις',
    'tier5.doesntGet.item1':
      'Τίποτα λείπει — είναι πλήρης επαγγελματική παράδοση',
    'tier5.doesntGet.item2':
      'Μόνη επιφύλαξη: υψηλότερο upfront κόστος και μεγαλύτερος χρόνος παράδοσης',

    'tier5.outlook.title': 'Πού θα βρεθείς σε 2 χρόνια',
    'tier5.outlook.text':
      'Βράχος. Το CI πιάνει regressions πριν φτάσουν στο production. Η τεκμηρίωση επιτρέπει team handoff χωρίς απώλεια γνώσης. Security posture enterprise-grade. Το site που μεγαλώνει με την επιχείρηση, χωρίς εκπλήξεις.',

    'tier5.ideal.title': 'Ιδανικό για',
    'tier5.ideal.item1': 'Ρυθμιζόμενος κλάδος (νομικά, ιατρικά, οικονομικά)',
    'tier5.ideal.item2': 'SEO-critical launch',
    'tier5.ideal.item3': 'Πολλαπλοί stakeholders, ορίζοντας 5+ ετών',

    'tier5.tco.build': '~€9.000',
    'tier5.tco.ongoing': '~€650',
    'tier5.tco.total': '~€9.650',
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

    'tierNav.tier1': 'WP Template',
    'tierNav.tier2': 'WP Semi-Custom',
    'tierNav.tier3': 'Next.js Quick',
    'tierNav.tier4': 'Next.js + CMS',
    'tierNav.tier5': 'Enterprise',

    'tier1.car': 'Used car from Facebook',
    'tier1.name': 'WP Template Flip',
    'tier1.price': '€250–€800',
    'tier1.verdict':
      "Just something online — it won't bring customers, but at least it exists.",
    'tier1.chip.hours': '6–16 hrs',
    'tier1.chip.lighthouse': 'Lighthouse 35–60',
    'tier1.chip.security': 'Security: Low',

    'tier1.gets.title': 'What you get',
    'tier1.gets.item1': 'Functional 5–7 page website',
    'tier1.gets.item2': 'Basic contact form',
    'tier1.gets.item3': "SSL certificate (usually Let's Encrypt)",
    'tier1.gets.item4': 'Mobile-visible (not optimized)',
    'tier1.gets.item5': 'Google Analytics installed (maybe)',
    'tier1.gets.item6': 'Stock theme with minor color swaps',
    'tier1.gets.item7': 'Delivery within 1–2 weeks',

    'tier1.doesntGet.title': "What you DON'T get",
    'tier1.doesntGet.item1': 'No custom design — template as-is',
    'tier1.doesntGet.item2': 'No SEO strategy or keyword research',
    'tier1.doesntGet.item3': 'No performance optimization',
    'tier1.doesntGet.item4': 'No child theme — updates wipe changes',
    'tier1.doesntGet.item5': 'No documentation or handoff',
    'tier1.doesntGet.item6': 'No staging environment',
    'tier1.doesntGet.item7': 'No usable CMS dashboard for the client',

    'tier1.outlook.title': "Where you'll be in 2 years",
    'tier1.outlook.text':
      'In two years, theme updates will have broken the configuration at least twice. Plugins will be unpatched, performance noticeably degraded, and the original vendor unreachable. Security is a real risk — most WordPress sites at this tier get compromised within the first year without maintenance. The most likely outcome is a full rebuild from scratch.',

    'tier1.ideal.title': 'Ideal for',
    'tier1.ideal.item1': 'Business that just wants "something online"',
    'tier1.ideal.item2': 'First-time SME with budget-only mindset',
    'tier1.ideal.item3': 'Temporary stopgap before serious investment',

    'tier1.tco.build': '~€525',
    'tier1.tco.ongoing': '~€4,475',
    'tier1.tco.total': '€2,500–€7,500',

    'tier2.car': 'New city car',
    'tier2.name': 'WP Semi-Custom',
    'tier2.price': '€800–€2,500',
    'tier2.verdict':
      'Looks professional — but the tech underneath is still WordPress.',
    'tier2.chip.hours': '25–50 hrs',
    'tier2.chip.lighthouse': 'Lighthouse 55–75',
    'tier2.chip.security': 'Security: Fair',

    'tier2.gets.title': 'What you get',
    'tier2.gets.item1': 'Wireframe/mockup sign-off before build',
    'tier2.gets.item2': 'Child theme — changes survive updates',
    'tier2.gets.item3': 'Yoast SEO configured with basic meta',
    'tier2.gets.item4': 'Caching & CDN layer (Cloudflare or similar)',
    'tier2.gets.item5': 'Structured contact form with validation',
    'tier2.gets.item6': 'Faster desktop load — LCP under 3s',
    'tier2.gets.item7': 'Google Search Console & Analytics handoff',
    'tier2.gets.item8': 'Delivery within 3–6 weeks',

    'tier2.doesntGet.title': "What you DON'T get",
    'tier2.doesntGet.item1': 'Core Web Vitals on mobile still poor',
    'tier2.doesntGet.item2': 'Plugin vulnerability surface (15–25 plugins)',
    'tier2.doesntGet.item3': 'No CI/CD pipeline or version control',
    'tier2.doesntGet.item4': 'No staging environment',
    'tier2.doesntGet.item5':
      'Content editing trapped in Elementor page builder',
    'tier2.doesntGet.item6': 'Vendor lock-in to page builder ecosystem',

    'tier2.outlook.title': "Where you'll be in 2 years",
    'tier2.outlook.text':
      'Plugin updates will have caused at least one serious issue. Elementor layouts will break when the client tries to edit content. Mobile performance remains problematic — most WordPress semi-custom sites sit at Lighthouse mobile 40–55. Annual licenses for Elementor, Yoast Premium, and hosting add €300–€600/year. If you want a modern stack, expect a full rebuild.',

    'tier2.ideal.title': 'Ideal for',
    'tier2.ideal.item1': 'Small business wanting basic professionalism',
    'tier2.ideal.item2': 'First-time SEO efforts',
    'tier2.ideal.item3': 'Business comfortable with WordPress ecosystem',

    'tier2.tco.build': '~€1,650',
    'tier2.tco.ongoing': '~€3,350',
    'tier2.tco.total': '€3,000–€7,000',

    'tier3.car': 'Well-polished used car',
    'tier3.name': 'Next.js Quick Delivery',
    'tier3.price': '€800–€2,500',
    'tier3.verdict':
      'Blazing fast site — but every change goes through a developer.',
    'tier3.chip.hours': '20–40 hrs',
    'tier3.chip.lighthouse': 'Lighthouse 90–100',
    'tier3.chip.security': 'Security: Strong',

    'tier3.gets.title': 'What you get',
    'tier3.gets.item1': 'Static HTML served from CDN — LCP 1–2s on mobile',
    'tier3.gets.item2': 'Zero attack surface — no plugins, no database',
    'tier3.gets.item3': 'Free hosting on Vercel or Cloudflare',
    'tier3.gets.item4': '99.9%+ uptime regardless of traffic',
    'tier3.gets.item5': 'Future-proof codebase — upgradeable to Tier 4',
    'tier3.gets.item6': 'Lighthouse score 90–100 out of the box',
    'tier3.gets.item7': 'No database dependency — nothing to break',

    'tier3.doesntGet.title': "What you DON'T get",
    'tier3.doesntGet.item1': 'No CMS dashboard — you cannot edit text yourself',
    'tier3.doesntGet.item2':
      'Every change = build + deploy cycle (€50–80 for a simple edit)',
    'tier3.doesntGet.item3': 'Content hardcoded in source code',
    'tier3.doesntGet.item4': 'No staging environment',
    'tier3.doesntGet.item5': 'No automated test suite',

    'tier3.outlook.title': "Where you'll be in 2 years",
    'tier3.outlook.text':
      'The site stays fast and secure, but every text or image change needs a developer. A simple edit costs €50–80, adding a page costs €200–250. Developer dependency becomes frustrating if content changes often.',

    'tier3.ideal.title': 'Ideal for',
    'tier3.ideal.item1': 'Tech-comfortable client with static content',
    'tier3.ideal.item2': 'Performance-focused business',
    'tier3.ideal.item3': 'Client being onboarded to Tier 4',

    'tier3.tco.build': '~€1,650',
    'tier3.tco.ongoing': '~€1,300',
    'tier3.tco.total': '~€2,950',

    'tier4.car': 'BMW 3 Series',
    'tier4.name': 'Next.js + Sanity CMS',
    'tier4.price': '€2,500–€6,000',
    'tier4.verdict':
      'Professional site you manage yourself — the sweet spot of quality and independence.',
    'tier4.chip.hours': '50–90 hrs',
    'tier4.chip.lighthouse': 'Lighthouse 90–100',
    'tier4.chip.security': 'Security: Strong',

    'tier4.gets.title': 'What you get',
    'tier4.gets.item1': 'Everything in Tier 3',
    'tier4.gets.item2': 'Sanity Studio CMS — edit text & images yourself',
    'tier4.gets.item3': 'JSON-LD structured data for Google',
    'tier4.gets.item4': 'Full SEO: sitemap, robots.txt, OG meta tags',
    'tier4.gets.item5': 'WCAG AA accessibility',
    'tier4.gets.item6': 'Feature-based architecture — reusable components',
    'tier4.gets.item7': 'Client training session + organized handoff',
    'tier4.gets.item8': 'Codebase maintainable by any React developer',

    'tier4.doesntGet.title': "What you DON'T get",
    'tier4.doesntGet.item1': 'No automated test suite',
    'tier4.doesntGet.item2': 'No CI/CD pipeline',
    'tier4.doesntGet.item3': 'No staging environment (optional add-on)',
    'tier4.doesntGet.item4': 'No security headers beyond basics',

    'tier4.outlook.title': "Where you'll be in 2 years",
    'tier4.outlook.text':
      'Content is updated independently via Sanity Studio — no developer needed for text or image changes. Site performs well, SEO ranks. Codebase is maintainable by any React developer. A solid investment that pays for itself.',

    'tier4.ideal.title': 'Ideal for',
    'tier4.ideal.item1': 'SME with growth plans',
    'tier4.ideal.item2': 'Business wanting content independence',
    'tier4.ideal.item3': '3+ year horizon, client who edits content regularly',

    'tier4.tco.build': '~€4,250',
    'tier4.tco.ongoing': '~€1,900',
    'tier4.tco.total': '~€6,150',

    'tier5.car': 'Mercedes S-Class',
    'tier5.name': 'Enterprise-Grade',
    'tier5.price': '€5,000–€12,000',
    'tier5.verdict':
      'The site that scales with your business — zero compromises.',
    'tier5.chip.hours': '70–130 hrs',
    'tier5.chip.lighthouse': 'Lighthouse 95–100 (CI-enforced)',
    'tier5.chip.security': 'Security: Fortified',

    'tier5.gets.title': 'What you get',
    'tier5.gets.item1': 'Everything in Tier 4',
    'tier5.gets.item2':
      'Playwright E2E tests — regressions caught before deploy',
    'tier5.gets.item3': 'Vitest unit tests — code quality enforced',
    'tier5.gets.item4': 'GitHub Actions CI/CD pipeline',
    'tier5.gets.item5': 'Security headers: CSP, HSTS, X-Frame-Options',
    'tier5.gets.item6': 'Staging environment — test before production',
    'tier5.gets.item7': 'Full documentation + client handoff guide',
    'tier5.gets.item8':
      'Performance budget enforced in CI — Lighthouse never drops',

    'tier5.doesntGet.title': "What you DON'T get",
    'tier5.doesntGet.item1':
      'Nothing missing — this is full professional output',
    'tier5.doesntGet.item2':
      'Only caveat: higher upfront cost and longer timeline',

    'tier5.outlook.title': "Where you'll be in 2 years",
    'tier5.outlook.text':
      'Rock-solid. CI catches regressions before deploy. Documentation enables team handoff with zero knowledge loss. Security posture is enterprise-grade. The site that scales with the business — no surprises.',

    'tier5.ideal.title': 'Ideal for',
    'tier5.ideal.item1': 'Regulated industry (legal, medical, financial)',
    'tier5.ideal.item2': 'SEO-critical launch',
    'tier5.ideal.item3': 'Multiple stakeholders, 5+ year horizon',

    'tier5.tco.build': '~€9,000',
    'tier5.tco.ongoing': '~€650',
    'tier5.tco.total': '~€9,650',
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
