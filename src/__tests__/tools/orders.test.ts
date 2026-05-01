import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../client.js", () => ({
  dynadotRequest: vi.fn().mockResolvedValue({ success: true }),
}));

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

  it("dynadot_order_get_status GETs by id", async () => {
    await findTool("dynadot_order_get_status").handler({ orderId: 100 });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/orders/100");
  });

  it("dynadot_order_get_history paginates with status filter", async () => {
    await findTool("dynadot_order_get_history").handler({ limit: 10, offset: 0, status: "completed" });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/orders", undefined, {
      limit: 10,
      offset: 0,
      status: "completed",
    });
  });

  it("dynadot_cancel_transfer POSTs cancel-transfer", async () => {
    await findTool("dynadot_cancel_transfer").handler({ orderId: 100 });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/orders/100/cancel-transfer");
  });

  it("dynadot_authorize_transfer_away POSTs authorize", async () => {
    await findTool("dynadot_authorize_transfer_away").handler({ orderId: 100 });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/orders/100/authorize-transfer");
  });

  it("dynadot_set_transfer_auth_code POSTs auth code", async () => {
    await findTool("dynadot_set_transfer_auth_code").handler({ orderId: 100, authCode: "EPP1" });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/orders/100/auth-code", { authCode: "EPP1" });
  });
});
