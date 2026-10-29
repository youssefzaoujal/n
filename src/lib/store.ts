import { promises as fs } from "fs";
import path from "path";

/**
 * Stockage des messages secrets.
 * - En ligne : Upstash Redis (variables KV_REST_API_URL / KV_REST_API_TOKEN
 *   ou UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).
 * - En local (npm run dev) : fichier .data/messages.json.
 */

export interface SecretMessage {
  id: string;
  text: string;
  createdAt: string;
}

const KEY = "nouha:messages";
const MAX_MESSAGES = 1000;

const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const storageMode: "redis" | "file" = redisUrl && redisToken ? "redis" : "file";

async function redis<T>(command: (string | number)[]): Promise<T> {
  const res = await fetch(redisUrl!, {
    method: "POST",
    headers: { Authorization: `Bearer ${redisToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const json = (await res.json()) as { result?: T; error?: string };
  if (!res.ok || json.error) throw new Error(json.error || `Redis ${res.status}`);
  return json.result as T;
}

const FILE = path.join(process.cwd(), ".data", "messages.json");

async function readFile(): Promise<SecretMessage[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as SecretMessage[];
  } catch {
    return [];
  }
}

async function writeFile(list: SecretMessage[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), "utf8");
}

export async function countMessages(): Promise<number> {
  if (storageMode === "redis") return redis<number>(["HLEN", KEY]);
  return (await readFile()).length;
}

export async function addMessage(text: string): Promise<SecretMessage> {
  const msg: SecretMessage = { id: crypto.randomUUID(), text, createdAt: new Date().toISOString() };
  if ((await countMessages()) >= MAX_MESSAGES) throw new Error("full");
  if (storageMode === "redis") {
    await redis(["HSET", KEY, msg.id, JSON.stringify(msg)]);
  } else {
    const list = await readFile();
    list.push(msg);
    await writeFile(list);
  }
  return msg;
}

export async function listMessages(): Promise<SecretMessage[]> {
  let list: SecretMessage[];
  if (storageMode === "redis") {
    const flat = await redis<string[]>(["HGETALL", KEY]);
    list = [];
    for (let i = 1; i < flat.length; i += 2) {
      try {
        list.push(JSON.parse(flat[i]) as SecretMessage);
      } catch {
        /* ignore a malformed row */
      }
    }
  } else {
    list = await readFile();
  }
  return list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function deleteMessage(id: string): Promise<void> {
  if (storageMode === "redis") {
    await redis(["HDEL", KEY, id]);
  } else {
    await writeFile((await readFile()).filter((m) => m.id !== id));
  }
}
