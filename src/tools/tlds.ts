import { z } from "zod";
import { dynadotRequest } from "../client.js";

export const tldTools = [
  {
    name: "dynadot_tld_get_tld_price",
    description: "Get pricing information for a specific TLD (register, renew, transfer, restore).",
    inputSchema: z.object({
      tld: z.string().describe("TLD without leading dot (e.g. 'com', 'io')"),
      currency: z.string().optional().describe("Currency code (e.g. 'USD')"),
    }),
    handler: async (args: { tld: string; currency?: string }) => {
      return dynadotRequest("GET", `/tlds/${encodeURIComponent(args.tld)}/price`, undefined, {
        currency: args.currency,
      });
    },
  },
];
