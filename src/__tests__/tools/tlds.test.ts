import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../client.js", () => ({
  dynadotRequest: vi.fn().mockResolvedValue({ success: true }),
}));

import { dynadotRequest } from "../../client.js";
import { tldTools } from "../../tools/tlds.js";

const mockRequest = vi.mocked(dynadotRequest);

function findTool(name: string) {
  const tool = tldTools.find((t: any) => t.name === name);
  if (!tool) throw new Error(`Tool not found: ${name}`);
  return tool as any;
}

describe("tldTools", () => {
  beforeEach(() => {
    mockRequest.mockClear();
  });

  it("dynadot_tld_get_tld_price GETs price for a TLD", async () => {
    await findTool("dynadot_tld_get_tld_price").handler({ tld: "com", currency: "USD" });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/tlds/com/price", undefined, { currency: "USD" });
  });

  it("dynadot_tld_get_tld_price works without currency", async () => {
    await findTool("dynadot_tld_get_tld_price").handler({ tld: "io" });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/tlds/io/price", undefined, { currency: undefined });
  });
});
