import { readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const packageJson = JSON.parse(await readFile(join(projectRoot, "package.json"), "utf8"));
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? `/${packageJson.name}`;

if (basePath && (!basePath.startsWith("/") || basePath.endsWith("/") || /[?#\\\s]/.test(basePath))) {
  console.error("NEXT_PUBLIC_BASE_PATH must be empty or a path beginning with / and without a trailing slash.");
  process.exit(1);
}

const result = spawnSync(process.execPath, [join(projectRoot, "node_modules/next/dist/bin/next"), "build"], {
  cwd: projectRoot,
  stdio: "inherit",
  env: { ...process.env, STATIC_EXPORT: "true", NEXT_PUBLIC_BASE_PATH: basePath },
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
if (result.status !== 0) process.exit(result.status ?? 1);

await writeFile(join(projectRoot, "out/.nojekyll"), "");
console.log(`Static Pages build ready: out → ${basePath || "/"}`);
