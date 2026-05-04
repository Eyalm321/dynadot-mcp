import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { dynadotRequest, dynadotRestRequest, toPunycode } from "../client.js";

describe("toPunycode", () => {
  it("returns ASCII domains unchanged", () => {
    expect(toPunycode("example.com")).toBe("example.com");
    expect(toPunycode("foo.bar.com")).toBe("foo.bar.com");
  });

  it("encodes IDN domains to punycode", () => {
    expect(toPunycode("krämer.ai")).toBe("xn--krmer-hra.ai");
  });
});

describe("dynadotRequest", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    vi.stubEnv("DYNADOT_API_KEY", "test-api-key");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("throws if DYNADOT_API_KEY is not set", async () => {
    vi.stubEnv("DYNADOT_API_KEY", "");
    await expect(dynadotRequest("account_info")).rejects.toThrow(
      "DYNADOT_API_KEY environment variable is not set"
    );
  });

  it("includes key and command query params", async () => {
    let captured = "";
    mockFetch.mockImplementation((url: string) => {
      captured = url;
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    await dynadotRequest("account_info");

    const url = new URL(captured);
    expect(url.origin + url.pathname).toBe("https://api.dynadot.com/api3.json");
    expect(url.searchParams.get("key")).toBe("test-api-key");
    expect(url.searchParams.get("command")).toBe("account_info");
  });

  it("issues a GET request with Accept: application/json", async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });

    await dynadotRequest("account_info");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "GET",
        headers: { Accept: "application/json" },
      })
    );
  });

  it("appends scalar params and skips undefined/empty", async () => {
    let captured = "";
    mockFetch.mockImplementation((url: string) => {
      captured = url;
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    await dynadotRequest("renew", {
      domain: "example.com",
      duration: 1,
      currency: "USD",
      coupon: undefined,
      blank: "",
    });

    const url = new URL(captured);
    expect(url.searchParams.get("domain")).toBe("example.com");
    expect(url.searchParams.get("duration")).toBe("1");
    expect(url.searchParams.get("currency")).toBe("USD");
    expect(url.searchParams.has("coupon")).toBe(false);
    expect(url.searchParams.has("blank")).toBe(false);
  });

  it("expands array params as name0, name1, ...", async () => {
    let captured = "";
    mockFetch.mockImplementation((url: string) => {
      captured = url;
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    await dynadotRequest("search", {
      domain: ["a.com", "b.com", "c.com"],
    });

    const url = new URL(captured);
    expect(url.searchParams.get("domain0")).toBe("a.com");
    expect(url.searchParams.get("domain1")).toBe("b.com");
    expect(url.searchParams.get("domain2")).toBe("c.com");
    expect(url.searchParams.has("domain")).toBe(false);
  });

  it("returns parsed JSON on success", async () => {
    const expected = { Response: { ResponseHeader: { SuccessCode: 0 } }, data: 1 };
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(expected) });

    const result = await dynadotRequest("account_info");
    expect(result).toEqual(expected);
  });

  it("throws on non-2xx HTTP response", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve("Unauthorized"),
    });

    await expect(dynadotRequest("account_info")).rejects.toThrow(
      "Dynadot API error 401: Unauthorized"
    );
  });

  it("throws on application error with code/error.description", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        code: 400,
        message: "Bad Request",
        error: { description: "X-Signature header not entered" },
      }),
    });

    await expect(dynadotRequest("domain_info", { domain: "x.com" })).rejects.toThrow(
      "Dynadot API error 400: X-Signature header not entered"
    );
  });

  it("throws on Response.ResponseHeader SuccessCode != 0", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        Response: { ResponseHeader: { SuccessCode: -1, Error: "invalid command" } },
      }),
    });

    await expect(dynadotRequest("foo")).rejects.toThrow("invalid command");
  });

  it("succeeds when SuccessCode is 0", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        SuccessCode: 0,
        ResponseHeader: { SuccessCode: 0 },
        data: "ok",
      }),
    });

    const result = await dynadotRequest("account_info");
    expect((result as any).data).toBe("ok");
  });
});

describe("dynadotRestRequest", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    vi.stubEnv("DYNADOT_API_KEY", "test-api-key");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("hits the v2 RESTful base URL with Bearer auth", async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ value: 100 }) });

    await dynadotRestRequest("GET", "/domains/example.com/appraisal");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.dynadot.com/restful/v2/domains/example.com/appraisal",
      expect.objectContaining({
        method: "GET",
        headers: {
          Authorization: "Bearer test-api-key",
          Accept: "application/json",
        },
      })
    );
  });

  it("appends scalar query params and skips empties", async () => {
    let captured = "";
    mockFetch.mockImplementation((url: string) => {
      captured = url;
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    await dynadotRestRequest("GET", "/test", { a: "1", b: undefined, c: "" });

    const url = new URL(captured);
    expect(url.searchParams.get("a")).toBe("1");
    expect(url.searchParams.has("b")).toBe(false);
    expect(url.searchParams.has("c")).toBe(false);
  });

  it("throws on non-2xx HTTP response", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      text: () => Promise.resolve("Not Found"),
    });

    await expect(dynadotRestRequest("GET", "/missing")).rejects.toThrow(
      "Dynadot API error 404: Not Found"
    );
  });

  it("returns parsed JSON on success", async () => {
    const expected = { name: "example.com", value: 1234 };
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(expected) });

    const result = await dynadotRestRequest<typeof expected>("GET", "/domains/example.com/appraisal");
    expect(result).toEqual(expected);
  });
});
