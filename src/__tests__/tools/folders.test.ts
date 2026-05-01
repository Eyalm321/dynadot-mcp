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

  it("dynadot_folder_list paginates", async () => {
    await findTool("dynadot_folder_list").handler({ limit: 25, offset: 0 });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/folders", undefined, { limit: 25, offset: 0 });
  });

  it("dynadot_folder_create POSTs folderName", async () => {
    await findTool("dynadot_folder_create").handler({ folderName: "Personal" });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/folders", { folderName: "Personal" });
  });

  it("dynadot_folder_delete DELETEs", async () => {
    await findTool("dynadot_folder_delete").handler({ folderId: 7 });
    expect(mockRequest).toHaveBeenCalledWith("DELETE", "/folders/7");
  });

  it("dynadot_folder_set_name PUTs", async () => {
    await findTool("dynadot_folder_set_name").handler({ folderId: 7, folderName: "Work" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/folders/7/name", { folderName: "Work" });
  });

  it("dynadot_folder_set_dns PUTs records", async () => {
    const records = [{ type: "A", value: "1.2.3.4" }];
    await findTool("dynadot_folder_set_dns").handler({ folderId: 7, records });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/folders/7/dns", { records });
  });

  it("dynadot_folder_set_nameserver PUTs nameservers", async () => {
    await findTool("dynadot_folder_set_nameserver").handler({ folderId: 7, nameservers: ["ns1", "ns2"] });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/folders/7/nameservers", {
      nameservers: ["ns1", "ns2"],
    });
  });

  it("dynadot_folder_set_contacts PUTs contact ids", async () => {
    await findTool("dynadot_folder_set_contacts").handler({
      folderId: 7,
      registrant: 1,
      admin: 2,
      tech: 3,
      billing: 4,
    });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/folders/7/contacts", {
      registrant: 1,
      admin: 2,
      tech: 3,
      billing: 4,
    });
  });

  it("dynadot_folder_set_parking PUTs parking_type", async () => {
    await findTool("dynadot_folder_set_parking").handler({ folderId: 7, parkingType: "forsale" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/folders/7/parking", { parking_type: "forsale" });
  });

  it("dynadot_folder_set_domain_forwarding PUTs forwarding", async () => {
    await findTool("dynadot_folder_set_domain_forwarding").handler({
      folderId: 7,
      url: "https://x",
      type: "302",
      masking: true,
    });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/folders/7/forwarding", {
      url: "https://x",
      type: "302",
      masking: true,
    });
  });

  it("dynadot_folder_set_stealth_forwarding PUTs", async () => {
    await findTool("dynadot_folder_set_stealth_forwarding").handler({ folderId: 7, url: "https://x" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/folders/7/stealth-forwarding", {
      url: "https://x",
      masking: undefined,
    });
  });

  it("dynadot_folder_set_email_forwarding PUTs", async () => {
    const forwards = [{ from: "info", to: "me@x.com" }];
    await findTool("dynadot_folder_set_email_forwarding").handler({ folderId: 7, forwards });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/folders/7/email-forwarding", { forwards });
  });

  it("dynadot_folder_set_hosting PUTs hosting_id", async () => {
    await findTool("dynadot_folder_set_hosting").handler({ folderId: 7, hostingId: 99 });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/folders/7/hosting", { hosting_id: 99 });
  });

  it("dynadot_folder_set_renew_option PUTs renewOption", async () => {
    await findTool("dynadot_folder_set_renew_option").handler({ folderId: 7, renewOption: "auto" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/folders/7/renew-option", { renewOption: "auto" });
  });

  it("dynadot_folder_clear_setting PUTs settings", async () => {
    await findTool("dynadot_folder_clear_setting").handler({ folderId: 7, settings: ["dns"] });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/folders/7/clear-settings", { settings: ["dns"] });
  });
});
