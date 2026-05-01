import { z } from "zod";
import { dynadotRequest } from "../client.js";

const contactSchema = z.object({
  registrant: z.number().optional().describe("Registrant contact ID"),
  admin: z.number().optional().describe("Admin contact ID"),
  tech: z.number().optional().describe("Tech contact ID"),
  billing: z.number().optional().describe("Billing contact ID"),
});

const dnsRecordSchema = z.object({
  type: z.string().describe("Record type (A, AAAA, CNAME, MX, TXT, SRV, etc.)"),
  subdomain: z.string().optional().describe("Subdomain (host) — use empty string for root"),
  value: z.string().describe("Record value (IP, hostname, text, etc.)"),
  ttl: z.number().optional().describe("Time-to-live in seconds"),
  priority: z.number().optional().describe("MX/SRV priority"),
});

export const domainTools = [
  {
    name: "dynadot_search",
    description: "Check availability of a single domain name and (optionally) get its price.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name to check (e.g. 'example.com')"),
      showPrice: z.boolean().optional().describe("Include pricing information"),
      currency: z.string().optional().describe("Currency code (e.g. 'USD')"),
    }),
    handler: async (args: { domainName: string; showPrice?: boolean; currency?: string }) => {
      return dynadotRequest("GET", `/domains/${encodeURIComponent(args.domainName)}/search`, undefined, {
        showPrice: args.showPrice,
        currency: args.currency,
      });
    },
  },
  {
    name: "dynadot_bulk_search",
    description: "Check availability for multiple domain names in one call.",
    inputSchema: z.object({
      domainNames: z.array(z.string()).describe("List of domain names to check"),
      showPrice: z.boolean().optional().describe("Include pricing information"),
      currency: z.string().optional().describe("Currency code"),
    }),
    handler: async (args: { domainNames: string[]; showPrice?: boolean; currency?: string }) => {
      return dynadotRequest("GET", "/domains/bulk-search", undefined, {
        domainNames: args.domainNames,
        showPrice: args.showPrice,
        currency: args.currency,
      });
    },
  },
  {
    name: "dynadot_suggestion_search",
    description: "Generate domain name suggestions based on a keyword.",
    inputSchema: z.object({
      keyword: z.string().describe("Seed keyword for suggestions"),
      tld: z.string().optional().describe("Limit suggestions to a specific TLD"),
      showPrice: z.boolean().optional().describe("Include pricing"),
    }),
    handler: async (args: { keyword: string; tld?: string; showPrice?: boolean }) => {
      return dynadotRequest("GET", "/domains/suggestion-search", undefined, {
        keyword: args.keyword,
        tld: args.tld,
        showPrice: args.showPrice,
      });
    },
  },
  {
    name: "dynadot_get_pending_push",
    description: "Get pending domain push requests for the specified domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("GET", `/domains/${encodeURIComponent(args.domainName)}/pending-push`);
    },
  },
  {
    name: "dynadot_register",
    description: "Register a new domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain to register"),
      years: z.number().describe("Registration period in years"),
      contacts: contactSchema.optional().describe("Contact IDs (registrant/admin/tech/billing)"),
      nameservers: z.array(z.string()).optional().describe("Nameservers for the domain"),
      privacy: z.boolean().optional().describe("Enable WHOIS privacy"),
      autoRenew: z.boolean().optional().describe("Enable auto-renewal"),
      coupon: z.string().optional().describe("Coupon code"),
    }),
    handler: async (args: {
      domainName: string;
      years: number;
      contacts?: z.infer<typeof contactSchema>;
      nameservers?: string[];
      privacy?: boolean;
      autoRenew?: boolean;
      coupon?: string;
    }) => {
      return dynadotRequest("POST", "/domains/register", {
        domainName: args.domainName,
        years: args.years,
        contacts: args.contacts,
        nameservers: args.nameservers,
        privacy: args.privacy,
        autoRenew: args.autoRenew,
        coupon: args.coupon,
      });
    },
  },
  {
    name: "dynadot_renew",
    description: "Renew a domain for the specified number of years.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain to renew"),
      years: z.number().describe("Renewal period in years"),
      coupon: z.string().optional().describe("Coupon code"),
    }),
    handler: async (args: { domainName: string; years: number; coupon?: string }) => {
      return dynadotRequest("POST", `/domains/${encodeURIComponent(args.domainName)}/renew`, {
        years: args.years,
        coupon: args.coupon,
      });
    },
  },
  {
    name: "dynadot_transfer_in",
    description: "Initiate an incoming transfer of a domain to Dynadot.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain to transfer in"),
      authCode: z.string().describe("Authorization code (EPP) from current registrar"),
      contacts: contactSchema.optional().describe("Contact IDs"),
      privacy: z.boolean().optional().describe("Enable WHOIS privacy"),
      autoRenew: z.boolean().optional().describe("Enable auto-renewal"),
    }),
    handler: async (args: {
      domainName: string;
      authCode: string;
      contacts?: z.infer<typeof contactSchema>;
      privacy?: boolean;
      autoRenew?: boolean;
    }) => {
      return dynadotRequest("POST", "/domains/transfer-in", {
        domainName: args.domainName,
        authCode: args.authCode,
        contacts: args.contacts,
        privacy: args.privacy,
        autoRenew: args.autoRenew,
      });
    },
  },
  {
    name: "dynadot_grace_delete",
    description: "Delete a domain that is still in the grace period (full refund).",
    inputSchema: z.object({
      domainName: z.string().describe("Domain to delete"),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("DELETE", `/domains/${encodeURIComponent(args.domainName)}/grace-delete`);
    },
  },
  {
    name: "dynadot_post_grace_delete",
    description: "Delete a domain that is past the grace period.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain to delete"),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("DELETE", `/domains/${encodeURIComponent(args.domainName)}/post-grace-delete`);
    },
  },
  {
    name: "dynadot_restore",
    description: "Restore a previously deleted domain (within the redemption period).",
    inputSchema: z.object({
      domainName: z.string().describe("Domain to restore"),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("POST", `/domains/${encodeURIComponent(args.domainName)}/restore`);
    },
  },
  {
    name: "dynadot_domain_list",
    description: "List all domains in the account.",
    inputSchema: z.object({
      folder: z.string().optional().describe("Filter by folder name or ID"),
      limit: z.number().optional().describe("Page size"),
      offset: z.number().optional().describe("Page offset"),
    }),
    handler: async (args: { folder?: string; limit?: number; offset?: number }) => {
      return dynadotRequest("GET", "/domains", undefined, {
        folder: args.folder,
        limit: args.limit,
        offset: args.offset,
      });
    },
  },
  {
    name: "dynadot_domain_info",
    description: "Get full details for a single domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("GET", `/domains/${encodeURIComponent(args.domainName)}`);
    },
  },
  {
    name: "dynadot_domain_appraisal",
    description: "Get an estimated value (appraisal) for a domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("GET", `/domains/${encodeURIComponent(args.domainName)}/appraisal`);
    },
  },
  {
    name: "dynadot_domain_get_tld_price",
    description: "Get TLD pricing details for a domain (register/renew/transfer prices for its TLD).",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("GET", `/domains/${encodeURIComponent(args.domainName)}/tld-price`);
    },
  },
  {
    name: "dynadot_set_domain_forwarding",
    description: "Set up domain forwarding (HTTP redirect) for a domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      url: z.string().describe("Destination URL"),
      type: z.string().optional().describe("Forwarding type (e.g. '301', '302')"),
      masking: z.boolean().optional().describe("Use URL masking (frame forwarding)"),
    }),
    handler: async (args: { domainName: string; url: string; type?: string; masking?: boolean }) => {
      return dynadotRequest("PUT", `/domains/${encodeURIComponent(args.domainName)}/forwarding`, {
        url: args.url,
        type: args.type,
        masking: args.masking,
      });
    },
  },
  {
    name: "dynadot_set_stealth_forwarding",
    description: "Set stealth (URL-hiding) forwarding for a domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      url: z.string().describe("Destination URL"),
      masking: z.boolean().optional().describe("Use URL masking"),
    }),
    handler: async (args: { domainName: string; url: string; masking?: boolean }) => {
      return dynadotRequest("PUT", `/domains/${encodeURIComponent(args.domainName)}/stealth-forwarding`, {
        url: args.url,
        masking: args.masking,
      });
    },
  },
  {
    name: "dynadot_set_email_forwarding",
    description: "Configure email forwarding rules for a domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      forwards: z.array(z.object({
        from: z.string().describe("Local part / alias (e.g. 'sales' for sales@domain)"),
        to: z.string().describe("Destination email address"),
      })).describe("List of email forwards"),
    }),
    handler: async (args: { domainName: string; forwards: Array<{ from: string; to: string }> }) => {
      return dynadotRequest("PUT", `/domains/${encodeURIComponent(args.domainName)}/email-forwarding`, {
        forwards: args.forwards,
      });
    },
  },
  {
    name: "dynadot_set_renew_option",
    description: "Set the renewal option (auto-renew, do-not-renew, etc.) for a domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      renewOption: z.string().describe("Renewal option (e.g. 'auto', 'donotrenew', 'reset')"),
    }),
    handler: async (args: { domainName: string; renewOption: string }) => {
      return dynadotRequest("PUT", `/domains/${encodeURIComponent(args.domainName)}/renew-option`, {
        renewOption: args.renewOption,
      });
    },
  },
  {
    name: "dynadot_set_contacts",
    description: "Update the contacts (registrant/admin/tech/billing) for a domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      registrant: z.number().optional().describe("Registrant contact ID"),
      admin: z.number().optional().describe("Admin contact ID"),
      tech: z.number().optional().describe("Tech contact ID"),
      billing: z.number().optional().describe("Billing contact ID"),
    }),
    handler: async (args: { domainName: string; registrant?: number; admin?: number; tech?: number; billing?: number }) => {
      return dynadotRequest("PUT", `/domains/${encodeURIComponent(args.domainName)}/contacts`, {
        registrant: args.registrant,
        admin: args.admin,
        tech: args.tech,
        billing: args.billing,
      });
    },
  },
  {
    name: "dynadot_set_folder",
    description: "Move a domain to a folder.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      folderId: z.number().describe("Target folder ID"),
    }),
    handler: async (args: { domainName: string; folderId: number }) => {
      return dynadotRequest("PUT", `/domains/${encodeURIComponent(args.domainName)}/folder`, {
        folder_id: args.folderId,
      });
    },
  },
  {
    name: "dynadot_set_domain_lock_status",
    description: "Enable or disable the registrar lock on a domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      lockStatus: z.boolean().describe("true to lock, false to unlock"),
    }),
    handler: async (args: { domainName: string; lockStatus: boolean }) => {
      return dynadotRequest("PUT", `/domains/${encodeURIComponent(args.domainName)}/lock-status`, {
        lockStatus: args.lockStatus,
      });
    },
  },
  {
    name: "dynadot_get_transfer_status",
    description: "Get the status of an in-progress incoming transfer.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("GET", `/domains/${encodeURIComponent(args.domainName)}/transfer-status`);
    },
  },
  {
    name: "dynadot_get_transfer_auth_code",
    description: "Retrieve the authorization (EPP) code for transferring a domain away.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("GET", `/domains/${encodeURIComponent(args.domainName)}/auth-code`);
    },
  },
  {
    name: "dynadot_domain_get_nameserver",
    description: "Get the nameservers configured for a domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("GET", `/domains/${encodeURIComponent(args.domainName)}/nameservers`);
    },
  },
  {
    name: "dynadot_domain_set_nameserver",
    description: "Set the nameservers for a domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      nameservers: z.array(z.string()).describe("Nameserver hostnames"),
    }),
    handler: async (args: { domainName: string; nameservers: string[] }) => {
      return dynadotRequest("PUT", `/domains/${encodeURIComponent(args.domainName)}/nameservers`, {
        nameservers: args.nameservers,
      });
    },
  },
  {
    name: "dynadot_set_hosting",
    description: "Assign a hosting plan to a domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      hostingId: z.number().describe("Hosting plan ID"),
    }),
    handler: async (args: { domainName: string; hostingId: number }) => {
      return dynadotRequest("PUT", `/domains/${encodeURIComponent(args.domainName)}/hosting`, {
        hosting_id: args.hostingId,
      });
    },
  },
  {
    name: "dynadot_set_parking",
    description: "Set the parking type for a domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      parkingType: z.string().describe("Parking type (e.g. 'dynadot', 'cashparking', 'forsale')"),
    }),
    handler: async (args: { domainName: string; parkingType: string }) => {
      return dynadotRequest("PUT", `/domains/${encodeURIComponent(args.domainName)}/parking`, {
        parking_type: args.parkingType,
      });
    },
  },
  {
    name: "dynadot_set_privacy",
    description: "Enable or disable WHOIS privacy on a domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      privacyStatus: z.string().describe("Privacy status (e.g. 'full', 'partial', 'off')"),
    }),
    handler: async (args: { domainName: string; privacyStatus: string }) => {
      return dynadotRequest("PUT", `/domains/${encodeURIComponent(args.domainName)}/privacy`, {
        privacyStatus: args.privacyStatus,
      });
    },
  },
  {
    name: "dynadot_get_dnssec",
    description: "Get DNSSEC records for a domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("GET", `/domains/${encodeURIComponent(args.domainName)}/dnssec`);
    },
  },
  {
    name: "dynadot_set_dnssec",
    description: "Set DNSSEC keys/DS records for a domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      dnssecKeys: z.array(z.object({
        keyTag: z.number().describe("Key tag"),
        algorithm: z.number().describe("Algorithm"),
        digestType: z.number().describe("Digest type"),
        digest: z.string().describe("Digest hex string"),
      })).describe("DNSSEC DS record entries"),
    }),
    handler: async (args: {
      domainName: string;
      dnssecKeys: Array<{ keyTag: number; algorithm: number; digestType: number; digest: string }>;
    }) => {
      return dynadotRequest("PUT", `/domains/${encodeURIComponent(args.domainName)}/dnssec`, {
        dnssecKeys: args.dnssecKeys,
      });
    },
  },
  {
    name: "dynadot_clear_dnssec",
    description: "Remove all DNSSEC records from a domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("DELETE", `/domains/${encodeURIComponent(args.domainName)}/dnssec`);
    },
  },
  {
    name: "dynadot_clear_domain_setting",
    description: "Reset specified settings on a domain (e.g. forwarding, nameservers) to account defaults.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      settings: z.array(z.string()).describe("Settings to clear (e.g. ['forwarding', 'dns', 'nameservers'])"),
    }),
    handler: async (args: { domainName: string; settings: string[] }) => {
      return dynadotRequest("PUT", `/domains/${encodeURIComponent(args.domainName)}/clear-settings`, {
        settings: args.settings,
      });
    },
  },
  {
    name: "dynadot_push",
    description: "Push (transfer) a domain to another Dynadot account or external registrar.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      targetRegistrar: z.string().optional().describe("Target registrar identifier"),
      targetEmail: z.string().describe("Target account's email address"),
    }),
    handler: async (args: { domainName: string; targetRegistrar?: string; targetEmail: string }) => {
      return dynadotRequest("POST", `/domains/${encodeURIComponent(args.domainName)}/push`, {
        targetRegistrar: args.targetRegistrar,
        targetEmail: args.targetEmail,
      });
    },
  },
  {
    name: "dynadot_accept_push",
    description: "Accept an incoming domain push.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      pushToken: z.string().describe("Token from the push request"),
    }),
    handler: async (args: { domainName: string; pushToken: string }) => {
      return dynadotRequest("POST", `/domains/${encodeURIComponent(args.domainName)}/accept-push`, {
        pushToken: args.pushToken,
      });
    },
  },
  {
    name: "dynadot_get_dns",
    description: "Get DNS records for a domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
    }),
    handler: async (args: { domainName: string }) => {
      return dynadotRequest("GET", `/domains/${encodeURIComponent(args.domainName)}/dns`);
    },
  },
  {
    name: "dynadot_set_dns",
    description: "Create or replace DNS records for a domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      records: z.array(dnsRecordSchema).describe("DNS records to set"),
    }),
    handler: async (args: { domainName: string; records: z.infer<typeof dnsRecordSchema>[] }) => {
      return dynadotRequest("POST", `/domains/${encodeURIComponent(args.domainName)}/dns`, {
        records: args.records,
      });
    },
  },
  {
    name: "dynadot_set_note",
    description: "Add or update a private note on a domain.",
    inputSchema: z.object({
      domainName: z.string().describe("Domain name"),
      note: z.string().describe("Note text"),
    }),
    handler: async (args: { domainName: string; note: string }) => {
      return dynadotRequest("PUT", `/domains/${encodeURIComponent(args.domainName)}/note`, {
        note: args.note,
      });
    },
  },
];
