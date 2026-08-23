import fs from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

export async function parseJson(req) {
  const limit = 1024 * 1024;
  const chunks = [];
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
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export function sendJson(res, status, payload, extraHeaders = {}) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    ...extraHeaders
  });
  res.end(body);
}

export async function sendStatic(res, publicDir, filePath) {
  const safePath = filePath === "/" ? "/index.html" : filePath;
  const absolute = path.join(publicDir, path.normalize(safePath).replace(/^(\.\.[/\\])+/, ""));
  try {
    const body = await fs.readFile(absolute);
    res.writeHead(200, {
      "content-type": contentType(absolute),
      "content-length": body.length,
      "cache-control": "no-cache"
    });
    res.end(body);
  } catch (error) {
    if (error.code === "ENOENT") {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    throw error;
  }
}

export async function proxyHttp(req, res, baseUrl, targetPath, { locationPrefix = "" } = {}) {
  const target = new URL(targetPath, baseUrl);
  const body = ["GET", "HEAD"].includes(req.method || "GET") ? undefined : Buffer.concat(await readChunks(req));
  const response = await fetch(target, {
    method: req.method,
    redirect: "follow",
    headers: {
      accept: req.headers.accept || "*/*",
      ...(req.headers["content-type"] ? { "content-type": req.headers["content-type"] } : {}),
      "user-agent": req.headers["user-agent"] || "SteepleStream/0.1"
    },
    body
  });

  const headers = {};
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

async function readChunks(stream) {
  const chunks = [];
  let size = 0;
  for await (const chunk of stream) {
    size += chunk.length;
    if (size > 2 * 1024 * 1024) throw Object.assign(new Error("Proxied request body is too large"), { status: 413 });
    chunks.push(chunk);
  }
  return chunks;
}

export function contentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

function isHopByHopHeader(header) {
  return [
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade"
  ].includes(header.toLowerCase());
}
