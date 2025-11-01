import net from "net";
import tls, { type TLSSocket } from "tls";

type PendingRequest = {
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
};

type RespParseResult =
  | { state: "value"; value: unknown; next: number }
  | { state: "error"; error: Error; next: number };

function findLine(buffer: Buffer, start: number): number {
  for (let index = start; index < buffer.length - 1; index += 1) {
    if (buffer[index] === 13 && buffer[index + 1] === 10) {
      return index;
    }
  }

  return -1;
}

function parseSimpleString(buffer: Buffer, start: number): RespParseResult | null {
  const end = findLine(buffer, start + 1);
  if (end === -1) {
    return null;
  }

  return {
    state: "value",
    value: buffer.toString("utf8", start + 1, end),
    next: end + 2,
  };
}

function parseInteger(buffer: Buffer, start: number): RespParseResult | null {
  const end = findLine(buffer, start + 1);
  if (end === -1) {
    return null;
  }

  const text = buffer.toString("utf8", start + 1, end);
  const value = Number.parseInt(text, 10);

  return {
    state: "value",
    value,
    next: end + 2,
  };
}

function parseError(buffer: Buffer, start: number): RespParseResult | null {
  const end = findLine(buffer, start + 1);
  if (end === -1) {
    return null;
  }

  const message = buffer.toString("utf8", start + 1, end);
  return {
    state: "error",
    error: new Error(message),
    next: end + 2,
  };
}

function parseBulkString(buffer: Buffer, start: number): RespParseResult | null {
  const end = findLine(buffer, start + 1);
  if (end === -1) {
    return null;
  }

  const lengthText = buffer.toString("utf8", start + 1, end);
  const length = Number.parseInt(lengthText, 10);
  if (Number.isNaN(length)) {
    return {
      state: "error",
      error: new Error(`Invalid bulk length: ${lengthText}`),
      next: end + 2,
    };
  }

  if (length === -1) {
    return {
      state: "value",
      value: null,
      next: end + 2,
    };
  }

  const dataStart = end + 2;
  const dataEnd = dataStart + length;
  if (buffer.length < dataEnd + 2) {
    return null;
  }

  return {
    state: "value",
    value: buffer.toString("utf8", dataStart, dataEnd),
    next: dataEnd + 2,
  };
}

function parseArray(buffer: Buffer, start: number): RespParseResult | null {
  const end = findLine(buffer, start + 1);
  if (end === -1) {
    return null;
  }

  const lengthText = buffer.toString("utf8", start + 1, end);
  const length = Number.parseInt(lengthText, 10);
  if (Number.isNaN(length)) {
    return {
      state: "error",
      error: new Error(`Invalid array length: ${lengthText}`),
      next: end + 2,
    };
  }

  if (length === -1) {
    return {
      state: "value",
      value: null,
      next: end + 2,
    };
  }

  const values: unknown[] = [];
  let offset = end + 2;

  for (let index = 0; index < length; index += 1) {
    const parsed = parseResp(buffer, offset);
    if (!parsed) {
      return null;
    }

    if (parsed.state === "error") {
      return parsed;
    }

    values.push(parsed.value);
    offset = parsed.next;
  }

  return {
    state: "value",
    value: values,
    next: offset,
  };
}

function parseResp(buffer: Buffer, start = 0): RespParseResult | null {
  if (buffer.length <= start) {
    return null;
  }

  const prefix = buffer[start];

  switch (prefix) {
    case 43: // +
      return parseSimpleString(buffer, start);
    case 45: // -
      return parseError(buffer, start);
    case 58: // :
      return parseInteger(buffer, start);
    case 36: // $
      return parseBulkString(buffer, start);
    case 42: // *
      return parseArray(buffer, start);
    default:
      return {
        state: "error",
        error: new Error(`Unsupported RESP prefix: ${String.fromCharCode(prefix)}`),
        next: buffer.length,
      };
  }
}

function encodeCommand(args: (string | number)[]): Buffer {
  let command = `*${args.length}\r\n`;

  for (const arg of args) {
    const text = typeof arg === "number" ? arg.toString() : arg;
    const length = Buffer.byteLength(text);
    command += `$${length}\r\n${text}\r\n`;
  }

  return Buffer.from(command, "utf8");
}

class RedisClient {
  private readonly host: string;

  private readonly port: number;

  private readonly useTls: boolean;

  private socket: TLSSocket | net.Socket | null = null;

  private connectPromise: Promise<void> | null = null;

  private buffer: Buffer = Buffer.alloc(0);

  private pending: PendingRequest[] = [];

  constructor(host: string, port: number, useTls: boolean) {
    this.host = host;
    this.port = port;
    this.useTls = useTls;
  }

  async get(key: string): Promise<string | null> {
    const result = await this.send(["GET", key]);

    if (result === null) {
      return null;
    }

    if (typeof result === "string") {
      return result;
    }

    return result != null ? String(result) : null;
  }

  async set(key: string, value: string, options?: { px?: number }): Promise<void> {
    const args: (string | number)[] = ["SET", key, value];

    if (options?.px && Number.isFinite(options.px)) {
      args.push("PX", Math.floor(options.px).toString());
    }

    await this.send(args);
  }

  async del(key: string): Promise<number> {
    const result = await this.send(["DEL", key]);
    return typeof result === "number" ? result : Number(result ?? 0);
  }

  async eval(script: string, keys: string[], args: (string | number)[]): Promise<unknown> {
    const parts: (string | number)[] = ["EVAL", script, keys.length];
    parts.push(...keys);
    parts.push(...args);

    return this.send(parts);
  }

  private async ensureConnection(): Promise<void> {
    if (this.socket && !this.socket.destroyed) {
      return;
    }

    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.connectPromise = new Promise((resolve, reject) => {
      const handleError = (error: Error) => {
        cleanup();
        this.resetConnection(error);
        reject(error);
      };

      const handleConnect = (socket: TLSSocket | net.Socket) => {
        cleanup();
        this.socket = socket;
        this.buffer = Buffer.alloc(0);
        socket.setKeepAlive(true, 60_000);
        socket.on("data", this.onData);
        socket.on("error", this.onSocketError);
        socket.on("close", this.onSocketClose);
        resolve();
      };

      const cleanup = () => {
        connection.removeListener("error", handleError);
        connection.removeListener("secureConnect", secureConnectListener);
        connection.removeListener("connect", connectListener);
      };

      const connectListener = () => handleConnect(connection);
      const secureConnectListener = () => handleConnect(connection);

      const connection = this.useTls
        ? tls.connect({ host: this.host, port: this.port }, secureConnectListener)
        : net.createConnection({ host: this.host, port: this.port }, connectListener);

      connection.once("error", handleError);
    });

    try {
      await this.connectPromise;
    } finally {
      this.connectPromise = null;
    }
  }

  private async send(args: (string | number)[]): Promise<unknown> {
    await this.ensureConnection();

    if (!this.socket) {
      throw new Error("Redis connection unavailable");
    }

    return new Promise((resolve, reject) => {
      this.pending.push({ resolve, reject });

      try {
        const payload = encodeCommand(args);
        const writeSuccess = this.socket!.write(payload);

        if (!writeSuccess) {
          this.socket!.once("drain", () => {
            /* no-op; resolves once socket ready again */
          });
        }
      } catch (error) {
        this.pending.pop();
        reject(error instanceof Error ? error : new Error("Redis write failed"));
      }
    });
  }

  private readonly onData = (chunk: Buffer) => {
    this.buffer = Buffer.concat([this.buffer, chunk]);

    while (true) {
      const parsed = parseResp(this.buffer);
      if (!parsed) {
        break;
      }

      this.buffer = this.buffer.slice(parsed.next);
      const pending = this.pending.shift();

      if (!pending) {
        continue;
      }

      if (parsed.state === "error") {
        pending.reject(parsed.error);
      } else {
        pending.resolve(parsed.value);
      }
    }
  };

  private readonly onSocketError = (error: Error) => {
    this.resetConnection(error);
  };

  private readonly onSocketClose = () => {
    this.resetConnection(new Error("Redis connection closed"));
  };

  private flushPending(error: Error) {
    if (this.pending.length === 0) {
      return;
    }

    const queue = this.pending;
    this.pending = [];

    for (const pending of queue) {
      pending.reject(error);
    }
  }

  private resetConnection(error: Error) {
    if (this.socket) {
      this.socket.removeListener("data", this.onData);
      this.socket.removeListener("error", this.onSocketError);
      this.socket.removeListener("close", this.onSocketClose);
      this.socket.destroy();
      this.socket = null;
    }

    this.connectPromise = null;
    this.buffer = Buffer.alloc(0);
    this.flushPending(error);
  }
}

function resolveMode(rawMode: string | undefined, hasEndpoint: boolean): "redis" | "memory" {
  const normalized = rawMode?.trim().toLowerCase();
  if (!hasEndpoint || normalized === "memory") {
    return "memory";
  }

  return "redis";
}
const rawCacheMode = process.env["UV_WIDGET_CACHE_MODE"];
const rawRateLimitMode = process.env["UV_WIDGET_RATE_LIMIT_MODE"] ?? rawCacheMode;
const endpoint = process.env["UV_WIDGET_CACHE_ENDPOINT"]?.trim() ?? "";
const port = Number.parseInt(process.env["UV_WIDGET_CACHE_PORT"] ?? "6379", 10);
const useTls = (process.env["UV_WIDGET_CACHE_USE_TLS"] ?? "true").trim().toLowerCase() !== "false";
const cacheMode = resolveMode(rawCacheMode, endpoint.length > 0);
const rateLimitMode = resolveMode(rawRateLimitMode, endpoint.length > 0);

let sharedClient: RedisClient | null = null;

function getClient(): RedisClient | null {
  if (endpoint.length === 0) {
    return null;
  }

  if (!sharedClient) {
    sharedClient = new RedisClient(endpoint, Number.isFinite(port) ? port : 6379, useTls);
  }

  return sharedClient;
}

export function getCacheMode(): "redis" | "memory" {
  return cacheMode;
}

export function getRateLimitMode(): "redis" | "memory" {
  return rateLimitMode;
}

export function getCacheRedisClient(): RedisClient | null {
  return cacheMode === "redis" ? getClient() : null;
}

export function getRateLimitRedisClient(): RedisClient | null {
  return rateLimitMode === "redis" ? getClient() : null;
}

export type RedisConnection = RedisClient;
