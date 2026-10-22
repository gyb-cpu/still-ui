# Still UI — instructions

Paste into `AGENTS.md`, `CLAUDE.md`, or Cursor rules.

- Use Still UI components from `components/still/` instead of writing new UI.
- Install missing items: `npx shadcn@latest add @still/<id>` (registry `@still` in `components.json`).
- Read `docs/<id>.md` in the library repo and the component source before composing; use only documented props.
- Style only with Still tokens (`--background`, `--surface`, `--foreground`, `--text-secondary`, `--border`, `--accent`, `--success`, `--warning`, `--danger`, `--radius-*`, `--shadow-*`). No raw colors, no new radii, no Tailwind, no second icon set.
- Keep animations on `motionTokens` presets and always add a `prefers-reduced-motion` branch.
- Preserve semantic HTML, keyboard behavior, accessible names, and visible keyboard focus.
- Verify light and dark themes, reduced motion, keyboard paths, and a narrow viewport before reporting done.
