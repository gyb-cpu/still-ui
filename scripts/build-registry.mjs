/**
 * Rebuilds public/r/<item>.json from the source in this repository.
 *
 * The upstream Arc repository ships prebuilt registry JSON but not the generator, so this is our local equivalent:
 *   node scripts/build-registry.mjs
 *
 * For every item in registry.json it embeds each source file with its imports rewritten for the install layout
 * (scripts/registry-install.mjs), writes the prebuilt JSON, and keeps every file target in registry.json in sync.
 * Run `npm run check:registry` afterwards to verify.
 */
import { readFile, writeFile, readdir, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { importSpecifiers, withRelativeImports, installTarget } from "./registry-install.mjs";

const schema = "https://ui.shadcn.com/schema/registry-item.json";
const registryFile = "registry.json";
const outDir = path.join("public", "r");

const registry = JSON.parse(await readFile(registryFile, "utf8"));

const exists = async file => {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
};

const toPosix = value => value.split(path.sep).join("/");

async function findFile(importPath) {
  const candidates = [importPath, `${importPath}.ts`, `${importPath}.tsx`, `${importPath}.css`, `${importPath}.module.css`, path.join(importPath, "index.ts"), path.join(importPath, "index.tsx")];
  for (const candidate of candidates) if (await exists(candidate)) return toPosix(path.normalize(candidate));
  return null;
}

const resolveFrom = file => specifier => {
  if (specifier.startsWith("./") || specifier.startsWith("../")) return findFile(path.normalize(path.join(path.dirname(file), specifier)));
  if (specifier.startsWith("@/")) return findFile(specifier.slice(2));
  return null;
};

/** The content a registry item should embed: the source with imports rewritten for the installed tree. */
async function buildContent(file) {
  const source = await readFile(file, "utf8");
  if (!/\.(?:tsx?|css)$/.test(file)) return source;
  return withRelativeImports(file, source, importSpecifiers(file, source), resolveFrom(file));
}

await mkdir(outDir, { recursive: true });

let written = 0;
for (const item of registry.items) {
  const files = [];
  for (const file of item.files) {
    const target = installTarget(file.path);
    if (file.target !== target) file.target = target;
    files.push({ path: file.path, type: file.type, target, content: await buildContent(file.path) });
  }
  const prebuilt = {
    $schema: schema,
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    categories: item.categories ?? [],
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    files,
  };
  if (item.meta) prebuilt.meta = item.meta;
  await writeFile(path.join(outDir, `${item.name}.json`), `${JSON.stringify(prebuilt, null, 2)}\n`);
  written += 1;
}

// Keep the source registry's targets in sync with the install layout.
await writeFile(registryFile, `${JSON.stringify(registry, null, 2)}\n`);

const stale = (await readdir(outDir)).filter(name => !registry.items.some(item => `${item.name}.json` === name));
for (const name of stale) await rm(path.join(outDir, name), { force: true });

const remaining = (await readdir(outDir)).length;
if (remaining !== written) throw new Error(`expected ${written} files, found ${remaining}`);
console.log(`Registry built: ${written} items in ${outDir}/.`);
