# Verification

Date: 2026-10-22. Environment: Windows, Node 24.14, npm 11.19, Chrome (headless, Playwright), shadcn CLI 4.22.1.

The library is the full free Arc set: 116 components + 22 blocks + 2 foundation items = **140 registry items**.

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
- `vite build` passed: 811 kB JS (256 kB gzip), 189.9 kB CSS (30.4 kB gzip).
- Playwright render: no page errors; `prefers-reduced-motion` respected by the components; dialog opens and closes with Escape; theme switch and `data-accent` changes apply. Light and dark screenshots captured with the original Arc visual language (neutral palette, 18px control radius, ink primary button) and Inter loaded.

## Real shadcn CLI install

A second fresh Vite app (`still-ui-cli-test`) registered only the raw registry in `components.json`:

```json
{ "registries": { "@still": "https://raw.githubusercontent.com/gyb-cpu/still-ui/main/public/r/{name}.json" } }
```

`npx shadcn@latest add @still/still-foundation @still/button @still/input @still/dialog --yes --overwrite` created 9 files under `src/components/still/`, installed `motion` / `lucide-react` / `@radix-ui/react-dialog` as needed, and rewrote local imports to relative paths. Then `tsc --noEmit` and `vite build` passed, and Playwright confirmed the dialog renders and opens.

## Not verified

- The repository has no unit or e2e suite; verification is typecheck, registry consistency, production builds, and browser smoke checks.
- Only a small subset (button, input, dialog, card, badge, progress, plus the theme tokens) was visually inspected; the other items compile and build but were not each rendered.
- Copy is English and formatting defaults are `en-US`, as inherited from upstream.
- The three Next.js page blocks require Next.js at runtime and were not rendered in the Vite app.
