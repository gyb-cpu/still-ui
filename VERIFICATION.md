# Verification

Date: 2026-10-22. Environment: Windows, Node 24.14, npm 11.19, Chrome (headless, Playwright), shadcn CLI 4.22.1.

The library is the full free Arc set: 116 components + 22 blocks + 2 foundation items = **140 registry items**. Visual language, tokens, and component source match the upstream site ([uiarc.dev](https://uiarc.dev)).

## Library checks

`npm run check` in this repository:

- `tsc --noEmit` — passed (covers every component, block, and lib file, including the three Next.js page blocks).
- `eslint .` — passed.
- `node scripts/check-registry.mjs` — `Registry OK: 140 items, every file present, installed where it belongs and up to date.`
- `npm run build` — regenerates `public/r` (140 files) and `docs/` (138 pages) deterministically; CI asserts the generated files are committed.

## Full install simulation

A fresh Vite React 19 + TypeScript app (`still-ui-demo`, outside this repository) received every file from the prebuilt registry at its declared target path:

- 137 items installed, 420 files, 289 unique targets.
- Three Next.js page examples (`changelog-feed`, `newsletter-signup`, `site-header`) were skipped in the Vite app because they import `next/image` or `next/link` directly; they are typechecked in the library repository instead.
- A barrel that re-exports all 138 installed TSX modules compiled: `tsc --noEmit` passed (with `lib: ES2023`, required by `signature-pad`).
- `vite build` passed: 813.9 kB JS, 200.5 kB CSS.
- Playwright render: no page errors; dialog opens and closes with Escape; `data-theme` and `data-accent` switches apply; the `sign-in` block rendered correctly inside the page. Screenshots use the original Arc look: neutral palette, 18px control radius, ink primary button, Inter loaded (Geist fallback).
- Verified values in the browser: `--accent: oklch(33% 0 0)`, primary button `background: oklch(0.15 0 0)`, radius `18px`, no horizontal overflow at 1280px.

## Real shadcn CLI install

A second fresh Vite app (`still-ui-cli-test`) registered only the raw registry in `components.json`:

```json
{ "registries": { "@still": "https://raw.githubusercontent.com/gyb-cpu/still-ui/main/public/r/{name}.json" } }
```

`npx shadcn@latest add @still/still-foundation @still/sign-in @still/date-picker @still/dialog --yes --overwrite` created 22 files under `src/components/still/`, including the sign-in **block** and the components it composes (avatar, button, input, otp-input, calendar), plus `lib/media.ts`, `lib/still-provider.tsx`, `lib/use-today.ts`. The CLI installed `motion` / `lucide-react` / Radix packages as needed and rewrote imports to relative paths (`../../avatar/avatar`, `../../lib/motion-tokens`).

Then `tsc --noEmit` and `vite build` passed.

## Not verified

- The repository has no unit or e2e suite; verification is typecheck, registry consistency, production builds, and browser smoke checks.
- Visual inspection covered button, input, dialog, card, badge, progress, the sign-in block, and the theme tokens; the other items compile and build but were not each rendered.
- The three Next.js page blocks require Next.js at runtime and were not rendered in the Vite app.
- Copy is English and formatting defaults are `en-US`; blocks ship upstream demo copy, including the "Arc" brand name, to replace before shipping.
