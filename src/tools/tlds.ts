import { z } from "zod";
import { dynadotRequest } from "../client.js";

export const tldTools = [
  {
    name: "dynadot_tld_price",
    description: "Get TLD pricing (registration, renewal, transfer, restore).",
    inputSchema: z.object({
      currency: z.string().optional().describe("Currency code (e.g. 'USD')"),
      countPerPage: z.number().optional(),
      pageIndex: z.number().optional(),
      sort: z.string().optional(),
    }),
    handler: async (args: { currency?: string; countPerPage?: number; pageIndex?: number; sort?: string }) => {
      return dynadotRequest("tld_price", {
        currency: args.currency,
        count_per_page: args.countPerPage,
        page_index: args.pageIndex,
        sort: args.sort,
      });
    },
  },
];
