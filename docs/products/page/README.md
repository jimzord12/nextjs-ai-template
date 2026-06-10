# Web Tiers Guide — Development

Single self-contained HTML file. Greek/EN bilingual, interactive, printable.
Built with Bun + Web Awesome + vanilla TypeScript.

## Quick Start

```bash
# Install dependencies
bun install

# Start dev server (http://localhost:3000)
bun dev

# Production build → dist/web-tiers-guide.html
bun run build:standalone
```

## Commands

| Command | What it does |
|---------|-------------|
| `bun dev` | Dev server with HMR at `http://localhost:3000` |
| `bun run build` | Minified build → `dist/web-tiers-guide.html` |
| `bun run build:standalone` | Single-file standalone build (same output, `--compile --target=browser`) |
| `bun run preview` | Serve `dist/` via static server |
| `bun run typecheck` | Run `tsc --noEmit` |
| `bun run lint` | Biome check + auto-fix |
| `bun test` | Run tests via `bun:test` |

All commands run from this directory (`docs/products/page/`).

## Manual Testing

### Dev Server

```bash
bun dev
```

Opens `http://localhost:3000`. Changes to any file under `src/` hot-reload automatically.

**What to check:**
- Page loads without console errors
- `<wa-details>` element renders and expands/collapses (proves Web Awesome loaded)
- Fontshare fonts load (Satoshi in body text)

### Build Output

```bash
bun run build:standalone
```

Then open the file:

```bash
# Windows
cmd /c start dist\web-tiers-guide.html

# macOS
open dist/web-tiers-guide.html

# Linux
xdg-open dist/web-tiers-guide.html
```

**What to check:**
- Single file opens in Chrome, Firefox, Safari, Edge
- No external file requests (except Fontshare CDN for fonts)
- `<wa-details>` element works offline (all JS/CSS is inline)
- File size is ~154 KB (well under 400 KB budget)

### Type Safety

```bash
bun run typecheck
```

Should exit with no errors.

## Project Structure

```
page/
├── src/
│   ├── index.html          # HTML entrypoint (wa-cloak, fonts, main.ts)
│   ├── main.ts             # WA init: setBasePath → allDefined → remove cloak
│   ├── wa.ts               # Cherry-picked WA component imports
│   └── styles/
│       └── main.css        # Reset + FOUCE cloak rules
├── public/assets/           # Static assets (WA icons etc.)
├── dist/                    # Build output (gitignored)
├── package.json
├── tsconfig.json            # Browser-targeted (no "types": ["bun"])
├── bunfig.toml
└── biome.json
```
