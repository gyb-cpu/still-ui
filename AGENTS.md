# Still UI — agent rules

Short always-on rules for projects that use Still UI (React 19, Next.js or Vite). Paste this into `AGENTS.md`, `CLAUDE.md`, or the editor's rules file. The full guide lives in the library's `SKILL.md`.

- **Prefer Still over bespoke UI.** Before writing a new component, check whether a Still item covers the job (`llms.txt` in the library repo, or the installed `components/still/` folder). Read that item's `docs/<id>.md` before using it.
- **Install by id** with the shadcn CLI from the `@still` registry; do not copy files from another project or paste from the upstream site.
- **Read the source for props.** Only documented props and exported types exist; do not invent variants.
- **Tokens only.** Use `--background`, `--surface`, `--foreground`, `--text-secondary`, `--border`, `--accent`, `--success`, `--warning`, `--danger`, `--radius-*`, `--shadow-*`. Never hardcode hex/oklch colors or new radii; theme changes belong in `components/still/foundation.css`.
- **Both themes.** Every touched screen must be checked with `data-theme="dark"` and the default light theme.
- **Motion from presets.** Import `motionTokens` from `@/lib/motion-tokens`; every animation needs a reduced-motion branch (`prefers-reduced-motion` / `useReducedMotion`). No decorative or page-load animation.
- **Accessibility.** Keep semantic roles, keyboard paths (Tab, Enter/Space, Escape, arrows), accessible names for icon-only controls, and visible keyboard focus. Pair status colors with text or an icon.
- **No second system.** Do not add Tailwind classes, another icon set, or a second CSS framework next to Still's CSS modules.
- **Verify, do not claim.** Build must pass; check light/dark, reduced motion, keyboard, and overflow at a narrow width. Report what was run and what stayed mock.
