/**
 * Generates the AI-facing docs from registry.json and the component source:
 *   docs/<item>.md   one page per item (install, files, exports, usage, upstream preview)
 *   llms.txt         index for agents
 *   docs/README.md   human index
 *
 *   node scripts/build-docs.mjs
 */
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const registry = JSON.parse(await readFile("registry.json", "utf8"));
const docsDir = "docs";
const rawBase = "https://raw.githubusercontent.com/gyb-cpu/still-ui/main/public/r";
const repoUrl = "https://github.com/gyb-cpu/still-ui";
const FENCE = "```";
const code = (lang, body) => [FENCE + lang, body, FENCE].join("\n");

const itemDir = item => {
  const first = item.files[0]?.path ?? "";
  const match = /^registry\/components\/([^/]+)\//.exec(first);
  return match ? match[1] : item.name;
};

const exportNames = content => {
  const names = new Set();
  for (const m of content.matchAll(/export\s+(?:const|function|class)\s+([A-Za-z_$][\w$]*)/g)) names.add(m[1]);
  for (const m of content.matchAll(/export\s+interface\s+([A-Za-z_$][\w$]*)/g)) names.add(m[1]);
  for (const m of content.matchAll(/export\s+type\s+([A-Za-z_$][\w$]*)/g)) names.add(m[1]);
  for (const m of content.matchAll(/export\s*\{([^}]+)\}/g)) {
    for (const part of m[1].split(",")) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim();
      if (name && name !== "default") names.add(name);
    }
  }
  return [...names];
};

const readMain = async item => {
  const tsx = item.files.map(file => file.path).filter(file => /\.tsx$/.test(file));
  const main = tsx.find(file => file.includes(`/${itemDir(item)}.tsx`)) ?? tsx[0];
  if (!main) return { main: null, exports: [] };
  const content = await readFile(main, "utf8");
  return { main, exports: exportNames(content) };
};

const describeWhen = item => {
  const name = item.title ?? item.name;
  if (item.type === "registry:block") return `Use this block when you need a complete ${name} surface: it composes the components it needs and is meant to be dropped into a page.`;
  if (item.name.endsWith("foundation")) return "Install once per app. Every component reads these tokens; components never install this file themselves, so your own theme can replace it.";
  if (item.name.endsWith("motion-tokens")) return "Installed automatically with any item that animates. Do not import it directly unless you are building your own Still component.";
  return `Use this component for: ${item.description.replace(/\.$/, "")}. Skip it when a plain element or an existing app component already does the job.`;
};

await rm(docsDir, { recursive: true, force: true });
await mkdir(docsDir, { recursive: true });

const rows = [];
const llms = [
  "# Still UI",
  "",
  "> Personal React components with calm motion, forked from Arc Library (MIT). Source you own: CSS modules on semantic design tokens, Motion for animation, keyboard support and a reduced-motion path in every item.",
  "",
  `There are ${registry.items.length} installable items. Install with the shadcn CLI from this repository's raw registry, or copy the files by hand. Components are React 19 + TypeScript, Next.js (App Router) or Vite, no Tailwind required.`,
  "",
  "## Install",
  "",
  "Register the registry once in `components.json`:",
  "",
  code("json", `{ "registries": { "@still": "${rawBase}/{name}.json" } }`),
  "",
  "Then:",
  "",
  code("bash", "npx shadcn@latest add @still/still-foundation   # design tokens, once per app\nnpx shadcn@latest add @still/button @still/dialog"),
  "",
  "Or install from a full URL, without editing components.json:",
  "",
  code("bash", `npx shadcn@latest add ${rawBase}/button.json`),
  "",
  'Import the tokens once at the app root: `import "@/components/still/foundation.css";`',
  "",
  "## Rules for agents",
  "",
  "- Prefer an existing Still component over writing a new one; read its page in `docs/` before using it and use only documented props.",
  "- Keep semantic HTML, keyboard behavior, and a reduced-motion branch (`prefers-reduced-motion`) for every animation.",
  "- Use the semantic tokens (`--background`, `--surface`, `--foreground`, `--text-secondary`, `--border`, `--accent`, `--success`, `--warning`, `--danger`) instead of raw colors; check light and dark.",
  "- Use `motionTokens` presets from `@/lib/motion-tokens` (`snappy` for presses, `smooth` for panels, `morph` for shared highlights). Motion explains cause and effect.",
  "- Follow the visual language: cool neutrals, indigo accent, restrained motion. Do not add decorative gradients, glows, or a second icon set.",
  "",
  "## Components",
  "",
];

for (const item of registry.items.filter(entry => !entry.name.startsWith("still-"))) {
  const dir = itemDir(item);
  const { main, exports } = await readMain(item);
  const mainEntry = main ? item.files.find(file => file.path === main) : null;
  const importPath = mainEntry?.target
    ? mainEntry.target.replace("@components/", "@/components/").replace(/\.tsx$/, "")
    : main
      ? main.replace(/^registry\//, "@/components/still/").replace(/\.tsx$/, "")
      : null;
  const primary = exports.find(name => name !== "useToday") ?? "Component";
  const link = `https://uiarc.dev/components/${dir}`;
  const sample = importPath
    ? code("tsx", `import { ${primary} } from "${importPath}";\n\nexport function Example() {\n  return <${primary} />;\n}`)
    : null;

  const sections = [
    `# ${item.title ?? item.name}`,
    "",
    item.description,
    "",
    `**Type:** ${item.type.replace("registry:", "")}  `,
    `**Id:** \`${item.name}\``,
    "",
    "## When to use it",
    "",
    describeWhen(item),
    "",
    "## Install",
    "",
    code("bash", `npx shadcn@latest add @still/${item.name}`),
  ];
  if (sample) sections.push("", sample);
  sections.push("", "## Files", "", ...item.files.map(file => `- \`${file.path}\` -> \`${file.target ?? ""}\``));
  if (item.dependencies?.length) sections.push("", "## npm dependencies", "", ...item.dependencies.map(dep => `- \`${dep}\``));
  if (exports.length) sections.push("", "## Exports", "", ...exports.map(name => `- \`${name}\``));
  sections.push(
    "",
    "## Notes",
    "",
    "- Props, events, and accessibility notes live in the source file; read it before composing.",
    `- Upstream preview and full notes (free items): ${link}`,
    "- This page is generated by `scripts/build-docs.mjs`; edit the generator, not the page.",
    "",
  );

  await writeFile(path.join(docsDir, `${item.name}.md`), sections.join("\n"));
  rows.push({ name: item.name, title: item.title ?? item.name, type: item.type.replace("registry:", ""), description: item.description });
  llms.push(`- [${item.title ?? item.name}](${repoUrl}/blob/main/docs/${item.name}.md): ${item.description}`);
}

const index = [
  "# Still UI docs",
  "",
  `Generated from \`registry.json\`: ${rows.length} components and blocks plus the foundation and motion tokens.`,
  "",
  "| Item | Type | Description |",
  "| --- | --- | --- |",
  ...rows.map(row => `| [${row.title}](./${row.name}.md) | ${row.type} | ${row.description} |`),
  "",
  "Install: `npx shadcn@latest add @still/<item>` after registering the registry in `components.json`.",
  "",
].join("\n");
await writeFile(path.join(docsDir, "README.md"), index);
llms.push("", "## Docs", "", "Every item has a page under `docs/`. Read it before using the component.", "");
await writeFile("llms.txt", `${llms.join("\n")}\n`);

console.log(`Docs written: ${rows.length} pages in ${docsDir}/, plus llms.txt and docs/README.md.`);
