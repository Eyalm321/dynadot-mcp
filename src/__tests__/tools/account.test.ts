import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../client.js", () => ({
  dynadotRequest: vi.fn().mockResolvedValue({ success: true }),
}));

import { dynadotRequest } from "../../client.js";
import { accountTools } from "../../tools/account.js";

const mockRequest = vi.mocked(dynadotRequest);

function findTool(name: string) {
  const tool = accountTools.find((t: any) => t.name === name);
  if (!tool) throw new Error(`Tool not found: ${name}`);
  return tool as any;
}

describe("accountTools", () => {
  beforeEach(() => {
    mockRequest.mockClear();
  });

  it("dynadot_account_info", async () => {
    await findTool("dynadot_account_info").handler({});
    expect(mockRequest).toHaveBeenCalledWith("account_info");
  });

  it("dynadot_get_account_balance", async () => {
    await findTool("dynadot_get_account_balance").handler({});
    expect(mockRequest).toHaveBeenCalledWith("get_account_balance");
  });

  it("dynadot_list_coupons", async () => {
    await findTool("dynadot_list_coupons").handler({});
    expect(mockRequest).toHaveBeenCalledWith("list_coupons");
  });

  it("dynadot_set_default_whois", async () => {
    await findTool("dynadot_set_default_whois").handler({
      registrantContact: 1, adminContact: 2, technicalContact: 3, billingContact: 4,
    });
    expect(mockRequest).toHaveBeenCalledWith("set_default_whois", {
      registrant_contact: 1,
      admin_contact: 2,
      technical_contact: 3,
      billing_contact: 4,
    });
  });

  it("dynadot_set_default_ns expands ns0..nsN", async () => {
    await findTool("dynadot_set_default_ns").handler({ nameservers: ["ns1", "ns2"] });
    expect(mockRequest).toHaveBeenCalledWith("set_default_ns", { ns0: "ns1", ns1: "ns2" });
  });

  it("dynadot_set_default_parking", async () => {
    await findTool("dynadot_set_default_parking").handler({ withAds: true });
    expect(mockRequest).toHaveBeenCalledWith("set_default_parking", { with_ads: 1 });
  });

  it("dynadot_set_default_forwarding", async () => {
    await findTool("dynadot_set_default_forwarding").handler({ forwardUrl: "https://x", isTemp: true });
    expect(mockRequest).toHaveBeenCalledWith("set_default_forwarding", {
      forward_url: "https://x",
      is_temp: 1,
    });
  });

  it("dynadot_set_default_stealth", async () => {
    await findTool("dynadot_set_default_stealth").handler({ stealthUrl: "https://x" });
    expect(mockRequest).toHaveBeenCalledWith("set_default_stealth", {
      stealth_url: "https://x",
      stealth_title: undefined,
    });
  });

  it("dynadot_set_default_hosting", async () => {
    await findTool("dynadot_set_default_hosting").handler({ hostingType: "advanced" });
    expect(mockRequest).toHaveBeenCalledWith("set_default_hosting", {
      hosting_type: "advanced",
      mobile_view_on: undefined,
    });
  });

  it("dynadot_set_default_renew_option", async () => {
    await findTool("dynadot_set_default_renew_option").handler({ renewOption: "auto" });
    expect(mockRequest).toHaveBeenCalledWith("set_default_renew_option", { renew_option: "auto" });
  });

  it("dynadot_set_default_dns expands records", async () => {
    await findTool("dynadot_set_default_dns").handler({
      mainRecords: [{ type: "a", value: "1.2.3.4" }],
      ttl: 3600,
    });
    expect(mockRequest).toHaveBeenCalledWith("set_default_dns2", {
      main_record_type0: "a",
      main_record0: "1.2.3.4",
      ttl: 3600,
    });
  });

  it("dynadot_set_default_email_forward", async () => {
    await findTool("dynadot_set_default_email_forward").handler({
      forwardType: "username_to_email",
      forwards: [{ username: "info", existEmail: "me@me.com" }],
    });
    expect(mockRequest).toHaveBeenCalledWith("set_default_email_forward", {
      forward_type: "username_to_email",
      username0: "info",
      exist_email0: "me@me.com",
    });
  });

  it("dynadot_set_clear_default_setting", async () => {
    await findTool("dynadot_set_clear_default_setting").handler({ service: "ns" });
    expect(mockRequest).toHaveBeenCalledWith("set_clear_default_setting", { service: "ns" });
  });
});
