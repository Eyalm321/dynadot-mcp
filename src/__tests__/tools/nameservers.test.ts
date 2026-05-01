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

  it("dynadot_nameserver_get GETs by id", async () => {
    await findTool("dynadot_nameserver_get").handler({ nameserverId: 7 });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/nameservers/7");
  });

  it("dynadot_nameserver_list paginates", async () => {
    await findTool("dynadot_nameserver_list").handler({ limit: 10, offset: 0 });
    expect(mockRequest).toHaveBeenCalledWith("GET", "/nameservers", undefined, { limit: 10, offset: 0 });
  });

  it("dynadot_nameserver_register POSTs glue NS", async () => {
    await findTool("dynadot_nameserver_register").handler({
      nameserverName: "ns1.example.com",
      ipv4: "1.2.3.4",
      ipv6: "::1",
    });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/nameservers", {
      nameserverName: "ns1.example.com",
      ipv4: "1.2.3.4",
      ipv6: "::1",
    });
  });

  it("dynadot_nameserver_add_external POSTs external NS", async () => {
    await findTool("dynadot_nameserver_add_external").handler({ nameserverName: "ns1.other.com" });
    expect(mockRequest).toHaveBeenCalledWith("POST", "/nameservers/external", {
      nameserverName: "ns1.other.com",
      ipv4: undefined,
      ipv6: undefined,
    });
  });

  it("dynadot_nameserver_set_ip PUTs ip", async () => {
    await findTool("dynadot_nameserver_set_ip").handler({ nameserverId: 7, ipv4: "5.6.7.8" });
    expect(mockRequest).toHaveBeenCalledWith("PUT", "/nameservers/7/ip", { ipv4: "5.6.7.8", ipv6: undefined });
  });

  it("dynadot_nameserver_delete DELETEs", async () => {
    await findTool("dynadot_nameserver_delete").handler({ nameserverId: 7 });
    expect(mockRequest).toHaveBeenCalledWith("DELETE", "/nameservers/7");
  });
});
