import { z } from "zod";
import { dynadotRequest } from "../client.js";

export const folderTools = [
  {
    name: "dynadot_folder_list",
    description: "List domain folders.",
    inputSchema: z.object({
      pageIndex: z.number().optional(),
      countPerPage: z.number().optional(),
    }),
    handler: async (args: { pageIndex?: number; countPerPage?: number }) => {
      return dynadotRequest("folder_list", {
        page_index: args.pageIndex,
        count_per_page: args.countPerPage,
      });
    },
  },
  {
    name: "dynadot_create_folder",
    description: "Create a new domain folder.",
    inputSchema: z.object({
      folderName: z.string(),
    }),
    handler: async (args: { folderName: string }) => {
      return dynadotRequest("create_folder", { folder_name: args.folderName });
    },
  },
  {
    name: "dynadot_delete_folder",
    description: "Delete a folder.",
    inputSchema: z.object({
      folderId: z.number(),
    }),
    handler: async (args: { folderId: number }) => {
      return dynadotRequest("delete_folder", { folder_id: args.folderId });
    },
  },
  {
    name: "dynadot_set_folder_name",
    description: "Rename a folder.",
    inputSchema: z.object({
      folderId: z.number(),
      newName: z.string(),
    }),
    handler: async (args: { folderId: number; newName: string }) => {
      return dynadotRequest("set_folder_name", { folder_id: args.folderId, new_name: args.newName });
    },
  },
  {
    name: "dynadot_set_folder_whois",
    description: "Apply WHOIS contacts to all domains in a folder.",
    inputSchema: z.object({
      folderId: z.number(),
      registrantContact: z.number(),
      adminContact: z.number(),
      technicalContact: z.number(),
      billingContact: z.number(),
    }),
    handler: async (args: {
      folderId: number;
      registrantContact: number;
      adminContact: number;
      technicalContact: number;
      billingContact: number;
    }) => {
      return dynadotRequest("set_folder_whois", {
        folder_id: args.folderId,
        registrant_contact: args.registrantContact,
        admin_contact: args.adminContact,
        technical_contact: args.technicalContact,
        billing_contact: args.billingContact,
      });
    },
  },
  {
    name: "dynadot_set_folder_ns",
    description: "Apply nameservers to all domains in a folder.",
    inputSchema: z.object({
      folderId: z.number(),
      nameservers: z.array(z.string()),
    }),
    handler: async (args: { folderId: number; nameservers: string[] }) => {
      const params: Record<string, any> = { folder_id: args.folderId };
      args.nameservers.forEach((ns, i) => { params[`ns${i}`] = ns; });
      return dynadotRequest("set_folder_ns", params);
    },
  },
  {
    name: "dynadot_set_folder_parking",
    description: "Apply parking to all domains in a folder.",
    inputSchema: z.object({
      folderId: z.number(),
      withAds: z.boolean().optional(),
    }),
    handler: async (args: { folderId: number; withAds?: boolean }) => {
      return dynadotRequest("set_folder_parking", {
        folder_id: args.folderId,
        with_ads: args.withAds ? 1 : undefined,
      });
    },
  },
  {
    name: "dynadot_set_folder_forwarding",
    description: "Apply HTTP forwarding to all domains in a folder.",
    inputSchema: z.object({
      folderId: z.number(),
      forwardUrl: z.string(),
      isTemp: z.boolean().optional(),
    }),
    handler: async (args: { folderId: number; forwardUrl: string; isTemp?: boolean }) => {
      return dynadotRequest("set_folder_forwarding", {
        folder_id: args.folderId,
        forward_url: args.forwardUrl,
        is_temp: args.isTemp ? 1 : undefined,
      });
    },
  },
  {
    name: "dynadot_set_folder_stealth",
    description: "Apply stealth forwarding to all domains in a folder.",
    inputSchema: z.object({
      folderId: z.number(),
      stealthUrl: z.string(),
      stealthTitle: z.string().optional(),
    }),
    handler: async (args: { folderId: number; stealthUrl: string; stealthTitle?: string }) => {
      return dynadotRequest("set_folder_stealth", {
        folder_id: args.folderId,
        stealth_url: args.stealthUrl,
        stealth_title: args.stealthTitle,
      });
    },
  },
  {
    name: "dynadot_set_folder_hosting",
    description: "Apply a hosting type to all domains in a folder.",
    inputSchema: z.object({
      folderId: z.number(),
      hostingType: z.string(),
      mobileViewOn: z.boolean().optional(),
    }),
    handler: async (args: { folderId: number; hostingType: string; mobileViewOn?: boolean }) => {
      return dynadotRequest("set_folder_hosting", {
        folder_id: args.folderId,
        hosting_type: args.hostingType,
        mobile_view_on: args.mobileViewOn ? 1 : undefined,
      });
    },
  },
  {
    name: "dynadot_set_folder_dns",
    description: "Apply DNS records to all domains in a folder.",
    inputSchema: z.object({
      folderId: z.number(),
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
      folderId: number;
      mainRecords?: Array<{ type: string; value: string; valueX?: string }>;
      subRecords?: Array<{ subdomain: string; type: string; value: string; valueX?: string }>;
      ttl?: number;
    }) => {
      const params: Record<string, any> = { folder_id: args.folderId };
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
      return dynadotRequest("set_folder_dns2", params);
    },
  },
  {
    name: "dynadot_set_folder_email_forward",
    description: "Apply email forwarding to all domains in a folder.",
    inputSchema: z.object({
      folderId: z.number(),
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
      folderId: number;
      forwardType: string;
      forwards?: Array<{ username: string; existEmail: string }>;
      mxHosts?: Array<{ host: string; distance: number }>;
    }) => {
      const params: Record<string, any> = { folder_id: args.folderId, forward_type: args.forwardType };
      args.forwards?.forEach((f, i) => {
        params[`username${i}`] = f.username;
        params[`exist_email${i}`] = f.existEmail;
      });
      args.mxHosts?.forEach((m, i) => {
        params[`mx_host${i}`] = m.host;
        params[`mx_distance${i}`] = m.distance;
      });
      return dynadotRequest("set_folder_email_forward", params);
    },
  },
  {
    name: "dynadot_set_folder_renew_option",
    description: "Apply a renewal option to all domains in a folder.",
    inputSchema: z.object({
      folderId: z.number(),
      renewOption: z.enum(["donot", "auto", "reset"]),
    }),
    handler: async (args: { folderId: number; renewOption: string }) => {
      return dynadotRequest("set_folder_renew_option", {
        folder_id: args.folderId,
        renew_option: args.renewOption,
      });
    },
  },
  {
    name: "dynadot_set_clear_folder_setting",
    description: "Reset a specific setting on all domains in a folder.",
    inputSchema: z.object({
      folderId: z.number(),
      service: z.string(),
    }),
    handler: async (args: { folderId: number; service: string }) => {
      return dynadotRequest("set_clear_folder_setting", {
        folder_id: args.folderId,
        service: args.service,
      });
    },
  },
];
