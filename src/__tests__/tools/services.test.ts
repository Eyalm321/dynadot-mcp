import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../client.js", () => ({
  dynadotRequest: vi.fn().mockResolvedValue({ success: true }),
}));

import { dynadotRequest } from "../../client.js";
import { serviceTools } from "../../tools/services.js";

const mockRequest = vi.mocked(dynadotRequest);

function findTool(name: string) {
  const tool = serviceTools.find((t: any) => t.name === name);
  if (!tool) throw new Error(`Tool not found: ${name}`);
  return tool as any;
}

describe("serviceTools", () => {
  beforeEach(() => {
    mockRequest.mockClear();
  });

  it("dynadot_get_site_builder GETs by id", async () => {
    await findTool("dynadot_get_site_builder").handler({ siteId: 5 });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/site-builder/5");
  });

  it("dynadot_list_site_builder GETs paginated", async () => {
    await findTool("dynadot_list_site_builder").handler({ limit: 10, offset: 0 });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/site-builder", undefined, { limit: 10, offset: 0 });
  });

  it("dynadot_create_site_builder POSTs", async () => {
    await findTool("dynadot_create_site_builder").handler({
      domainName: "example.com",
      template: "modern",
      siteTitle: "My Site",
    });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/site-builder", {
      domainName: "example.com",
      template: "modern",
      siteTitle: "My Site",
    });
  });

  it("dynadot_upgrade_site_builder POSTs upgrade", async () => {
    await findTool("dynadot_upgrade_site_builder").handler({ siteId: 5, planType: "pro" });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/site-builder/5/upgrade", { planType: "pro" });
  });

  it("dynadot_create_email_hosting POSTs", async () => {
    await findTool("dynadot_create_email_hosting").handler({
      domainName: "example.com",
      mailboxes: 5,
      planType: "basic",
    });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/email-hosting", {
      domainName: "example.com",
      mailboxes: 5,
      planType: "basic",
    });
  });

  it("dynadot_list_email_hosting GETs", async () => {
    await findTool("dynadot_list_email_hosting").handler({ limit: 10, offset: 0 });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/email-hosting", undefined, { limit: 10, offset: 0 });
  });

  it("dynadot_upgrade_email_hosting POSTs upgrade", async () => {
    await findTool("dynadot_upgrade_email_hosting").handler({ emailId: 5, mailboxes: 10 });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/email-hosting/5/upgrade", { mailboxes: 10 });
  });

  it("dynadot_delete_email_hosting DELETEs", async () => {
    await findTool("dynadot_delete_email_hosting").handler({ emailId: 5 });
    expect(mockRequest).toHaveBeenCalledWith("DELETE", "/email-hosting/5");
  });
});
