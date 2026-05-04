import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../client.js", async () => {
  const actual = await vi.importActual<typeof import("../../client.js")>("../../client.js");
  return {
    dynadotRequest: vi.fn().mockResolvedValue({ success: true }),
    dynadotRestRequest: vi.fn().mockResolvedValue({ success: true }),
    toPunycode: actual.toPunycode,
  };
});

import { dynadotRequest, dynadotRestRequest } from "../../client.js";
import { domainTools } from "../../tools/domains.js";

const mockRequest = vi.mocked(dynadotRequest);
const mockRestRequest = vi.mocked(dynadotRestRequest);

function findTool(name: string) {
  const tool = domainTools.find((t: any) => t.name === name);
  if (!tool) throw new Error(`Tool not found: ${name}`);
  return tool as any;
}

describe("domainTools", () => {
  beforeEach(() => {
    mockRequest.mockClear();
    mockRestRequest.mockClear();
  });

  it("has no duplicate names", () => {
    const names = domainTools.map((t: any) => t.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("dynadot_search uses array expansion and IDN encoding", async () => {
    await findTool("dynadot_search").handler({ domains: ["a.com", "krämer.ai"], showPrice: true, currency: "USD" });
    expect(mockRequest).toHaveBeenCalledWith("search", {
      domain: ["a.com", "xn--krmer-hra.ai"],
      show_price: 1,
      currency: "USD",
    });
  });

  it("dynadot_bulk_search aliases search", async () => {
    await findTool("dynadot_bulk_search").handler({ domainNames: ["a.com"] });
    expect(mockRequest).toHaveBeenCalledWith("search", {
      domain: ["a.com"],
      show_price: undefined,
      currency: undefined,
    });
  });

  it("dynadot_register hits register with v3 param names", async () => {
    await findTool("dynadot_register").handler({
      domainName: "uprime.ai",
      duration: 2,
      currency: "USD",
      premium: true,
      registrantContact: 11,
      adminContact: 12,
      technicalContact: 13,
      billingContact: 14,
    });
    expect(mockRequest).toHaveBeenCalledWith("register", {
      domain: "uprime.ai",
      duration: 2,
      currency: "USD",
      premium: 1,
      coupon: undefined,
      registrant_contact: 11,
      admin_contact: 12,
      technical_contact: 13,
      billing_contact: 14,
    });
  });

  it("dynadot_bulk_register expands domains", async () => {
    await findTool("dynadot_bulk_register").handler({ domains: ["a.com", "b.com"] });
    expect(mockRequest).toHaveBeenCalledWith("bulk_register", {
      domain: ["a.com", "b.com"],
      premium: undefined,
      currency: undefined,
      coupon: undefined,
    });
  });

  it("dynadot_renew passes duration and price_check", async () => {
    await findTool("dynadot_renew").handler({ domainName: "x.com", duration: 1, priceCheck: 50 });
    expect(mockRequest).toHaveBeenCalledWith("renew", {
      domain: "x.com",
      duration: 1,
      currency: undefined,
      year: undefined,
      price_check: 50,
      coupon: undefined,
      no_renew_if_late_renew_fee_needed: undefined,
    });
  });

  it("dynadot_transfer_in passes auth as 'auth' param and nameservers array", async () => {
    await findTool("dynadot_transfer_in").handler({
      domainName: "x.com",
      authCode: "EPP",
      nameservers: ["ns1", "ns2"],
    });
    expect(mockRequest).toHaveBeenCalledWith("transfer", expect.objectContaining({
      domain: "x.com",
      auth: "EPP",
      name_servers: ["ns1", "ns2"],
    }));
  });

  it("dynadot_grace_delete uses the 'delete' command", async () => {
    await findTool("dynadot_grace_delete").handler({ domainName: "x.com" });
    expect(mockRequest).toHaveBeenCalledWith("delete", { domain: "x.com" });
  });

  it("dynadot_restore", async () => {
    await findTool("dynadot_restore").handler({ domainName: "x.com" });
    expect(mockRequest).toHaveBeenCalledWith("restore", { domain: "x.com" });
  });

  it("dynadot_domain_list passes pagination", async () => {
    await findTool("dynadot_domain_list").handler({ countPerPage: 50, pageIndex: 2, sort: "name" });
    expect(mockRequest).toHaveBeenCalledWith("list_domain", {
      count_per_page: 50,
      page_index: 2,
      sort: "name",
      customer_id: undefined,
    });
  });

  it("dynadot_domain_info", async () => {
    await findTool("dynadot_domain_info").handler({ domainName: "x.com" });
    expect(mockRequest).toHaveBeenCalledWith("domain_info", { domain: "x.com" });
  });

  it("dynadot_domain_appraisal uses the v2 REST endpoint (no v3 equivalent)", async () => {
    await findTool("dynadot_domain_appraisal").handler({ domainName: "x.com" });
    expect(mockRestRequest).toHaveBeenCalledWith("GET", "/domains/x.com/appraisal");
    expect(mockRequest).not.toHaveBeenCalled();
  });

  it("dynadot_domain_appraisal punycodes IDN domains", async () => {
    await findTool("dynadot_domain_appraisal").handler({ domainName: "krämer.ai" });
    expect(mockRestRequest).toHaveBeenCalledWith("GET", "/domains/xn--krmer-hra.ai/appraisal");
  });

  it("dynadot_lock_domain", async () => {
    await findTool("dynadot_lock_domain").handler({ domainName: "x.com" });
    expect(mockRequest).toHaveBeenCalledWith("lock_domain", { domain: "x.com" });
  });

  it("dynadot_set_domain_forwarding", async () => {
    await findTool("dynadot_set_domain_forwarding").handler({ domainName: "x.com", forwardUrl: "https://t", isTemp: true });
    expect(mockRequest).toHaveBeenCalledWith("set_forwarding", {
      domain: "x.com",
      forward_url: "https://t",
      is_temp: 1,
    });
  });

  it("dynadot_set_stealth_forwarding", async () => {
    await findTool("dynadot_set_stealth_forwarding").handler({ domainName: "x.com", stealthUrl: "https://t" });
    expect(mockRequest).toHaveBeenCalledWith("set_stealth", {
      domain: "x.com",
      stealth_url: "https://t",
      stealth_title: undefined,
    });
  });

  it("dynadot_set_email_forwarding expands forwards and mxHosts", async () => {
    await findTool("dynadot_set_email_forwarding").handler({
      domainName: "x.com",
      forwardType: "username_to_email",
      forwards: [{ username: "info", existEmail: "me@me.com" }],
      mxHosts: [{ host: "mx.x.com", distance: 10 }],
    });
    expect(mockRequest).toHaveBeenCalledWith("set_email_forward", {
      domain: "x.com",
      forward_type: "username_to_email",
      username0: "info",
      exist_email0: "me@me.com",
      mx_host0: "mx.x.com",
      mx_distance0: 10,
    });
  });

  it("dynadot_set_renew_option", async () => {
    await findTool("dynadot_set_renew_option").handler({ domainName: "x.com", renewOption: "auto" });
    expect(mockRequest).toHaveBeenCalledWith("set_renew_option", { domain: "x.com", renew_option: "auto" });
  });

  it("dynadot_set_whois", async () => {
    await findTool("dynadot_set_whois").handler({
      domainName: "x.com",
      registrantContact: 1, adminContact: 2, technicalContact: 3, billingContact: 4,
    });
    expect(mockRequest).toHaveBeenCalledWith("set_whois", {
      domain: "x.com",
      registrant_contact: 1,
      admin_contact: 2,
      technical_contact: 3,
      billing_contact: 4,
    });
  });

  it("dynadot_set_folder", async () => {
    await findTool("dynadot_set_folder").handler({ domainName: "x.com", folder: "main", folderId: 7 });
    expect(mockRequest).toHaveBeenCalledWith("set_folder", { domain: "x.com", folder: "main", folder_id: 7 });
  });

  it("dynadot_get_transfer_status", async () => {
    await findTool("dynadot_get_transfer_status").handler({ domainName: "x.com", transferType: "in" });
    expect(mockRequest).toHaveBeenCalledWith("get_transfer_status", { domain: "x.com", transfer_type: "in" });
  });

  it("dynadot_get_transfer_auth_code", async () => {
    await findTool("dynadot_get_transfer_auth_code").handler({ domainName: "x.com" });
    expect(mockRequest).toHaveBeenCalledWith("get_transfer_auth_code", { domain: "x.com" });
  });

  it("dynadot_set_ns expands ns0..nsN", async () => {
    await findTool("dynadot_set_ns").handler({ domainName: "x.com", nameservers: ["ns1", "ns2", "ns3"] });
    expect(mockRequest).toHaveBeenCalledWith("set_ns", {
      domain: "x.com",
      ns0: "ns1",
      ns1: "ns2",
      ns2: "ns3",
    });
  });

  it("dynadot_set_hosting", async () => {
    await findTool("dynadot_set_hosting").handler({ domainName: "x.com", hostingType: "advanced" });
    expect(mockRequest).toHaveBeenCalledWith("set_hosting", {
      domain: "x.com",
      hosting_type: "advanced",
      mobile_view_on: undefined,
    });
  });

  it("dynadot_set_parking", async () => {
    await findTool("dynadot_set_parking").handler({ domainName: "x.com", withAds: true });
    expect(mockRequest).toHaveBeenCalledWith("set_parking", { domain: "x.com", with_ads: 1 });
  });

  it("dynadot_set_privacy", async () => {
    await findTool("dynadot_set_privacy").handler({ domainName: "x.com", option: "full", whoisPrivacyOption: "fullname" });
    expect(mockRequest).toHaveBeenCalledWith("set_privacy", {
      domain: "x.com",
      option: "full",
      whois_privacy_option: "fullname",
    });
  });

  it("dynadot_get_dnssec uses domain_name param", async () => {
    await findTool("dynadot_get_dnssec").handler({ domainName: "x.com" });
    expect(mockRequest).toHaveBeenCalledWith("get_dnssec", { domain_name: "x.com" });
  });

  it("dynadot_set_dnssec", async () => {
    await findTool("dynadot_set_dnssec").handler({
      domainName: "x.com", keyTag: 1, digestType: 2, digest: "abc", algorithm: 13,
    });
    expect(mockRequest).toHaveBeenCalledWith("set_dnssec", {
      domain_name: "x.com",
      key_tag: 1,
      digest_type: 2,
      digest: "abc",
      algorithm: 13,
    });
  });

  it("dynadot_clear_dnssec", async () => {
    await findTool("dynadot_clear_dnssec").handler({ domainName: "x.com" });
    expect(mockRequest).toHaveBeenCalledWith("clear_dnssec", { domain_name: "x.com" });
  });

  it("dynadot_clear_domain_setting", async () => {
    await findTool("dynadot_clear_domain_setting").handler({ domainName: "x.com", service: "forwarding" });
    expect(mockRequest).toHaveBeenCalledWith("set_clear_domain_setting", { domain: "x.com", service: "forwarding" });
  });

  it("dynadot_get_domain_push_request", async () => {
    await findTool("dynadot_get_domain_push_request").handler({ domainName: "x.com" });
    expect(mockRequest).toHaveBeenCalledWith("get_domain_push_request", { domain: "x.com" });
  });

  it("dynadot_set_domain_push_request", async () => {
    await findTool("dynadot_set_domain_push_request").handler({
      domainName: "x.com", receiverPushUsername: "alice", unlockDomainForPush: true,
    });
    expect(mockRequest).toHaveBeenCalledWith("set_domain_push_request", {
      domain: "x.com",
      receiver_push_username: "alice",
      receiver_email: undefined,
      currency: undefined,
      unlock_domain_for_push: 1,
    });
  });

  it("dynadot_get_dns", async () => {
    await findTool("dynadot_get_dns").handler({ domainName: "x.com" });
    expect(mockRequest).toHaveBeenCalledWith("get_dns", { domain: "x.com" });
  });

  it("dynadot_set_dns expands main and sub records", async () => {
    await findTool("dynadot_set_dns").handler({
      domainName: "x.com",
      mainRecords: [
        { type: "a", value: "1.2.3.4" },
        { type: "mx", value: "mx.x.com", valueX: "10" },
      ],
      subRecords: [
        { subdomain: "www", type: "cname", value: "x.com" },
      ],
      ttl: 3600,
      addToCurrent: true,
    });
    expect(mockRequest).toHaveBeenCalledWith("set_dns2", {
      domain: "x.com",
      main_record_type0: "a",
      main_record0: "1.2.3.4",
      main_record_type1: "mx",
      main_record1: "mx.x.com",
      main_recordx1: "10",
      subdomain0: "www",
      sub_record_type0: "cname",
      sub_record0: "x.com",
      ttl: 3600,
      add_dns_to_current_setting: 1,
    });
  });

  it("dynadot_set_note", async () => {
    await findTool("dynadot_set_note").handler({ domainName: "x.com", note: "hello" });
    expect(mockRequest).toHaveBeenCalledWith("set_note", { domain: "x.com", note: "hello" });
  });
});
