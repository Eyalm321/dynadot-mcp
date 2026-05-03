import { z } from "zod";
import { dynadotRequest } from "../client.js";

export const accountTools = [
  {
    name: "dynadot_account_info",
    description: "Get account profile and settings.",
    inputSchema: z.object({}),
    handler: async () => {
      return dynadotRequest("account_info");
    },
  },
  {
    name: "dynadot_get_account_balance",
    description: "Get the account credit balance.",
    inputSchema: z.object({}),
    handler: async () => {
      return dynadotRequest("get_account_balance");
    },
  },
  {
    name: "dynadot_list_coupons",
    description: "List available coupon codes.",
    inputSchema: z.object({}),
    handler: async () => {
      return dynadotRequest("list_coupons");
    },
  },
  {
    name: "dynadot_set_default_whois",
    description: "Set default WHOIS contacts for new domains.",
    inputSchema: z.object({
      registrantContact: z.number(),
      adminContact: z.number(),
      technicalContact: z.number(),
      billingContact: z.number(),
    }),
    handler: async (args: { registrantContact: number; adminContact: number; technicalContact: number; billingContact: number }) => {
      return dynadotRequest("set_default_whois", {
        registrant_contact: args.registrantContact,
        admin_contact: args.adminContact,
        technical_contact: args.technicalContact,
        billing_contact: args.billingContact,
      });
    },
  },
  {
    name: "dynadot_set_default_ns",
    description: "Set default nameservers for new domains (up to 13).",
    inputSchema: z.object({
      nameservers: z.array(z.string()),
    }),
    handler: async (args: { nameservers: string[] }) => {
      const params: Record<string, any> = {};
      args.nameservers.forEach((ns, i) => { params[`ns${i}`] = ns; });
      return dynadotRequest("set_default_ns", params);
    },
  },
  {
    name: "dynadot_set_default_parking",
    description: "Set default parking settings for new domains.",
    inputSchema: z.object({
      withAds: z.boolean().optional(),
    }),
    handler: async (args: { withAds?: boolean }) => {
      return dynadotRequest("set_default_parking", { with_ads: args.withAds ? 1 : undefined });
    },
  },
  {
    name: "dynadot_set_default_forwarding",
    description: "Set default HTTP forwarding for new domains.",
    inputSchema: z.object({
      forwardUrl: z.string(),
      isTemp: z.boolean().optional(),
    }),
    handler: async (args: { forwardUrl: string; isTemp?: boolean }) => {
      return dynadotRequest("set_default_forwarding", {
        forward_url: args.forwardUrl,
        is_temp: args.isTemp ? 1 : undefined,
      });
    },
  },
  {
    name: "dynadot_set_default_stealth",
    description: "Set default stealth forwarding for new domains.",
    inputSchema: z.object({
      stealthUrl: z.string(),
      stealthTitle: z.string().optional(),
    }),
    handler: async (args: { stealthUrl: string; stealthTitle?: string }) => {
      return dynadotRequest("set_default_stealth", {
        stealth_url: args.stealthUrl,
        stealth_title: args.stealthTitle,
      });
    },
  },
  {
    name: "dynadot_set_default_hosting",
    description: "Set default hosting type for new domains.",
    inputSchema: z.object({
      hostingType: z.string(),
      mobileViewOn: z.boolean().optional(),
    }),
    handler: async (args: { hostingType: string; mobileViewOn?: boolean }) => {
      return dynadotRequest("set_default_hosting", {
        hosting_type: args.hostingType,
        mobile_view_on: args.mobileViewOn ? 1 : undefined,
      });
    },
  },
  {
    name: "dynadot_set_default_renew_option",
    description: "Set default auto-renewal option for new domains.",
    inputSchema: z.object({
      renewOption: z.enum(["donot", "auto", "reset"]),
    }),
    handler: async (args: { renewOption: string }) => {
      return dynadotRequest("set_default_renew_option", { renew_option: args.renewOption });
    },
  },
  {
    name: "dynadot_set_default_dns",
    description: "Set default DNS records for new domains. Pass main records (root domain) and/or subdomain records.",
    inputSchema: z.object({
      mainRecords: z.array(z.object({
        type: z.string(),
        value: z.string(),
        valueX: z.string().optional(),
      })).optional(),
      subRecords: z.array(z.object({
        subdomain: z.string(),
        type: z.string(),
        value: z.string(),
        valueX: z.string().optional(),
      })).optional(),
      ttl: z.number().optional(),
    }),
    handler: async (args: {
      mainRecords?: Array<{ type: string; value: string; valueX?: string }>;
      subRecords?: Array<{ subdomain: string; type: string; value: string; valueX?: string }>;
      ttl?: number;
    }) => {
      const params: Record<string, any> = {};
      args.mainRecords?.forEach((r, i) => {
        params[`main_record_type${i}`] = r.type;
        params[`main_record${i}`] = r.value;
        if (r.valueX !== undefined) params[`main_recordx${i}`] = r.valueX;
      });
      args.subRecords?.forEach((r, i) => {
        params[`subdomain${i}`] = r.subdomain;
        params[`sub_record_type${i}`] = r.type;
        params[`sub_record${i}`] = r.value;
        if (r.valueX !== undefined) params[`sub_recordx${i}`] = r.valueX;
      });
      if (args.ttl !== undefined) params.ttl = args.ttl;
      return dynadotRequest("set_default_dns2", params);
    },
  },
  {
    name: "dynadot_set_default_email_forward",
    description: "Set default email forwarding rules for new domains.",
    inputSchema: z.object({
      forwardType: z.string(),
      forwards: z.array(z.object({
        username: z.string(),
        existEmail: z.string(),
      })).optional(),
      mxHosts: z.array(z.object({
        host: z.string(),
        distance: z.number(),
      })).optional(),
    }),
    handler: async (args: {
      forwardType: string;
      forwards?: Array<{ username: string; existEmail: string }>;
      mxHosts?: Array<{ host: string; distance: number }>;
    }) => {
      const params: Record<string, any> = { forward_type: args.forwardType };
      args.forwards?.forEach((f, i) => {
        params[`username${i}`] = f.username;
        params[`exist_email${i}`] = f.existEmail;
      });
      args.mxHosts?.forEach((m, i) => {
        params[`mx_host${i}`] = m.host;
        params[`mx_distance${i}`] = m.distance;
      });
      return dynadotRequest("set_default_email_forward", params);
    },
  },
  {
    name: "dynadot_set_clear_default_setting",
    description: "Reset a specific account-default setting.",
    inputSchema: z.object({
      service: z.string().describe("Setting to clear (e.g. 'ns', 'forwarding', 'dns')"),
    }),
    handler: async (args: { service: string }) => {
      return dynadotRequest("set_clear_default_setting", { service: args.service });
    },
  },
];
