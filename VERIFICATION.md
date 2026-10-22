# Verification

Date: 2026-10-22. Environment: Windows, Node 24.14, npm 11.19, Chrome (headless, Playwright), shadcn CLI 4.22.1.

## Library checks

`npm run check` in this repository:

- `tsc --noEmit` — passed.
- `eslint .` — passed.
- `node scripts/check-registry.mjs` — `Registry OK: 34 items, every file present, installed where it belongs and up to date.`

## Full install simulation

A fresh Vite React 19 + TypeScript app (`still-ui-demo`, outside this repository) received every file from `public/r/*.json` at its declared target path (72 files, 69 unique). Then:

- A barrel that re-exports all 33 component modules compiled: `tsc --noEmit` passed.
- `vite build` passed (2496 modules, 42.8 kB CSS).
- Playwright render: no page errors, dialog opens and closes with Escape, `data-accent="violet"` switch changes `--accent` to `#7747ff`, light and dark screenshots captured.

## Real shadcn CLI install

A second fresh Vite app (`still-ui-cli-test`) registered only the raw registry in `components.json`:

```json
{ "registries": { "@still": "https://raw.githubusercontent.com/gyb-cpu/still-ui/main/public/r/{name}.json" } }
```

`npx shadcn@latest add @still/still-foundation @still/button @still/input @still/dialog --yes --overwrite` created 9 files under `src/components/still/`, installed `motion` / `lucide-react` / `@radix-ui/react-dialog` as needed, and rewrote local imports to relative paths (`../lib/motion-tokens`). Then:

- `tsc --noEmit` passed.
- `vite build` passed (19.8 kB CSS).
- Playwright: dialog renders and opens; no page errors.

## Not verified

- The repository has no unit or e2e suite; verification is typecheck, registry consistency, production builds, and browser smoke checks.
- Only button, input, dialog, card, badge, progress and the theme tokens were rendered; the other items compile but were not each visually inspected.
- Copy is still English and formatting defaults are `en-US`, as inherited from upstream.
