import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../client.js", async () => {
  const actual = await vi.importActual<typeof import("../../client.js")>("../../client.js");
  return {
    dynadotRequest: vi.fn().mockResolvedValue({ success: true }),
    toPunycode: actual.toPunycode,
  };
});

import { dynadotRequest } from "../../client.js";
import { orderTools } from "../../tools/orders.js";

const mockRequest = vi.mocked(dynadotRequest);

function findTool(name: string) {
  const tool = orderTools.find((t: any) => t.name === name);
  if (!tool) throw new Error(`Tool not found: ${name}`);
  return tool as any;
}

describe("orderTools", () => {
  beforeEach(() => {
    mockRequest.mockClear();
  });

  it("dynadot_order_list", async () => {
    await findTool("dynadot_order_list").handler({ pageIndex: 0, countPerPage: 25 });
    expect(mockRequest).toHaveBeenCalledWith("order_list", { page_index: 0, count_per_page: 25 });
  });

  it("dynadot_get_order_status", async () => {
    await findTool("dynadot_get_order_status").handler({ orderId: 100 });
    expect(mockRequest).toHaveBeenCalledWith("get_order_status", { order_id: 100 });
  });

  it("dynadot_is_processing", async () => {
    await findTool("dynadot_is_processing").handler({ orderId: 100 });
    expect(mockRequest).toHaveBeenCalledWith("is_processing", { order_id: 100 });
  });

  it("dynadot_cancel_transfer", async () => {
    await findTool("dynadot_cancel_transfer").handler({ domainName: "x.com", orderId: 100 });
    expect(mockRequest).toHaveBeenCalledWith("cancel_transfer", { domain: "x.com", order_id: 100 });
  });

  it("dynadot_authorize_transfer_away maps boolean to yes/no", async () => {
    await findTool("dynadot_authorize_transfer_away").handler({ domainName: "x.com", orderId: 100, authorize: true });
    expect(mockRequest).toHaveBeenCalledWith("authorize_transfer_away", {
      domain: "x.com",
      order_id: 100,
      authorize: "yes",
    });

    mockRequest.mockClear();
    await findTool("dynadot_authorize_transfer_away").handler({ domainName: "x.com", orderId: 100, authorize: false });
    expect(mockRequest).toHaveBeenCalledWith("authorize_transfer_away", {
      domain: "x.com",
      order_id: 100,
      authorize: "no",
    });
  });

  it("dynadot_set_transfer_auth_code", async () => {
    await findTool("dynadot_set_transfer_auth_code").handler({ domainName: "x.com", authCode: "EPP" });
    expect(mockRequest).toHaveBeenCalledWith("set_transfer_auth_code", {
      domain: "x.com",
      auth_code: "EPP",
      order_id: undefined,
    });
  });
});
