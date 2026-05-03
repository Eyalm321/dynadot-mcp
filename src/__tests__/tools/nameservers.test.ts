import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../client.js", () => ({
  dynadotRequest: vi.fn().mockResolvedValue({ success: true }),
}));

import { dynadotRequest } from "../../client.js";
import { nameserverTools } from "../../tools/nameservers.js";

const mockRequest = vi.mocked(dynadotRequest);

function findTool(name: string) {
  const tool = nameserverTools.find((t: any) => t.name === name);
  if (!tool) throw new Error(`Tool not found: ${name}`);
  return tool as any;
}

describe("nameserverTools", () => {
  beforeEach(() => {
    mockRequest.mockClear();
  });

  it("dynadot_get_ns by hostname", async () => {
    await findTool("dynadot_get_ns").handler({ nameserver: "ns1.x.com" });
    expect(mockRequest).toHaveBeenCalledWith("get_ns", { nameserver: "ns1.x.com" });
  });

  it("dynadot_server_list", async () => {
    await findTool("dynadot_server_list").handler({ pageIndex: 0, countPerPage: 25 });
    expect(mockRequest).toHaveBeenCalledWith("server_list", { page_index: 0, count_per_page: 25 });
  });

  it("dynadot_register_ns", async () => {
    await findTool("dynadot_register_ns").handler({ nameserver: "ns1.x.com", ipAddress: "1.2.3.4" });
    expect(mockRequest).toHaveBeenCalledWith("register_ns", { nameserver: "ns1.x.com", ip_address: "1.2.3.4" });
  });

  it("dynadot_add_ns", async () => {
    await findTool("dynadot_add_ns").handler({ nameserver: "ns1.x.com", ipAddress: "1.2.3.4" });
    expect(mockRequest).toHaveBeenCalledWith("add_ns", { nameserver: "ns1.x.com", ip_address: "1.2.3.4" });
  });

  it("dynadot_set_ns_ip", async () => {
    await findTool("dynadot_set_ns_ip").handler({ nameserver: "ns1.x.com", ipAddress: "5.6.7.8" });
    expect(mockRequest).toHaveBeenCalledWith("set_ns_ip", { nameserver: "ns1.x.com", ip_address: "5.6.7.8" });
  });

  it("dynadot_delete_ns", async () => {
    await findTool("dynadot_delete_ns").handler({ nameserver: "ns1.x.com" });
    expect(mockRequest).toHaveBeenCalledWith("delete_ns", { nameserver: "ns1.x.com" });
  });

  it("dynadot_delete_ns_by_domain", async () => {
    await findTool("dynadot_delete_ns_by_domain").handler({ domainName: "x.com" });
    expect(mockRequest).toHaveBeenCalledWith("delete_ns_by_domain", { domain: "x.com" });
  });
});
