import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../client.js", () => ({
  dynadotRequest: vi.fn().mockResolvedValue({ success: true }),
}));

import { dynadotRequest } from "../../client.js";
import { folderTools } from "../../tools/folders.js";

const mockRequest = vi.mocked(dynadotRequest);

function findTool(name: string) {
  const tool = folderTools.find((t: any) => t.name === name);
  if (!tool) throw new Error(`Tool not found: ${name}`);
  return tool as any;
}

describe("folderTools", () => {
  beforeEach(() => {
    mockRequest.mockClear();
  });

  it("dynadot_folder_list", async () => {
    await findTool("dynadot_folder_list").handler({ pageIndex: 0, countPerPage: 25 });
    expect(mockRequest).toHaveBeenCalledWith("folder_list", { page_index: 0, count_per_page: 25 });
  });

  it("dynadot_create_folder", async () => {
    await findTool("dynadot_create_folder").handler({ folderName: "Personal" });
    expect(mockRequest).toHaveBeenCalledWith("create_folder", { folder_name: "Personal" });
  });

  it("dynadot_delete_folder", async () => {
    await findTool("dynadot_delete_folder").handler({ folderId: 7 });
    expect(mockRequest).toHaveBeenCalledWith("delete_folder", { folder_id: 7 });
  });

  it("dynadot_set_folder_name", async () => {
    await findTool("dynadot_set_folder_name").handler({ folderId: 7, newName: "Work" });
    expect(mockRequest).toHaveBeenCalledWith("set_folder_name", { folder_id: 7, new_name: "Work" });
  });

  it("dynadot_set_folder_whois", async () => {
    await findTool("dynadot_set_folder_whois").handler({
      folderId: 7,
      registrantContact: 1, adminContact: 2, technicalContact: 3, billingContact: 4,
    });
    expect(mockRequest).toHaveBeenCalledWith("set_folder_whois", {
      folder_id: 7,
      registrant_contact: 1,
      admin_contact: 2,
      technical_contact: 3,
      billing_contact: 4,
    });
  });

  it("dynadot_set_folder_ns expands ns0..", async () => {
    await findTool("dynadot_set_folder_ns").handler({ folderId: 7, nameservers: ["ns1", "ns2"] });
    expect(mockRequest).toHaveBeenCalledWith("set_folder_ns", { folder_id: 7, ns0: "ns1", ns1: "ns2" });
  });

  it("dynadot_set_folder_parking", async () => {
    await findTool("dynadot_set_folder_parking").handler({ folderId: 7, withAds: true });
    expect(mockRequest).toHaveBeenCalledWith("set_folder_parking", { folder_id: 7, with_ads: 1 });
  });

  it("dynadot_set_folder_forwarding", async () => {
    await findTool("dynadot_set_folder_forwarding").handler({ folderId: 7, forwardUrl: "https://x", isTemp: true });
    expect(mockRequest).toHaveBeenCalledWith("set_folder_forwarding", {
      folder_id: 7,
      forward_url: "https://x",
      is_temp: 1,
    });
  });

  it("dynadot_set_folder_stealth", async () => {
    await findTool("dynadot_set_folder_stealth").handler({ folderId: 7, stealthUrl: "https://x" });
    expect(mockRequest).toHaveBeenCalledWith("set_folder_stealth", {
      folder_id: 7,
      stealth_url: "https://x",
      stealth_title: undefined,
    });
  });

  it("dynadot_set_folder_hosting", async () => {
    await findTool("dynadot_set_folder_hosting").handler({ folderId: 7, hostingType: "advanced" });
    expect(mockRequest).toHaveBeenCalledWith("set_folder_hosting", {
      folder_id: 7,
      hosting_type: "advanced",
      mobile_view_on: undefined,
    });
  });

  it("dynadot_set_folder_dns", async () => {
    await findTool("dynadot_set_folder_dns").handler({
      folderId: 7,
      mainRecords: [{ type: "a", value: "1.2.3.4" }],
    });
    expect(mockRequest).toHaveBeenCalledWith("set_folder_dns2", {
      folder_id: 7,
      main_record_type0: "a",
      main_record0: "1.2.3.4",
    });
  });

  it("dynadot_set_folder_email_forward", async () => {
    await findTool("dynadot_set_folder_email_forward").handler({
      folderId: 7, forwardType: "username_to_email",
      forwards: [{ username: "info", existEmail: "me@me.com" }],
    });
    expect(mockRequest).toHaveBeenCalledWith("set_folder_email_forward", {
      folder_id: 7,
      forward_type: "username_to_email",
      username0: "info",
      exist_email0: "me@me.com",
    });
  });

  it("dynadot_set_folder_renew_option", async () => {
    await findTool("dynadot_set_folder_renew_option").handler({ folderId: 7, renewOption: "auto" });
    expect(mockRequest).toHaveBeenCalledWith("set_folder_renew_option", { folder_id: 7, renew_option: "auto" });
  });

  it("dynadot_set_clear_folder_setting", async () => {
    await findTool("dynadot_set_clear_folder_setting").handler({ folderId: 7, service: "dns" });
    expect(mockRequest).toHaveBeenCalledWith("set_clear_folder_setting", { folder_id: 7, service: "dns" });
  });
});
