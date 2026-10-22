# Still UI

Personal React component library with calm motion. Source you own: CSS modules on semantic design tokens, [Motion](https://motion.dev) for animation, keyboard support, and a reduced-motion path in every item. Components are plain files installed into your project — there is no runtime package to keep in sync.

Forked from [Arc Library](https://github.com/kuratlielia/arc-library) (MIT) and retuned to the **still palette**: cool neutrals, indigo accent, restrained motion. This repository keeps 31 components, one block, and the shared design/motion tokens.

![Still UI in light theme](assets/light.png)

![Still UI in dark theme](assets/dark.png)

## Install

Register the registry once in your `components.json`:

```json
{
  "registries": {
    "@still": "https://raw.githubusercontent.com/gyb-cpu/still-ui/main/public/r/{name}.json"
  }
}
```

Install the tokens once per app, then any component:

```bash
npx shadcn@latest add @still/still-foundation
npx shadcn@latest add @still/button @still/input @still/dialog
```

Or install from a full URL without editing `components.json`:

```bash
npx shadcn@latest add https://raw.githubusercontent.com/gyb-cpu/still-ui/main/public/r/button.json
```

Import the tokens at the root of your app:

```tsx
// app/layout.tsx (Next.js) or src/main.tsx (Vite)
import "@/components/still/foundation.css";
```

Files land in `components/still/<id>/…` (or `src/components/still/…` in a `src/` layout) and import each other with relative paths:

```tsx
import { Button } from "@/components/still/button/button";

export function SaveBar() {
  return <Button variant="primary">Save changes</Button>;
}
```

Requirements: React 19 + TypeScript, Next.js (App Router) or Vite, the `@/*` import alias, and `motion`. Some components also pull in `lucide-react` or a Radix primitive; the CLI installs whatever an item needs. No Tailwind required.

## Theme

Components read semantic tokens and never raw colors. Change the palette in `foundation.css` once and every component follows, in both themes.

- **Dark mode:** set `data-theme="dark"` on `<html>`.
- **Accent:** set `data-accent` on `<html>` to `neutral`, `violet`, `blue`, `green`, `amber`, `orange`, `coral`, or `rose`.
- **Default identity:** cool neutral surfaces, indigo accent (`#4f46e5`), soft shadows, spring motion. Tune `--accent`, `--surface*`, `--border*`, `--radius-*`, `--font-body`, and `--shadow-*` in `registry/foundation.css`.
- **Motion:** presets live in `registry/motion-tokens.ts`; every animation respects `prefers-reduced-motion`.

## Components

31 components, grouped by job:

| Group | Items |
| --- | --- |
| Foundation | `still-foundation` (tokens), `still-motion-tokens` |
| Actions | button |
| Forms | input, textarea, select, combobox, checkbox, switch, radio-group, slider, number-field, date-picker, calendar |
| Overlays | dialog, drawer, popover, tooltip, dropdown-menu, context-menu |
| Disclosure | tabs, accordion |
| Feedback | toast, alert, progress, skeleton, stepper |
| Data display | card, badge, avatar, sortable-data-table, pagination |
| Blocks | command-palette |

Each item has a page under [`docs/`](./docs) with its install command, files, exports, and a usage snippet. `llms.txt` is the flat index for coding agents.

## For AI coding agents

- [`SKILL.md`](./SKILL.md): how to choose, install, compose, and verify Still components.
- [`AGENTS.md`](./AGENTS.md): short always-on rules to paste into a project's agent instructions.
- [`llms.txt`](./llms.txt): one line per item.
- [`docs/`](./docs): per-component pages.

## Repository layout

```text
registry/foundation.css        design tokens, light and dark themes
registry/motion-tokens.ts      motion presets
lib/motion-tokens.ts           motion presets, shared import path
lib/still-provider.tsx         swap link/image elements (Next.js, router)
registry/components/<id>/      components and the command-palette block
registry.json                  registry index
public/r/<id>.json             prebuilt registry items consumed by the shadcn CLI
docs/<id>.md                   generated per-item docs
scripts/build-registry.mjs     regenerate public/r from source
scripts/build-docs.mjs         regenerate docs/ and llms.txt
```

## Develop

```bash
npm install
npm run build          # rebuild public/r, docs/ and llms.txt
npm run check          # typecheck + lint + registry consistency
```

To add another item from upstream, copy its folder from `registry/components/`, add a matching entry to `registry.json` (files, dependencies, `registryDependencies`), run `npm run build`, then `npm run check`. Keep the upstream `uiarc.dev` preview link in the item meta as a reference.

## Verification

See [VERIFICATION.md](./VERIFICATION.md) for the checks run on 2026-10-22: `npm run check`, a full install simulation in a fresh Vite app, and a real `shadcn add` from the raw registry followed by typecheck and production build.

## License

MIT. The original Arc Library is © 2026 Elia Kuratli; modifications are © 2026 gyb-cpu. See [LICENSE](./LICENSE). Arc Pro content is not included and is not licensed for redistribution.
