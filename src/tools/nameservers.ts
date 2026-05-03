import { z } from "zod";
import { dynadotRequest } from "../client.js";

export const nameserverTools = [
  {
    name: "dynadot_get_ns",
    description: "Retrieve nameserver details. Pass a hostname to get one, omit to list account servers.",
    inputSchema: z.object({
      nameserver: z.string().optional().describe("Nameserver hostname (omit to list)"),
    }),
    handler: async (args: { nameserver?: string }) => {
      return dynadotRequest("get_ns", { nameserver: args.nameserver });
    },
  },
  {
    name: "dynadot_server_list",
    description: "List all nameservers in the account (paginated).",
    inputSchema: z.object({
      pageIndex: z.number().optional(),
      countPerPage: z.number().optional(),
    }),
    handler: async (args: { pageIndex?: number; countPerPage?: number }) => {
      return dynadotRequest("server_list", {
        page_index: args.pageIndex,
        count_per_page: args.countPerPage,
      });
    },
  },
  {
    name: "dynadot_register_ns",
    description: "Register a nameserver (host) with an IP.",
    inputSchema: z.object({
      nameserver: z.string().describe("Nameserver hostname"),
      ipAddress: z.string().describe("IP address (IPv4 or IPv6)"),
    }),
    handler: async (args: { nameserver: string; ipAddress: string }) => {
      return dynadotRequest("register_ns", {
        nameserver: args.nameserver,
        ip_address: args.ipAddress,
      });
    },
  },
  {
    name: "dynadot_add_ns",
    description: "Add a nameserver record.",
    inputSchema: z.object({
      nameserver: z.string(),
      ipAddress: z.string(),
    }),
    handler: async (args: { nameserver: string; ipAddress: string }) => {
      return dynadotRequest("add_ns", {
        nameserver: args.nameserver,
        ip_address: args.ipAddress,
      });
    },
  },
  {
    name: "dynadot_set_ns_ip",
    description: "Update the IP for a nameserver.",
    inputSchema: z.object({
      nameserver: z.string(),
      ipAddress: z.string(),
    }),
    handler: async (args: { nameserver: string; ipAddress: string }) => {
      return dynadotRequest("set_ns_ip", {
        nameserver: args.nameserver,
        ip_address: args.ipAddress,
      });
    },
  },
  {
    name: "dynadot_delete_ns",
    description: "Delete a nameserver record.",
    inputSchema: z.object({
      nameserver: z.string(),
    }),
    handler: async (args: { nameserver: string }) => {
      return dynadotRequest("delete_ns", { nameserver: args.nameserver });
    },
  },
  {
    name: "dynadot_delete_ns_by_domain",
    description: "Remove all nameservers for a domain.",
    inputSchema: z.object({
      domainName: z.string(),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("delete_ns_by_domain", { domain: args.domainName });
    },
  },
];
