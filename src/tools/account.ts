import { z } from "zod";
import { dynadotRequest } from "../client.js";

export const accountTools = [
  {
    name: "dynadot_get_info",
    description: "Get account profile, balance, and basic info.",
    inputSchema: z.object({}),
    handler: async () => {
      return dynadotRequest("GET", "/account/info");
    },
  },
  {
    name: "dynadot_set_default_nameservers",
    description: "Set the account-wide default nameservers used for new domains.",
    inputSchema: z.object({
      nameservers: z.array(z.string()).describe("Nameserver hostnames"),
    }),
    handler: async (args: { nameservers: string[] }) => {
      return dynadotRequest("PUT", "/account/default-nameservers", { nameservers: args.nameservers });
    },
  },
  {
    name: "dynadot_set_default_domain_forwarding",
    description: "Set the default domain forwarding for new domains.",
    inputSchema: z.object({
      url: z.string().describe("Destination URL"),
      type: z.string().optional().describe("Forwarding type (e.g. '301', '302')"),
      masking: z.boolean().optional().describe("Use URL masking"),
    }),
    handler: async (args: { url: string; type?: string; masking?: boolean }) => {
      return dynadotRequest("PUT", "/account/default-forwarding", {
        url: args.url,
        type: args.type,
        masking: args.masking,
      });
    },
  },
  {
    name: "dynadot_set_default_stealth_forwarding",
    description: "Set the default stealth forwarding for new domains.",
    inputSchema: z.object({
      url: z.string().describe("Destination URL"),
      masking: z.boolean().optional().describe("Use URL masking"),
    }),
    handler: async (args: { url: string; masking?: boolean }) => {
      return dynadotRequest("PUT", "/account/default-stealth-forwarding", {
        url: args.url,
        masking: args.masking,
      });
    },
  },
  {
    name: "dynadot_set_default_email_forwarding",
    description: "Set default email forwarding rules for new domains.",
    inputSchema: z.object({
      forwards: z.array(z.object({
        from: z.string().describe("Local part"),
        to: z.string().describe("Destination email address"),
      })).describe("Email forwards"),
    }),
    handler: async (args: { forwards: Array<{ from: string; to: string }> }) => {
      return dynadotRequest("PUT", "/account/default-email-forwarding", { forwards: args.forwards });
    },
  },
  {
    name: "dynadot_set_default_contacts",
    description: "Set default domain contacts (registrant/admin/tech/billing) for new registrations.",
    inputSchema: z.object({
      registrant: z.number().optional().describe("Registrant contact ID"),
      admin: z.number().optional().describe("Admin contact ID"),
      tech: z.number().optional().describe("Tech contact ID"),
      billing: z.number().optional().describe("Billing contact ID"),
    }),
    handler: async (args: { registrant?: number; admin?: number; tech?: number; billing?: number }) => {
      return dynadotRequest("PUT", "/account/default-contacts", args);
    },
  },
  {
    name: "dynadot_set_default_parking",
    description: "Set the default parking type for new domains.",
    inputSchema: z.object({
      parkingType: z.string().describe("Parking type"),
    }),
    handler: async (args: { parkingType: string }) => {
      return dynadotRequest("PUT", "/account/default-parking", { parking_type: args.parkingType });
    },
  },
  {
    name: "dynadot_set_default_hosting",
    description: "Set the default hosting plan for new domains.",
    inputSchema: z.object({
      hostingId: z.number().describe("Hosting plan ID"),
    }),
    handler: async (args: { hostingId: number }) => {
      return dynadotRequest("PUT", "/account/default-hosting", { hosting_id: args.hostingId });
    },
  },
  {
    name: "dynadot_set_default_renew_option",
    description: "Set the default renewal option for new domains.",
    inputSchema: z.object({
      renewOption: z.string().describe("Renew option (e.g. 'auto', 'donotrenew', 'reset')"),
    }),
    handler: async (args: { renewOption: string }) => {
      return dynadotRequest("PUT", "/account/default-renew-option", { renewOption: args.renewOption });
    },
  },
  {
    name: "dynadot_set_default_dns",
    description: "Set default DNS records applied to new domains.",
    inputSchema: z.object({
      records: z.array(z.object({
        type: z.string().describe("Record type"),
        subdomain: z.string().optional().describe("Subdomain (host)"),
        value: z.string().describe("Record value"),
        ttl: z.number().optional().describe("TTL"),
        priority: z.number().optional().describe("Priority (MX/SRV)"),
      })).describe("Default DNS records"),
    }),
    handler: async (args: { records: Array<Record<string, unknown>> }) => {
      return dynadotRequest("PUT", "/account/default-dns", { records: args.records });
    },
  },
  {
    name: "dynadot_clear_default_setting",
    description: "Reset specified account default settings.",
    inputSchema: z.object({
      settings: z.array(z.string()).describe("Settings to clear (e.g. ['nameservers', 'forwarding'])"),
    }),
    handler: async (args: { settings: string[] }) => {
      return dynadotRequest("PUT", "/account/clear-default-settings", { settings: args.settings });
    },
  },
  {
    name: "dynadot_set_account_lock_status",
    description: "Enable or disable the account-wide lock.",
    inputSchema: z.object({
      lockStatus: z.boolean().describe("true to lock, false to unlock"),
    }),
    handler: async (args: { lockStatus: boolean }) => {
      return dynadotRequest("PUT", "/account/lock-status", { lockStatus: args.lockStatus });
    },
  },
  {
    name: "dynadot_list_coupons",
    description: "List available promotional codes (coupons).",
    inputSchema: z.object({
      limit: z.number().optional().describe("Page size"),
      offset: z.number().optional().describe("Page offset"),
    }),
    handler: async (args: { limit?: number; offset?: number }) => {
      return dynadotRequest("GET", "/account/coupons", undefined, { limit: args.limit, offset: args.offset });
    },
  },
];
