const BASE_URL = "https://api.dynadot.com/restful/v2";

function getApiKey(): string {
  const key = process.env.DYNADOT_API_KEY;
  if (!key) throw new Error("DYNADOT_API_KEY environment variable is not set");
  return key;
}

export async function dynadotRequest<T>(
  method: string,
  path: string,
  body?: Record<string, unknown>,
  params?: Record<string, string | number | boolean | string[] | undefined>
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === "") continue;
      if (Array.isArray(value)) {
        for (const item of value) url.searchParams.append(key, String(item));
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${getApiKey()}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const options: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  const res = await fetch(url.toString(), options);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Dynadot API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}
