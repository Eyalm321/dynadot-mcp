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

  it("dynadot_tld_price", async () => {
    await findTool("dynadot_tld_price").handler({ currency: "USD", countPerPage: 100, pageIndex: 0 });
    expect(mockRequest).toHaveBeenCalledWith("tld_price", {
      currency: "USD",
      count_per_page: 100,
      page_index: 0,
      sort: undefined,
    });
  });

  it("dynadot_tld_price with no params", async () => {
    await findTool("dynadot_tld_price").handler({});
    expect(mockRequest).toHaveBeenCalledWith("tld_price", {
      currency: undefined,
      count_per_page: undefined,
      page_index: undefined,
      sort: undefined,
    });
  });
});
