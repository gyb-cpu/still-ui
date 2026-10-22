# Upstream and sync policy

This repository is a curated fork of [Arc Library](https://github.com/kuratlielia/arc-library) (MIT). It keeps the free, open part of that library and drops the rest.

- **Pinned upstream:** commit `d2db2a9` (2026-10-21), the last clone used to seed this repository.
- **What changed here:** install folder `arc/` → `still/`, registry namespace `@still`, palette retuned to cool neutrals + indigo (`registry/foundation.css`), primary buttons use the accent, provider renamed to `StillProvider`, and the item list reduced to the 31 components + 1 block this repository keeps. Docs, `llms.txt`, `public/r` and CI are local.
- **What was not copied:** Arc Pro (66 components + 87 blocks) is commercial and is not in the upstream public repository. Do not add it here.
- **License:** the upstream MIT notice is retained in `LICENSE`; modifications are licensed MIT too.

## Adding an item from upstream

1. Copy `registry/components/<id>/` from a pinned upstream checkout.
2. Add a matching entry to `registry.json`: `name`, `type`, `title`, `description`, `categories`, `dependencies`, `registryDependencies` (`https://raw.githubusercontent.com/gyb-cpu/still-ui/main/public/r/<id>.json` for local items), and `files` with `path` + `type`.
3. If the item imports `@/lib/*` helpers, copy those files into `lib/` and add them to the item's `files` so the CLI installs them (see `avatar` and `calendar` for examples).
4. Run `npm run build` (rebuilt `public/r/` and `docs/`) and `npm run check`.
5. Commit the source, `registry.json`, `public/r/<id>.json`, and `docs/<id>.md` together.

## Syncing later

Upstream is a generated mirror that replaces its contents on every release, so merging it directly creates conflicts in `registry.json`, `public/r` and the README. Preferred flow: pin a new upstream commit, diff `registry.json` against the previous pin, and copy only the items or fixes you want, then rebuild.

Do not file pull requests against upstream that reference the `still/` layout; upstream's generator rewrites paths for `arc/`.
