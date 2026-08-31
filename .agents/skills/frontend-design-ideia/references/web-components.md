# IDE.IA — Web component patterns

Concrete recipes for building UI in the brand. Every component honors the hard rules in
`brand-foundations.md`: two greens only, square corners in light mode / rounded cards in dark,
no light-mode shadows, no emoji, Mulish headings + Montserrat body (+ Sora as dark-mode body).

All examples use the CSS variables from `styles.css` + `tokens-web.css`. Adapt freely to
React/Tailwind — the values are what matter, not the markup.

---

## Buttons

**Light mode — primary** (square, solid leaf green, no shadow):
```css
.btn-primary {
  font-family: var(--font-body); font-weight: 700;
  background: var(--interactive-primary); color: var(--white);
  border: none; border-radius: var(--radius-control);   /* square */
  padding: 12px 24px; font-size: var(--text-ui-size); cursor: pointer;
  transition: background var(--motion-fast) var(--motion-ease);
}
.btn-primary:hover  { background: var(--interactive-primary-hover); }
.btn-primary:active { background: var(--interactive-primary-active); }
.btn-primary:disabled { background: var(--interactive-disabled-bg); color: var(--interactive-disabled-fg); cursor: not-allowed; }
```

**Light mode — secondary** (outline, green stroke on white):
```css
.btn-secondary {
  background: transparent; color: var(--text-brand);        /* green-700 — 5.10:1, holds on hover too */
  border: 2px solid var(--text-brand); border-radius: var(--radius-control);
  padding: 10px 22px; font-family: var(--font-body); font-weight: 700;
}
.btn-secondary:hover { background: var(--green-100); }      /* label stays 4.63:1 on the tint */
```

**Dark mode — primary** (mint, controls inside cards may round slightly):
```css
.btn-primary-dark {
  background: var(--interactive-primary-dark); color: var(--navy-900);
  font-family: var(--font-accent); font-weight: 700;
  border: none; border-radius: var(--radius-control-dark);
  padding: 12px 24px;
}
.btn-primary-dark:hover { background: var(--interactive-primary-dark-hover); }
```

No pill buttons. No gradients. No shadows in light mode.

---

## Inputs & forms

Light mode: square, hairline border, green focus ring.
```css
.field-label { font-family: var(--font-body); font-weight: 700; text-transform: uppercase;
  letter-spacing: var(--text-eyebrow-tracking); font-size: var(--text-ui-sm-size); color: var(--gray-600); }
.input {
  font-family: var(--font-body); font-size: var(--text-ui-size); color: var(--text-body);
  background: var(--white); border: 1px solid var(--border-hairline);
  border-radius: var(--radius-control); padding: 10px 14px; width: 100%;
}
.input:focus-visible { border-color: var(--focus-ring-color);
  outline: var(--focus-ring-width) solid var(--focus-ring-color); outline-offset: var(--focus-ring-offset); }
```
Dark mode: navy field on card, mint focus. Use `--font-accent` for label/value text.

---

## Cards

**Light mode** — a card is a plain white rectangle separated by whitespace or a hairline;
**no shadow, no radius**:
```css
.card { background: var(--white); border: 1px solid var(--border-hairline);
  border-radius: var(--radius-none); padding: var(--space-5); }
```
Prefer no border at all when whitespace gives enough separation.

**Dark mode** — the signature rounded navy panel:
```css
.card-dark { background: var(--surface-dark-card); border-radius: var(--radius-card-dark);
  padding: var(--space-6) var(--space-5); color: var(--text-body-inverse);
  font-family: var(--font-accent); box-shadow: var(--elevation-dark-card); }
```
Feature-card pattern (from the deck's 3-card layout): icon top-left, faint oversized number
top-right (`color: rgba(128,233,120,0.28)`), mint title (`--text-brand-on-dark`), muted body.

---

## Eyebrow + heading pattern

The brand's core text block, reused everywhere (hero, section, card header):
```html
<p class="eyebrow">LABORATÓRIO</p>
<h2 class="title">Título da seção</h2>
```
```css
.eyebrow { font-family: var(--font-body); font-weight: var(--text-eyebrow-weight);
  text-transform: uppercase; letter-spacing: var(--text-eyebrow-tracking);
  font-size: var(--text-eyebrow-size); color: var(--text-brand); margin: 0; }
.title { font-family: var(--font-display); font-weight: var(--text-title-weight);
  font-size: var(--text-title-size); line-height: var(--text-title-line);
  color: var(--text-heading); margin: 12px 0 0; }   /* sentence case, never Title Case */
```
On dark surfaces: eyebrow → `--text-brand-on-dark`, title → `--white`.
A short mint accent bar (`width:100px; height:6px; background:var(--green-400)`) under a title is
a recurring device — reuse it.

---

## Navigation / header

Light: white bar, logo lockup left (`ideia-logo-full.png`), Montserrat nav links, active/hover
link in `--text-brand`. Square everything. No shadow — use a bottom `--border-hairline` if a
divider is needed. Dark: navy bar with `ideia-logo-full-white.png`, links in mint on hover.

---

## Tables (esp. dark technical mode)

The dark comparison/score table is a signature: a grid with 2px gaps over a faint white bg so
gaps read as hairlines, header row on `--navy-800` with mint labels, highlighted "winning" cells
filled `--green-legend-dark`. Body text in `--font-accent`. Rounded outer container
(`--radius-card-dark`). Use for dashboards, pricing/comparison, criteria scoring.

---

## Badges & pills-that-aren't-pills

Icon badge: brand icon centered in a filled circle (`--radius-icon-badge` 50%) — mint or leaf
fill. Status/label chips should stay **square** in light mode (not pill-shaped) — small
uppercase Montserrat label, green or gray background tint.

---

## Backgrounds, hero & empty states

- Solid fills only: white, mint (`--green-400` full-bleed band), or navy. No gradients/textures.
- Signature accent: bleed the `network-outline` pattern off a corner at low opacity
  (light: ~0.5 on mint / ~0.9 on white edges; dark: ~0.25 on navy). Perfect for heroes, auth
  screens, 404/empty states. Never center it, never let it fight text.
- Keep a small logo lockup in a consistent corner as a running brand mark.

---

## Charts / data viz

Segments in the two greens (+ neutrals for "other"); no rainbow palettes. Sample pie chart in
`assets/illustrations/pie-chart-sample.png`. On dark surfaces put charts inside a rounded navy
card with `--font-accent` labels. See the `dataviz` skill for palette-building method, but keep
the IDE.IA two-green constraint.

---

## Accessibility notes

Green text is the one place this palette needs care, so the tokens already encode the answer —
reach for the semantic token and it comes out right:

| Situation | Use | Ratio |
|---|---|---|
| Green text or link on white | `--text-brand` (green-700) | 5.10 ✅ |
| Green button fill, white label | `--interactive-primary` (green-700) | 5.10 ✅ |
| Text on a mint `--green-400` band | `--text-on-accent` (gray-900) | 11.47 ✅ |
| Green text on dark | `--text-brand-on-dark` (green-400) | 11.57 ✅ |
| Icon strokes, logo, decorative marks | `--green-600` | 3.27 — non-text only |

The two combinations to avoid: `--green-600` as body text on white (3.27, fails the 4.5 minimum —
it is the brand hue, not a text color) and *any* green as text on the mint band (green-700 on mint
is 3.36, green-600 is 2.16). Mint is a fill; put near-black on it.

- Mint (`--green-400`) fails contrast as text on white — use it as a fill/background or as text
  only on navy. Body text: `--gray-900` on white, `--text-body-inverse` on navy.
- Always render the `:focus-visible` ring (`tokens-web.css` sets a sensible default).
- Icons are decorative SVGs — give interactive icon-only controls an `aria-label`.
