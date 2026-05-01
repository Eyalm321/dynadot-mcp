import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../client.js", () => ({
  dynadotRequest: vi.fn().mockResolvedValue({ success: true }),
}));

import { dynadotRequest } from "../../client.js";
import { domainTools } from "../../tools/domains.js";

const mockRequest = vi.mocked(dynadotRequest);

function findTool(name: string) {
  const tool = domainTools.find((t: any) => t.name === name);
  if (!tool) throw new Error(`Tool not found: ${name}`);
  return tool as any;
}

describe("domainTools", () => {
  beforeEach(() => {
    mockRequest.mockClear();
  });

  it("has no duplicate tool names", () => {
    const names = domainTools.map((t: any) => t.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("dynadot_search calls the search endpoint", async () => {
    await findTool("dynadot_search").handler({ domainName: "example.com", showPrice: true, currency: "USD" });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/domains/example.com/search", undefined, {
      showPrice: true,
      currency: "USD",
    });
  });

  it("dynadot_bulk_search passes domainNames array", async () => {
    await findTool("dynadot_bulk_search").handler({ domainNames: ["a.com", "b.com"] });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/domains/bulk-search", undefined, {
      domainNames: ["a.com", "b.com"],
      showPrice: undefined,
      currency: undefined,
    });
  });

  it("dynadot_suggestion_search uses keyword", async () => {
    await findTool("dynadot_suggestion_search").handler({ keyword: "ai", tld: "com" });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/domains/suggestion-search", undefined, {
      keyword: "ai",
      tld: "com",
      showPrice: undefined,
    });
  });

  it("dynadot_get_pending_push hits per-domain endpoint", async () => {
    await findTool("dynadot_get_pending_push").handler({ domainName: "example.com" });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/domains/example.com/pending-push");
  });

  it("dynadot_register POSTs the registration payload", async () => {
    await findTool("dynadot_register").handler({
      domainName: "example.com",
      years: 2,
      contacts: { registrant: 1 },
      nameservers: ["ns1.example.com"],
      privacy: true,
      autoRenew: true,
      coupon: "SAVE10",
    });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/domains/register", {
      domainName: "example.com",
      years: 2,
      contacts: { registrant: 1 },
      nameservers: ["ns1.example.com"],
      privacy: true,
      autoRenew: true,
      coupon: "SAVE10",
    });
  });

  it("dynadot_renew posts years", async () => {
    await findTool("dynadot_renew").handler({ domainName: "example.com", years: 1 });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/domains/example.com/renew", {
      years: 1,
      coupon: undefined,
    });
  });

  it("dynadot_transfer_in posts auth code", async () => {
    await findTool("dynadot_transfer_in").handler({ domainName: "example.com", authCode: "abc123" });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/domains/transfer-in", {
      domainName: "example.com",
      authCode: "abc123",
      contacts: undefined,
      privacy: undefined,
      autoRenew: undefined,
    });
  });

  it("dynadot_grace_delete sends DELETE", async () => {
    await findTool("dynadot_grace_delete").handler({ domainName: "example.com" });
    expect(mockRequest).toHaveBeenCalledWith("DELETE", "/domains/example.com/grace-delete");
  });

  it("dynadot_post_grace_delete sends DELETE", async () => {
    await findTool("dynadot_post_grace_delete").handler({ domainName: "example.com" });
    expect(mockRequest).toHaveBeenCalledWith("DELETE", "/domains/example.com/post-grace-delete");
  });

  it("dynadot_restore POSTs", async () => {
    await findTool("dynadot_restore").handler({ domainName: "example.com" });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/domains/example.com/restore");
  });

  it("dynadot_domain_list lists with pagination", async () => {
    await findTool("dynadot_domain_list").handler({ folder: "main", limit: 50, offset: 0 });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/domains", undefined, {
      folder: "main",
      limit: 50,
      offset: 0,
    });
  });

  it("dynadot_domain_info returns single domain", async () => {
    await findTool("dynadot_domain_info").handler({ domainName: "example.com" });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/domains/example.com");
  });

  it("dynadot_domain_appraisal hits appraisal", async () => {
    await findTool("dynadot_domain_appraisal").handler({ domainName: "example.com" });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/domains/example.com/appraisal");
  });

  it("dynadot_domain_get_tld_price hits tld-price", async () => {
    await findTool("dynadot_domain_get_tld_price").handler({ domainName: "example.com" });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/domains/example.com/tld-price");
  });

  it("dynadot_set_domain_forwarding PUTs forwarding", async () => {
    await findTool("dynadot_set_domain_forwarding").handler({
      domainName: "example.com",
      url: "https://target.com",
      type: "301",
      masking: false,
    });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/domains/example.com/forwarding", {
      url: "https://target.com",
      type: "301",
      masking: false,
    });
  });

  it("dynadot_set_stealth_forwarding PUTs stealth", async () => {
    await findTool("dynadot_set_stealth_forwarding").handler({ domainName: "example.com", url: "https://x" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/domains/example.com/stealth-forwarding", {
      url: "https://x",
      masking: undefined,
    });
  });

  it("dynadot_set_email_forwarding PUTs forwards", async () => {
    const forwards = [{ from: "sales", to: "team@other.com" }];
    await findTool("dynadot_set_email_forwarding").handler({ domainName: "example.com", forwards });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/domains/example.com/email-forwarding", { forwards });
  });

  it("dynadot_set_renew_option PUTs renew option", async () => {
    await findTool("dynadot_set_renew_option").handler({ domainName: "example.com", renewOption: "auto" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/domains/example.com/renew-option", { renewOption: "auto" });
  });

  it("dynadot_set_contacts PUTs all contact ids", async () => {
    await findTool("dynadot_set_contacts").handler({
      domainName: "example.com",
      registrant: 1,
      admin: 2,
      tech: 3,
      billing: 4,
    });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/domains/example.com/contacts", {
      registrant: 1,
      admin: 2,
      tech: 3,
      billing: 4,
    });
  });

  it("dynadot_set_folder PUTs folder_id", async () => {
    await findTool("dynadot_set_folder").handler({ domainName: "example.com", folderId: 7 });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/domains/example.com/folder", { folder_id: 7 });
  });

  it("dynadot_set_domain_lock_status PUTs lockStatus", async () => {
    await findTool("dynadot_set_domain_lock_status").handler({ domainName: "example.com", lockStatus: true });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/domains/example.com/lock-status", { lockStatus: true });
  });

  it("dynadot_get_transfer_status GETs transfer-status", async () => {
    await findTool("dynadot_get_transfer_status").handler({ domainName: "example.com" });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/domains/example.com/transfer-status");
  });

  it("dynadot_get_transfer_auth_code GETs auth-code", async () => {
    await findTool("dynadot_get_transfer_auth_code").handler({ domainName: "example.com" });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/domains/example.com/auth-code");
  });

  it("dynadot_domain_get_nameserver GETs nameservers", async () => {
    await findTool("dynadot_domain_get_nameserver").handler({ domainName: "example.com" });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/domains/example.com/nameservers");
  });

  it("dynadot_domain_set_nameserver PUTs nameservers", async () => {
    await findTool("dynadot_domain_set_nameserver").handler({
      domainName: "example.com",
      nameservers: ["ns1", "ns2"],
    });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/domains/example.com/nameservers", {
      nameservers: ["ns1", "ns2"],
    });
  });

  it("dynadot_set_hosting PUTs hosting_id", async () => {
    await findTool("dynadot_set_hosting").handler({ domainName: "example.com", hostingId: 99 });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/domains/example.com/hosting", { hosting_id: 99 });
  });

  it("dynadot_set_parking PUTs parking_type", async () => {
    await findTool("dynadot_set_parking").handler({ domainName: "example.com", parkingType: "dynadot" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/domains/example.com/parking", { parking_type: "dynadot" });
  });

  it("dynadot_set_privacy PUTs privacyStatus", async () => {
    await findTool("dynadot_set_privacy").handler({ domainName: "example.com", privacyStatus: "full" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/domains/example.com/privacy", { privacyStatus: "full" });
  });

  it("dynadot_get_dnssec GETs dnssec", async () => {
    await findTool("dynadot_get_dnssec").handler({ domainName: "example.com" });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/domains/example.com/dnssec");
  });

  it("dynadot_set_dnssec PUTs dnssecKeys", async () => {
    const dnssecKeys = [{ keyTag: 1, algorithm: 13, digestType: 2, digest: "abcd" }];
    await findTool("dynadot_set_dnssec").handler({ domainName: "example.com", dnssecKeys });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/domains/example.com/dnssec", { dnssecKeys });
  });

  it("dynadot_clear_dnssec DELETEs dnssec", async () => {
    await findTool("dynadot_clear_dnssec").handler({ domainName: "example.com" });
    expect(mockRequest).toHaveBeenCalledWith("DELETE", "/domains/example.com/dnssec");
  });

  it("dynadot_clear_domain_setting PUTs settings", async () => {
    await findTool("dynadot_clear_domain_setting").handler({
      domainName: "example.com",
      settings: ["forwarding", "dns"],
    });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/domains/example.com/clear-settings", {
      settings: ["forwarding", "dns"],
    });
  });

  it("dynadot_push POSTs push", async () => {
    await findTool("dynadot_push").handler({
      domainName: "example.com",
      targetEmail: "buyer@example.com",
    });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/domains/example.com/push", {
      targetRegistrar: undefined,
      targetEmail: "buyer@example.com",
    });
  });

  it("dynadot_accept_push POSTs pushToken", async () => {
    await findTool("dynadot_accept_push").handler({ domainName: "example.com", pushToken: "tok" });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/domains/example.com/accept-push", { pushToken: "tok" });
  });

  it("dynadot_get_dns GETs dns", async () => {
    await findTool("dynadot_get_dns").handler({ domainName: "example.com" });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/domains/example.com/dns");
  });

  it("dynadot_set_dns POSTs dns records", async () => {
    const records = [{ type: "A", subdomain: "", value: "1.2.3.4" }];
    await findTool("dynadot_set_dns").handler({ domainName: "example.com", records });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/domains/example.com/dns", { records });
  });

  it("dynadot_set_note PUTs note", async () => {
    await findTool("dynadot_set_note").handler({ domainName: "example.com", note: "hello" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/domains/example.com/note", { note: "hello" });
  });
});
