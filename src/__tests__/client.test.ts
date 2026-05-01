import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { dynadotRequest } from "../client.js";

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
    await expect(dynadotRequest("GET", "/domains")).rejects.toThrow(
      "DYNADOT_API_KEY environment variable is not set"
    );
  });

  it("makes GET request with correct URL and headers", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: "test" }),
    });

    await dynadotRequest("GET", "/domains");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.dynadot.com/restful/v2/domains",
      expect.objectContaining({
        method: "GET",
        headers: {
          Authorization: "Bearer test-api-key",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: undefined,
      })
    );
  });

  it("makes POST request with body", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: "123" }),
    });

    await dynadotRequest("POST", "/domains/register", { domainName: "example.com", years: 1 });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.dynadot.com/restful/v2/domains/register",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ domainName: "example.com", years: 1 }),
      })
    );
  });

  it("appends query params and filters undefined/null/empty values", async () => {
    let capturedUrl = "";
    mockFetch.mockImplementation((url: string) => {
      capturedUrl = url;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    await dynadotRequest("GET", "/domains", undefined, {
      folder: "personal",
      limit: 10,
      empty: undefined,
      blank: "",
    });

    const url = new URL(capturedUrl);
    expect(url.searchParams.get("folder")).toBe("personal");
    expect(url.searchParams.get("limit")).toBe("10");
    expect(url.searchParams.has("empty")).toBe(false);
    expect(url.searchParams.has("blank")).toBe(false);
  });

  it("repeats array query params", async () => {
    let capturedUrl = "";
    mockFetch.mockImplementation((url: string) => {
      capturedUrl = url;
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    await dynadotRequest("GET", "/domains/bulk-search", undefined, {
      domainNames: ["a.com", "b.com", "c.com"],
    });

    const url = new URL(capturedUrl);
    expect(url.searchParams.getAll("domainNames")).toEqual(["a.com", "b.com", "c.com"]);
  });

  it("returns parsed JSON on success", async () => {
    const expected = { domains: [{ name: "example.com" }] };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(expected),
    });

    const result = await dynadotRequest("GET", "/domains");
    expect(result).toEqual(expected);
  });

  it("throws on non-2xx response", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve("Unauthorized"),
    });

    await expect(dynadotRequest("GET", "/domains")).rejects.toThrow(
      "Dynadot API error 401: Unauthorized"
    );
  });

  it("handles text() failure gracefully on error", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.reject(new Error("parse failed")),
    });

    await expect(dynadotRequest("GET", "/domains")).rejects.toThrow(
      "Dynadot API error 500:"
    );
  });
});
