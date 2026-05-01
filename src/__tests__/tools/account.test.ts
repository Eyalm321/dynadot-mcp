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

  it("dynadot_get_info GETs /account/info", async () => {
    await findTool("dynadot_get_info").handler({});
    expect(mockRequest).toHaveBeenCalledWith("GET", "/account/info");
  });

  it("dynadot_set_default_nameservers PUTs nameservers", async () => {
    await findTool("dynadot_set_default_nameservers").handler({ nameservers: ["ns1", "ns2"] });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/account/default-nameservers", {
      nameservers: ["ns1", "ns2"],
    });
  });

  it("dynadot_set_default_domain_forwarding PUTs forwarding", async () => {
    await findTool("dynadot_set_default_domain_forwarding").handler({
      url: "https://x",
      type: "301",
      masking: false,
    });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/account/default-forwarding", {
      url: "https://x",
      type: "301",
      masking: false,
    });
  });

  it("dynadot_set_default_stealth_forwarding PUTs", async () => {
    await findTool("dynadot_set_default_stealth_forwarding").handler({ url: "https://x" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/account/default-stealth-forwarding", {
      url: "https://x",
      masking: undefined,
    });
  });

  it("dynadot_set_default_email_forwarding PUTs forwards", async () => {
    const forwards = [{ from: "info", to: "me@x.com" }];
    await findTool("dynadot_set_default_email_forwarding").handler({ forwards });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/account/default-email-forwarding", { forwards });
  });

  it("dynadot_set_default_contacts PUTs contact ids", async () => {
    await findTool("dynadot_set_default_contacts").handler({ registrant: 1, admin: 2, tech: 3, billing: 4 });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/account/default-contacts", {
      registrant: 1,
      admin: 2,
      tech: 3,
      billing: 4,
    });
  });

  it("dynadot_set_default_parking PUTs parking_type", async () => {
    await findTool("dynadot_set_default_parking").handler({ parkingType: "dynadot" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/account/default-parking", { parking_type: "dynadot" });
  });

  it("dynadot_set_default_hosting PUTs hosting_id", async () => {
    await findTool("dynadot_set_default_hosting").handler({ hostingId: 12 });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/account/default-hosting", { hosting_id: 12 });
  });

  it("dynadot_set_default_renew_option PUTs renewOption", async () => {
    await findTool("dynadot_set_default_renew_option").handler({ renewOption: "auto" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/account/default-renew-option", { renewOption: "auto" });
  });

  it("dynadot_set_default_dns PUTs records", async () => {
    const records = [{ type: "A", subdomain: "", value: "1.2.3.4" }];
    await findTool("dynadot_set_default_dns").handler({ records });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/account/default-dns", { records });
  });

  it("dynadot_clear_default_setting PUTs settings", async () => {
    await findTool("dynadot_clear_default_setting").handler({ settings: ["nameservers"] });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/account/clear-default-settings", {
      settings: ["nameservers"],
    });
  });

  it("dynadot_set_account_lock_status PUTs", async () => {
    await findTool("dynadot_set_account_lock_status").handler({ lockStatus: true });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/account/lock-status", { lockStatus: true });
  });

  it("dynadot_list_coupons GETs paginated", async () => {
    await findTool("dynadot_list_coupons").handler({ limit: 50, offset: 0 });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/account/coupons", undefined, { limit: 50, offset: 0 });
  });
});
