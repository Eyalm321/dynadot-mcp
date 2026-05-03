import { z } from "zod";
import { dynadotRequest, toPunycode } from "../client.js";

export const orderTools = [
  {
    name: "dynadot_order_list",
    description: "List the account's order history (paginated).",
    inputSchema: z.object({
      pageIndex: z.number().optional(),
      countPerPage: z.number().optional(),
    }),
    handler: async (args: { pageIndex?: number; countPerPage?: number }) => {
      return dynadotRequest("order_list", {
        page_index: args.pageIndex,
        count_per_page: args.countPerPage,
      });
    },
  },
  {
    name: "dynadot_get_order_status",
    description: "Get the status of a specific order.",
    inputSchema: z.object({
      orderId: z.union([z.number(), z.string()]),
    }),
    handler: async (args: { orderId: number | string }) => {
      return dynadotRequest("get_order_status", { order_id: args.orderId });
    },
  },
  {
    name: "dynadot_is_processing",
    description: "Check whether an order is still processing.",
    inputSchema: z.object({
      orderId: z.union([z.number(), z.string()]),
    }),
    handler: async (args: { orderId: number | string }) => {
      return dynadotRequest("is_processing", { order_id: args.orderId });
    },
  },
  {
    name: "dynadot_cancel_transfer",
    description: "Cancel a pending transfer order.",
    inputSchema: z.object({
      domainName: z.string(),
      orderId: z.union([z.number(), z.string()]).optional(),
    }),
    handler: async (args: { domainName: string; orderId?: number | string }) => {
      return dynadotRequest("cancel_transfer", {
        domain: toPunycode(args.domainName),
        order_id: args.orderId,
      });
    },
  },
  {
    name: "dynadot_authorize_transfer_away",
    description: "Approve or deny an outgoing transfer.",
    inputSchema: z.object({
      domainName: z.string(),
      orderId: z.union([z.number(), z.string()]),
      authorize: z.boolean().describe("true to approve, false to deny"),
    }),
    handler: async (args: { domainName: string; orderId: number | string; authorize: boolean }) => {
      return dynadotRequest("authorize_transfer_away", {
        domain: toPunycode(args.domainName),
        order_id: args.orderId,
        authorize: args.authorize ? "yes" : "no",
      });
    },
  },
  {
    name: "dynadot_set_transfer_auth_code",
    description: "Submit or update the transfer authorization code on an order.",
    inputSchema: z.object({
      domainName: z.string(),
      authCode: z.string(),
      orderId: z.union([z.number(), z.string()]).optional(),
    }),
    handler: async (args: { domainName: string; authCode: string; orderId?: number | string }) => {
      return dynadotRequest("set_transfer_auth_code", {
        domain: toPunycode(args.domainName),
        auth_code: args.authCode,
        order_id: args.orderId,
      });
    },
  },
];
