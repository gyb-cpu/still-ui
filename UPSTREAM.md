# Upstream and sync policy

This repository is a fork of [Arc Library](https://github.com/kuratlielia/arc-library) (MIT). It keeps the full free, open part of that library.

- **Pinned upstream:** commit `d2db2a9` (2026-10-21), the clone used to seed this repository.
- **What changed here:** install folder `arc/` → `still/`, registry namespace `@still`, provider renamed to `StillProvider`, item names `arc-foundation` / `arc-motion-tokens` → `still-foundation` / `still-motion-tokens`, `public/r` and `docs/` generated locally, and CI added. The visual language, component source, tokens, and motion presets are upstream's.
- **Scope:** the full free set — 116 components + 22 blocks, 140 registry items. Four block items live under `registry/components/` (`command-palette`, `notification-center`, `otp-input`, `file-upload`) because the registry item type is the source of truth for classification.
- **What was not copied:** Arc Pro (66 components + 87 blocks) is commercial and is not in the upstream public repository. Do not add it here.
- **License:** the upstream MIT notice is retained in `LICENSE`; modifications are licensed MIT too.

## Adding an item from upstream

1. Copy `registry/components/<id>/` or `registry/blocks/<id>/` from a pinned upstream checkout.
2. Add a matching entry to `registry.json`: `name`, `type`, `title`, `description`, `categories`, `dependencies`, `registryDependencies` (`https://raw.githubusercontent.com/gyb-cpu/still-ui/main/public/r/<id>.json` for local items), and `files` with `path` + `type`.
3. If the item imports `@/lib/*` helpers, copy those files into `lib/` and add them to the item's `files` so the CLI installs them (see `avatar`, `calendar`, and the marketing blocks).
4. Run `npm run build` (rebuilds `public/r/` and `docs/`) and `npm run check`.
5. Commit the source, `registry.json`, `public/r/<id>.json`, and `docs/<id>.md` together.

## Syncing later

Upstream is a generated mirror that replaces its contents on every release, so merging it directly creates conflicts in `registry.json`, `public/r` and the README. Preferred flow: pin a new upstream commit, diff `registry.json` against the previous pin, and copy only the items or fixes you want, then rebuild.

Do not file pull requests against upstream that reference the `still/` layout; upstream's generator rewrites paths for `arc/`.
