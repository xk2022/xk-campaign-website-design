import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// ESLint's base path must include both the frontend and the root acceptance suite.
const result = spawnSync(
  process.execPath,
  [
    fileURLToPath(new URL("../node_modules/eslint/bin/eslint.js", import.meta.url)),
    "--config",
    "frontend/eslint.config.mjs",
    "frontend",
    "tests",
    "--max-warnings=0",
    ...process.argv.slice(2),
  ],
  { cwd: fileURLToPath(new URL("../..", import.meta.url)), stdio: "inherit" },
);

if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
