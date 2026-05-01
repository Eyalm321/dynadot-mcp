import { z } from "zod";
import { dynadotRequest } from "../client.js";

export const orderTools = [
  {
    name: "dynadot_order_get_status",
    description: "Get the status and details of a specific order.",
    inputSchema: z.object({
      orderId: z.number().describe("Order ID"),
    }),
    handler: async (args: { orderId: number }) => {
      return dynadotRequest("GET", `/orders/${args.orderId}`);
    },
  },
  {
    name: "dynadot_order_get_history",
    description: "List the account's order history.",
    inputSchema: z.object({
      limit: z.number().optional().describe("Page size"),
      offset: z.number().optional().describe("Page offset"),
      status: z.string().optional().describe("Filter by order status"),
    }),
    handler: async (args: { limit?: number; offset?: number; status?: string }) => {
      return dynadotRequest("GET", "/orders", undefined, {
        limit: args.limit,
        offset: args.offset,
        status: args.status,
      });
    },
  },
  {
    name: "dynadot_cancel_transfer",
    description: "Cancel a pending domain transfer order.",
    inputSchema: z.object({
      orderId: z.number().describe("Order ID"),
    }),
    handler: async (args: { orderId: number }) => {
      return dynadotRequest("POST", `/orders/${args.orderId}/cancel-transfer`);
    },
  },
  {
    name: "dynadot_authorize_transfer_away",
    description: "Authorize an outgoing domain transfer order.",
    inputSchema: z.object({
      orderId: z.number().describe("Order ID"),
    }),
    handler: async (args: { orderId: number }) => {
      return dynadotRequest("POST", `/orders/${args.orderId}/authorize-transfer`);
    },
  },
  {
    name: "dynadot_set_transfer_auth_code",
    description: "Set the authorization (EPP) code on a transfer order.",
    inputSchema: z.object({
      orderId: z.number().describe("Order ID"),
      authCode: z.string().describe("Authorization code"),
    }),
    handler: async (args: { orderId: number; authCode: string }) => {
      return dynadotRequest("POST", `/orders/${args.orderId}/auth-code`, { authCode: args.authCode });
    },
  },
];
