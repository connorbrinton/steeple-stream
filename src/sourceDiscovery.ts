import { execFile, spawn } from "node:child_process";
import dgram from "node:dgram";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const mdnsAddress = "224.0.0.251";
const mdnsPort = 5353;

export async function discoverNdiSources(currentSource): Promise<any[]> {
  const discovered = new Map();

  for (const name of envSources()) {
    discovered.set(name, { name, source: "env" });
  }

  for (const source of await discoverWithAvahi()) {
    discovered.set(source.name, source);
  }

  for (const source of await discoverWithDnsSd()) {
    discovered.set(source.name, source);
  }

  for (const source of await discoverWithNativeMdns()) {
    discovered.set(source.name, source);
  }

  for (const source of await discoverWithGStreamer()) {
    discovered.set(source.name, source);
  }

  const configured = currentSource?.ndi?.sourceName;
  if (configured && !discovered.has(configured)) {
    discovered.set(configured, {
      name: configured,
      urlAddress: currentSource.ndi?.urlAddress || "",
      source: "configured",
      available: false
    });
  }

  return [...discovered.values()].sort((a, b) => a.name.localeCompare(b.name));
}

async function discoverWithNativeMdns(): Promise<any[]> {
  return new Promise<any[]>((resolve) => {
    const socket = dgram.createSocket({ type: "udp4", reuseAddr: true });
    const found = new Map();
    const query = buildPtrQuery("_ndi._tcp.local");
    const finish = () => {
      socket.removeAllListeners();
      try {
        socket.close();
      } catch {
        // Socket may already be closed.
      }
      resolve([...found.values()]);
    };
    const timer = setTimeout(finish, 2500);

    socket.on("error", () => {
      clearTimeout(timer);
      finish();
    });

    socket.on("message", (message) => {
      for (const name of parsePtrAnswers(message, "_ndi._tcp.local")) {
        found.set(name, { name, source: "native-mdns", available: true });
      }
    });

    socket.bind(0, () => {
      try {
        socket.setMulticastTTL(2);
        socket.setMulticastLoopback(false);
        socket.send(query, mdnsPort, mdnsAddress);
        setTimeout(() => socket.send(query, mdnsPort, mdnsAddress), 500).unref();
      } catch {
        clearTimeout(timer);
        finish();
      }
    });
  });
}

function envSources() {
  return String(process.env.STEEPLE_NDI_SOURCES || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

async function discoverWithAvahi() {
  try {
    const { stdout } = await execFileAsync("avahi-browse", ["-rt", "_ndi._tcp"], { timeout: 2500 });
    return stdout
      .split("\n")
      .map((line) => line.match(/=\s+[^;]+;[^;]+;_ndi\._tcp;[^;]*;([^;]+)/)?.[1])
      .filter(Boolean)
      .map(decodeMdnsName)
      .map((name) => ({ name, source: "avahi", available: true }));
  } catch {
    return [];
  }
}

async function discoverWithDnsSd() {
  try {
    const { stdout } = await execFileAsync("dns-sd", ["-B", "_ndi._tcp", "local"], { timeout: 2500 });
    return stdout
      .split("\n")
      .map((line) => line.match(/\s+_ndi\._tcp\.\s+(.+)$/)?.[1])
      .filter(Boolean)
      .map((name) => ({ name: name.trim(), source: "dns-sd", available: true }));
  } catch {
    return [];
  }
}

async function discoverWithGStreamer() {
  try {
    const stdout = await collectOutput(
      "gst-device-monitor-1.0",
      ["-f", "Source/Network:application/x-ndi"],
      3000
    );
    return parseGstDeviceMonitor(stdout);
  } catch {
    return [];
  }
}

function collectOutput(command, args, timeoutMs) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "ignore"] });
    let stdout = "";
    let timedOut = false;
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.once("error", reject);
    child.once("close", (code) => {
      clearTimeout(timer);
      if (code === 0 || timedOut) resolve(stdout);
      else reject(new Error(`${command} exited with code ${code}`));
    });
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
    }, timeoutMs);
  });
}

export function parseGstDeviceMonitor(output) {
  return String(output)
    .split(/Device found:\s*/)
    .slice(1)
    .map((block) => {
      const name = block.match(/^\s*name\s*:\s*(.+)$/m)?.[1]?.trim();
      const urlAddress = block.match(/^\s*url-address\s*=\s*(.+)$/m)?.[1]?.trim();
      return name
        ? { name, urlAddress: urlAddress || "", source: "gstreamer", available: true }
        : null;
    })
    .filter(Boolean);
}

function decodeMdnsName(name) {
  return name.replace(/\\032/g, " ").trim();
}

export function buildPtrQuery(name) {
  const labels = name.split(".");
  const questionLength = labels.reduce((total, label) => total + 1 + Buffer.byteLength(label), 0) + 1 + 4;
  const buffer = Buffer.alloc(12 + questionLength);
  let offset = 0;
  buffer.writeUInt16BE(Math.floor(Math.random() * 65536), offset);
  offset += 2;
  buffer.writeUInt16BE(0, offset);
  offset += 2;
  buffer.writeUInt16BE(1, offset);
  offset += 2;
  buffer.writeUInt16BE(0, offset);
  offset += 2;
  buffer.writeUInt16BE(0, offset);
  offset += 2;
  buffer.writeUInt16BE(0, offset);
  offset += 2;
  for (const label of labels) {
    const length = Buffer.byteLength(label);
    buffer[offset] = length;
    offset += 1;
    buffer.write(label, offset);
    offset += length;
  }
  buffer[offset] = 0;
  offset += 1;
  buffer.writeUInt16BE(12, offset);
  offset += 2;
  buffer.writeUInt16BE(1, offset);
  return buffer;
}

export function parsePtrAnswers(buffer, queryName) {
  const names = [];
  try {
    const qdCount = buffer.readUInt16BE(4);
    const answerCount = buffer.readUInt16BE(6) + buffer.readUInt16BE(8) + buffer.readUInt16BE(10);
    let offset = 12;
    for (let index = 0; index < qdCount; index += 1) {
      const question = readName(buffer, offset);
      offset = question.offset + 4;
    }

    for (let index = 0; index < answerCount; index += 1) {
      const recordName = readName(buffer, offset);
      offset = recordName.offset;
      if (offset + 10 > buffer.length) break;
      const type = buffer.readUInt16BE(offset);
      offset += 2;
      offset += 2; // class
      offset += 4; // ttl
      const dataLength = buffer.readUInt16BE(offset);
      offset += 2;
      const dataOffset = offset;
      offset += dataLength;

      if (type !== 12 || normalizeMdnsName(recordName.name) !== queryName) continue;
      const ptr = readName(buffer, dataOffset);
      const serviceName = serviceInstanceFromPtr(ptr.name);
      if (serviceName) names.push(serviceName);
    }
  } catch {
    return names;
  }
  return names;
}

function readName(buffer, startOffset, depth = 0) {
  if (depth > 8) throw new Error("DNS name pointer depth exceeded");
  const labels = [];
  let offset = startOffset;
  let nextOffset = null;

  while (offset < buffer.length) {
    const length = buffer[offset];
    if (length === 0) {
      offset += 1;
      break;
    }
    if ((length & 0xc0) === 0xc0) {
      const pointer = ((length & 0x3f) << 8) | buffer[offset + 1];
      const pointed = readName(buffer, pointer, depth + 1);
      labels.push(pointed.name);
      nextOffset = offset + 2;
      break;
    }
    offset += 1;
    labels.push(buffer.subarray(offset, offset + length).toString("utf8"));
    offset += length;
  }

  return { name: labels.filter(Boolean).join("."), offset: nextOffset ?? offset };
}

function normalizeMdnsName(name) {
  return name.replace(/\.$/, "").toLowerCase();
}

function serviceInstanceFromPtr(ptrName) {
  const suffix = "._ndi._tcp.local";
  const normalized = normalizeMdnsName(ptrName);
  if (!normalized.endsWith(suffix)) return null;
  return ptrName.slice(0, ptrName.length - suffix.length).replace(/\.$/, "");
}
