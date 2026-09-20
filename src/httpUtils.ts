import fs from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { createHash } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Readable as NodeReadable } from "node:stream";

const uncachedHeaders = {
  "cache-control": "private, no-store",
  "cdn-cache-control": "no-store",
};

export type JsonObject = Record<string, unknown>;

export async function parseJson(req: IncomingMessage): Promise<JsonObject> {
  const limit = 1024 * 1024;
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) {
      const error = new Error("Request body exceeds 1 MB");
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  const value: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    const error = new Error("Request body must be a JSON object");
    error.status = 400;
    throw error;
  }
  return value as JsonObject;
}

export function sendJson(
  res: ServerResponse,
  status: number,
  payload: unknown,
  extraHeaders: Record<string, string | number> = {},
) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    ...uncachedHeaders,
    ...extraHeaders,
  });
  res.end(body);
}

export async function sendStatic(res: ServerResponse, publicDir: string, filePath: string) {
  const safePath = filePath === "/" ? "/index.html" : filePath;
  const absolute = path.join(publicDir, path.normalize(safePath).replace(/^(\.\.[/\\])+/, ""));
  try {
    let body = await fs.readFile(absolute);
    if (absolute.endsWith(".html")) {
      const version = await frontendVersion(publicDir);
      body = Buffer.from(body.toString("utf8").replaceAll("__ASSET_VERSION__", version));
    }
    res.writeHead(200, {
      "content-type": contentType(absolute),
      "content-length": body.length,
      ...uncachedHeaders,
    });
    res.end(body);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8", ...uncachedHeaders });
      res.end("Not found");
      return;
    }
    throw error;
  }
}

async function frontendVersion(publicDir: string) {
  const hash = createHash("sha256");
  // Read current contents so local development and packaged deployments agree.
  async function visit(relativeDir: string): Promise<void> {
    const entries = await fs.readdir(path.join(publicDir, relativeDir), { withFileTypes: true });
    entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    for (const entry of entries) {
      const relative = path.join(relativeDir, entry.name);
      if (entry.isDirectory()) await visit(relative);
      else if (entry.isFile()) {
        hash.update(relative).update("\0");
        hash.update(
          createHash("sha256")
            .update(await fs.readFile(path.join(publicDir, relative)))
            .digest(),
        );
      }
    }
  }
  await visit("");
  return hash.digest("hex").slice(0, 20);
}

export async function proxyHttp(
  req: IncomingMessage,
  res: ServerResponse,
  baseUrl: string,
  targetPath: string,
  { locationPrefix = "" }: { locationPrefix?: string } = {},
) {
  const target = new URL(targetPath, baseUrl);
  const body = ["GET", "HEAD"].includes(req.method || "GET")
    ? undefined
    : Buffer.concat(await readChunks(req));
  const response = await fetch(target, {
    method: req.method,
    redirect: "follow",
    headers: {
      accept: req.headers.accept || "*/*",
      ...(req.headers["content-type"] ? { "content-type": req.headers["content-type"] } : {}),
      "user-agent": req.headers["user-agent"] || "SteepleStream/0.1",
    },
    body,
  });

  const headers: Record<string, string> = {};
  for (const [key, value] of response.headers) {
    if (isHopByHopHeader(key) || key.toLowerCase() === "set-cookie") continue;
    if (key.toLowerCase() === "location" && locationPrefix) {
      const location = new URL(value, baseUrl);
      headers[key] = `${locationPrefix}${location.pathname}${location.search}`;
    } else {
      headers[key] = value;
    }
  }
  res.writeHead(response.status, headers);
  if (req.method === "HEAD" || !response.body) {
    res.end();
    return;
  }
  Readable.fromWeb(response.body).pipe(res);
}

async function readChunks(stream: NodeReadable): Promise<Buffer[]> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of stream) {
    size += chunk.length;
    if (size > 2 * 1024 * 1024)
      throw Object.assign(new Error("Proxied request body is too large"), { status: 413 });
    chunks.push(chunk);
  }
  return chunks;
}

export function contentType(filePath: string) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

function isHopByHopHeader(header: string) {
  return [
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
  ].includes(header.toLowerCase());
}
