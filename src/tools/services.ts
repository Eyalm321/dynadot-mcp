import { z } from "zod";
import { dynadotRequest } from "../client.js";

export const serviceTools = [
  {
    name: "dynadot_get_site_builder",
    description: "Get details of a single site builder website.",
    inputSchema: z.object({
      siteId: z.number().describe("Site builder ID"),
    }),
    handler: async (args: { siteId: number }) => {
      return dynadotRequest("GET", `/site-builder/${args.siteId}`);
    },
  },
  {
    name: "dynadot_list_site_builder",
    description: "List site builder websites in the account.",
    inputSchema: z.object({
      limit: z.number().optional().describe("Page size"),
      offset: z.number().optional().describe("Page offset"),
    }),
    handler: async (args: { limit?: number; offset?: number }) => {
      return dynadotRequest("GET", "/site-builder", undefined, { limit: args.limit, offset: args.offset });
    },
  },
  {
    name: "dynadot_create_site_builder",
    description: "Create a new site-builder website on a domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name to attach the site to"),
      template: z.string().describe("Template identifier"),
      siteTitle: z.string().describe("Site title"),
    }),
    handler: async (args: { domainName: string; template: string; siteTitle: string }) => {
      return dynadotRequest("POST", "/site-builder", {
        domainName: args.domainName,
        template: args.template,
        siteTitle: args.siteTitle,
      });
    },
  },
  {
    name: "dynadot_upgrade_site_builder",
    description: "Upgrade the plan of an existing site builder.",
    inputSchema: z.object({
      siteId: z.number().describe("Site builder ID"),
      planType: z.string().describe("Plan type to upgrade to"),
    }),
    handler: async (args: { siteId: number; planType: string }) => {
      return dynadotRequest("POST", `/site-builder/${args.siteId}/upgrade`, { planType: args.planType });
    },
  },
  {
    name: "dynadot_create_email_hosting",
    description: "Set up email hosting on a domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      mailboxes: z.number().describe("Number of mailboxes"),
      planType: z.string().describe("Email hosting plan type"),
    }),
    handler: async (args: { domainName: string; mailboxes: number; planType: string }) => {
      return dynadotRequest("POST", "/email-hosting", {
        domainName: args.domainName,
        mailboxes: args.mailboxes,
        planType: args.planType,
      });
    },
  },
  {
    name: "dynadot_list_email_hosting",
    description: "List email hosting accounts.",
    inputSchema: z.object({
      limit: z.number().optional().describe("Page size"),
      offset: z.number().optional().describe("Page offset"),
    }),
    handler: async (args: { limit?: number; offset?: number }) => {
      return dynadotRequest("GET", "/email-hosting", undefined, { limit: args.limit, offset: args.offset });
    },
  },
  {
    name: "dynadot_upgrade_email_hosting",
    description: "Upgrade an email hosting account (e.g. add mailboxes).",
    inputSchema: z.object({
      emailId: z.number().describe("Email hosting ID"),
      mailboxes: z.number().describe("New mailbox count"),
    }),
    handler: async (args: { emailId: number; mailboxes: number }) => {
      return dynadotRequest("POST", `/email-hosting/${args.emailId}/upgrade`, { mailboxes: args.mailboxes });
    },
  },
  {
    name: "dynadot_delete_email_hosting",
    description: "Delete an email hosting account.",
    inputSchema: z.object({
      emailId: z.number().describe("Email hosting ID"),
    }),
    handler: async (args: { emailId: number }) => {
      return dynadotRequest("DELETE", `/email-hosting/${args.emailId}`);
    },
  },
];
