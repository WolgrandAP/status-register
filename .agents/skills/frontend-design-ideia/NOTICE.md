# NOTICE — licensing & attribution

This skill bundles third-party fonts and IDE.IA brand assets. Read this before distributing the
skill or shipping a build that embeds these files.

## Fonts

| Font | License | Status |
|---|---|---|
| **Urbanist** (all weights, `fonts/Urbanist-*.ttf`) | SIL Open Font License 1.1 | ✅ Redistributable |
| **Olney Light** (`fonts/olney_light.otf`) | **Unknown / unresolved** | ⚠️ Verify before distributing |

### Urbanist — OFL 1.1 (safe)
Copyright 2021–2024 The Urbanist Project Authors — Corey Hu
(<https://github.com/coreyhu/Urbanist>). Licensed under the SIL Open Font License, Version 1.1.
The full license text is bundled at [`fonts/OFL-Urbanist.txt`](fonts/OFL-Urbanist.txt) and **must
travel with the font files** in any redistribution. Under the OFL you may use, embed, and
redistribute the font, but you may not sell it on its own and must keep this attribution.

### Olney Light — ⚠️ license unresolved
The font's own metadata reads *"Generated in 2010 by FontLab Studio. Copyright info pending"* — it
carries **no license grant and no clear owner**. Treat it as **not cleared for redistribution**:
- Do **not** ship `olney_light.otf` in a public build until its rights are confirmed.
- Olney is only a **rare display accent** (logo wordmark / occasional accent word — see
  `fonts/brand-fonts-override.css`), so the identity does not depend on it. If rights can't be
  cleared, drop the `@font-face` for Olney and the accent gracefully falls back to Urbanist.
- If IDE.IA licensed Olney directly, record that grant here and delete this warning.

## IDE.IA brand assets

`assets/logo/`, `assets/icons/`, `assets/icons-dark/`, `assets/patterns/`,
`assets/illustrations/`, and the color/type system are **IDE.IA's proprietary visual identity**,
included here for building IDE.IA surfaces. They are not licensed for use by unrelated third
parties. The Mulish / Montserrat / Sora substitutes referenced in `tokens/fonts.css` are loaded
from Google Fonts (each OFL) and are not bundled.
