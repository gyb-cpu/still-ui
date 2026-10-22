# Still UI skill

Use this skill when building React or Next.js interfaces and a Still component exists for the job. The library is source you install into the project, not a runtime dependency.

The repository ships the full free Arc set: 116 components and 22 blocks (140 registry items), with the original Arc visual language — neutral palette, Geist/Inter type, soft radii, calm spring motion.

## Install

Register the registry once in the project's `components.json`:

```json
{
  "registries": {
    "@still": "https://raw.githubusercontent.com/gyb-cpu/still-ui/main/public/r/{name}.json"
  }
}
```

Then install items by id:

```bash
npx shadcn@latest add @still/still-foundation
npx shadcn@latest add @still/button @still/dialog
```

Files land in `components/still/<id>/` (or `src/components/still/…`). Import the tokens once at the app root:

```tsx
import "@/components/still/foundation.css";
```

If the project has no `components.json`, run `npx shadcn@latest init` first and accept the `@/*` alias.

## Choose the right item

Read `docs/<id>.md` before using a component. It lists the install command, files, exports, and a usage snippet. The full index is `llms.txt`.

| Job | Item |
| --- | --- |
| Primary or destructive action | `button` |
| Text entry | `input`, `textarea` |
| Pick one or many values | `select`, `combobox`, `checkbox`, `switch`, `radio-group`, `slider` |
| Numeric entry | `number-field` |
| Dates | `date-picker`, `calendar` |
| Focused task or confirmation | `dialog` |
| Side panel | `drawer` |
| Contextual actions | `dropdown-menu`, `context-menu` |
| Explain or preview | `popover`, `tooltip` |
| Switch views in place | `tabs`, `accordion` |
| Transient feedback | `toast`, `alert` |
| Progress and loading | `progress`, `skeleton`, `stepper` |
| Structure and identity | `card`, `badge`, `avatar` |
| Tables and paging | `sortable-data-table`, `pagination` |
| Empty results | `empty-state` |
| Command surface | `command-palette` block |

Do not install a component for a plain `<button>`, a native `<input>` inside an existing form system, or anything the project already has a house component for. Prefer one still item over a new bespoke component.

**Blocks** are complete sections or screens (sign-in, sign-up, command palette, pricing comparison, hero, site header/footer, FAQ, changelog, blog grid, stats band, file upload, notification center, empty states). Reach for a block when the job is a whole section; install it, then replace copy, data, and links. Blocks pull in the components they compose automatically.

## Design rules

- **Tokens only.** Components read `--background`, `--surface`, `--foreground`, `--text-secondary`, `--border`, `--accent`, `--success`, `--warning`, `--danger`, `--radius-*`, `--shadow-*`. Never hardcode a hex, oklch, or px radius in app code. Theme changes happen in `components/still/foundation.css`.
- **Theme.** Set `data-theme="dark"` on `<html>` for dark mode and `data-accent` for an alternate accent. Check both themes after composing.
- **Type and space.** Use the existing scale (`--text-sm`, `--leading-body`, `--space-*`). Do not invent a second type ramp.
- **Surfaces.** Cards and panels use `--surface` / `--surface-muted`; floating layers use `--shadow-raised` / `--shadow-floating`.
- **No second system.** Do not add Tailwind classes, another icon set, or a second CSS framework alongside these CSS modules. Lucide icons are already a dependency of most items.

## Motion rules

- Import presets from `@/lib/motion-tokens` (installed with each item) and pass them to Motion: `snappy` for presses and toggles, `smooth` for panels and layout shifts, `morph` for shared highlights and width changes.
- Animate cause and effect, not decoration. Keep staggers short; total stagger under roughly 0.4s.
- Every animation needs a reduced-motion branch (`prefers-reduced-motion` or `useReducedMotion`). Never make motion the only signal.
- Do not add page-load animations, parallax, or gradient glows that the component does not already have.

## Composition and accessibility

- Keep semantic HTML and the component's rendered roles; do not replace a `<button>` with a `<div onClick>`.
- Every interactive element must work with keyboard: Tab reaches it, Enter/Space activate, Escape closes overlays, arrow keys move inside menus and lists.
- Give icon-only buttons an accessible name (`aria-label`), and keep focus visible (keyboard focus uses the shared `:focus-visible` outline).
- Label every form control; pair status colors (`--success`, `--warning`, `--danger`) with text or an icon.
- Loading and disabled states come from the component's props (`loading`, `disabled`), not ad-hoc styles.

## Verify before finishing

1. `npm run build` (or the project's equivalent) passes.
2. The touched page renders in light and dark (`data-theme`).
3. Reduced motion works: enable the OS setting or force it in DevTools and confirm the layout still settles.
4. Keyboard pass: Tab through the new UI, open and close overlays with Escape, activate with Enter/Space.
5. No raw colors or new radii in the diff; no second icon/CSS system.
6. Report what was real and what is still mock or unverified.

## Example

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/still/button/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/still/dialog/dialog";
import { Input } from "@/components/still/input/input";

export function RenameProject({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Rename</Button>
      </DialogTrigger>
      <DialogContent title="Rename project" description="The new name appears everywhere this project is linked.">
        <Input aria-label="Project name" defaultValue={name} />
        <Button variant="primary" onClick={() => setOpen(false)}>
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
```
