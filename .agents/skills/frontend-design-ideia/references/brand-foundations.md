# IDE.IA — Brand foundations (authoritative)

These rules are extracted directly from the IDE.IA slide decks and are the brand's source of
truth. They apply to every surface, web included. Social handle: `@ide.ia_`.

## Palette

Two greens plus black/white/navy — **nothing else**. No gradients, no additional hues.

| Token | Value | Role |
|---|---|---|
| `--green-600` | `#3FA14C` | **Primary leaf green** — the brand hue: logo mark, icon strokes, decorative accents. **Non-text only** (3.27:1 on white) |
| `--green-400` | `#80E978` | **Bright mint** — big fills (hero/section bands), icon badges, chart segments, accent on dark |
| `--green-700` | `#2f7d3c` | derived — the **accessible** green (5.10:1 on white): every green *text* role and the light-mode button fill |
| `--green-800` / `--green-900` | `#256330` / `#1c4b25` | derived — hover / pressed steps under green-700 |
| `--green-200` / `--green-100` | `#B7EFB2` / `#E7F9E5` | derived tints — subtle fills, hover surfaces, hairline backgrounds |
| `--black` / `--white` | `#000` / `#FFF` | base |
| `--gray-900` / `--gray-600` / `--gray-200` | `#1A1A1A` / `#5C5C5C` / `#E3E3E3` | derived — body text / caption / hairline (light mode) |
| `--navy-900` | `#111A24` | dark-mode page background |
| `--navy-800` | `#182430` | dark-mode card panel |
| `--green-legend-dark` | `#1B4220` | dark forest green — table/legend highlight cells |

Semantic aliases (`--brand-primary`, `--surface-page`, `--surface-dark`, `--text-heading`,
`--text-brand`, `--text-brand-on-dark`, `--icon-stroke`, …) are defined in `tokens/colors.css` —
prefer these in components.

**Usage:** body copy is `--text-body` on `--surface-page` (light) or `--text-body-inverse` on
`--surface-dark`. Links and interactive accents use `--text-brand` / `--interactive-primary` on
light (both green-700), `--green-400` on dark.

**The green/contrast rule.** Two of the three greens can't legally carry text on white, so the
palette splits the job: `--green-600` is the *brand* hue and stays on non-text marks (logo, icon
strokes) where the 3:1 threshold applies; `--green-700` is the *text* green and carries links,
eyebrows, and button fills at 5.10:1. Mint (`--green-400`) is a fill in both modes — on a mint
band put `--text-on-accent` (near-black), never green, and on white it may not be text at all.
Use the semantic tokens and this resolves itself; hand-picking a green is how it breaks.

## Typography

Two-family system + one rare accent. Fonts load via `tokens/fonts.css` (Google Fonts).

- `--font-display` = **Mulish** (substitutes the deck's Clear Sans Bold). Every heading/display
  moment. Always bold (800), sentence case, tight line-height. Sizes: `--text-display-size`
  (clamp 48–96px) for hero, `--text-title-size` (clamp 36–56px) for section titles.
- `--font-body` = **Montserrat**. Body paragraphs (regular 400, `--text-body-size` 22px in deck
  context — scale down to ~16px for dense app UI). Eyebrows/labels = Montserrat **bold**,
  UPPERCASE, `--text-eyebrow-tracking` (0.14em).
- `--font-accent` = **Sora** (substitutes Codec Pro). **Light mode:** rare accent only.
  **Dark mode:** primary body/label face — use it for card text, labels, table cells.

No serif, no script, no third body face.

**Real vs. substitute fonts:** the identity's *real* brand typefaces are **Urbanist** (primary,
all weights) and **Olney** (display accent), shipped in `../fonts/` and wired via
`fonts/brand-fonts.css` + `fonts/brand-fonts-override.css`. The Mulish/Montserrat/Sora families
in `tokens/typography.css` are Google-Fonts substitutes chosen when the original PPTX deck was the
only source (it embedded no usable font files). Prefer the real fonts for production; the
substitutes are fine for zero-asset quick artifacts.

## Shape & elevation

- **Light mode: hard square corners everywhere.** No rounded cards, no rounded images, no pill
  buttons. The only curves are the logo's node-dots and icon badge circles (`--radius-icon-badge`
  = 50%).
- **Dark mode:** rounded card panels — `--radius-card-dark` = 20px — group related content on
  navy. This is the one place radius is allowed on containers.
- **Light mode: no drop shadows, borders, or inner glows** as the separation device. Use whitespace
  and green/white contrast. A hairline (`--border-hairline`) is acceptable for tables/dividers when
  whitespace alone is insufficient.
- **Dark mode:** the one sanctioned shadow is `--elevation-dark-card`, a subtle lift on the rounded
  navy panel — it reads as depth against navy, where a hairline would disappear. Nothing else gets
  a shadow, in either mode.

## Iconography

- **Light mode:** thin, single-weight, rounded-cap **outline** icons in leaf green
  (`assets/icons/`, `--icon-stroke-width` 3px). Bare inline with text; inside a filled circular
  mint/leaf **badge** (`--radius-icon-badge`) when they must read at a glance in a grid.
- **Dark mode:** a *second, thicker* rounded-stroke set (`assets/icons-dark/`,
  `--icon-stroke-width-dark` 6px) always in bright mint (`--green-400`). **Never mix the two
  sets on one surface.**
- Prefer the **SVG** versions so icons recolor/scale cleanly. Never use emoji or unicode glyphs
  as icon substitutes.

## Logo & decorative pattern

- Full lockup: `assets/logo/ideia-logo-full.png` (light bg), `ideia-logo-full-white.png` (dark
  bg). Mark alone: `ideia-logo-mark.png`. Keep a small lockup in a consistent corner as a running
  mark (like a persistent header/footer brand).
- To tint the mark to an exact token, use `assets/logo/svg/09.svg` — it declares
  `fill="currentColor"`, so `<svg style="color: var(--green-600)">` (or `--white` on dark) drives
  it. The other marks carry baked-in fills; see `assets/logo/README.md`.
- **Signature move:** the "network/node" line-art (`assets/patterns/network-outline-*.png`)
  scaled 5–10× and bled off a screen edge/corner as a quiet accent — low opacity, never centered,
  never fighting the text. Great for hero sections, empty states, auth screens, 404s.

## Voice & content (PT-BR)

- Portuguese (Brazil) by default. Plain, instructional, third-person institutional tone — not
  salesy, no hype adjectives.
- Titles = sentence case ("Exemplo de título"). Eyebrows/labels = UPPERCASE, short (1–2 words):
  "LABORATÓRIO", "EMPRESA".
- No emoji. Closing/gratitude moments use warm "Obrigada!" (light decks) / "Obrigado!" (dark) —
  informal, not "obrigado pela atenção".
- Placeholder Lorem Ipsum is fine as filler but always flagged as placeholder.
