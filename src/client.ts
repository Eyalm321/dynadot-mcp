const BASE_URL = "https://api.dynadot.com/api3.json";

function getApiKey(): string {
  const key = process.env.DYNADOT_API_KEY;
  if (!key) throw new Error("DYNADOT_API_KEY environment variable is not set");
  return key;
}

/**
 * Convert a domain name to ASCII punycode form (xn--...). Pass-through for
 * domains that are already ASCII. The Dynadot API rejects non-ASCII hostnames.
 */
export function toPunycode(domain: string): string {
  if (/^[\x00-\x7F]+$/.test(domain)) return domain;
  try {
    const url = new URL(`http://${domain}`);
    return url.hostname;
  } catch {
    return domain;
  }
}

export type DynadotParam =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | undefined;

/**
 * Make a Dynadot v3 API request.
 *
 * Auth is via `key=API_KEY` query param. Arrays are expanded as
 * `name0=...&name1=...` (Dynadot's bulk-input convention), not repeated
 * `name=...&name=...`.
 */
export async function dynadotRequest<T = unknown>(
  command: string,
  params?: Record<string, DynadotParam>
): Promise<T> {
  const url = new URL(BASE_URL);
  url.searchParams.set("key", getApiKey());
  url.searchParams.set("command", command);

  if (params) {
    for (const [name, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === "") continue;
      if (Array.isArray(value)) {
        value.forEach((item, i) => {
          if (item === undefined || item === null || item === "") return;
          url.searchParams.set(`${name}${i}`, String(item));
        });
      } else {
        url.searchParams.set(name, String(value));
      }
    }
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Dynadot API error ${res.status}: ${text}`);
  }

  const data = (await res.json()) as any;

  // Dynadot v3 surfaces application errors inside the body. Detect common
  // shapes and surface them as thrown errors so MCP tool handlers report them.
  if (data && typeof data === "object") {
    if (data.code !== undefined && data.code !== 0 && data.code !== 200) {
      const desc = data?.error?.description ?? data?.message ?? JSON.stringify(data);
      throw new Error(`Dynadot API error ${data.code}: ${desc}`);
    }
    if (data.SuccessCode !== undefined && data.SuccessCode !== 0) {
      const err = data?.Error ?? data?.Response?.ResponseHeader?.Error ?? "Unknown error";
      throw new Error(`Dynadot API error: ${err}`);
    }
    const responseHeader = data?.Response?.ResponseHeader ?? data?.ResponseHeader;
    if (responseHeader?.SuccessCode !== undefined && responseHeader.SuccessCode !== 0) {
      throw new Error(`Dynadot API error: ${responseHeader?.Error ?? "Unknown error"}`);
    }
  }

  return data as T;
}
