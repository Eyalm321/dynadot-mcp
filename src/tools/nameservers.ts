import { z } from "zod";
import { dynadotRequest } from "../client.js";

export const nameserverTools = [
  {
    name: "dynadot_nameserver_get",
    description: "Get details for a single nameserver record.",
    inputSchema: z.object({
      nameserverId: z.number().describe("Nameserver ID"),
    }),
    handler: async (args: { nameserverId: number }) => {
      return dynadotRequest("GET", `/nameservers/${args.nameserverId}`);
    },
  },
  {
    name: "dynadot_nameserver_list",
    description: "List all nameservers in the account.",
    inputSchema: z.object({
      limit: z.number().optional().describe("Page size"),
      offset: z.number().optional().describe("Page offset"),
    }),
    handler: async (args: { limit?: number; offset?: number }) => {
      return dynadotRequest("GET", "/nameservers", undefined, { limit: args.limit, offset: args.offset });
    },
  },
  {
    name: "dynadot_nameserver_register",
    description: "Register a glue nameserver record (host on a domain you own).",
    inputSchema: z.object({
      nameserverName: z.string().describe("Nameserver hostname"),
      ipv4: z.string().optional().describe("IPv4 address"),
      ipv6: z.string().optional().describe("IPv6 address"),
    }),
    handler: async (args: { nameserverName: string; ipv4?: string; ipv6?: string }) => {
      return dynadotRequest("POST", "/nameservers", {
        nameserverName: args.nameserverName,
        ipv4: args.ipv4,
        ipv6: args.ipv6,
      });
    },
  },
  {
    name: "dynadot_nameserver_add_external",
    description: "Add an external nameserver (hostname not registered with Dynadot).",
    inputSchema: z.object({
      nameserverName: z.string().describe("Nameserver hostname"),
      ipv4: z.string().optional().describe("IPv4 address"),
      ipv6: z.string().optional().describe("IPv6 address"),
    }),
    handler: async (args: { nameserverName: string; ipv4?: string; ipv6?: string }) => {
      return dynadotRequest("POST", "/nameservers/external", {
        nameserverName: args.nameserverName,
        ipv4: args.ipv4,
        ipv6: args.ipv6,
      });
    },
  },
  {
    name: "dynadot_nameserver_set_ip",
    description: "Update the IP address(es) for a nameserver.",
    inputSchema: z.object({
      nameserverId: z.number().describe("Nameserver ID"),
      ipv4: z.string().optional().describe("IPv4 address"),
      ipv6: z.string().optional().describe("IPv6 address"),
    }),
    handler: async (args: { nameserverId: number; ipv4?: string; ipv6?: string }) => {
      return dynadotRequest("PUT", `/nameservers/${args.nameserverId}/ip`, {
        ipv4: args.ipv4,
        ipv6: args.ipv6,
      });
    },
  },
  {
    name: "dynadot_nameserver_delete",
    description: "Remove a nameserver record.",
    inputSchema: z.object({
      nameserverId: z.number().describe("Nameserver ID"),
    }),
    handler: async (args: { nameserverId: number }) => {
      return dynadotRequest("DELETE", `/nameservers/${args.nameserverId}`);
    },
  },
];
