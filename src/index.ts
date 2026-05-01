#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { domainTools } from "./tools/domains.js";
import { contactTools } from "./tools/contacts.js";
import { nameserverTools } from "./tools/nameservers.js";
import { orderTools } from "./tools/orders.js";
import { accountTools } from "./tools/account.js";
import { folderTools } from "./tools/folders.js";
import { aftermarketTools } from "./tools/aftermarket.js";
import { tldTools } from "./tools/tlds.js";
import { serviceTools } from "./tools/services.js";

const server = new McpServer({
  name: "dynadot-mcp",
  version: "1.0.0",
});

const allTools = [
  ...domainTools,
  ...contactTools,
  ...nameserverTools,
  ...orderTools,
  ...accountTools,
  ...folderTools,
  ...aftermarketTools,
  ...tldTools,
  ...serviceTools,
];

for (const tool of allTools) {
  server.tool(
    tool.name,
    tool.description,
    tool.inputSchema.shape as any,
    async (args: any) => {
      try {
        const result = await tool.handler(args as any);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: "text" as const, text: `Error: ${message}` }],
          isError: true,
        };
      }
    }
  );
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Dynadot MCP server running");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
