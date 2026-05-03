import { describe, it, expect } from "vitest";
import { domainTools } from "../tools/domains.js";
import { contactTools } from "../tools/contacts.js";
import { nameserverTools } from "../tools/nameservers.js";
import { orderTools } from "../tools/orders.js";
import { accountTools } from "../tools/account.js";
import { folderTools } from "../tools/folders.js";
import { aftermarketTools } from "../tools/aftermarket.js";
import { tldTools } from "../tools/tlds.js";

const allTools = [
  ...domainTools,
  ...contactTools,
  ...nameserverTools,
  ...orderTools,
  ...accountTools,
  ...folderTools,
  ...aftermarketTools,
  ...tldTools,
];

describe("Tool Registration", () => {
  it("has no duplicate tool names across all modules", () => {
    const names = allTools.map((t) => t.name);
    const duplicates = names.filter((name, i) => names.indexOf(name) !== i);
    expect(duplicates).toEqual([]);
  });

  it("all tools have required properties", () => {
    for (const tool of allTools) {
      expect(tool.name).toBeTruthy();
      expect(tool.description).toBeTruthy();
      expect(tool.inputSchema).toBeDefined();
      expect(typeof tool.handler).toBe("function");
    }
  });

  it("all tool names follow dynadot_ naming convention", () => {
    for (const tool of allTools) {
      expect(tool.name).toMatch(/^dynadot_/);
    }
  });

  it("registers a meaningful number of tools", () => {
    expect(allTools.length).toBeGreaterThanOrEqual(60);
  });

  it("each module exports a non-empty array", () => {
    const modules = [
      domainTools, contactTools, nameserverTools, orderTools, accountTools,
      folderTools, aftermarketTools, tldTools,
    ];
    for (const mod of modules) {
      expect(Array.isArray(mod)).toBe(true);
      expect(mod.length).toBeGreaterThan(0);
    }
  });
});
