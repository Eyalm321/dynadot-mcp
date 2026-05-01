import { z } from "zod";
import { dynadotRequest } from "../client.js";

export const folderTools = [
  {
    name: "dynadot_folder_list",
    description: "List domain folders in the account.",
    inputSchema: z.object({
      limit: z.number().optional().describe("Page size"),
      offset: z.number().optional().describe("Page offset"),
    }),
    handler: async (args: { limit?: number; offset?: number }) => {
      return dynadotRequest("GET", "/folders", undefined, { limit: args.limit, offset: args.offset });
    },
  },
  {
    name: "dynadot_folder_create",
    description: "Create a new domain folder.",
    inputSchema: z.object({
      folderName: z.string().describe("Folder name"),
    }),
    handler: async (args: { folderName: string }) => {
      return dynadotRequest("POST", "/folders", { folderName: args.folderName });
    },
  },
  {
    name: "dynadot_folder_delete",
    description: "Delete a folder; domains inside it move to no-folder.",
    inputSchema: z.object({
      folderId: z.number().describe("Folder ID"),
    }),
    handler: async (args: { folderId: number }) => {
      return dynadotRequest("DELETE", `/folders/${args.folderId}`);
    },
  },
  {
    name: "dynadot_folder_set_name",
    description: "Rename a folder.",
    inputSchema: z.object({
      folderId: z.number().describe("Folder ID"),
      folderName: z.string().describe("New folder name"),
    }),
    handler: async (args: { folderId: number; folderName: string }) => {
      return dynadotRequest("PUT", `/folders/${args.folderId}/name`, { folderName: args.folderName });
    },
  },
  {
    name: "dynadot_folder_set_dns",
    description: "Apply DNS records to all domains in a folder.",
    inputSchema: z.object({
      folderId: z.number().describe("Folder ID"),
      records: z.array(z.object({
        type: z.string(),
        subdomain: z.string().optional(),
        value: z.string(),
        ttl: z.number().optional(),
        priority: z.number().optional(),
      })).describe("DNS records"),
    }),
    handler: async (args: { folderId: number; records: Array<Record<string, unknown>> }) => {
      return dynadotRequest("PUT", `/folders/${args.folderId}/dns`, { records: args.records });
    },
  },
  {
    name: "dynadot_folder_set_nameserver",
    description: "Apply nameservers to all domains in a folder.",
    inputSchema: z.object({
      folderId: z.number().describe("Folder ID"),
      nameservers: z.array(z.string()).describe("Nameserver hostnames"),
    }),
    handler: async (args: { folderId: number; nameservers: string[] }) => {
      return dynadotRequest("PUT", `/folders/${args.folderId}/nameservers`, { nameservers: args.nameservers });
    },
  },
  {
    name: "dynadot_folder_set_contacts",
    description: "Apply contacts to all domains in a folder.",
    inputSchema: z.object({
      folderId: z.number().describe("Folder ID"),
      registrant: z.number().optional().describe("Registrant contact ID"),
      admin: z.number().optional().describe("Admin contact ID"),
      tech: z.number().optional().describe("Tech contact ID"),
      billing: z.number().optional().describe("Billing contact ID"),
    }),
    handler: async (args: { folderId: number; registrant?: number; admin?: number; tech?: number; billing?: number }) => {
      const { folderId, ...rest } = args;
      return dynadotRequest("PUT", `/folders/${folderId}/contacts`, rest);
    },
  },
  {
    name: "dynadot_folder_set_parking",
    description: "Apply a parking type to all domains in a folder.",
    inputSchema: z.object({
      folderId: z.number().describe("Folder ID"),
      parkingType: z.string().describe("Parking type"),
    }),
    handler: async (args: { folderId: number; parkingType: string }) => {
      return dynadotRequest("PUT", `/folders/${args.folderId}/parking`, { parking_type: args.parkingType });
    },
  },
  {
    name: "dynadot_folder_set_domain_forwarding",
    description: "Apply domain forwarding to all domains in a folder.",
    inputSchema: z.object({
      folderId: z.number().describe("Folder ID"),
      url: z.string().describe("Destination URL"),
      type: z.string().optional().describe("Forwarding type"),
      masking: z.boolean().optional().describe("Use URL masking"),
    }),
    handler: async (args: { folderId: number; url: string; type?: string; masking?: boolean }) => {
      return dynadotRequest("PUT", `/folders/${args.folderId}/forwarding`, {
        url: args.url,
        type: args.type,
        masking: args.masking,
      });
    },
  },
  {
    name: "dynadot_folder_set_stealth_forwarding",
    description: "Apply stealth forwarding to all domains in a folder.",
    inputSchema: z.object({
      folderId: z.number().describe("Folder ID"),
      url: z.string().describe("Destination URL"),
      masking: z.boolean().optional().describe("Use URL masking"),
    }),
    handler: async (args: { folderId: number; url: string; masking?: boolean }) => {
      return dynadotRequest("PUT", `/folders/${args.folderId}/stealth-forwarding`, {
        url: args.url,
        masking: args.masking,
      });
    },
  },
  {
    name: "dynadot_folder_set_email_forwarding",
    description: "Apply email forwarding rules to all domains in a folder.",
    inputSchema: z.object({
      folderId: z.number().describe("Folder ID"),
      forwards: z.array(z.object({
        from: z.string().describe("Local part"),
        to: z.string().describe("Destination email"),
      })).describe("Email forwards"),
    }),
    handler: async (args: { folderId: number; forwards: Array<{ from: string; to: string }> }) => {
      return dynadotRequest("PUT", `/folders/${args.folderId}/email-forwarding`, { forwards: args.forwards });
    },
  },
  {
    name: "dynadot_folder_set_hosting",
    description: "Apply a hosting plan to all domains in a folder.",
    inputSchema: z.object({
      folderId: z.number().describe("Folder ID"),
      hostingId: z.number().describe("Hosting plan ID"),
    }),
    handler: async (args: { folderId: number; hostingId: number }) => {
      return dynadotRequest("PUT", `/folders/${args.folderId}/hosting`, { hosting_id: args.hostingId });
    },
  },
  {
    name: "dynadot_folder_set_renew_option",
    description: "Apply a renewal option to all domains in a folder.",
    inputSchema: z.object({
      folderId: z.number().describe("Folder ID"),
      renewOption: z.string().describe("Renewal option"),
    }),
    handler: async (args: { folderId: number; renewOption: string }) => {
      return dynadotRequest("PUT", `/folders/${args.folderId}/renew-option`, { renewOption: args.renewOption });
    },
  },
  {
    name: "dynadot_folder_clear_setting",
    description: "Reset specified settings on all domains in a folder.",
    inputSchema: z.object({
      folderId: z.number().describe("Folder ID"),
      settings: z.array(z.string()).describe("Settings to clear"),
    }),
    handler: async (args: { folderId: number; settings: string[] }) => {
      return dynadotRequest("PUT", `/folders/${args.folderId}/clear-settings`, { settings: args.settings });
    },
  },
];
