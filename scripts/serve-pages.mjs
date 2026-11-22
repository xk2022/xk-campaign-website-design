import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const outputRoot = join(projectRoot, "out");
const packageJson = JSON.parse(await readFile(join(projectRoot, "package.json"), "utf8"));
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? `/${packageJson.name}`;
const args = process.argv.slice(2);
let port = Number(process.env.PORT ?? 3000);
for (let index = 0; index < args.length; index += 1) {
  if (args[index] === "--port") port = Number(args[++index]);
  else if (args[index].startsWith("--port=")) port = Number(args[index].slice(7));
  else throw new Error(`Unsupported option: ${args[index]}`);
}
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Use --port with an integer from 1 to 65535.");
if (basePath && (!basePath.startsWith("/") || basePath.endsWith("/") || /[?#\\\s]/.test(basePath))) {
  throw new Error("NEXT_PUBLIC_BASE_PATH must be empty or a path beginning with / and without a trailing slash.");
}
await stat(join(outputRoot, "index.html")).catch(() => {
  throw new Error("Missing out/index.html. Run npm run build:pages first.");
});

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".wasm": "application/wasm",
};

const server = createServer(async (request, response) => {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Cache-Control", "no-cache");
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method not allowed");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url ?? "/", "http://127.0.0.1").pathname);
  } catch {
    response.writeHead(400);
    response.end("Invalid URL");
    return;
  }
  if (basePath && pathname === basePath) {
    response.writeHead(308, { Location: `${basePath}/` });
    response.end();
    return;
  }
  if (!pathname.startsWith(`${basePath}/`)) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  let filePath = resolve(outputRoot, `.${pathname.slice(basePath.length)}`);
  const relativePath = relative(outputRoot, filePath);
  if (relativePath === ".." || relativePath.startsWith(`..${sep}`)) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  try {
    if ((await stat(filePath)).isDirectory()) filePath = join(filePath, "index.html");
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error("Not a file");
    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath)] ?? "application/octet-stream",
      "Content-Length": fileStat.size,
    });
    if (request.method === "HEAD") response.end();
    else createReadStream(filePath).on("error", () => response.destroy()).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.on("error", (error) => {
  console.error(error.message);
  process.exit(1);
});
server.listen(port, "127.0.0.1", () => {
  console.log(`Pages preview: http://127.0.0.1:${port}${basePath}/`);
});
